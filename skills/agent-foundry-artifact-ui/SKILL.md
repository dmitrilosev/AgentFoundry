---
name: agent-foundry-artifact-ui
description: "Build agent-produced typed artifacts rendered as AgentFoundry native SwiftUI UI using the mandatory agent-foundry-design companion skill in iOS/Firebase products. Use when a backend OpenAI Agents SDK agent should answer with Markdown text plus a durable typed domain artifact, an inline native UI card in chat, and a SwiftUI detail screen or product surface. Use after or alongside agent-foundry-proof when evolving a chat-only proof into agent text plus artifact UI. When this skill is used, agent-foundry-design must also be loaded and followed."
---

# AgentFoundry Artifact UI

## Purpose

Use this skill to turn an AgentFoundry chat proof into an agent-produced artifact UI:

```text
User message
-> backend-owned agent run
-> durable assistant Markdown
-> typed durable domain artifact
-> inline chat card
-> tap opens native detail screen / product surface
```

The agent does not only answer in chat. The agent produces a typed durable artifact, and iOS renders that artifact as native AgentFoundry UI.

This is not arbitrary server-driven UI. The backend may choose data, artifact type, version, and safe actions. The iOS app renders only known, reviewed SwiftUI components from a fixed registry.

## Required References

Load only what is needed:

- Read `references/agent-surface-contract.md` before designing schemas, backend writes, or iOS DTOs.
- Read `references/qchat-agent-ui-pattern.md` before implementing inline chat cards, action routing, or detail presentation.
- Read `references/travel-planner-pattern.md` before implementing session-level durable artifacts such as plans, itineraries, dashboards, or other full product surfaces.

If the user provides a product-specific schema, treat it as authoritative and use these references as guardrails.

## Mandatory Companion Skill

`agent-foundry-design` is a required companion skill for every `agent-foundry-artifact-ui` run.

At the start of this skill, read the peer file `../agent-foundry-design/SKILL.md` and follow it as part of the artifact UI workflow. Load its references exactly as that skill instructs:

- `references/design-system.md` before designing or implementing inline cards, detail screens, target settings, or reusable UI.
- `references/visual-qa.md` before declaring artifact UI complete.

If `agent-foundry-design` cannot be loaded, stop before UI planning or implementation and report the missing design companion. Do not proceed with artifact UI using only artifact-local design memory.

## Relationship To Other AgentFoundry Skills

- `agent-foundry-proof` creates the backend-owned proof path: iOS app, Firebase backend, authenticated user, durable messages, and backend OpenAI Agents SDK runtime.
- `agent-foundry-design` owns target version, Liquid Glass, design system, clickability, keyboard dismissal, and visual QA requirements.
- `agent-foundry-artifact-ui` extends that path with typed durable artifacts and native UI surfaces.
- `agent-foundry-product-evolution` is for product-change proposal and release pipelines. Do not use it as the runtime UI mechanism.

## Hard Gates

Do not claim the agent surface is complete unless all are true:

- The backend agent runs server-side and provider credentials are not present in the iOS app.
- The user message is persisted before model work starts.
- The assistant response is persisted as Markdown text in a typed message field such as `textMarkdown` or `replyMarkdown`.
- If the user request implies a useful product object, the agent produces a typed artifact for that object instead of only writing a text answer.
- Every native UI payload is typed, versioned, validated, and persisted. Do not use free-form model JSON directly as UI state.
- The artifact is the source of truth for the product surface. Markdown is supporting communication, not the only representation of the result.
- Do not show fake, placeholder, generic, guessed, or low-confidence product UI as ready. Represent it as `generating`, `needs_input`, `partial`, `stale`, or `failed`, or do not render the artifact yet.
- No fake fallback cards. If real data is required for the surface, fetch, validate, or enrich it server-side; otherwise show an explicit incomplete state.
- The iOS app has a fixed renderer registry for known artifact/card types. Unknown types render a safe fallback, not raw JSON.
- Inline chat UI and full detail UI are driven by the same durable artifact identity or by a clearly documented message-scoped payload.
- Tapping an inline card routes through app state or a reducer action to a SwiftUI detail surface, sheet, full-screen cover, tab, or navigation destination.
- Detail screens can restore after app relaunch from backend state. The app does not rely on transient in-memory payloads for important artifacts.
- The native surface preserves domain state across app relaunch, chat reload, and switching between Agent and artifact UI.
- New SwiftUI targets or generated AgentFoundry iOS projects pass the `agent-foundry-design` target baseline.
- Loading state, failed load, empty-after-load, in-flight generation, and restored history are represented explicitly.
- Background polling or listeners do not unexpectedly navigate into a restored/generating chat. Selection changes only on explicit user action, except for a same-session surface switch immediately after the user asked for the artifact and the selected session is still open.
- Any action that mutates external state, opens external URLs, buys, books, publishes, or sends messages is either allowlisted and safe or requires explicit user approval.
- Tests or smoke checks prove close/reopen restoration, artifact decoding, unknown-version fallback, and card-to-detail routing.

