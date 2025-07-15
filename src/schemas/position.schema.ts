import { z } from 'zod';

export const positionAccessSchema = z.object({
  organizations: z.object({
    create: z.boolean(),
    view: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
  }),
  units: z.object({
    create: z.boolean(),
    view: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
  }),
  positions: z.object({
    create: z.boolean(),
    view: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
  }),
  users: z.object({
    create: z.boolean(),
    view: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
  }),
});

export const createPositionSchema = z.object({
  position_name: z.string().min(1),
  position_description: z.string().min(1),
  unit_id: z.string().uuid(),
  position_access: positionAccessSchema,
});
