require('dotenv').config();

const BASE = 'http://localhost:4000/v2';
const VEHICLE_ID = process.argv[2] || '9ed1dd9e-5b44-48e1-94a8-d083ddc0d877';

async function loginAsOrgUser() {
  // Try org user from seed - user may use masoro org
  const attempts = [
    { email: 'superadmin@tekinova.rw', password: 'supersecurepassword' },
  ];
  for (const cred of attempts) {
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cred),
    });
    const login = await loginRes.json();
    const positions = login?.data ?? [];
    if (!positions.length) continue;
    const pos = positions[0];
    const posRes = await fetch(`${BASE}/auth/${pos.position_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cred),
    });
    const posData = await posRes.json();
    const token = posData?.data?.token;
    if (token) return token;
  }
  throw new Error('Login failed');
}

async function main() {
  const token = await loginAsOrgUser();
  const res = await fetch(`${BASE}/vehicles/${VEHICLE_ID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  console.log('GET status:', res.status);
  const v = body?.data;
  console.log('unit_id:', v?.unit_id);
  console.log('unit:', v?.unit?.unit_name);
  console.log('gps_device imei:', v?.gps_device?.imei);
  if (!v?.unit_id && !v?.gps_device) {
    console.log('Full response:', JSON.stringify(body, null, 2));
  } else {
    console.log('OK — unit and/or GPS present in API response');
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
