import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    // No setup file loads .env: these tests mock Prisma and must never be able
    // to reach the configured database.
    globals: false,
  },
});
