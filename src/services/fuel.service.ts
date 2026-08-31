import { Prisma, PrismaClient } from '@prisma/client';
import { AppError } from '../utils/Error';
import { resolveCampusScope, type RequesterContext } from '../utils/campusScope';
import { getNextStartingOdometer } from './reservation.services';
import type {
  CreateFuelRequisitionInput,
  CreateGeneratorInput,
  IssueFuelRequisitionInput,
  ReplenishFuelAccountInput,
  UpdateGeneratorInput,
} from '../schemas/fuel.schema';

const prisma = new PrismaClient();

/**
 * Fuel management.
 *
 * The paper form has four sections and each is a separate hand: the driver
 * raises it, Assets and Services Management recommends it, the Director of
 * Finance confirms the money is there, and the logistics desk issues the fuel
 * and takes a signature for it. This service enforces that order — a section
 * cannot be signed before the one above it — and posts every issue to the fuel
 * account so the monthly consumption report reconciles.
 */

/** The order the form is signed in. Index is used for "has it got this far?". */
const WORKFLOW: readonly string[] = [
  'SUBMITTED',
  'RECOMMENDED',
  'FUNDING_CONFIRMED',
  'ISSUED',
  'RECEIVED',
];

type Actor = RequesterContext & { user_id: string; organization_id: string };

type SignatureIdentity = {
  user_id: string;
  name: string;
  position?: string | null;
  signature_url?: string | null;
};

/**
 * Who is signing, as it should read on the form.
 *
 * Resolved from the database rather than the token so the name and position
 * are the ones on record at the moment of signing — the snapshot stored on the
 * requisition must not drift when someone later changes position.
 */
async function resolveSignatory(actor: Actor): Promise<SignatureIdentity> {
  const user = await prisma.tbl_users.findUnique({
    where: { user_id: actor.user_id },
    select: { first_name: true, last_name: true, signature_url: true },
  });

  if (!user) {
    throw new AppError('Your user account could not be found', 404);
  }

  let position: string | null = null;
  if (actor.position_id) {
    const held = await prisma.tbl_position.findUnique({
      where: { position_id: actor.position_id },
      select: { position_name: true },
    });
    position = held?.position_name ?? null;
  }

  return {
    user_id: actor.user_id,
    name: `${user.first_name} ${user.last_name}`.trim(),
    position: position ?? actor.inuma_position ?? null,
    signature_url: user.signature_url,
  };
}

/**
 * Requisitions the actor is allowed to see.
 *
 * Campus-scoped users see their own campus only, matching how vehicles and
 * users already behave. `viewOwn` without `view` narrows it to the actor's own
 * forms, which is what an ordinary driver gets.
 */
/**
 * The units whose vehicles and generators a requester may raise fuel against.
 *
 * `undefined` means no restriction — the requester reads organization-wide.
 *
 * A campus does not usually own the vehicles it runs: the fleet is held
 * centrally and lent out. Pinning the asset list to the requester's own unit
 * therefore left campuses with an empty dropdown and no way to fuel the car
 * parked outside. The pool is the organization's primary and leader units,
 * plus any asset not assigned to a unit at all.
 *
 * Requisition *records* stay pinned to the raising unit — this widens only
 * which vehicles can be picked, never whose paperwork you can read. Generators
 * are not part of that pool; they stay on the requester's own unit.
 */
async function resolveAssetUnitIds(actor: Actor): Promise<string[] | undefined> {
  const scope = resolveCampusScope(actor);
  if (!scope.campusUnitId) return undefined;

  const [pooled, organization] = await Promise.all([
    prisma.tbl_unit.findMany({
      where: { organization_id: actor.organization_id, is_primary: true },
      select: { unit_id: true },
    }),
    prisma.tbl_organizations.findUnique({
      where: { organization_id: actor.organization_id },
      select: { leader_unit_id: true },
    }),
  ]);

  const ids = new Set<string>([scope.campusUnitId]);
  for (const unit of pooled) ids.add(unit.unit_id);
  if (organization?.leader_unit_id) ids.add(organization.leader_unit_id);

  return [...ids];
}

/** Where-clause fragment matching assets in scope, unassigned ones included. */
async function assetUnitWhere(
  actor: Actor
): Promise<{ OR: { unit_id: string | { in: string[] } | null }[] } | Record<string, never>> {
  const unitIds = await resolveAssetUnitIds(actor);
  if (!unitIds) return {};
  return { OR: [{ unit_id: { in: unitIds } }, { unit_id: null }] };
}

/**
 * Generators sit on a campus. Unlike the vehicle pool they are not lent out
 * from headquarters, so a Gako user must not see UR Head Quarter's plant.
 *
 * Organization-wide listing is only for hub SuperAdmins and positions that
 * already read across units (`units.view`). Everyone else is pinned to their
 * campus, or to the unit on their position when they have no campus.
 */
function ownGeneratorUnitId(actor: Actor): string | undefined {
  const scope = resolveCampusScope(actor);
  if (scope.isSuperAdmin) return undefined;
  if (scope.campusUnitId) return scope.campusUnitId;
  if (actor.position_access?.units?.view) return undefined;
  return actor.unit_id ?? undefined;
}

function generatorUnitWhere(actor: Actor): { unit_id: string } | Record<string, never> {
  const unitId = ownGeneratorUnitId(actor);
  if (!unitId) return {};
  return { unit_id: unitId };
}

function assertGeneratorInOwnUnit(generatorUnitId: string | null, actor: Actor) {
  const unitId = ownGeneratorUnitId(actor);
  if (!unitId) return;
  if (generatorUnitId === unitId) return;
  throw new AppError('That generator belongs to another unit', 403);
}

