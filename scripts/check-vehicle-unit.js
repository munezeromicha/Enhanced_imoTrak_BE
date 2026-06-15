require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const id = process.argv[2] || '9ed1dd9e-5b44-48e1-94a8-d083ddc0d877';
const prisma = new PrismaClient();

async function main() {
  try {
    const vehicle = await prisma.tbl_vehicles.findUnique({
      where: { vehicle_id: id },
      include: { unit: true, gps_device: true, organization: true, vehicle_model: true },
    });
    console.log('Vehicle with relations:', JSON.stringify(vehicle, null, 2));
  } catch (err) {
    console.error('Query failed:', err.message);
    if (err.code) console.error('code:', err.code);
  }

  try {
    const cols = await prisma.$queryRaw`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'tbl_vehicles' AND column_name IN ('unit_id')
    `;
    console.log('unit_id column exists:', cols);
  } catch (err) {
    console.error('Column check failed:', err.message);
  }

  try {
    const gpsTable = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables
      WHERE table_name = 'tbl_gps_devices'
    `;
    console.log('tbl_gps_devices table:', gpsTable);
  } catch (err) {
    console.error('GPS table check failed:', err.message);
  }
}

main().finally(() => prisma.$disconnect());
