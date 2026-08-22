import prisma from '../prisma/prisma.client';

/**
 * Tenant guard for the Inuma (University of Rwanda) catalog sync.
 *
 * The catalog describes UR's campuses and positions, so it may only ever be
 * written into the one organization that represents UR. Callers used to pass
 * whatever organization was in the URL and the sync trusted it, which meant
 * simply *opening* another tenant's page planted UR's campuses inside it —
 * every organization ended up holding a copy of UR's units.
 *
 * Resolution order: INUMA_ORGANIZATION_ID, then INUMA_ORGANIZATION_NAME, then
 * the "University of Rwanda" default. There is deliberately no "fall back to
 * any active organization" step: writing the catalog into an unrelated tenant
 * is worse than not syncing at all.
 */
export async function resolveInumaOrganizationId(): Promise<string | null> {
  const configuredId = (process.env.INUMA_ORGANIZATION_ID || '').trim();
  if (configuredId) {
    const org = await prisma.tbl_organizations.findUnique({
      where: { organization_id: configuredId },
    });
    if (org) return org.organization_id;
  }

  const configuredName = (
    process.env.INUMA_ORGANIZATION_NAME || 'University of Rwanda'
  ).trim();
  const byName = await prisma.tbl_organizations.findFirst({
    where: {
      organization_name: { equals: configuredName, mode: 'insensitive' },
      organization_status: 'ACTIVE',
    },
  });

  return byName?.organization_id ?? null;
}

/**
 * Decide which organization an Inuma sync is allowed to write into.
 *
 * Returns the Inuma organization id when the sync may proceed, or `null` when
 * it must be skipped — either because no Inuma organization is configured, or
 * because the caller asked to sync into a different tenant.
 */
export async function resolveInumaSyncTarget(
  requestedOrganizationId?: string
): Promise<string | null> {
  const inumaOrgId = await resolveInumaOrganizationId();
  if (!inumaOrgId) return null;

  // No specific tenant asked for — sync the Inuma organization itself.
  if (!requestedOrganizationId) return inumaOrgId;

  // A tenant was named: only proceed when it *is* the Inuma organization.
  return requestedOrganizationId === inumaOrgId ? inumaOrgId : null;
}
