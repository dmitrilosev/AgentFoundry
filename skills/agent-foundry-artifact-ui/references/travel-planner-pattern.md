# Travel Planner Pattern

Observed source files in the Travel Planner proof:

- `functions/src/index.ts`
- `Modules/Core/AgentClient/Sources/TravelAgentClient.swift`
- `Modules/Platform/BackendClient/Sources/LiveTravelAgentClient.swift`
- `Modules/Features/Chat/Sources/ChatFeature.swift`
- `Modules/Features/Chat/Sources/ChatView.swift`
- `Modules/Features/Chat/Sources/TravelPlanExperienceView.swift`
- `AGENTFOUNDRY_PROOF_REPORT.md`

## Backend Pattern

Travel Planner evolved the base proof from text-only chat into a native product surface.

Travel Planner is an example, not a special case for this skill. Reuse the pattern by replacing `TravelPlan` with the durable artifact for the user's domain: a meal plan, property shortlist, cart, case dashboard, lesson plan, budget review, care plan, work order, or another typed object.

The backend:

- Verifies Firebase Auth.
- Persists user messages under `travelUsers/{uid}/sessions/{sessionId}/messages/{messageId}`.
- Runs a Firestore create trigger after the user message is durable.
- Uses a structured `TravelPlan` schema validated with Zod/OpenAI structured output.
- Treats the native plan as source of truth and chat text as a short notification.
- Persists assistant Markdown in a message.
- Persists `travelPlan` on the session.
- `loadChat` returns sessions, messages, generating state, and the restored plan.

Important backend instruction from the proof:

```text
The native visual plan is the product surface of record. Chat text is only a short notification after this object is saved.
```

Use the same stance for durable surfaces such as plans, trackers, case dashboards, carts, orders, comparisons, approvals, documents, or workspaces.

## iOS Pattern

The iOS app:

- Has chat/session/message domain models plus a `TravelPlan` domain model.
- Loads persisted backend state before showing an authoritative empty state.
- Keeps selected session explicit; restored sessions are not auto-opened.
- Polls while any session is generating.
- Switches the selected open session to the native plan surface when a new plan appears.
- Provides a surface switcher between `Plan` and `Agent`.
- Renders the full plan in `TravelPlanExperienceView`.

This pattern is useful when the detail surface is a main product tab/screen, not just a sheet.

## Gap To Fix In The General Skill

Travel Planner stores a durable `TravelPlan`, but it does not use a QChat-style inline `chatViews` card. The generalized AgentFoundry pattern should combine both:

- Persist the full native artifact as session state or an artifact document.
- Attach an inline card to the assistant message that points to the artifact.
- Let tapping the card open/switch to the detail surface.

## Recommended Generalization

For a travel plan, use:

```text
messages/{assistantMessageId}.chatViews[]:
  type: travel_plan_card
  version: 1
  title: Nice, Jun 12-16
  subtitle: 5 days, weather and itinerary ready
  artifactId: travel-plan-active
  action.semanticType: open_detail

surfaceArtifacts/{artifactId}:
  type: travel_plan
  version: 1
  payload: TravelPlan
```

The card is the chat affordance. The artifact is the product surface of record.

## UX Rules

- Do not replace the chat with a plan before the user has sent or selected a session.
- If the selected session receives a newly completed artifact from the user's current request, it may switch to the native surface.
- If background polling restores older or generating sessions, update state but do not navigate into them automatically.
- Keep the agent surface available so the user can edit the artifact conversationally.
- Use `agent-foundry-design` for the artifact surface: SwiftUI-native layout, stable tabs/carousels/lists/maps, useful loading states inside the affected domain object, and visual QA.
- Do not show fake fallback cards as ready. Missing or low-confidence domain data should be `generating`, `needs_input`, `partial`, `stale`, or `failed`.
- Preserve the user's domain context when switching `Artifact -> Agent -> Artifact`, such as selected day, selected item, selected tab, scroll position, map pin, or current comparison.
