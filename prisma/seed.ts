// prisma/seed.ts
import { PrismaClient, TransmissionMode, VehicleType } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const now = new Date();

  // ======= Helper Access Objects =======
  const fullAdminAccess = {
    organizations: { create: true, view: true, update: true, delete: true },
    units: { create: true, view: true, update: true, delete: true },
    positions: { create: true, view: true, update: true, delete: true },
    users: { create: true, view: true, update: true, delete: true },
    vehicleModels: { create: false, view: false, viewSingle: false, update: false, delete: false },
    vehicles: { create: false, view: false, viewSingle: false, update: false, delete: false },
  };

  const fleetManagerAccess = {
    organizations: { create: false, view: false, update: false, delete: false },
    units: { create: false, view: false, update: false, delete: false },
    positions: { create: false, view: false, update: false, delete: false },
    users: { create: false, view: false, update: false, delete: false },
    vehicleModels: { create: true, view: true, viewSingle: true, update: true, delete: true },
    vehicles: { create: true, view: true, viewSingle: true, update: true, delete: true },
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
    update: {},
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


  const adminUser = await prisma.tbl_users.create({
    data: {
      first_name: 'Tekinova',
      last_name: 'Admin',
      user_nid: '1234567890123456',
      user_phone: '250788654321',
      user_dob: new Date('1990-01-01'),
      user_gender: 'MALE',
      user_photo: 'https://avatars.githubusercontent.com/u/122959151?v=4',
      street_address: 'Admin Street',
      auth_id: adminAuth.auth_id,
    },
  });

  await prisma.tbl_position.update({
    where: { position_id: adminPosition.position_id },
    data: { user_id: adminUser.user_id },
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

  const vehicleModel = await prisma.tbl_vehicle_models.create({
    data: {
      vehicle_model_name: 'Nissan Patrol',
      vehicle_type: 'SUV',
      manufacturer_name: 'Nissan',
    },
  });

 const vehicles = [
  {
    plate_number: 'FLEET001',
    vehicle_type: VehicleType.SUV,
    transmission_mode: TransmissionMode.AUTOMATIC,
    vehicle_photo: 'patrol1.png',
    vehicle_year: 2019,
    vehicle_capacity: 5,
    energy_type: 'Petrol',
  },
  {
    plate_number: 'FLEET002',
    vehicle_type: VehicleType.SUV,
    transmission_mode: TransmissionMode.MANUAL,
    vehicle_photo: 'patrol2.png',
    vehicle_year: 2020,
    vehicle_capacity: 7,
    energy_type: 'Diesel',
  },
  {
    plate_number: 'FLEET003',
    vehicle_type: VehicleType.SUV,
    transmission_mode: TransmissionMode.AUTOMATIC,
    vehicle_photo: 'patrol3.png',
    vehicle_year: 2021,
    vehicle_capacity: 5,
    energy_type: 'Diesel',
  },
];



  for (const v of vehicles) {
    await prisma.tbl_vehicles.create({
      data: {
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
    update: {},
    create: {
      position_name: 'Fleet Manager',
      position_description: 'Manages fleet resources.',
      position_access: fleetManagerAccess,
      unit_id: fleetUnit.unit_id,
    },
  });

  const fleetPassword = await argon2.hash('fleetsecurepassword');
  const fleetAuth = await prisma.tbl_auth.create({
    data: {
      email: 'fleetmanager@fleetcorp.rw',
      password: fleetPassword,
    },
  });

  const fleetUser = await prisma.tbl_users.create({
    data: {
      first_name: 'Fleet',
      last_name: 'Manager',
      user_nid: '9876543210987654',
      user_phone: '250788123789',
      user_dob: new Date('1985-05-20'),
      user_gender: 'FEMALE',
      user_photo: 'https://avatars.githubusercontent.com/u/122959151?v=4',
      street_address: 'Fleet Road',
      auth_id: fleetAuth.auth_id,
    },
  });

  await prisma.tbl_position.update({
    where: { position_id: fleetPosition.position_id },
    data: { user_id: fleetUser.user_id },
  });

  // ======= 3. Reservation User with Reservation Permissions =======
  const reservationUserAccess = {
    organizations: { create: false, view: false, update: false, delete: false },
    units: { create: false, view: false, update: false, delete: false },
    positions: { create: false, view: false, update: false, delete: false },
    users: { create: false, view: false, update: false, delete: false },
    vehicleModels: { create: false, view: false, viewSingle: false, update: false, delete: false },
    vehicles: { create: false, view: true, viewSingle: true, update: false, delete: false },
    reservations: { create: true, view: true, update: true, delete: true },
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
  const reservationAuth = await prisma.tbl_auth.create({
    data: {
      email: 'reservationuser@tekinova.rw',
      password: reservationPassword,
    },
  });

  const reservationUser = await prisma.tbl_users.create({
    data: {
      first_name: 'Reservation',
      last_name: 'User',
      user_nid: '1111222233334444',
      user_phone: '250788111222',
      user_dob: new Date('1995-02-15'),
      user_gender: 'FEMALE',
      user_photo: 'https://avatars.githubusercontent.com/u/122959151?v=4',
      street_address: 'Reservation Street',
      auth_id: reservationAuth.auth_id,
    },
  });

  await prisma.tbl_position.update({
    where: { position_id: reservationPosition.position_id },
    data: { user_id: reservationUser.user_id },
  });

  // ======= 4. Seed a Reservation and Reserved Vehicle =======
  const availableVehicle = await prisma.tbl_vehicles.findFirst({
    where: { vehicle_status: 'AVAILABLE' },
  });

  if (availableVehicle) {
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