If a gate fails, stop with the smallest concrete next action needed to continue.

## Domain-Agnostic Artifact Rule

For every product vertical, first identify the durable domain artifact the user actually wants.

Examples:

- Travel: `travel_plan`
- Nutrition: `meal_plan`, `progress_dashboard`
- Real estate: `property_shortlist`, `rental_comparison`
- Commerce: `cart`, `order_plan`
- Support: `case_status`, `resolution_plan`
- Education: `learning_plan`, `lesson_progress`
- Finance: `budget_plan`, `portfolio_review`
- Healthcare or wellness: `care_plan`, `habit_tracker`
- Legal or operations: `case_file`, `approval_packet`, `work_order`

Do not design the UI around the chat transcript. Design it around the artifact.

The agent response should produce:

1. Short Markdown explanation.
2. Typed inline card.
3. Durable native artifact.
4. Native detail surface.
5. Safe actions for editing, approving, opening, saving, or continuing.

Travel Planner is only an example. For any vertical, convert the user's desired outcome into a durable typed artifact and render that artifact as native AgentFoundry UI.

## AgentFoundry Design Gate

Agent-produced UI must pass `agent-foundry-design`. This skill owns artifact contracts; `agent-foundry-design` owns the visual system.

Requirements:

- Prefer useful product surfaces over decorative landing-page UI.
- Show meaningful loading/progress states inside the affected domain object.
- Keep carousels, segmented controls, tabs, maps, charts, and lists spatially stable.
- Preserve user context when switching between Agent and native artifact surface.
- Avoid fake affordances: do not show tabs, buttons, map pins, cards, or actions when the underlying state is unavailable.
- The detail surface must be useful without reading the chat transcript.
- Run the design-skill clickability and shadow/clipping QA for inline cards, detail screens, sheets, and surface switchers.

## Surface Design Stance

Prefer a two-layer contract for complex product UI:

1. Message-scoped inline card: small, tappable, and tied to the assistant response.
2. Session-scoped durable artifact: the source of truth for the full detail screen.

For very small cards that never need a detail screen, message-scoped `chatViews` are enough. For plans, dashboards, search results, carts, orders, documents, or itineraries, persist a durable artifact and let the message card point to it.

## Workflow

### 1. Define The Surface

Identify the domain artifact before designing views:

- Artifact type, for example `travel_plan`, `rental_results`, `cart_summary`, `case_status`, or `document_checklist`.
- Artifact readiness states, such as `generating`, `needs_input`, `partial`, `ready`, `stale`, or `failed`.
- Required real-world data and backend enrichment sources, such as weather, inventory, prices, calendars, maps, documents, search, or internal records.
- Inline card shape: title, subtitle, summary rows, preview items, icon/image, and primary action.
- Detail surface shape: sheet, full-screen cover, navigation destination, or split-view tab.
- Mutations and actions: open, edit, approve, reject, add, save, checkout, share, or external handoff.
- Persistence scope: message-only, session-level active artifact, or artifact collection.
- Versioning and fallback behavior.

Default to a narrow first slice: one artifact type, one inline card, one detail surface, one safe action (`open_detail`), and durable restore.

### 2. Inspect The Existing App