function buildScopeFilter(actor: Actor): Prisma.tbl_fuel_requisitionsWhereInput {
  const scope = resolveCampusScope(actor);
  const access = actor.position_access?.fuel;

  const where: Prisma.tbl_fuel_requisitionsWhereInput = {
    organization_id: actor.organization_id,
  };

  if (scope.campusUnitId) {
    where.unit_id = scope.campusUnitId;
  }

  if (!access?.view) {
    where.applicant_user_id = actor.user_id;
  }

  return where;
}

const requisitionInclude = {
  vehicle: {
    select: { vehicle_id: true, plate_number: true, current_odometer: true },
  },
  generator: {
    select: { generator_id: true, generator_name: true, fuel_level_percent: true },
  },
  unit: { select: { unit_id: true, unit_name: true } },
} satisfies Prisma.tbl_fuel_requisitionsInclude;

/**
 * Next reference number for the year, e.g. FR-2026-000042.
 *
 * Derived from the highest existing reference rather than a count, so deleting
 * a row can never hand the same number out twice. The unique index on
 * `reference` is the real guard if two requests race.
 */
async function nextReference(tx: Prisma.TransactionClient): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `FR-${year}-`;

  const latest = await tx.tbl_fuel_requisitions.findFirst({
    where: { reference: { startsWith: prefix } },
    orderBy: { reference: 'desc' },
    select: { reference: true },
  });

  const previous = latest ? Number(latest.reference.slice(prefix.length)) : 0;
  const next = Number.isFinite(previous) ? previous + 1 : 1;
  return `${prefix}${String(next).padStart(6, '0')}`;
}

/** Raise a new requisition — section I of the form. */
export async function createFuelRequisition(
  input: CreateFuelRequisitionInput,
  actor: Actor
) {
  const signatory = await resolveSignatory(actor);
  const scope = resolveCampusScope(actor);
  const assetUnitIds = await resolveAssetUnitIds(actor);

  /** Refuse an asset the requester could not have picked from their own list. */
  const assertAssetInScope = (assetUnitId: string | null, noun: string) => {
    if (!assetUnitIds) return;
    if (assetUnitId === null || assetUnitIds.includes(assetUnitId)) return;
    throw new AppError(`That ${noun} belongs to another unit`, 403);
  };

  let assetLabel: string;
  let unitId: string | null = scope.campusUnitId ?? actor.unit_id ?? null;

  if (input.request_type === 'VEHICLE') {
    const vehicle = await prisma.tbl_vehicles.findUnique({
      where: { vehicle_id: input.vehicle_id! },
      select: {
        plate_number: true,
        organization_id: true,
        unit_id: true,
        current_odometer: true,
      },
    });
    if (!vehicle) throw new AppError('Vehicle not found', 404);
    if (vehicle.organization_id !== actor.organization_id) {
      throw new AppError('That vehicle belongs to another organization', 403);
    }
    assertAssetInScope(vehicle.unit_id, 'vehicle');

    // The logbook only ever counts up. Catching this here keeps a typo out of
    // the consumption report, where the km column is used to work out usage.
    const latest = await getNextStartingOdometer(input.vehicle_id!);
    if (input.odometer_km! < latest) {
      throw new AppError(
        `Logbook reading is below the last recorded reading for this vehicle (${latest} km)`,
        400
      );
    }

    assetLabel = vehicle.plate_number;
    unitId = unitId ?? vehicle.unit_id;
  } else {
    const generator = await prisma.tbl_generators.findUnique({
      where: { generator_id: input.generator_id! },
      select: {
        generator_name: true,
        organization_id: true,
        unit_id: true,
        status: true,
      },
    });
    if (!generator) throw new AppError('Generator not found', 404);
    if (generator.organization_id !== actor.organization_id) {
      throw new AppError('That generator belongs to another organization', 403);
    }
    assertGeneratorInOwnUnit(generator.unit_id, actor);
    if (generator.status !== 'ACTIVE') {
      throw new AppError('That generator is inactive', 400);
    }

    assetLabel = generator.generator_name;
    unitId = unitId ?? generator.unit_id;
  }

  return prisma.$transaction(async (tx) => {
    const reference = await nextReference(tx);

    return tx.tbl_fuel_requisitions.create({
      data: {
        reference,
        organization_id: actor.organization_id,
        unit_id: unitId,
        request_type: input.request_type,
        vehicle_id: input.request_type === 'VEHICLE' ? input.vehicle_id : null,
        generator_id: input.request_type === 'GENERATOR' ? input.generator_id : null,
        asset_label: assetLabel,
        applicant_user_id: signatory.user_id,
        applicant_name: signatory.name,
        applicant_position: signatory.position,
        applicant_signature_url: signatory.signature_url,
        quantity_requested_litres: new Prisma.Decimal(input.quantity_requested_litres),
        odometer_km: input.request_type === 'VEHICLE' ? input.odometer_km : null,
        fuel_indicator_percent:
          input.request_type === 'GENERATOR' ? input.fuel_indicator_percent : null,
        purpose: input.purpose,
      },
      include: requisitionInclude,
    });
  });
}

export async function listFuelRequisitions(
  actor: Actor,
  filters: { status?: string; request_type?: string; mine?: boolean }
) {
  const where = buildScopeFilter(actor);

  if (filters.status) {
    where.status = filters.status as Prisma.EnumFuelRequisitionStatusFilter['equals'];
  }
  if (filters.request_type) {
    where.request_type = filters.request_type as Prisma.EnumFuelRequestTypeFilter['equals'];
  }
  if (filters.mine) {
    where.applicant_user_id = actor.user_id;
  }

  return prisma.tbl_fuel_requisitions.findMany({
    where,
    include: requisitionInclude,
    orderBy: { requested_at: 'desc' },
    take: 500,
  });
}

