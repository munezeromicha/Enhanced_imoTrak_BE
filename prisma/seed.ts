// prisma/seed.ts
import { PrismaClient, TransmissionMode } from '@prisma/client';

/** Built-in vehicle types seeded as global defaults (organization_id = null). */
const DEFAULT_VEHICLE_TYPES = [
  'AMBULANCE', 'SEDAN', 'SUV', 'TRUCK', 'VAN', 'MOTORCYCLE', 'BUS', 'OTHER',
];

async function seedVehicleTypes(prisma: PrismaClient) {
  for (const name of DEFAULT_VEHICLE_TYPES) {
    const existing = await prisma.tbl_vehicle_types.findFirst({
      where: { name, organization_id: null },
    });
    if (!existing) {
      await prisma.tbl_vehicle_types.create({
        data: { name, is_default: true, organization_id: null },
      });
    }
  }
}
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

type SeedUserData = {
  first_name: string;
  last_name: string;
  user_nid: string;
  user_phone: string;
  user_dob: Date;
  user_gender: 'MALE' | 'FEMALE';
  user_photo: string;
  street_address: string;
  auth_id: string;
};

/** Upsert user by auth_id or user_nid (safe for re-running seed on existing DB). */
async function upsertSeedUser(data: SeedUserData) {
  const existingByAuth = await prisma.tbl_users.findUnique({
    where: { auth_id: data.auth_id },
  });
  if (existingByAuth) {
    return prisma.tbl_users.update({
      where: { user_id: existingByAuth.user_id },
      data,
    });
  }

  const existingByNid = await prisma.tbl_users.findUnique({
    where: { user_nid: data.user_nid },
  });
  if (existingByNid) {
    return prisma.tbl_users.update({
      where: { user_id: existingByNid.user_id },
      data,
    });
  }

  return prisma.tbl_users.create({ data });
}

