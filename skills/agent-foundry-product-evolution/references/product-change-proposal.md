# Product-Change Proposal

Use this reference when creating schemas, examples, or Codex-ready tasks for Product Evolution.

## Proposal Schema

```text
productChangeProposals/{proposalId}
  title
  status: draft | proposed | approved | rejected | implemented | released
  priority: low | medium | high
  confidence: low | medium | high
  problem
  userValue
  conversationMemoryRefs[]
  redactedEvidence[]
  affectedProductAreas[]
  proposedNativeSurfaces[]
  backendChanges[]
  dataModelChanges[]
  nonGoals[]
  risks[]
  privacyReview
  acceptanceCriteria[]
  testPlan[]
  rolloutPlan
  codexTaskDraft
  createdAt
  updatedAt
  approvedAt
  implementedPrUrl
  releaseVersion
```

## Proposal Requirements

- Evidence is redacted by default. Use summaries like "3 chats asked to compare Portugal D7 and Spain DNV by cost/timeline" instead of raw private messages.
- Link proposals to conversation memory references instead of copying raw chat transcripts into implementation tasks.
- Proposed surfaces must be native, reviewable product changes, not runtime-generated UI.
- A proposal should be rejected or merged into an existing proposal when it only reflects a one-off request.
- Acceptance criteria should be concrete enough for Codex and tests.
- Risks must include privacy, App Store/release risk, and scope creep.

## Codex Task Draft

Generate tasks in this shape:

```text
Implement <feature name> for <app/repo>.

Context:
- Why this matters.
- Which proposal approved it.
- Conversation memory reference and redacted evidence summary.

Scope:
- Native surfaces.
- Backend/domain changes.
- Persistence/migration.
- Analytics or logging if needed.

Requirements:
- User-visible behavior.
- Agent/backend behavior.
- Approval or safety rules.
- Privacy constraints.

Verification:
- Unit tests.
- Backend build/deploy checks.
- iOS build/run checks.
- Smoke test path.

Out of scope:
- Explicit non-goals.
```

## Example

```text
Title: Add Program Comparison Workspace
Problem: Users compare multiple residency programs in chat, but the result is lost in message history.
Evidence: Redacted summaries from chats mention comparing Portugal D7, Spain DNV, and France Talent Passport by timeline, cost, eligibility, and document burden.
Native surfaces:
- ProgramComparisonListView
- ProgramComparisonDetailView
- AddProgramFromChatAction
Backend:
- programComparisons collection
- programComparisonItems subcollection
Acceptance:
- User can create a comparison from chat.
- User can manually edit rows.
- Agent can propose rows, but user approves changes.
- Comparison is readable without reopening the chat transcript.
```