export async function getFuelRequisition(id: string, actor: Actor) {
  const requisition = await prisma.tbl_fuel_requisitions.findFirst({
    where: { fuel_requisition_id: id, ...buildScopeFilter(actor) },
    include: requisitionInclude,
  });

  if (!requisition) {
    throw new AppError('Fuel requisition not found', 404);
  }
  return requisition;
}

/**
 * Load a requisition for a workflow action and check it is at the right step.
 *
 * `expected` is the status the form must currently be in. Anything else means
 * somebody already acted, or the step below has not been signed yet.
 */
async function loadForAction(
  id: string,
  actor: Actor,
  expected: string,
  actionLabel: string
) {
  const scope = resolveCampusScope(actor);
  const requisition = await prisma.tbl_fuel_requisitions.findFirst({
    where: {
      fuel_requisition_id: id,
      organization_id: actor.organization_id,
      ...(scope.campusUnitId ? { unit_id: scope.campusUnitId } : {}),
    },
    include: requisitionInclude,
  });

  if (!requisition) {
    throw new AppError('Fuel requisition not found', 404);
  }

  if (requisition.status === 'REJECTED' || requisition.status === 'CANCELLED') {
    throw new AppError(
      `This requisition was ${requisition.status.toLowerCase()} and cannot be ${actionLabel}`,
      409
    );
  }

  if (requisition.status !== expected) {
    const reached = WORKFLOW.indexOf(requisition.status);
    const needed = WORKFLOW.indexOf(expected);
    throw new AppError(
      reached > needed
        ? `This requisition has already moved past that step (it is ${requisition.status})`
        : `This requisition is not ready to be ${actionLabel} yet (it is ${requisition.status})`,
      409
    );
  }

  return requisition;
}

/** Section II — Assets and Services Management recommends the request. */
export async function recommendFuelRequisition(
  id: string,
  note: string | undefined,
  actor: Actor
) {
  await loadForAction(id, actor, 'SUBMITTED', 'recommended');
  const signatory = await resolveSignatory(actor);

  return prisma.tbl_fuel_requisitions.update({
    where: { fuel_requisition_id: id },
    data: {
      status: 'RECOMMENDED',
      recommended_by_user_id: signatory.user_id,
      recommended_by_name: signatory.name,
      recommended_by_position: signatory.position,
      recommended_by_signature_url: signatory.signature_url,
      recommended_at: new Date(),
      recommendation_note: note ?? null,
    },
    include: requisitionInclude,
  });
}

/** Section III — the Director of Finance confirms the funding. */
export async function confirmFuelRequisitionFunding(id: string, actor: Actor) {
  await loadForAction(id, actor, 'RECOMMENDED', 'funded');
  const signatory = await resolveSignatory(actor);

  return prisma.tbl_fuel_requisitions.update({
    where: { fuel_requisition_id: id },
    data: {
      status: 'FUNDING_CONFIRMED',
      funding_confirmed_by_user_id: signatory.user_id,
      funding_confirmed_by_name: signatory.name,
      funding_confirmed_by_position: signatory.position,
      funding_confirmed_by_signature_url: signatory.signature_url,
      funding_confirmed_at: new Date(),
    },
    include: requisitionInclude,
  });
}

/**
 * Section IV — the logistics desk issues the fuel.
 *
 * This is the step that costs money, so it does three things in one
 * transaction: records what was supplied, posts the spend to the fuel account,
 * and carries the reading forward onto the asset — the vehicle's odometer or
 * the generator's gauge — which is what makes the next requisition's reading
 * check meaningful.
 */
export async function issueFuelRequisition(
  id: string,
  input: IssueFuelRequisitionInput,
  actor: Actor
) {
  const requisition = await loadForAction(id, actor, 'FUNDING_CONFIRMED', 'issued');
  const signatory = await resolveSignatory(actor);
  const issuedOn = input.issued_on ?? new Date();

  return prisma.$transaction(async (tx) => {
    const updated = await tx.tbl_fuel_requisitions.update({
      where: { fuel_requisition_id: id },
      data: {
        status: 'ISSUED',
        issued_by_user_id: signatory.user_id,
        issued_by_name: signatory.name,
        issued_by_signature_url: signatory.signature_url,
        issued_at: issuedOn,
        quantity_supplied_litres: new Prisma.Decimal(input.quantity_supplied_litres),
        amount_rwf: new Prisma.Decimal(input.amount_rwf),
      },
      include: requisitionInclude,
    });

    // Negative: an issue draws the account down. See the ledger's doc comment.
    await tx.tbl_fuel_transactions.create({
      data: {
        organization_id: requisition.organization_id,
        type: 'ISSUE',
        amount_rwf: new Prisma.Decimal(-input.amount_rwf),
        litres: new Prisma.Decimal(input.quantity_supplied_litres),
        description: requisition.purpose,
        occurred_on: issuedOn,
        fuel_requisition_id: id,
        recorded_by_user_id: signatory.user_id,
        recorded_by_name: signatory.name,
      },
    });

    if (requisition.vehicle_id && requisition.odometer_km != null) {
      // Only ever forward — a stale form must not rewind the odometer.
      await tx.tbl_vehicles.updateMany({
        where: {
          vehicle_id: requisition.vehicle_id,
          current_odometer: { lt: requisition.odometer_km },
        },
        data: { current_odometer: requisition.odometer_km },
      });
    }

    if (requisition.generator_id && requisition.fuel_indicator_percent != null) {
      await tx.tbl_generators.update({
        where: { generator_id: requisition.generator_id },
        data: { fuel_level_percent: requisition.fuel_indicator_percent },
      });
    }

    return updated;
  });
}

