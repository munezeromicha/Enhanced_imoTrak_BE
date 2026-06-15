require('dotenv').config();
require('ts-node/register');

const { verifyToken } = require('../src/utils/jwt');
const { deleteUserPermanentlyService } = require('../src/services/user.services');

const BASE = 'http://localhost:4000/v2';
const EMAIL = 'superadmin@tekinova.rw';
const PASSWORD = 'supersecurepassword';
const TARGET = process.argv[2] || '7887b0e7-ed5a-4f2d-94a4-eb985dae4211';

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function main() {
  const login = await postJson(`${BASE}/auth/login`, { email: EMAIL, password: PASSWORD });
  const positions = login?.data ?? [];
  const pos = positions.find((p) => p.position_name === 'SuperAdmin') ?? positions[0];
  const posRes = await postJson(`${BASE}/auth/${pos.position_id}`, { email: EMAIL, password: PASSWORD });
  const token = posRes?.data?.token ?? posRes?.token;
  const decoded = verifyToken(token);
  console.log('Actor from JWT:', decoded);

  try {
    await deleteUserPermanentlyService({
      targetUserId: TARGET,
      actorUserId: decoded.user_id,
    });
    console.log('Service OK with JWT actor');
  } catch (e) {
    console.error('Service FAILED with JWT actor');
    console.error(e);
    process.exitCode = 1;
  }
}

main();
