# Agent Surface Contract

## Recommended Storage Shape

For an AgentFoundry Firebase app:

```text
users/{uid}/sessions/{sessionId}
  ownerUid
  title
  status: idle | running | failed
  activeSurfaceArtifactId?
  updatedAt

users/{uid}/sessions/{sessionId}/messages/{messageId}
  ownerUid
  sessionId
  role: user | assistant
  textMarkdown
  chatViews[]              // compact inline payloads or pointers
  responseToMessageId?
  createdAt

users/{uid}/sessions/{sessionId}/surfaceArtifacts/{artifactId}
  ownerUid
  sessionId
  type
  version
  status: generating | needs_input | partial | ready | stale | failed
  title
  subtitle?
  summaryMarkdown?
  payload                 // typed and versioned domain payload
  sourceMessageId
  createdAt
  updatedAt
```

Message-scoped payloads are acceptable for small cards. Use session-scoped artifacts when the user expects a full screen, restore after relaunch, follow-up edits, or ongoing state.

## Minimal DTOs

Use names that match the product, but preserve these semantics:

```ts
type AgentMessageDTO = {
  id: string;
  role: "user" | "assistant";
  textMarkdown: string;
  chatViews?: AgentChatViewDTO[];
};

type AgentChatViewDTO = {
  id: string;
  type: string;
  version: number;
  title?: string;
  subtitle?: string;
  artifactId?: string;
  action?: AgentSurfaceActionDTO;
  payload?: unknown;
};

type AgentSurfaceArtifactDTO = {
  id: string;
  type: string;
  version: number;
  status: "generating" | "needs_input" | "partial" | "ready" | "stale" | "failed";
  title: string;
  subtitle?: string;
  summaryMarkdown?: string;
  payload: unknown;
};

type AgentSurfaceActionDTO = {
  semanticType: "open_detail" | "approve" | "reject" | "run_tool" | "open_external_url";
  targetId?: string;
  ref?: unknown;
};
```

Use explicit product-specific payload schemas instead of leaving `payload` untyped in actual implementation.

## Backend Write Sequence

1. Verify Firebase Auth and resolve `uid`.
2. Persist the user message before model work starts.
3. Start backend-owned async work, such as a Firestore trigger, queue, or durable job.
4. Run the backend OpenAI Agents SDK agent.
5. Ask the agent for structured output or tool output matching the product artifact schema.
6. Validate the object with Zod or equivalent.
7. Normalize, enrich, and constrain data server-side.
   - Reject fake placeholder UI as `ready`.
   - Mark missing real-world data as `needs_input`, `partial`, `stale`, or `failed`.
   - Do not invent cards, map pins, prices, bookings, people, documents, or other domain objects when the surface depends on real data.
8. Create a short assistant Markdown response.
9. In one transaction when possible, write:
   - assistant message with `textMarkdown`
   - `chatViews[]` containing an inline card or artifact pointer
   - durable `surfaceArtifact`
   - session status and active artifact pointer
10. `loadChat` or equivalent returns messages plus active/restorable artifacts.

## Domain Artifact Selection

Do not design around the transcript. Design around the durable product object the user actually wants.

Examples:

- Travel -> `travel_plan`
- Nutrition -> `meal_plan` or `progress_dashboard`
- Real estate -> `property_shortlist` or `rental_comparison`
- Commerce -> `cart` or `order_plan`
- Support -> `case_status` or `resolution_plan`
- Education -> `learning_plan` or `lesson_progress`
- Finance -> `budget_plan` or `portfolio_review`
- Operations -> `work_order` or `approval_packet`

The artifact is the source of truth. Assistant Markdown explains what happened and what the user can do next.

## AgentFoundry Design Contract

The inline card and detail surface should be native SwiftUI product UI and must apply `agent-foundry-design`:

- Use reviewed SwiftUI components, not model-generated layout code.
- Keep charts, maps, tabs, carousels, segmented controls, and lists spatially stable.
- Show progress inside the affected artifact or domain object, not only as a generic global spinner.
- Preserve selection and scroll/context when switching between Agent and artifact UI.
- Do not show unavailable actions, empty tabs, map pins, cards, or buttons as if data exists.
- Run design-skill clickability and shadow/clipping QA for inline cards and detail surfaces.

## Versioning

Every `chatView` and artifact must include `type` and `version`.

The iOS renderer should:

- Render supported versions directly.
- Migrate old versions in DTO mapping when simple.
- Show a safe unsupported-card fallback for unknown major versions.
- Keep the assistant Markdown visible even if the UI payload cannot render.

## Safety Rules

- Never put executable UI code, Swift snippets, HTML, JavaScript, or layout DSL from the model into production rendering.
- Treat external URLs as untrusted; allowlist hosts before opening.
- Treat purchase, booking, publishing, messaging, and irreversible mutations as approval-gated actions.
- Do not use raw model strings for prices, availability, legal/medical advice, or live claims without a source-specific backend capability.
- Do not log private artifact payloads unless redacted.

## Acceptance Criteria

- A real user message produces assistant Markdown plus a typed inline card.
- Tapping the card opens a native detail surface.
- Relaunching the app restores chat text, inline card, and detail surface from backend state.
- A generated artifact cannot appear `ready` with fake placeholders or missing required real-world data.
- The native detail surface is useful without rereading the chat transcript.
- Unknown card/artifact type does not crash and leaves the Markdown answer readable.
- Tests cover payload decoding, renderer fallback, reducer/action routing, backend validation, and idempotent writes.