/** "Received by" at the foot of the form. */
export async function receiveFuelRequisition(id: string, actor: Actor) {
  const requisition = await loadForAction(id, actor, 'ISSUED', 'signed for');
  const signatory = await resolveSignatory(actor);

  const access = actor.position_access?.fuel;
  // A driver signs for their own fuel. Anyone holding `issue` may sign on
  // their behalf, which is what happens when the driver collects in person.
  if (requisition.applicant_user_id !== actor.user_id && !access?.issue) {
    throw new AppError(
      'Only the applicant can sign for this fuel',
      403
    );
  }

  const now = new Date();

  // The last signature completes the form, so this is where the fuel stops
  // being a document and becomes part of the asset's own record. Posting it
  // here means nobody keys the same litres into the vehicle a second time.
  return prisma.$transaction(async (tx) => {
    const completed = await tx.tbl_fuel_requisitions.update({
      where: { fuel_requisition_id: id },
      data: {
        status: 'RECEIVED',
        received_by_user_id: signatory.user_id,
        received_by_name: signatory.name,
        received_by_signature_url: signatory.signature_url,
        received_at: now,
        recorded_on_asset_at: now,
      },
      include: requisitionInclude,
    });

    if (requisition.vehicle_id && requisition.odometer_km != null) {
      // Only ever forward — a form signed late must not rewind the odometer
      // past readings taken since.
      await tx.tbl_vehicles.updateMany({
        where: {
          vehicle_id: requisition.vehicle_id,
          current_odometer: { lt: requisition.odometer_km },
        },
        data: { current_odometer: requisition.odometer_km },
      });
    }

    if (requisition.generator_id && requisition.fuel_indicator_percent != null) {
      await tx.tbl_generators.update({
        where: { generator_id: requisition.generator_id },
        data: { fuel_level_percent: requisition.fuel_indicator_percent },
      });
    }

    return completed;
  }, { timeout: 20_000, maxWait: 10_000 });
}

export async function rejectFuelRequisition(id: string, reason: string, actor: Actor) {
  const scope = resolveCampusScope(actor);
  const requisition = await prisma.tbl_fuel_requisitions.findFirst({
    where: {
      fuel_requisition_id: id,
      organization_id: actor.organization_id,
      ...(scope.campusUnitId ? { unit_id: scope.campusUnitId } : {}),
    },
  });

  if (!requisition) throw new AppError('Fuel requisition not found', 404);

  // Once fuel has left the pump there is nothing left to refuse.
  if (requisition.status === 'ISSUED' || requisition.status === 'RECEIVED') {
    throw new AppError('Fuel has already been issued against this requisition', 409);
  }
  if (requisition.status === 'REJECTED' || requisition.status === 'CANCELLED') {
    throw new AppError('This requisition is already closed', 409);
  }

  const signatory = await resolveSignatory(actor);

  return prisma.tbl_fuel_requisitions.update({
    where: { fuel_requisition_id: id },
    data: {
      status: 'REJECTED',
      rejected_by_user_id: signatory.user_id,
      rejected_by_name: signatory.name,
      rejected_at: new Date(),
      rejection_reason: reason,
    },
    include: requisitionInclude,
  });
}

/** An applicant withdrawing their own form before anyone has acted on it. */
export async function cancelFuelRequisition(id: string, actor: Actor) {
  const requisition = await prisma.tbl_fuel_requisitions.findFirst({
    where: {
      fuel_requisition_id: id,
      organization_id: actor.organization_id,
      applicant_user_id: actor.user_id,
    },
  });

  if (!requisition) throw new AppError('Fuel requisition not found', 404);
  if (requisition.status !== 'SUBMITTED') {
    throw new AppError(
      'This requisition has already been acted on and can no longer be withdrawn',
      409
    );
  }

  return prisma.tbl_fuel_requisitions.update({
    where: { fuel_requisition_id: id },
    data: { status: 'CANCELLED' },
    include: requisitionInclude,
  });
}

// --- Generators -------------------------------------------------------------

export async function listGenerators(actor: Actor) {
  return prisma.tbl_generators.findMany({
    where: {
      organization_id: actor.organization_id,
      ...generatorUnitWhere(actor),
    },
    include: { unit: { select: { unit_id: true, unit_name: true } } },
    orderBy: { generator_name: 'asc' },
  });
}

export async function createGenerator(input: CreateGeneratorInput, actor: Actor) {
  const forcedUnitId = ownGeneratorUnitId(actor);
  if (forcedUnitId && input.unit_id && input.unit_id !== forcedUnitId) {
    throw new AppError('You can only register generators in your own unit', 403);
  }
  const unitId = forcedUnitId ?? input.unit_id ?? actor.unit_id ?? null;

  if (unitId) {
    const unit = await prisma.tbl_unit.findFirst({
      where: { unit_id: unitId, organization_id: actor.organization_id },
      select: { unit_id: true },
    });
    if (!unit) throw new AppError('That unit is not in your organization', 400);
  }

  const duplicate = await prisma.tbl_generators.findFirst({
    where: {
      organization_id: actor.organization_id,
      generator_name: input.generator_name,
    },
    select: { generator_id: true },
  });
  if (duplicate) {
    throw new AppError('A generator with that name already exists', 409);
  }

  return prisma.tbl_generators.create({
    data: {
      generator_name: input.generator_name,
      generator_code: input.generator_code ?? null,
      location: input.location ?? null,
      organization_id: actor.organization_id,
      unit_id: unitId,
      fuel_level_percent: input.fuel_level_percent ?? null,
    },
    include: { unit: { select: { unit_id: true, unit_name: true } } },
  });
}

