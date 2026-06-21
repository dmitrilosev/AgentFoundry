# Native UX Patterns For Proactive Systems

Use this reference before designing ADR UX sections or implementing iOS proactive surfaces.

## UX Principle

Proactivity should be visible where it helps, not buried in chat.

The user needs to understand:

- What event happened or changed.
- Why it matters now.
- What the app recommends.
- What will happen if they approve.
- Whether the app actually completed the ProactiveTask.

## Core Surfaces

### Now / Current State

Primary surface for "what matters now".

Shows:

- Current summary.
- Next important task or signal.
- Relevant timing.
- Top risk/opportunity.
- Fast action.

Names may vary by product:

- Travel: Today.
- Health: Today / Care.
- Running: Today / Run.
- Commerce: Watchlist.
- Education: Study Today.

### Proactive Feed

Chronological list of ProactiveSignals, ProactiveTasks, ProactiveApprovals, notifications, and results.

Use for:

- Non-urgent signals.
- Completed task history.
- Failed/stale states.
- Audit trail.

### ProactiveSignal Card

Small card for observation or recommendation.

Must show:

- Title.
- Why it matters.
- Source confidence.
- Expiration if time-sensitive.
- Primary action when useful.

### ProactiveTask Card

Card for actionable work.

Must show:

- Task status.
- Expected outcome.
- Related artifact context.
- Primary action.
- Retry/change/skip when relevant.

### ProactiveApproval Sheet

Required for external or risky work.

Must show:

- Exact action.
- Data shared.
- Cost/commitment.
- Provider or execution path.
- Approve / Change / Skip.

Do not hide approvals behind tiny buttons.

### ProactiveTask Detail

Shows status timeline:

- Created.
- Approved.
- Queued.
- Running.
- Provider result.
- Succeeded/failed.

Include related artifact links: day, place, care item, cart item, lesson, case, etc.

### Notifications

Notifications should deep-link to the exact ProactiveSignal, ProactiveTask, ProactiveApproval, artifact section, or Now surface.

They need:

- Dedupe.
- Quiet hours.
- Expiration.
- Clear reason.
- No surprise navigation into unrelated chat.

## Visual And Interaction Rules

Follow `agent-foundry-design` for iOS UI.

Additional proactive UX rules:

- Safe suggestions and external actions must look different.
- Pending/running/completed/failed states must be visually obvious.
- Never show fake provider success.
- Do not duplicate whole artifacts; show the changed or timely part.
- Avoid notification spam; prefer grouped summaries unless timing is critical.
- Let users pause or adjust proactive behavior.
- Every task should remain understandable without reading the chat transcript.

## Minimum First Slice

For a first implementation, build:

- One Now/current-state section.
- One ProactiveSignal card.
- One ProactiveTask card.
- One ProactiveApproval sheet.
- One ProactiveTask detail or status timeline.
- Notification/deep-link route if notifications are in scope.
