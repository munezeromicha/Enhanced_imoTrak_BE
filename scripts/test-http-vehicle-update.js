require('dotenv').config();

const BASE = 'http://localhost:4000/v2';
const VEHICLE_ID = '9ed1dd9e-5b44-48e1-94a8-d083ddc0d877';
const UNIT_ID = 'e44aec5e-2544-45e8-a593-4db938223ad0';

async function main() {
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'superadmin@tekinova.rw', password: 'supersecurepassword' }),
  });
  const login = await loginRes.json();
  const pos = login?.data?.[0];
  const posRes = await fetch(`${BASE}/auth/${pos.position_id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'superadmin@tekinova.rw', password: 'supersecurepassword' }),
  });
  const token = (await posRes.json())?.data?.token;

  const form = new FormData();
  form.append('plate_number', 'RAA001M');
  form.append('transmission_mode', 'AUTOMATIC');
  form.append('vehicle_model_id', '3823de5d-b977-4e07-a2da-18926154f81c');
  form.append('vehicle_year', '2000');
  form.append('energy_type', 'ELECTRIC');
  form.append('organization_id', '0e487983-43c6-45e2-9109-b4a779145412');
  form.append('unit_id', UNIT_ID);
  form.append(
    'gps_device',
    JSON.stringify({
      device_model: 'M588GS',
      imei: '867686060123456',
      sim_number: '0788000000',
      apn: 'internet',
      server_ip: '127.0.0.1',
      server_port: 5023,
    }),
  );

  const putRes = await fetch(`${BASE}/vehicles/${VEHICLE_ID}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const putBody = await putRes.json();
  console.log('PUT status:', putRes.status);
  console.log('PUT unit_id:', putBody?.data?.unit_id);
  console.log('PUT unit name:', putBody?.data?.unit?.unit_name);
  console.log('PUT gps imei:', putBody?.data?.gps_device?.imei);

  const getRes = await fetch(`${BASE}/vehicles/${VEHICLE_ID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const getBody = await getRes.json();
  console.log('GET status:', getRes.status);
  console.log('GET unit_id:', getBody?.data?.unit_id);
  console.log('GET unit name:', getBody?.data?.unit?.unit_name);
  console.log('GET gps imei:', getBody?.data?.gps_device?.imei);

  if (!getBody?.data?.unit_id) {
    console.log('GET full:', JSON.stringify(getBody, null, 2));
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
