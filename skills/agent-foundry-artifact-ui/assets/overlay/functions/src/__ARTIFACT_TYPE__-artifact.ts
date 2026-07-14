import { z } from "zod";

export const __ARTIFACT_SWIFT__ReadinessSchema = z.enum([
  "generating",
  "needs_input",
  "partial",
  "ready",
  "stale",
  "failed",
]);

export const __ARTIFACT_SWIFT__PayloadSchema = z.object({
  title: z.string().min(1).max(160),
  summary: z.string().min(1).max(1200),
  highlights: z.array(z.string().min(1).max(240)).max(12),
});

export const __ARTIFACT_SWIFT__ArtifactSchema = z.object({
  id: z.string().min(3).max(160),
  type: z.literal("__ARTIFACT_TYPE__"),
  version: z.literal(1),
  readiness: __ARTIFACT_SWIFT__ReadinessSchema,
  payload: __ARTIFACT_SWIFT__PayloadSchema.nullable(),
  updatedAt: z.string().datetime(),
});

export type __ARTIFACT_SWIFT__Artifact = z.infer<typeof __ARTIFACT_SWIFT__ArtifactSchema>;

// Persist only parsed artifacts. Store the full artifact under the session and
// put an artifact id/type/version pointer on the assistant message inline card.
export function parse__ARTIFACT_SWIFT__Artifact(value: unknown): __ARTIFACT_SWIFT__Artifact {
  return __ARTIFACT_SWIFT__ArtifactSchema.parse(value);
}