export async function updateGenerator(
  id: string,
  input: UpdateGeneratorInput,
  actor: Actor
) {
  const existing = await prisma.tbl_generators.findFirst({
    where: {
      generator_id: id,
      organization_id: actor.organization_id,
      ...generatorUnitWhere(actor),
    },
    select: { generator_id: true },
  });
  if (!existing) throw new AppError('Generator not found', 404);

  const forcedUnitId = ownGeneratorUnitId(actor);
  if (forcedUnitId && input.unit_id && input.unit_id !== forcedUnitId) {
    throw new AppError('You can only keep generators in your own unit', 403);
  }

  return prisma.tbl_generators.update({
    where: { generator_id: id },
    data: {
      ...(input.generator_name !== undefined && { generator_name: input.generator_name }),
      ...(input.generator_code !== undefined && { generator_code: input.generator_code }),
      ...(input.location !== undefined && { location: input.location }),
      ...(input.unit_id !== undefined && { unit_id: input.unit_id }),
      ...(input.fuel_level_percent !== undefined && {
        fuel_level_percent: input.fuel_level_percent,
      }),
      ...(input.status !== undefined && { status: input.status }),
    },
    include: { unit: { select: { unit_id: true, unit_name: true } } },
  });
}

// --- Fuel account and consumption report ------------------------------------

export async function replenishFuelAccount(
  input: ReplenishFuelAccountInput,
  actor: Actor
) {
  const signatory = await resolveSignatory(actor);

  return prisma.tbl_fuel_transactions.create({
    data: {
      organization_id: actor.organization_id,
      type: 'REPLENISHMENT',
      amount_rwf: new Prisma.Decimal(input.amount_rwf),
      description: input.description ?? 'REPLENISHMENT',
      occurred_on: input.occurred_on ?? new Date(),
      recorded_by_user_id: signatory.user_id,
      recorded_by_name: signatory.name,
    },
  });
}

/** Current fuel account balance in RWF — the cumulative sum of the ledger. */
export async function getFuelBalance(organizationId: string): Promise<number> {
  const total = await prisma.tbl_fuel_transactions.aggregate({
    where: { organization_id: organizationId },
    _sum: { amount_rwf: true },
  });
  return Number(total._sum.amount_rwf ?? 0);
}

export type FuelReportRow = {
  date: Date;
  description: string;
  plate_number: string | null;
  /** Km for a vehicle, gauge percentage for a generator, null otherwise. */
  reading: string | null;
  driver_name: string | null;
  litres: number | null;
  amount: number | null;
  replenishment: number | null;
  balance: number;
};

/**
 * The monthly fuel consumption report.
 *
 * Rebuilds the paper report exactly: one line per ledger entry in date order
 * with a running balance, replenishments in their own column, and the reading
 * column carrying kilometres for vehicles and a gauge percentage for the
 * generator. The opening balance is the account total *before* the window, so
 * a report for one month still reconciles against the months before it.
 */
export async function getFuelConsumptionReport(
  actor: Actor,
  range: { from?: Date; to?: Date }
): Promise<{
  opening_balance: number;
  closing_balance: number;
  total_issued: number;
  total_replenished: number;
  total_litres: number;
  rows: FuelReportRow[];
}> {
  const organizationId = actor.organization_id;

  const openingAggregate = range.from
    ? await prisma.tbl_fuel_transactions.aggregate({
        where: { organization_id: organizationId, occurred_on: { lt: range.from } },
        _sum: { amount_rwf: true },
      })
    : null;

  const openingBalance = Number(openingAggregate?._sum.amount_rwf ?? 0);

  const transactions = await prisma.tbl_fuel_transactions.findMany({
    where: {
      organization_id: organizationId,
      ...(range.from || range.to
        ? {
            occurred_on: {
              ...(range.from ? { gte: range.from } : {}),
              ...(range.to ? { lte: range.to } : {}),
            },
          }
        : {}),
    },
    include: {
      requisition: {
        select: {
          asset_label: true,
          applicant_name: true,
          odometer_km: true,
          fuel_indicator_percent: true,
          request_type: true,
          purpose: true,
          unit_id: true,
        },
      },
    },
    orderBy: [{ occurred_on: 'asc' }, { created_at: 'asc' }],
  });

  // The ledger is organization-wide because the fuel account is, but a campus
  // has no business reading another campus's consumption. Issues are shown
  // only for the requester's own unit; replenishments carry no requisition and
  // fund the shared account, so they stay visible to everyone who may read the
  // report at all.
  //
  // The running balance is still accumulated over every transaction, so the
  // figure against each row is the true account balance at that moment rather
  // than a total of the rows above it.
  const reportScope = resolveCampusScope(actor);
  const inScope = (unitId: string | null | undefined) =>
    !reportScope.campusUnitId || !unitId || unitId === reportScope.campusUnitId;

  let running = openingBalance;
  let totalIssued = 0;
  let totalReplenished = 0;
  let totalLitres = 0;

  const rows: FuelReportRow[] = [];

  for (const transaction of transactions) {
    const amount = Number(transaction.amount_rwf);
    running += amount;

    const requisition = transaction.requisition;
    const isIssue = transaction.type === 'ISSUE';

    if (!inScope(requisition?.unit_id)) continue;

    if (isIssue) totalIssued += Math.abs(amount);
    if (transaction.type === 'REPLENISHMENT') totalReplenished += amount;

    const litres = transaction.litres != null ? Number(transaction.litres) : null;
    if (litres) totalLitres += litres;

    // The paper report puts the generator's gauge percentage in the same
    // column as a vehicle's kilometres, so the two never appear on one line.
    let reading: string | null = null;
    if (requisition?.request_type === 'VEHICLE' && requisition.odometer_km != null) {
      reading = String(requisition.odometer_km);
    } else if (
      requisition?.request_type === 'GENERATOR' &&
      requisition.fuel_indicator_percent != null
    ) {
      reading = `${requisition.fuel_indicator_percent}%`;
    }

    rows.push({
      date: transaction.occurred_on,
      description: transaction.description,
      plate_number:
        requisition?.request_type === 'VEHICLE' ? requisition.asset_label : null,
      reading,
      driver_name: requisition?.applicant_name ?? null,
      litres,
      amount: isIssue ? Math.abs(amount) : null,
      replenishment: transaction.type === 'ISSUE' ? null : amount,
      balance: running,
    });
  }

  return {
    opening_balance: openingBalance,
    closing_balance: running,
    total_issued: totalIssued,
    total_replenished: totalReplenished,
    total_litres: totalLitres,
    rows,
  };
}

