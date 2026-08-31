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
    assignUser: z.boolean()
  }),
  users: z.object({
    create: z.boolean(),
    view: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
  }),
  vehicleModels: z.object({
    create: z.boolean(),
    view: z.boolean(),
    viewSingle: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
  }),
  vehicles: z.object({
    create: z.boolean(),
    view: z.boolean(),
    viewSingle: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
  }),
  reservations: z.object({
    create: z.boolean(),
    view: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
    cancel: z.boolean(),
    approve: z.boolean(),
    assignVehicle: z.boolean(),
    odometerFuel: z.boolean(),
    start: z.boolean(),
    complete: z.boolean(),
    viewOwn: z.boolean(),
    updateReason: z.boolean(),
    viewAssigned: z.boolean(),
  }),
  vehicleIssues: z.object({
    report: z.boolean(),
    view: z.boolean(),
    viewOwn: z.boolean().optional().default(false),
    update: z.boolean(),
    delete: z.boolean(),
  }),
  // One flag per section of the fuel requisition form.
  //
  // Optional, and every flag within it optional, because positions saved
  // before this module existed carry no `fuel` key. Note that a module
  // missing from this schema is not rejected — zod strips unknown keys
  // silently — so a new module must be added here or it will never reach
  // the database, however carefully it was ticked in the UI.
  fuel: z
    .object({
      request: z.boolean(),
      view: z.boolean(),
      viewOwn: z.boolean(),
      recommend: z.boolean(),
      confirmFunding: z.boolean(),
      issue: z.boolean(),
      receive: z.boolean(),
      replenish: z.boolean(),
      viewReport: z.boolean(),
      manageGenerators: z.boolean(),
    })
    .partial()
    .optional(),
});


export const createPositionSchema = z.object({
  position_name: z.string().min(1),
  position_description: z.string().min(1),
  unit_id: z.string().uuid(),
  position_access: positionAccessSchema,
});

export const updatePositionSchema = z.object({
  position_name: z.string().min(1).optional(),
  position_description: z.string().min(1).optional(),
  position_access: positionAccessSchema.optional(),
});

export const assignUserToPositionSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email('Invalid email address')
});