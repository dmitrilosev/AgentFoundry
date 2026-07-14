import { z } from "zod";

export const __DOMAIN_SWIFT__StatusSchema = z.enum(["active", "completed", "archived"]);

export const __DOMAIN_SWIFT__RecordSchema = z.object({
  id: z.string().min(3).max(160),
  title: z.string().min(1).max(160),
  note: z.string().max(2000).optional(),
  status: __DOMAIN_SWIFT__StatusSchema,
  version: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const Create__DOMAIN_SWIFT__Schema = z.object({
  mutationId: z.string().min(3).max(160),
  recordId: z.string().min(3).max(160).optional(),
  title: z.string().min(1).max(160),
  note: z.string().max(2000).optional(),
});

export const Update__DOMAIN_SWIFT__Schema = z.object({
  recordId: z.string().min(3).max(160),
  expectedVersion: z.number().int().positive(),
  title: z.string().min(1).max(160).optional(),
  note: z.string().max(2000).nullable().optional(),
  status: z.enum(["active", "completed"]).optional(),
});

export const Archive__DOMAIN_SWIFT__Schema = z.object({
  recordId: z.string().min(3).max(160),
  expectedVersion: z.number().int().positive(),
  confirmed: z.literal(true),
});

export type Create__DOMAIN_SWIFT__Input = z.infer<typeof Create__DOMAIN_SWIFT__Schema>;
export type Update__DOMAIN_SWIFT__Input = z.infer<typeof Update__DOMAIN_SWIFT__Schema>;
export type Archive__DOMAIN_SWIFT__Input = z.infer<typeof Archive__DOMAIN_SWIFT__Schema>;
