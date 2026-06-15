const { vehicleUpdateSchema } = require('./src/schemas/vehicle.schema');

const sample = {
  plate_number: 'RAA001M',
  transmission_mode: 'AUTOMATIC',
  vehicle_model_id: '3823de5d-b977-4e07-a2da-18926154f81c',
  unit_id: 'e44aec5e-2544-45e8-a593-4db938223ad0',
  vehicle_year: '2000',
  energy_type: 'ELECTRIC',
};

try {
  console.log('parsed:', vehicleUpdateSchema.parse(sample));
} catch (e) {
  console.error('parse error:', e.issues || e.message);
}
