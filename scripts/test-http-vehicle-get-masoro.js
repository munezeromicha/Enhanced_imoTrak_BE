require('dotenv').config();

const BASE = process.env.API_BASE || 'http://localhost:4000/v2';
const VEHICLE_ID = '9ed1dd9e-5b44-48e1-94a8-d083ddc0d877';

async function login(email, password) {
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const login = await loginRes.json();
  const positions = login?.data ?? [];
  if (!positions.length) return null;
  const pos = positions.find((p) => p.organization_id === '0e487983-43c6-45e2-9109-b4a779145412') || positions[0];
  const posRes = await fetch(`${BASE}/auth/${pos.position_id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const posData = await posRes.json();
  return posData?.data?.token ?? null;
}

async function main() {
  const attempts = [
    { email: 'munezerontaganiramichel@gmail.com', password: 'Password123!' },
    { email: 'munezerontaganiramichel@gmail.com', password: 'supersecurepassword' },
    { email: 'superadmin@tekinova.rw', password: 'supersecurepassword' },
  ];

  let token = null;
  for (const cred of attempts) {
    token = await login(cred.email, cred.password);
    if (token) {
      console.log('Logged in as', cred.email);
      break;
    }
  }
  if (!token) throw new Error('Login failed for all credentials');

  const res = await fetch(`${BASE}/vehicles/${VEHICLE_ID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  console.log('GET status:', res.status);
  console.log(JSON.stringify(body, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