/**
 * Vehicles a requisition can be raised against, each carrying the reading the
 * next logbook entry has to start from.
 *
 * This is what the request form uses so the driver sees the last known
 * odometer instead of guessing it.
 */
export async function listFuellableVehicles(actor: Actor) {
  const vehicles = await prisma.tbl_vehicles.findMany({
    where: {
      organization_id: actor.organization_id,
      ...(await assetUnitWhere(actor)),
      vehicle_status: { not: 'OUT_OF_SERVICE' },
    },
    select: {
      vehicle_id: true,
      plate_number: true,
      energy_type: true,
      current_odometer: true,
      vehicle_status: true,
      unit: { select: { unit_id: true, unit_name: true } },
      vehicle_model: { select: { vehicle_model_name: true } },
    },
    orderBy: { plate_number: 'asc' },
  });

  // Same rule as getNextStartingOdometer — the highest returned odometer,
  // falling back to the registered reading — but resolved for the whole list
  // in one query instead of one round trip per vehicle.
  const lastReturned = await prisma.tbl_reserved_vehicles.groupBy({
    by: ['vehicle_id'],
    where: {
      vehicle_id: { in: vehicles.map((vehicle) => vehicle.vehicle_id) },
      returned_odometer: { not: null },
    },
    _max: { returned_odometer: true },
  });

  const highestByVehicle = new Map(
    lastReturned.map((row) => [row.vehicle_id, row._max.returned_odometer])
  );

  return vehicles.map((vehicle) => ({
    ...vehicle,
    latest_odometer:
      highestByVehicle.get(vehicle.vehicle_id) ?? vehicle.current_odometer,
  }));
}

export type VehicleFuelAvailability = {
  vehicle_id: string;
  plate_number: string;
  /** Litres signed for since this vehicle last went out on a trip. */
  available_litres: number;
  /** How many completed requisitions that came from. */
  fills: number;
  /** When the vehicle was last assigned to a reservation, if ever. */
  last_trip_at: Date | null;
};

/**
 * Fuel issued for this vehicle that has not been sent out on a trip yet.
 *
 * The requisition is where fuel enters a vehicle and a reservation is where it
 * leaves, so the two have to agree: whoever assigns the vehicle should not be
 * keying in a number the fuel desk already recorded.
 *
 * Measured as "issued since the vehicle last went out" rather than as a
 * lifetime issued-minus-used balance. A running balance sounds more precise but
 * cannot survive the data that already exists — `fuel_provided` was typed by
 * hand for years before this module existed, and some rows hold readings in the
 * thousands. Subtracting those would peg every vehicle at zero forever. Dating
 * from the last trip needs no historical figure to be correct.
 *
 * Only requisitions posted to the asset count, the same rule
 * `getAssetFuelHistory` applies: a form still going round for signature has not
 * been collected.
 */
export async function getVehicleFuelAvailability(
  vehicleId: string,
  actor: Actor
): Promise<VehicleFuelAvailability> {
  const vehicle = await prisma.tbl_vehicles.findFirst({
    where: { vehicle_id: vehicleId, organization_id: actor.organization_id },
    select: { vehicle_id: true, plate_number: true },
  });
  if (!vehicle) throw new AppError('Vehicle not found', 404);

  const lastTrip = await prisma.tbl_reserved_vehicles.findFirst({
    where: { vehicle_id: vehicleId },
    orderBy: { created_at: 'desc' },
    select: { created_at: true },
  });

  const issued = await prisma.tbl_fuel_requisitions.aggregate({
    where: {
      vehicle_id: vehicleId,
      organization_id: actor.organization_id,
      recorded_on_asset_at: lastTrip
        ? { gt: lastTrip.created_at }
        : { not: null },
    },
    _sum: { quantity_supplied_litres: true },
    _count: true,
  });

  return {
    vehicle_id: vehicle.vehicle_id,
    plate_number: vehicle.plate_number,
    available_litres: Number(issued._sum.quantity_supplied_litres ?? 0),
    fills: issued._count,
    last_trip_at: lastTrip?.created_at ?? null,
  };
}

// --- Approval chain -------------------------------------------------------

type ChainStepKey = 'APPLICANT' | 'RECOMMEND' | 'FUNDING' | 'ISSUE' | 'RECEIPT';