async function main() {
  const now = new Date();

  // Global vehicle-type defaults (safe to re-run).
  await seedVehicleTypes(prisma);

  // Long catalogue of car / fleet / bus / motorcycle models (SuperAdmin-managed).
  const { seedVehicleModels } = await import('./seed-vehicle-models');
  await seedVehicleModels(prisma);

  // ======= Helper Access Objects =======
  const fullAdminAccess = {
    organizations: { create: true, view: true, update: true, delete: true },
    units: { create: true, view: true, update: true, delete: true },
    positions: { create: true, view: true, update: true, delete: true, assignUser: true },
    users: { create: true, view: true, update: true, delete: true },
    vehicleModels: { create: true, view: true, viewSingle: true, update: true, delete: true },
    vehicles: { create: true, view: true, viewSingle: true, update: true, delete: true },
    reservations: {
      create: false,
      view: false,
      update: false,
      delete: false,
      cancel: false,
      approve: false,
      assignVehicle: false,
      odometerFuel: false,
      start: false,
      complete: false,
      viewOwn: false,
      updateReason: false,
    },
    vehicleIssues: {
      report: false,
      view: false,
      update: false,
      delete: false,
    },
    fuel: {
      request: true,
      view: true,
      viewOwn: true,
      recommend: true,
      confirmFunding: true,
      issue: true,
      receive: true,
      replenish: true,
      viewReport: true,
      manageGenerators: true,
    },
  };

  const fleetManagerAccess = {
    organizations: { create: false, view: false, update: false, delete: false },
    units: { create: false, view: false, update: false, delete: false },
    positions: { create: false, view: false, update: false, delete: false, assignUser: false },
    users: { create: false, view: false, update: false, delete: false },
    vehicleModels: { create: false, view: true, viewSingle: true, update: false, delete: false },
    vehicles: { create: true, view: true, viewSingle: true, update: true, delete: true },
    reservations: {
      create: true,
      view: true,
      update: true,
      delete: true,
      cancel: true,
      approve: true,
      assignVehicle: true,
      odometerFuel: true,
      start: true,
      complete: true,
      viewOwn: true,
      updateReason: true,
    },
    vehicleIssues: {
      report: true,
      view: true,
      update: true,
      delete: true,
    },
    fuel: {
      request: true,
      view: true,
      viewOwn: true,
      recommend: true,
      confirmFunding: true,
      issue: true,
      receive: true,
      replenish: true,
      viewReport: true,
      manageGenerators: true,
    },
  };

  // ======= 1. SuperAdmin for Tekinova hub =======
  const tekinovaOrg = await prisma.tbl_organizations.upsert({
    where: { organization_name: 'Tekinova hub' },
    update: {},
    create: {
      organization_name: 'Tekinova hub',
      street_address: '123 Main Street',
      organization_phone: '250788123456',
      organization_email: 'info@tekinova.rw',
      organization_logo: 'tekinova_logo.png',
      organization_customId: 'TEK-HUB-001',
    },
  });

  const adminUnit = await prisma.tbl_unit.upsert({
    where: {
      unit_name_organization_id: {
        unit_name: 'Administrative',
        organization_id: tekinovaOrg.organization_id,
      },
    },
    update: {},
    create: {
      unit_name: 'Administrative',
      organization_id: tekinovaOrg.organization_id,
    },
  });

  const adminPosition = await prisma.tbl_position.upsert({
    where: {
      position_name_unit_id: {
        position_name: 'SuperAdmin',
        unit_id: adminUnit.unit_id,
      },
    },
    update: {
      position_access: fullAdminAccess,
    },
    create: {
      position_name: 'SuperAdmin',
      position_description: 'Has full access to all resources.',
      position_access: fullAdminAccess,
      unit_id: adminUnit.unit_id,
    },
  });

  const adminPassword = await argon2.hash('supersecurepassword');
  const adminAuth = await prisma.tbl_auth.upsert({
    where: { email: 'superadmin@tekinova.rw' },
    update: { password: adminPassword },
    create: {
      email: 'superadmin@tekinova.rw',
      password: adminPassword,
    },
  });


  const adminUser = await upsertSeedUser({
    first_name: 'Tekinova',
    last_name: 'Admin',
    user_nid: '1234567890123456',
    user_phone: '250788654321',
    user_dob: new Date('1990-01-01'),
    user_gender: 'MALE',
    user_photo: 'https://avatars.githubusercontent.com/u/122959151?v=4',
    street_address: 'Admin Street',
    auth_id: adminAuth.auth_id,
  });

  await prisma.tbl_user_position_assignments.upsert({
    where: {
      user_id_position_id: {
        user_id: adminUser.user_id,
        position_id: adminPosition.position_id,
      },
    },
    update: {},
    create: {
      user_id: adminUser.user_id,
      position_id: adminPosition.position_id,
    },
  });

  // ======= 2. Fleet Manager for Fleet Corp =======
  const fleetOrg = await prisma.tbl_organizations.upsert({
    where: { organization_name: 'Fleet Corp' },
    update: {},
    create: {
      organization_name: 'Fleet Corp',
      street_address: '456 Fleet Avenue',
      organization_phone: '250788999000',
      organization_email: 'info@fleetcorp.rw',
      organization_logo: 'fleetcorp_logo.png',
      organization_customId: 'FLEET-001',
    },
  });

  const fleetUnit = await prisma.tbl_unit.upsert({
    where: {
      unit_name_organization_id: {
        unit_name: 'Fleet management',
        organization_id: fleetOrg.organization_id,
      },
    },
    update: {},
    create: {
      unit_name: 'Fleet management',
      organization_id: fleetOrg.organization_id,
    },
  });

  const vehicleModel = await prisma.tbl_vehicle_models.upsert({
    where: { vehicle_model_name: 'Nissan Patrol' },
    update: {},
    create: {
      vehicle_model_name: 'Nissan Patrol',
      vehicle_type: 'SUV',
      manufacturer_name: 'Nissan',
      vehicle_capacity: 5,
    },
  });

 const vehicles = [
  {
    plate_number: 'RAM001A',
    transmission_mode: TransmissionMode.AUTOMATIC,
    vehicle_photo: 'patrol1.png',
    vehicle_year: 2019,
    energy_type: 'Petrol',
  },
  {
    plate_number: 'RAM002A',
    transmission_mode: TransmissionMode.MANUAL,
    vehicle_photo: 'patrol2.png',
    vehicle_year: 2020,
    energy_type: 'Diesel',
  },
  {
    plate_number: 'RAM003A',
    transmission_mode: TransmissionMode.AUTOMATIC,
    vehicle_photo: 'patrol3.png',
    vehicle_year: 2021,
    energy_type: 'Diesel',
  },
];



  for (const v of vehicles) {
    await prisma.tbl_vehicles.upsert({
      where: { plate_number: v.plate_number },
      update: {},
      create: {
        ...v,
        vehicle_model: { connect: { vehicle_model_id: vehicleModel.vehicle_model_id } },
        organization: { connect: { organization_id: fleetOrg.organization_id } },
      },
    });

  }

  const fleetPosition = await prisma.tbl_position.upsert({
    where: {
      position_name_unit_id: {
        position_name: 'Fleet Manager',
        unit_id: fleetUnit.unit_id,
      },
    },
    update: {
      position_access: fleetManagerAccess,
    },
    create: {
      position_name: 'Fleet Manager',
      position_description: 'Manages fleet resources.',
      position_access: fleetManagerAccess,
      unit_id: fleetUnit.unit_id,
    },
  });

  const fleetPassword = await argon2.hash('fleetsecurepassword');
  const fleetAuth = await prisma.tbl_auth.upsert({
    where: { email: 'fleetmanager@fleetcorp.rw' },
    update: { password: fleetPassword },
    create: {
      email: 'fleetmanager@fleetcorp.rw',
      password: fleetPassword,
    },
  });

  const fleetUser = await upsertSeedUser({
    first_name: 'Fleet',
    last_name: 'Manager',
    user_nid: '9876543210987654',
    user_phone: '250788123789',
    user_dob: new Date('1985-05-20'),
    user_gender: 'FEMALE',
    user_photo: 'https://avatars.githubusercontent.com/u/122959151?v=4',
    street_address: 'Fleet Road',
    auth_id: fleetAuth.auth_id,
  });

  await prisma.tbl_user_position_assignments.upsert({
    where: {
      user_id_position_id: {
        user_id: fleetUser.user_id,
        position_id: fleetPosition.position_id,
      },
    },
    update: {},
    create: {
      user_id: fleetUser.user_id,
      position_id: fleetPosition.position_id,
    },
  });

  // ======= 3. Reservation User with Reservation Permissions =======
  const reservationUserAccess = {
    organizations: { create: false, view: false, update: false, delete: false },
    units: { create: false, view: false, update: false, delete: false },
    positions: { create: false, view: false, update: false, delete: false, assignUser: false },
    users: { create: false, view: false, update: false, delete: false },
    vehicleModels: { create: false, view: false, viewSingle: false, update: false, delete: false },
    vehicles: { create: false, view: true, viewSingle: true, update: false, delete: false },
    reservations: {
    view: false,
    start: false,
    cancel: true,
    create: true,
    delete: false,
    update: false,
    approve: false,
    viewOwn: true,
    complete: false,
    odometerFuel: false,
    updateReason: true,
    assignVehicle: false
  },
    fuel: {
      request: true,
      view: false,
      viewOwn: true,
      recommend: false,
      confirmFunding: false,
      issue: false,
      receive: true,
      replenish: false,
      viewReport: false,
      manageGenerators: false,
    },
  };

  const reservationUnit = await prisma.tbl_unit.upsert({
    where: {
      unit_name_organization_id: {
        unit_name: 'Reservation Unit',
        organization_id: tekinovaOrg.organization_id,
      },
    },
    update: {},
    create: {
      unit_name: 'Reservation Unit',
      organization_id: tekinovaOrg.organization_id,
    },
  });

  const reservationPosition = await prisma.tbl_position.upsert({
    where: {
      position_name_unit_id: {
        position_name: 'Reservation User',
        unit_id: reservationUnit.unit_id,
      },
    },
    update: {},
    create: {
      position_name: 'Reservation User',
      position_description: 'Can make and manage reservations.',
      position_access: reservationUserAccess,
      unit_id: reservationUnit.unit_id,
    },
  });

  const reservationPassword = await argon2.hash('reservationpassword');
  const reservationAuth = await prisma.tbl_auth.upsert({
    where: { email: 'reservationuser@tekinova.rw' },
    update: { password: reservationPassword },
    create: {
      email: 'reservationuser@tekinova.rw',
      password: reservationPassword,
    },
  });

  const reservationUser = await upsertSeedUser({
    first_name: 'Reservation',
    last_name: 'User',
    user_nid: '1111222233334444',
    user_phone: '250788111222',
    user_dob: new Date('1995-02-15'),
    user_gender: 'FEMALE',
    user_photo: 'https://avatars.githubusercontent.com/u/122959151?v=4',
    street_address: 'Reservation Street',
    auth_id: reservationAuth.auth_id,
  });

  await prisma.tbl_user_position_assignments.upsert({
    where: {
      user_id_position_id: {
        user_id: reservationUser.user_id,
        position_id: reservationPosition.position_id,
      },
    },
    update: {},
    create: {
      user_id: reservationUser.user_id,
      position_id: reservationPosition.position_id,
    },
  });

  // ======= 4. Seed a Reservation and Reserved Vehicle =======
  const availableVehicle = await prisma.tbl_vehicles.findFirst({
    where: { vehicle_status: 'AVAILABLE' },
  });

  if (availableVehicle) {
    const existingReservation = await prisma.tbl_reservations.findFirst({
      where: { user_id: reservationUser.user_id, reservation_purpose: 'Client visit' },
    });

    if (!existingReservation) {
      const reservation = await prisma.tbl_reservations.create({
        data: {
          reservation_purpose: 'Client visit',
          start_location: 'Kigali HQ',
          reservation_destination: 'Gisenyi Branch',
          departure_date: new Date('2024-08-10T08:00:00Z'),
          expected_returning_date: new Date('2024-08-10T18:00:00Z'),
          user_id: reservationUser.user_id,
          reservation_status: 'UNDER_REVIEW',
        },
      });

      await prisma.tbl_reserved_vehicles.create({
        data: {
          vehicle_id: availableVehicle.vehicle_id,
          reservation_id: reservation.reservation_id,
          starting_odometer: 10000,
          fuel_provided: 60,
          returned_odometer: null,
          returned_date: new Date('2024-08-10T18:00:00Z'),
        },
      });

      await prisma.tbl_vehicles.update({
        where: { vehicle_id: availableVehicle.vehicle_id },
        data: { vehicle_status: 'OCCUPIED' },
      });
    }
  }

  // ======= 4b. Reservation User for Fleet Corp =======
  const fleetReservationUserAccess = {
    organizations: { create: false, view: false, update: false, delete: false },
    units: { create: false, view: false, update: false, delete: false },
    positions: { create: false, view: false, update: false, delete: false },
    users: { create: false, view: false, update: false, delete: false },
    vehicleModels: { create: false, view: false, viewSingle: false, update: false, delete: false },
    vehicles: { create: false, view: true, viewSingle: true, update: false, delete: false },
    reservations: {
      view: false,
      start: false,
      cancel: true,
      create: true,
      delete: false,
      update: false,
      approve: false,
      viewOwn: true,
      complete: false,
      odometerFuel: false,
      updateReason: true,
      assignVehicle: false
    },
    fuel: {
      request: true,
      view: false,
      viewOwn: true,
      recommend: false,
      confirmFunding: false,
      issue: false,
      receive: true,
      replenish: false,
      viewReport: false,
      manageGenerators: false,
    },
  };

  const fleetReservationUnit = await prisma.tbl_unit.upsert({
    where: {
      unit_name_organization_id: {
        unit_name: 'Reservation Unit',
        organization_id: fleetOrg.organization_id,
      },
    },
    update: {},
    create: {
      unit_name: 'Reservation Unit',
      organization_id: fleetOrg.organization_id,
    },
  });

  const fleetReservationPosition = await prisma.tbl_position.upsert({
    where: {
      position_name_unit_id: {
        position_name: 'Reservation User',
        unit_id: fleetReservationUnit.unit_id,
      },
    },
    update: {},
    create: {
      position_name: 'Reservation User',
      position_description: 'Can make and manage reservations.',
      position_access: fleetReservationUserAccess,
      unit_id: fleetReservationUnit.unit_id,
    },
  });

  const fleetReservationPassword = await argon2.hash('fleetreservationpassword');
  const fleetReservationAuth = await prisma.tbl_auth.upsert({
    where: { email: 'munezeromicha2000@gmail.com' },
    update: { password: fleetReservationPassword },
    create: {
      email: 'munezeromicha2000@gmail.com',
      password: fleetReservationPassword,
    },
  });

  const fleetReservationUser = await upsertSeedUser({
    first_name: 'Fleet',
    last_name: 'ReservationUser',
    user_nid: '1112333344445000',
    user_phone: '250788229833',
    user_dob: new Date('1993-03-15'),
    user_gender: 'MALE',
    user_photo: 'https://avatars.githubusercontent.com/u/122959151?v=4',
    street_address: 'Fleet Reservation Street',
    auth_id: fleetReservationAuth.auth_id,
  });

  await prisma.tbl_user_position_assignments.upsert({
    where: {
      user_id_position_id: {
        user_id: fleetReservationUser.user_id,
        position_id: fleetReservationPosition.position_id,
      },
    },
    update: {},
    create: {
      user_id: fleetReservationUser.user_id,
      position_id: fleetReservationPosition.position_id,
    },
  });

  // Strip Organizations module from every non-SuperAdmin position (fixes org leaders
  // that were previously given organizations.view/update).
  const allPositions = await prisma.tbl_position.findMany({
    select: { position_id: true, position_name: true, position_access: true },
  });
  for (const pos of allPositions) {
    if (pos.position_name === 'SuperAdmin') continue;
    const access = (pos.position_access ?? {}) as Record<string, Record<string, boolean>>;
    const orgs = access.organizations;
    if (!orgs) continue;
    if (!orgs.create && !orgs.view && !orgs.update && !orgs.delete) continue;
    await prisma.tbl_position.update({
      where: { position_id: pos.position_id },
      data: {
        position_access: {
          ...access,
          organizations: { create: false, view: false, update: false, delete: false },
        },
      },
    });
  }

  console.log('✅ Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
