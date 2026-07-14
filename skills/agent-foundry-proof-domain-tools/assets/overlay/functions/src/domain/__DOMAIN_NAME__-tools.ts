import { tool } from "@openai/agents";
import { z } from "zod";
import {
  Archive__DOMAIN_SWIFT__Schema,
  Create__DOMAIN_SWIFT__Schema,
  Update__DOMAIN_SWIFT__Schema,
} from "./__DOMAIN_NAME__-contract.js";
import {
  archive__DOMAIN_SWIFT__Record,
  create__DOMAIN_SWIFT__Record,
  list__DOMAIN_SWIFT__Records,
  update__DOMAIN_SWIFT__Record,
} from "./__DOMAIN_NAME__-repository.js";

export function __DOMAIN_CAMEL__Tools(uid: string) {
  return [
    tool({
      name: "list___DOMAIN_NAME___records",
      description: "List authorized __DOMAIN_NAME__ records owned by the current user.",
      parameters: z.object({}),
      execute: async () => list__DOMAIN_SWIFT__Records(uid),
    }),
    tool({
      name: "create___DOMAIN_NAME___record",
      description: "Create one validated __DOMAIN_NAME__ record with an idempotency key.",
      parameters: Create__DOMAIN_SWIFT__Schema,
      execute: async (input) => create__DOMAIN_SWIFT__Record(uid, input),
    }),
    tool({
      name: "update___DOMAIN_NAME___record",
      description: "Update one owned __DOMAIN_NAME__ record using optimistic version control.",
      parameters: Update__DOMAIN_SWIFT__Schema,
      execute: async (input) => update__DOMAIN_SWIFT__Record(uid, input),
    }),
    tool({
      name: "archive___DOMAIN_NAME___record",
      description: "Archive one owned __DOMAIN_NAME__ record only after explicit confirmation.",
      parameters: Archive__DOMAIN_SWIFT__Schema,
      execute: async (input) => archive__DOMAIN_SWIFT__Record(uid, input),
    }),
  ];
}
