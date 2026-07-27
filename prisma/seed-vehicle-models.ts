import { PrismaClient } from '@prisma/client';

/**
 * Comprehensive vehicle model catalogue for ImoTrak.
 * Safe to re-run — upserts by unique vehicle_model_name.
 */
export const VEHICLE_MODEL_SEED: Array<{
  vehicle_model_name: string;
  vehicle_type: string;
  manufacturer_name: string;
  vehicle_capacity: number;
}> = [
  // Toyota
  { vehicle_model_name: 'Toyota Corolla', vehicle_type: 'SEDAN', manufacturer_name: 'Toyota', vehicle_capacity: 5 },
  { vehicle_model_name: 'Toyota Camry', vehicle_type: 'SEDAN', manufacturer_name: 'Toyota', vehicle_capacity: 5 },
  { vehicle_model_name: 'Toyota Altis', vehicle_type: 'SEDAN', manufacturer_name: 'Toyota', vehicle_capacity: 5 },
  { vehicle_model_name: 'Toyota Avalon', vehicle_type: 'SEDAN', manufacturer_name: 'Toyota', vehicle_capacity: 5 },
  { vehicle_model_name: 'Toyota RAV4', vehicle_type: 'SUV', manufacturer_name: 'Toyota', vehicle_capacity: 5 },
  { vehicle_model_name: 'Toyota Prado', vehicle_type: 'SUV', manufacturer_name: 'Toyota', vehicle_capacity: 7 },
  { vehicle_model_name: 'Toyota Land Cruiser', vehicle_type: 'SUV', manufacturer_name: 'Toyota', vehicle_capacity: 8 },
  { vehicle_model_name: 'Toyota Fortuner', vehicle_type: 'SUV', manufacturer_name: 'Toyota', vehicle_capacity: 7 },
  { vehicle_model_name: 'Toyota Highlander', vehicle_type: 'SUV', manufacturer_name: 'Toyota', vehicle_capacity: 8 },
  { vehicle_model_name: 'Toyota Hilux', vehicle_type: 'TRUCK', manufacturer_name: 'Toyota', vehicle_capacity: 5 },
  { vehicle_model_name: 'Toyota Tacoma', vehicle_type: 'TRUCK', manufacturer_name: 'Toyota', vehicle_capacity: 5 },
  { vehicle_model_name: 'Toyota Hiace', vehicle_type: 'VAN', manufacturer_name: 'Toyota', vehicle_capacity: 14 },
  { vehicle_model_name: 'Toyota Coaster', vehicle_type: 'BUS', manufacturer_name: 'Toyota', vehicle_capacity: 30 },
  { vehicle_model_name: 'Toyota Prius', vehicle_type: 'SEDAN', manufacturer_name: 'Toyota', vehicle_capacity: 5 },
  // Nissan
  { vehicle_model_name: 'Nissan Patrol', vehicle_type: 'SUV', manufacturer_name: 'Nissan', vehicle_capacity: 7 },
  { vehicle_model_name: 'Nissan X-Trail', vehicle_type: 'SUV', manufacturer_name: 'Nissan', vehicle_capacity: 5 },
  { vehicle_model_name: 'Nissan Qashqai', vehicle_type: 'SUV', manufacturer_name: 'Nissan', vehicle_capacity: 5 },
  { vehicle_model_name: 'Nissan Rogue', vehicle_type: 'SUV', manufacturer_name: 'Nissan', vehicle_capacity: 5 },
  { vehicle_model_name: 'Nissan Altima', vehicle_type: 'SEDAN', manufacturer_name: 'Nissan', vehicle_capacity: 5 },
  { vehicle_model_name: 'Nissan Sentra', vehicle_type: 'SEDAN', manufacturer_name: 'Nissan', vehicle_capacity: 5 },
  { vehicle_model_name: 'Nissan Sunny', vehicle_type: 'SEDAN', manufacturer_name: 'Nissan', vehicle_capacity: 5 },
  { vehicle_model_name: 'Nissan Navara', vehicle_type: 'TRUCK', manufacturer_name: 'Nissan', vehicle_capacity: 5 },
  { vehicle_model_name: 'Nissan Frontier', vehicle_type: 'TRUCK', manufacturer_name: 'Nissan', vehicle_capacity: 5 },
  { vehicle_model_name: 'Nissan Urvan', vehicle_type: 'VAN', manufacturer_name: 'Nissan', vehicle_capacity: 15 },
  { vehicle_model_name: 'Nissan NV350', vehicle_type: 'VAN', manufacturer_name: 'Nissan', vehicle_capacity: 12 },
  // Honda
  { vehicle_model_name: 'Honda Civic', vehicle_type: 'SEDAN', manufacturer_name: 'Honda', vehicle_capacity: 5 },
  { vehicle_model_name: 'Honda Accord', vehicle_type: 'SEDAN', manufacturer_name: 'Honda', vehicle_capacity: 5 },
  { vehicle_model_name: 'Honda City', vehicle_type: 'SEDAN', manufacturer_name: 'Honda', vehicle_capacity: 5 },
  { vehicle_model_name: 'Honda CR-V', vehicle_type: 'SUV', manufacturer_name: 'Honda', vehicle_capacity: 5 },
  { vehicle_model_name: 'Honda HR-V', vehicle_type: 'SUV', manufacturer_name: 'Honda', vehicle_capacity: 5 },
  { vehicle_model_name: 'Honda Pilot', vehicle_type: 'SUV', manufacturer_name: 'Honda', vehicle_capacity: 8 },
  { vehicle_model_name: 'Honda Ridgeline', vehicle_type: 'TRUCK', manufacturer_name: 'Honda', vehicle_capacity: 5 },
  // Hyundai / Kia
  { vehicle_model_name: 'Hyundai Elantra', vehicle_type: 'SEDAN', manufacturer_name: 'Hyundai', vehicle_capacity: 5 },
  { vehicle_model_name: 'Hyundai Sonata', vehicle_type: 'SEDAN', manufacturer_name: 'Hyundai', vehicle_capacity: 5 },
  { vehicle_model_name: 'Hyundai Tucson', vehicle_type: 'SUV', manufacturer_name: 'Hyundai', vehicle_capacity: 5 },
  { vehicle_model_name: 'Hyundai Santa Fe', vehicle_type: 'SUV', manufacturer_name: 'Hyundai', vehicle_capacity: 7 },
  { vehicle_model_name: 'Hyundai Creta', vehicle_type: 'SUV', manufacturer_name: 'Hyundai', vehicle_capacity: 5 },
  { vehicle_model_name: 'Hyundai H1', vehicle_type: 'VAN', manufacturer_name: 'Hyundai', vehicle_capacity: 12 },
  { vehicle_model_name: 'Hyundai County', vehicle_type: 'BUS', manufacturer_name: 'Hyundai', vehicle_capacity: 25 },
  { vehicle_model_name: 'Kia Sportage', vehicle_type: 'SUV', manufacturer_name: 'Kia', vehicle_capacity: 5 },
  { vehicle_model_name: 'Kia Sorento', vehicle_type: 'SUV', manufacturer_name: 'Kia', vehicle_capacity: 7 },
  { vehicle_model_name: 'Kia Rio', vehicle_type: 'SEDAN', manufacturer_name: 'Kia', vehicle_capacity: 5 },
  { vehicle_model_name: 'Kia Cerato', vehicle_type: 'SEDAN', manufacturer_name: 'Kia', vehicle_capacity: 5 },
  { vehicle_model_name: 'Kia Carnival', vehicle_type: 'VAN', manufacturer_name: 'Kia', vehicle_capacity: 8 },
  // Mitsubishi / Suzuki / Isuzu
  { vehicle_model_name: 'Mitsubishi Pajero', vehicle_type: 'SUV', manufacturer_name: 'Mitsubishi', vehicle_capacity: 7 },
  { vehicle_model_name: 'Mitsubishi Outlander', vehicle_type: 'SUV', manufacturer_name: 'Mitsubishi', vehicle_capacity: 5 },
  { vehicle_model_name: 'Mitsubishi L200', vehicle_type: 'TRUCK', manufacturer_name: 'Mitsubishi', vehicle_capacity: 5 },
  { vehicle_model_name: 'Mitsubishi Canter', vehicle_type: 'TRUCK', manufacturer_name: 'Mitsubishi', vehicle_capacity: 3 },
  { vehicle_model_name: 'Suzuki Swift', vehicle_type: 'SEDAN', manufacturer_name: 'Suzuki', vehicle_capacity: 5 },
  { vehicle_model_name: 'Suzuki Vitara', vehicle_type: 'SUV', manufacturer_name: 'Suzuki', vehicle_capacity: 5 },
  { vehicle_model_name: 'Suzuki Jimny', vehicle_type: 'SUV', manufacturer_name: 'Suzuki', vehicle_capacity: 4 },
  { vehicle_model_name: 'Suzuki Every', vehicle_type: 'VAN', manufacturer_name: 'Suzuki', vehicle_capacity: 7 },
  { vehicle_model_name: 'Suzuki Carry Bus', vehicle_type: 'BUS', manufacturer_name: 'Suzuki', vehicle_capacity: 30 },
  { vehicle_model_name: 'Isuzu D-Max', vehicle_type: 'TRUCK', manufacturer_name: 'Isuzu', vehicle_capacity: 5 },
  { vehicle_model_name: 'Isuzu MU-X', vehicle_type: 'SUV', manufacturer_name: 'Isuzu', vehicle_capacity: 7 },
  { vehicle_model_name: 'Isuzu NPR', vehicle_type: 'TRUCK', manufacturer_name: 'Isuzu', vehicle_capacity: 3 },
  // Ford / Chevrolet / VW
  { vehicle_model_name: 'Ford Ranger', vehicle_type: 'TRUCK', manufacturer_name: 'Ford', vehicle_capacity: 5 },
  { vehicle_model_name: 'Ford Everest', vehicle_type: 'SUV', manufacturer_name: 'Ford', vehicle_capacity: 7 },
  { vehicle_model_name: 'Ford Escape', vehicle_type: 'SUV', manufacturer_name: 'Ford', vehicle_capacity: 5 },
  { vehicle_model_name: 'Ford Focus', vehicle_type: 'SEDAN', manufacturer_name: 'Ford', vehicle_capacity: 5 },
  { vehicle_model_name: 'Ford Transit', vehicle_type: 'VAN', manufacturer_name: 'Ford', vehicle_capacity: 15 },
  { vehicle_model_name: 'Chevrolet Traverse', vehicle_type: 'SUV', manufacturer_name: 'Chevrolet', vehicle_capacity: 8 },
  { vehicle_model_name: 'Chevrolet Malibu', vehicle_type: 'SEDAN', manufacturer_name: 'Chevrolet', vehicle_capacity: 5 },
  { vehicle_model_name: 'Chevrolet Colorado', vehicle_type: 'TRUCK', manufacturer_name: 'Chevrolet', vehicle_capacity: 5 },
  { vehicle_model_name: 'Volkswagen Golf', vehicle_type: 'SEDAN', manufacturer_name: 'Volkswagen', vehicle_capacity: 5 },
  { vehicle_model_name: 'Volkswagen Tiguan', vehicle_type: 'SUV', manufacturer_name: 'Volkswagen', vehicle_capacity: 5 },
  { vehicle_model_name: 'Volkswagen Amarok', vehicle_type: 'TRUCK', manufacturer_name: 'Volkswagen', vehicle_capacity: 5 },
  { vehicle_model_name: 'Volkswagen Crafter', vehicle_type: 'VAN', manufacturer_name: 'Volkswagen', vehicle_capacity: 16 },
  // Mercedes / BMW / Audi
  { vehicle_model_name: 'Mercedes-Benz C-Class', vehicle_type: 'SEDAN', manufacturer_name: 'Mercedes-Benz', vehicle_capacity: 5 },
  { vehicle_model_name: 'Mercedes-Benz E-Class', vehicle_type: 'SEDAN', manufacturer_name: 'Mercedes-Benz', vehicle_capacity: 5 },
  { vehicle_model_name: 'Mercedes-Benz GLE', vehicle_type: 'SUV', manufacturer_name: 'Mercedes-Benz', vehicle_capacity: 5 },
  { vehicle_model_name: 'Mercedes-Benz G-Class', vehicle_type: 'SUV', manufacturer_name: 'Mercedes-Benz', vehicle_capacity: 5 },
  { vehicle_model_name: 'Mercedes-Benz Sprinter', vehicle_type: 'VAN', manufacturer_name: 'Mercedes-Benz', vehicle_capacity: 18 },
  { vehicle_model_name: 'BMW 3 Series', vehicle_type: 'SEDAN', manufacturer_name: 'BMW', vehicle_capacity: 5 },
  { vehicle_model_name: 'BMW 5 Series', vehicle_type: 'SEDAN', manufacturer_name: 'BMW', vehicle_capacity: 5 },
  { vehicle_model_name: 'BMW X3', vehicle_type: 'SUV', manufacturer_name: 'BMW', vehicle_capacity: 5 },
  { vehicle_model_name: 'BMW X5', vehicle_type: 'SUV', manufacturer_name: 'BMW', vehicle_capacity: 5 },
  { vehicle_model_name: 'Audi A4', vehicle_type: 'SEDAN', manufacturer_name: 'Audi', vehicle_capacity: 5 },
  { vehicle_model_name: 'Audi Q5', vehicle_type: 'SUV', manufacturer_name: 'Audi', vehicle_capacity: 5 },
  { vehicle_model_name: 'Audi Q7', vehicle_type: 'SUV', manufacturer_name: 'Audi', vehicle_capacity: 7 },
  // Land Rover / Jeep / Mazda / Subaru
  { vehicle_model_name: 'Land Rover Defender', vehicle_type: 'SUV', manufacturer_name: 'Land Rover', vehicle_capacity: 5 },
  { vehicle_model_name: 'Land Rover Discovery', vehicle_type: 'SUV', manufacturer_name: 'Land Rover', vehicle_capacity: 7 },
  { vehicle_model_name: 'Range Rover Sport', vehicle_type: 'SUV', manufacturer_name: 'Land Rover', vehicle_capacity: 5 },
  { vehicle_model_name: 'Jeep Wrangler', vehicle_type: 'SUV', manufacturer_name: 'Jeep', vehicle_capacity: 5 },
  { vehicle_model_name: 'Jeep Grand Cherokee', vehicle_type: 'SUV', manufacturer_name: 'Jeep', vehicle_capacity: 5 },
  { vehicle_model_name: 'Mazda 3', vehicle_type: 'SEDAN', manufacturer_name: 'Mazda', vehicle_capacity: 5 },
  { vehicle_model_name: 'Mazda 6', vehicle_type: 'SEDAN', manufacturer_name: 'Mazda', vehicle_capacity: 5 },
  { vehicle_model_name: 'Mazda CX-5', vehicle_type: 'SUV', manufacturer_name: 'Mazda', vehicle_capacity: 5 },
  { vehicle_model_name: 'Mazda CX-9', vehicle_type: 'SUV', manufacturer_name: 'Mazda', vehicle_capacity: 7 },
  { vehicle_model_name: 'Subaru Forester', vehicle_type: 'SUV', manufacturer_name: 'Subaru', vehicle_capacity: 5 },
  { vehicle_model_name: 'Subaru Outback', vehicle_type: 'SUV', manufacturer_name: 'Subaru', vehicle_capacity: 5 },
  // Buses / specialty / motorcycles
  { vehicle_model_name: 'Yutong ZK6118', vehicle_type: 'BUS', manufacturer_name: 'Yutong', vehicle_capacity: 45 },
  { vehicle_model_name: 'Golden Dragon XML6125', vehicle_type: 'BUS', manufacturer_name: 'Golden Dragon', vehicle_capacity: 50 },
  { vehicle_model_name: 'Ashok Leyland Falcon', vehicle_type: 'BUS', manufacturer_name: 'Ashok Leyland', vehicle_capacity: 40 },
  { vehicle_model_name: 'Tata Starbus', vehicle_type: 'BUS', manufacturer_name: 'Tata', vehicle_capacity: 42 },
  { vehicle_model_name: 'Fuso Rosa', vehicle_type: 'BUS', manufacturer_name: 'Mitsubishi Fuso', vehicle_capacity: 26 },
  { vehicle_model_name: 'Toyota Ambulance Hiace', vehicle_type: 'OTHER', manufacturer_name: 'Toyota', vehicle_capacity: 4 },
  { vehicle_model_name: 'Ford Ambulance Transit', vehicle_type: 'OTHER', manufacturer_name: 'Ford', vehicle_capacity: 4 },
  { vehicle_model_name: 'Yamaha MT-07', vehicle_type: 'MOTORCYCLE', manufacturer_name: 'Yamaha', vehicle_capacity: 2 },
  { vehicle_model_name: 'Honda CB500X', vehicle_type: 'MOTORCYCLE', manufacturer_name: 'Honda', vehicle_capacity: 2 },
  { vehicle_model_name: 'Bajaj Boxer 150', vehicle_type: 'MOTORCYCLE', manufacturer_name: 'Bajaj', vehicle_capacity: 2 },
  { vehicle_model_name: 'TVS Apache RTR', vehicle_type: 'MOTORCYCLE', manufacturer_name: 'TVS', vehicle_capacity: 2 },
  { vehicle_model_name: 'Suzuki GSX-S750', vehicle_type: 'MOTORCYCLE', manufacturer_name: 'Suzuki', vehicle_capacity: 2 },
  // Electric / newer fleet options
  { vehicle_model_name: 'Tesla Model 3', vehicle_type: 'SEDAN', manufacturer_name: 'Tesla', vehicle_capacity: 5 },
  { vehicle_model_name: 'Tesla Model Y', vehicle_type: 'SUV', manufacturer_name: 'Tesla', vehicle_capacity: 5 },
  { vehicle_model_name: 'BYD Atto 3', vehicle_type: 'SUV', manufacturer_name: 'BYD', vehicle_capacity: 5 },
  { vehicle_model_name: 'BYD Seal', vehicle_type: 'SEDAN', manufacturer_name: 'BYD', vehicle_capacity: 5 },
  { vehicle_model_name: 'Hyundai Ioniq 5', vehicle_type: 'SUV', manufacturer_name: 'Hyundai', vehicle_capacity: 5 },
  { vehicle_model_name: 'Kia EV6', vehicle_type: 'SUV', manufacturer_name: 'Kia', vehicle_capacity: 5 },
];

export async function seedVehicleModels(prisma: PrismaClient) {
  let created = 0;
  let updated = 0;
  for (const model of VEHICLE_MODEL_SEED) {
    const existing = await prisma.tbl_vehicle_models.findUnique({
      where: { vehicle_model_name: model.vehicle_model_name },
    });
    if (existing) {
      await prisma.tbl_vehicle_models.update({
        where: { vehicle_model_id: existing.vehicle_model_id },
        data: {
          vehicle_type: model.vehicle_type,
          manufacturer_name: model.manufacturer_name,
          vehicle_capacity: model.vehicle_capacity,
        },
      });
      updated += 1;
    } else {
      await prisma.tbl_vehicle_models.create({ data: model });
      created += 1;
    }
  }
  console.log(`🚗 Vehicle models seed: ${created} created, ${updated} updated (${VEHICLE_MODEL_SEED.length} total).`);
}

/** Run directly: npm run seed:vehicle-models */
async function main() {
  const prisma = new PrismaClient();
  try {
    await seedVehicleModels(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error('❌ Vehicle models seed failed:', e);
    process.exit(1);
  });
}
