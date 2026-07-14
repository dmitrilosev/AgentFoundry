# Domain Overlay Contract

The overlay supplies mechanics, not the final business model.

Keep these invariants when replacing its generic record fields:

- Every operation derives owner or organization scope from verified server context; never from model input.
- Every input and returned DTO has a Zod schema and a matching Swift model.
- Create operations use a stable mutation id; retries do not create duplicates.
- Shared-state updates use Firestore transactions and an `expectedVersion` check.
- Writes record server timestamps, actor identity, source, and monotonically increasing version.
- Destructive, external, financial, publishing, messaging, or booking actions require explicit confirmation.
- Agent tools expose workflow operations, not arbitrary document paths or raw Firestore CRUD.
- Firestore clients remain deny-by-default unless intentionally owner-scoped rules are designed and tested.

Replace `title`, `note`, and generic statuses with the smallest real domain schema. Rename tools to the language of the workflow, add the required indexes, and test authorization, retries, conflicts, and confirmation gates.