Before editing, locate:

- Chat/session/message models and backend DTOs.
- Existing Markdown rendering path.
- Existing SwiftUI navigation, sheet, full-screen cover, and TCA/reducer patterns.
- Existing backend agent runtime, message persistence, and Firestore paths.
- Existing domain models that should become the native artifact payload.

For QChat-derived apps, look for `AgentMessage.chatViews`, `ChatViewPayload`, `ChatViewRenderer`, `AgentChatBubbleView`, and action handlers in the chat screen.

For AgentFoundry agent apps, look for `loadChat`, `sendMessage`/domain endpoint, Firestore trigger/job, `TravelAgentClient`-style DTOs, and TCA chat state.

### 3. Build The Backend Contract

The backend must own artifact generation and persistence:

- Tell the agent that the typed artifact is the product surface of record; chat text is a short explanation after the artifact is saved.
- Validate agent output with a schema parser such as Zod before writing it.
- Normalize and enrich generated data server-side before exposing it to iOS.
- Reject or mark incomplete artifacts that contain placeholders, guessed data, fake entities, or domain objects without required identifiers.
- Persist the assistant Markdown and artifact/card payload in one transaction when possible.
- Make submission idempotent by session/message id or a stable request key.
- Return latest server state from send/load endpoints so the app can reconcile optimistic UI.
- Store artifacts under owner-scoped backend paths and deny direct client reads unless owner-scoped rules are intentionally implemented.

For complex surfaces, persist both:

- `messages/{assistantMessageId}.chatViews[]` with an inline card or artifact pointer.
- `sessions/{sessionId}/surfaceArtifacts/{artifactId}` or a session field such as `activeSurfaceArtifact`, containing the full typed payload.

### 4. Build The iOS Surface

Keep networking, domain models, feature state, and SwiftUI views separated.

Recommended iOS pieces:

- Transport DTOs for `messageMarkdown`, `chatViews`, `surfaceArtifacts`, and active artifact ids.
- Domain models for each artifact type.
- TCA state or equivalent state for selected session, visible messages, artifact store, selected/presented artifact route, and loading/error states.
- A renderer registry:

```swift
switch payload.type {
case "travel_plan_card":
    TravelPlanInlineCard(...)
default:
    UnsupportedAgentSurfaceCard(...)
}
```

- A single action path from card tap to detail route, for example `.surfaceCardTapped(artifactId)` or `handleChatViewAction(_:)`.
- A native detail screen that reads from durable state and can show loading, stale, missing, or failed states.

Do not put arbitrary JSON-to-view rendering into production. New surface types should add explicit SwiftUI components, DTOs, tests, and routing.

### 5. Connect Text And UI

The assistant should still answer in text. The UI artifact should not replace the answer; it should make the result usable.

Good pattern:

- Assistant Markdown says what changed and what the user can do next.
- Inline card gives a compact visual summary.
- Detail screen contains the working product surface.

Avoid long duplicate summaries. If the artifact is the source of truth, say that in the backend instructions, as Travel Planner does for `TravelPlan`.

If the artifact cannot be produced yet, the assistant should either ask for the minimum missing information or persist an explicit partial/needs-input artifact. Do not let the agent write a confident text-only answer when the user asked for a product object that should become UI.

### 6. Verify

At minimum, run:

- Backend build/tests for schema parsing, idempotency, and persistence.
- iOS decoding tests for known payloads and unknown type/version fallback.
- Reducer/view-model tests for send -> generating -> assistant text + card -> tap -> detail route.
- Close/reopen or load-state smoke test proving the detail surface restores from backend state.
- Command-line iOS build or approved platform build.

Record remaining manual UI QA separately from verified backend/iOS checks.

## Output Shape

When this skill is used to plan or implement a new surface, produce:

- Chosen artifact name and version.
- Domain artifact source-of-truth rule and readiness states.
- Backend storage paths and DTO contract.
- iOS model/rendering/routing files to add or change.
- AgentFoundry design decisions for the inline card and detail surface, referencing `agent-foundry-design`.
- First-slice implementation plan.
- Verification commands and acceptance criteria.
