require('dotenv').config();
require('ts-node/register');
const { PrismaClient } = require('@prisma/client');
const { updateVehicle } = require('../src/services/vehicle.services');

const vehicleId = '9ed1dd9e-5b44-48e1-94a8-d083ddc0d877';
const prisma = new PrismaClient();

async function main() {
  const units = await prisma.tbl_unit.findMany({
    where: { organization_id: '0e487983-43c6-45e2-9109-b4a779145412' },
    select: { unit_id: true, unit_name: true },
  });
  console.log('Units:', units);

  const testUnit = units.find((u) => u.unit_name.includes('Testing')) || units[0];
  if (!testUnit) {
    console.log('No unit found');
    return;
  }

  console.log('Updating with unit:', testUnit);
  const result = await updateVehicle(vehicleId, {
    unit_id: testUnit.unit_id,
    gps_device: {
      device_model: 'M588GS',
      imei: '867686060123456',
      sim_number: '0788000000',
      apn: 'internet',
      server_ip: '127.0.0.1',
      server_port: 5023,
    },
  });
  console.log('Update result:', JSON.stringify(result, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
