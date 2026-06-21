# Product Research And Event Selection

Use this reference before recommending domain-specific proactive event watchers, reactions, result types, or ProactiveTask types.

## Product Research Goal

The goal is to understand which proactive moments users actually need in the product the user is creating.

Do not start from available APIs or generic automation ideas. Start from the target user's job, current workflow, anxiety points, repeated manual checks, timing pressure, and consequences when the product fails to notice something early.

The output of research is not only a provider list. It is a set of user-need statements that explain why proactivity matters.

## Required Product Research Questions

For any product vertical, answer:

- Who is the target user and what job do they hire this product to do?
- What does the user currently watch, check, ask, compare, remember, or chase manually?
- What can go wrong if the user notices a change too late?
- Which moments would make the user think "the product had my back"?
- Which proactive moments are core to the product promise versus nice-to-have?
- What user journey moments happen before, during, after, and repeatedly?
- What changes over time and can break the user's artifact, plan, case, goal, or commitment?
- What is time-sensitive?
- What creates anxiety, missed opportunity, safety risk, cost, delay, or cognitive load?
- Which actions are safe suggestions versus external side effects?
- Which providers or internal data sources can verify reality?
- Which event watchers can be represented clearly in native UX?
- Which reactions require approval before the app mutates state, contacts providers, spends money, shares data, or commits the user?

## User Input Plus Independent Research

Ask the user which event watchers and reactions they imagine. Ask one question at a time.

Do not let user ideation become the full taxonomy. Users often name obvious automations, while the best first-release features are often smaller: current-state briefings, checks, alerts, handoffs, and approval-gated proposals.

Use browsing when the answer depends on current behavior, market patterns, APIs, regulations, pricing, health/commerce/travel/running/education trends, or available providers.

If browsing is unavailable or forbidden:

- Use local product context.
- State assumptions.
- Prefer safer first-release events and reactions.

## User-Need Statements

Before scoring features, synthesize 5-10 user-need statements:

```text
User need: <target user> needs the product to notice <event/change> because <consequence if missed>.
Proactive value: <brief/check/alert/proposal/handoff/approval>.
Evidence: <user answer, local product context, or external research source>.
```

Good examples:

- "A traveler needs the product to notice that rain affects an outdoor slot because otherwise the itinerary becomes wrong while they are already out."
- "A health user needs the product to notice a missed medication/check-in window because the value of the care plan depends on timely adherence."
- "A commerce user needs the product to notice stock or delivery risk because waiting may make checkout impossible or late."

Bad examples:

- "Add weather API watcher." This names technology, not user need.
- "Send reminders." This names a reaction, not the reason it matters.
- "Use AI to monitor everything." This is unbounded and likely noisy.

## Candidate Event/Reaction Matrix

For each candidate proactive feature, score:

```text
Event watcher
Observed event
Algorithm / importance rule
Data source / provider
Reaction / result type
Approval required
Reach: 1-10
Impact: 1-5
Confidence: 0.5-1.0
Effort: 1-5
Ease: 6 - Effort
RICE: Reach * Impact * Confidence / Effort
RISE: Reach * Impact * Confidence * Ease
Why this score
Release recommendation: ship / later / avoid
```

Use RICE as the default backlog sort. Use RISE when the user explicitly wants easy/high-value wins surfaced.

First-release event/reaction rows should usually have:

- High or medium user value.
- Frequent or journey-critical use.
- Clear timing or clear triggering condition.
- Medium/high feasibility.
- Low/medium risk.
- Clear native UX.
- Known internal data source, provider, or manual handoff.

Avoid starting with rows that require heavy compliance, payments, autonomous third-party contact, regulated advice, or high liability unless the product explicitly requires them and ProactiveApproval/provider architecture exists.

## First-Release Composition

Pick 3-7 event/reaction rows.

Include these roles when possible:

- Current-state brief/check-in.
- Context or health watcher.
- Time-sensitive reminder/alert.
- Risk or warning.
- Opportunity discovery.
- Artifact update/change proposal.
- External handoff or approval-gated execution.

## Output Template

```text
Source artifact:
Journey moments:
User-requested event watchers:
User-requested reactions:
Research summary:

Candidate event/reaction matrix:
- ...

Recommended release-1 rows:
- ...

Deferred/unsafe rows:
- ...

Why this set:
- ...
```

## Example Domain Mapping

These are examples only. Do not treat them as universal.

Travel might include:

- Event: morning window opens -> Reaction: daily trip brief.
- Event: weather changes for a specific itinerary slot -> Reaction: artifact change proposal.
- Event: leave window opens -> Reaction: time-sensitive push.
- Event: ticketed event is near -> Reaction: document handoff.
- Event: reservation decision window opens -> Reaction: approval-gated handoff.

Health might include:

- Event: day begins with incomplete care plan -> Reaction: daily care check-in.
- Event: medication/habit window opens -> Reaction: reminder.
- Event: symptom trend worsens -> Reaction: signal and possible escalation suggestion.
- Event: appointment is near -> Reaction: prep checklist.
- Event: refill threshold reached -> Reaction: approval-gated refill handoff.

Running/weekend might include:

- Event: planned run window approaches -> Reaction: activity brief.
- Event: weather/air quality changes -> Reaction: route or timing suggestion.
- Event: gear/prep window opens -> Reaction: reminder.
- Event: recovery window begins -> Reaction: recovery task.

Commerce might include:

- Event: watched item price drops -> Reaction: notification card.
- Event: stock returns or is low -> Reaction: time-sensitive alert.
- Event: cart is stale or missing options -> Reaction: cart review task.
- Event: delivery risk appears -> Reaction: warning and alternate handoff.
- Event: checkout is ready -> Reaction: approval-gated checkout handoff.

Education might include:

- Event: study day begins -> Reaction: daily study brief.
- Event: deadline approaches -> Reaction: time-sensitive reminder.
- Event: weak topic detected -> Reaction: practice task.
- Event: lesson sequence stalls -> Reaction: next lesson task.