export type ChainStep = {
  key: ChainStepKey;
  /** Section number as printed on the paper form, where there is one. */
  section: string | null;
  title: string;
  office: string;
  state: 'DONE' | 'CURRENT' | 'PENDING' | 'BLOCKED';
  signed_by_name: string | null;
  signed_by_position: string | null;
  signed_at: Date | null;
  signature_url: string | null;
  /** Who can sign this step, filled in only for the step it is sitting on. */
  waiting_on: Array<{
    user_id: string;
    name: string;
    position_name: string;
    unit_name: string | null;
  }>;
};

/** The permission each step needs, used to work out who is holding it up. */
const STEP_PERMISSION: Record<ChainStepKey, string | null> = {
  APPLICANT: null,
  RECOMMEND: 'recommend',
  FUNDING: 'confirmFunding',
  ISSUE: 'issue',
  RECEIPT: 'receive',
};

/**
 * Everyone who could sign a given step, so a requester can see which desk their
 * form is on rather than having to ask around.
 *
 * Positions are filtered inside the stored JSON by Postgres rather than loaded
 * and filtered here — an organization the size of UR has thousands of positions
 * and pulling them all back to test one flag would be wasteful.
 */
async function findSignatories(
  organizationId: string,
  campusUnitId: string | undefined,
  permission: string
) {
  const positions = await prisma.tbl_position.findMany({
    where: {
      position_status: 'ACTIVE',
      unit: {
        organization_id: organizationId,
        ...(campusUnitId ? { unit_id: campusUnitId } : {}),
      },
      position_access: {
        path: ['fuel', permission],
        equals: true,
      },
    },
    select: {
      position_name: true,
      unit: { select: { unit_name: true } },
      assignments: {
        select: {
          user: { select: { user_id: true, first_name: true, last_name: true } },
        },
      },
    },
  });

  return positions.flatMap((position) =>
    position.assignments.map((assignment) => ({
      user_id: assignment.user.user_id,
      name: `${assignment.user.first_name} ${assignment.user.last_name}`.trim(),
      position_name: position.position_name,
      unit_name: position.unit?.unit_name ?? null,
    }))
  );
}

/**
 * Where the form has got to, who signed each section, and whose desk it is on.
 *
 * Read-only and scoped like any other read: the requester sees the chain for
 * their own form, which is the whole point — it answers "who am I waiting for".
 */
export async function getFuelRequisitionChain(
  id: string,
  actor: Actor
): Promise<{ status: string; steps: ChainStep[] }> {
  const requisition = await getFuelRequisition(id, actor);
  const scope = resolveCampusScope(actor);

  const closed =
    requisition.status === 'REJECTED' || requisition.status === 'CANCELLED';

  const reached = WORKFLOW.indexOf(requisition.status);

  const steps: ChainStep[] = [
    {
      key: 'APPLICANT',
      section: 'I',
      title: 'Applicant details',
      office: requisition.applicant_position ?? 'Applicant',
      state: 'DONE',
      signed_by_name: requisition.applicant_name,
      signed_by_position: requisition.applicant_position,
      signed_at: requisition.requested_at,
      signature_url: requisition.applicant_signature_url,
      waiting_on: [],
    },
    {
      key: 'RECOMMEND',
      section: 'II',
      title: 'Recommending authority',
      office: 'Assets and Services Management',
      state: 'PENDING',
      signed_by_name: requisition.recommended_by_name,
      signed_by_position: requisition.recommended_by_position,
      signed_at: requisition.recommended_at,
      signature_url: requisition.recommended_by_signature_url,
      waiting_on: [],
    },
    {
      key: 'FUNDING',
      section: 'III',
      title: 'Confirmation of funding',
      office: 'Director of Finance',
      state: 'PENDING',
      signed_by_name: requisition.funding_confirmed_by_name,
      signed_by_position: requisition.funding_confirmed_by_position,
      signed_at: requisition.funding_confirmed_at,
      signature_url: requisition.funding_confirmed_by_signature_url,
      waiting_on: [],
    },
    {
      key: 'ISSUE',
      section: 'IV',
      title: 'Verification',
      office: 'Logistics',
      state: 'PENDING',
      signed_by_name: requisition.issued_by_name,
      signed_by_position: null,
      signed_at: requisition.issued_at,
      signature_url: requisition.issued_by_signature_url,
      waiting_on: [],
    },
    {
      key: 'RECEIPT',
      section: null,
      title: 'Received by',
      office: requisition.applicant_name,
      state: 'PENDING',
      signed_by_name: requisition.received_by_name,
      signed_by_position: null,
      signed_at: requisition.received_at,
      signature_url: requisition.received_by_signature_url,
      waiting_on: [],
    },
  ];

  // Step N is done once the form has moved past status N in the workflow.
  steps.forEach((step, index) => {
    if (step.signed_at) {
      step.state = 'DONE';
    } else if (closed) {
      step.state = 'BLOCKED';
    } else if (index === reached + 1 || (index === 0 && reached === 0)) {
      step.state = 'CURRENT';
    }
  });

  const current = steps.find((step) => step.state === 'CURRENT');
  const permission = current ? STEP_PERMISSION[current.key] : null;

  if (current && permission) {
    if (current.key === 'RECEIPT') {
      // The applicant signs for their own fuel, so there is exactly one name.
      current.waiting_on = [
        {
          user_id: requisition.applicant_user_id,
          name: requisition.applicant_name,
          position_name: requisition.applicant_position ?? 'Applicant',
          unit_name: requisition.unit?.unit_name ?? null,
        },
      ];
    } else {
      current.waiting_on = await findSignatories(
        requisition.organization_id,
        scope.campusUnitId,
        permission
      );
    }
  }

  return { status: requisition.status, steps };
}

