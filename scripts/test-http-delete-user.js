require('dotenv').config();

const BASE = 'http://localhost:4000/v2';
const EMAIL = 'superadmin@tekinova.rw';
const PASSWORD = 'supersecurepassword';
const TARGET = process.argv[2] || '7887b0e7-ed5a-4f2d-94a4-eb985dae4211';

async function postJson(url, body, token) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

async function main() {
  const loginRes = await postJson(`${BASE}/auth/login`, { email: EMAIL, password: PASSWORD });
  const positions = loginRes.data?.data ?? loginRes.data ?? [];
  const pos = positions.find((p) => p.position_name === 'SuperAdmin') ?? positions[0];
  const posRes = await postJson(`${BASE}/auth/${pos.position_id}`, { email: EMAIL, password: PASSWORD });
  const token = posRes.data?.data?.token ?? posRes.data?.token;
  if (!token) {
    console.error('Login failed', { loginRes, posRes });
    process.exit(1);
  }

  // Probe permissions endpoint via GET user list first
  const listRes = await fetch(`${BASE}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('GET /users status:', listRes.status);

  console.log('DELETE', TARGET);
  const t0 = Date.now();
  const delRes = await fetch(`${BASE}/users/${TARGET}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const delText = await delRes.text();
  console.log('Elapsed ms:', Date.now() - t0);
  console.log('Status:', delRes.status);
  console.log('Body:', delText);
}

main().catch(console.error);