// --- Asset fuel history ---------------------------------------------------

export type AssetFuelEntry = {
  fuel_requisition_id: string;
  reference: string;
  recorded_at: Date;
  litres: number;
  amount_rwf: number;
  /** Odometer for a vehicle, gauge percentage for a generator. */
  odometer_km: number | null;
  fuel_indicator_percent: number | null;
  purpose: string;
  driver_name: string;
  issued_by_name: string | null;
  /** Kilometres since the previous fill. Null for the first record. */
  distance_km: number | null;
  /** Litres per 100 km over that distance. Null when it cannot be worked out. */
  consumption_l_per_100km: number | null;
};

export type AssetFuelHistory = {
  asset: {
    type: 'VEHICLE' | 'GENERATOR';
    id: string;
    label: string;
    latest_reading: number | null;
  };
  totals: {
    fills: number;
    litres: number;
    amount_rwf: number;
    distance_km: number | null;
    average_consumption_l_per_100km: number | null;
  };
  entries: AssetFuelEntry[];
};

/**
 * Everything an asset has been fuelled with, newest first.
 *
 * Built from completed requisitions rather than a separate log: the signed form
 * *is* the record, so there is nothing to keep in step and nothing to key in
 * twice. Only requisitions posted to the asset count — a form still going
 * round for signature has not been consumed yet.
 *
 * Consumption is worked out between consecutive odometer readings, which is why
 * the first fill on a vehicle has none: there is no earlier reading to measure
 * against.
 */
export async function getAssetFuelHistory(
  assetType: 'VEHICLE' | 'GENERATOR',
  assetId: string,
  actor: Actor
): Promise<AssetFuelHistory> {
  const scope = resolveCampusScope(actor);

  let label = '';
  let latestReading: number | null = null;

  if (assetType === 'VEHICLE') {
    const vehicle = await prisma.tbl_vehicles.findFirst({
      where: { vehicle_id: assetId, organization_id: actor.organization_id },
      select: { plate_number: true, current_odometer: true },
    });
    if (!vehicle) throw new AppError('Vehicle not found', 404);
    label = vehicle.plate_number;
    latestReading = vehicle.current_odometer;
  } else {
    const generator = await prisma.tbl_generators.findFirst({
      where: {
        generator_id: assetId,
        organization_id: actor.organization_id,
        ...generatorUnitWhere(actor),
      },
      select: { generator_name: true, fuel_level_percent: true },
    });
    if (!generator) throw new AppError('Generator not found', 404);
    label = generator.generator_name;
    latestReading = generator.fuel_level_percent;
  }

  const rows = await prisma.tbl_fuel_requisitions.findMany({
    where: {
      organization_id: actor.organization_id,
      ...(scope.campusUnitId ? { unit_id: scope.campusUnitId } : {}),
      ...(assetType === 'VEHICLE'
        ? { vehicle_id: assetId }
        : { generator_id: assetId }),
      recorded_on_asset_at: { not: null },
    },
    // Oldest first so each row can be measured against the one before it.
    orderBy: [{ recorded_on_asset_at: 'asc' }],
  });

  let previousOdometer: number | null = null;
  let totalLitres = 0;
  let totalAmount = 0;

  const entries: AssetFuelEntry[] = rows.map((row) => {
    const litres = Number(row.quantity_supplied_litres ?? row.quantity_requested_litres);
    const amount = Number(row.amount_rwf ?? 0);
    totalLitres += litres;
    totalAmount += amount;

    let distance: number | null = null;
    let consumption: number | null = null;

    if (row.odometer_km != null) {
      if (previousOdometer != null && row.odometer_km > previousOdometer) {
        distance = row.odometer_km - previousOdometer;
        if (litres > 0) {
          consumption = Number(((litres / distance) * 100).toFixed(2));
        }
      }
      previousOdometer = row.odometer_km;
    }

    return {
      fuel_requisition_id: row.fuel_requisition_id,
      reference: row.reference,
      recorded_at: row.recorded_on_asset_at!,
      litres,
      amount_rwf: amount,
      odometer_km: row.odometer_km,
      fuel_indicator_percent: row.fuel_indicator_percent,
      purpose: row.purpose,
      driver_name: row.applicant_name,
      issued_by_name: row.issued_by_name,
      distance_km: distance,
      consumption_l_per_100km: consumption,
    };
  });

  // Distance covered across the whole history is first reading to last, which
  // is not the same as adding the gaps when a reading is missing in between.
  const withOdometer = entries.filter((entry) => entry.odometer_km != null);
  const totalDistance =
    withOdometer.length > 1
      ? withOdometer[withOdometer.length - 1].odometer_km! - withOdometer[0].odometer_km!
      : null;

  // Fuel in the tank at the first fill was not bought over this distance, so it
  // is left out of the average.
  const litresAfterFirst =
    withOdometer.length > 1
      ? withOdometer.slice(1).reduce((sum, entry) => sum + entry.litres, 0)
      : 0;

  return {
    asset: { type: assetType, id: assetId, label, latest_reading: latestReading },
    totals: {
      fills: entries.length,
      litres: Number(totalLitres.toFixed(2)),
      amount_rwf: totalAmount,
      distance_km: totalDistance,
      average_consumption_l_per_100km:
        totalDistance && totalDistance > 0 && litresAfterFirst > 0
          ? Number(((litresAfterFirst / totalDistance) * 100).toFixed(2))
          : null,
    },
    entries: entries.reverse(),
  };
}
