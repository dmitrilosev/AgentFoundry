# Proactive Architecture Reference

Use this reference when designing ADR runtime sections, schemas, backend workers, state machines, provider adapters, and persistence for `agent-foundry-proactive`.

## Canonical Objects

The proactive runtime has five core objects:

1. `ProactiveState`
2. `ProactiveWatcher`
3. `ProactiveSignal`
4. `ProactiveTask`
5. `ProactiveApproval`

These objects are product-agnostic. A travel app, health app, commerce app, education app, finance app, or operations app should share this shape while defining domain-specific event watcher types and payloads.

## Event/Reaction Contract

Every proactive feature must be described as:

```text
observed event
-> ProactiveWatcher
-> algorithm / importance rule
-> ProactiveSignal
-> reaction / result type
-> optional ProactiveTask
-> optional ProactiveApproval
-> notification or native surface
```

Do not name watchers after UI results. A watcher observes reality; a result is what the user sees or approves.

## ProactiveState

One `ProactiveState` is attached to a durable artifact or user goal.

Purpose:

- Store current proactive status for the artifact.
- Track enabled watchers, pending signals, active tasks, approvals, notification settings, and privacy settings.
- Restore the proactive runtime after app relaunch.

Recommended shape:

```ts
type ProactiveState = {
  id: string;
  version: number;
  ownerUid: string;
  sessionId?: string;
  artifactId: string;
  artifactType: string;
  status: "inactive" | "active" | "paused" | "completed" | "failed";
  currentSummary?: string;
  activeWindow?: {
    startsAt?: string;
    endsAt?: string;
    timezone?: string;
  };
  settings: {
    enabled: boolean;
    quietHours?: { startsAt: string; endsAt: string; timezone: string };
    notificationLevel: "off" | "critical" | "important" | "all";
    locationUse?: "never" | "while_using" | "explicit_check_in";
  };
  counters: {
    activeWatchers: number;
    unreadSignals: number;
    pendingTasks: number;
    pendingApprovals: number;
  };
  privacy: {
    dataUsed: string[];
    dataSentToProviders: string[];
    logging: string;
    deletion: string;
  };
  createdAt: string;
  updatedAt: string;
};
```

## ProactiveWatcher

A `ProactiveWatcher` is a backend-owned observer. It may run on a schedule, artifact change, time window, location/check-in event, provider event, or manual trigger.

Purpose:

- Observe context.
- Produce `ProactiveSignal` objects.
- Produce `ProactiveTask` objects when action is useful.

Recommended shape:

```ts
type ProactiveWatcher = {
  id: string;
  version: number;
  ownerUid: string;
  sessionId?: string;
  proactiveStateId: string;
  artifactId: string;
  type: string;
  status: "enabled" | "paused" | "disabled" | "expired" | "failed";
  trigger: {
    kind: "schedule" | "artifact_change" | "time_window" | "location_check_in" | "provider_event" | "manual";
    cadence?: "realtime" | "hourly" | "daily" | "weekly" | "once";
    cron?: string;
    runAt?: string;
    timezone?: string;
  };
  scope: {
    relatedIds?: Record<string, string>;
    startsAt?: string;
    endsAt?: string;
  };
  inputs: Record<string, unknown>;
  rateLimit: {
    maxSignalsPerDay: number;
    minMinutesBetweenRuns: number;
  };
  notificationPolicy: {
    level: "off" | "critical" | "important" | "all";
    quietHoursRespected: boolean;
    dedupeKey: string;
  };
  lastRunAt?: string;
  nextRunAt?: string;
  failureCount: number;
  dedupeKey: string;
  leaseOwner?: string;
  leaseUntil?: string;
  attempt?: number;
  createdAt: string;
  updatedAt: string;
};
```

ProactiveWatcher rules:

- Must be scoped to a user and artifact.
- Must have cadence or trigger.
- Must have dedupe and rate-limit policy.
- Must not create unbounded notifications.
- Must expire when the artifact/journey is over.
- Must not materialize unless the minimum inputs exist.

## ProactiveSignal

A `ProactiveSignal` is an observation. It does not execute external work by itself.

Examples:

- Risk: weather changed, route too tight, deadline approaching.
- Opportunity: a better time window appeared, price dropped, nearby event is available.
- Reminder: upcoming action, check-in, gear item, appointment prep.
- Context: summary of what matters now.

Recommended shape:

```ts
type ProactiveSignal = {
  id: string;
  version: number;
  ownerUid: string;
  proactiveStateId: string;
  artifactId: string;
  watcherId?: string;
  type: string;
  resultType: ProactiveResultType;
  severity: "info" | "important" | "urgent" | "critical";
  status: "new" | "seen" | "dismissed" | "expired" | "converted_to_task";
  title: string;
  summary: string;
  rationale: string;
  relatedIds?: Record<string, string>;
  recommendedTaskType?: string;
  source: {
    provider?: string;
    confidence: "verified" | "estimated" | "unknown";
    fetchedAt?: string;
  };
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
};
```

## ProactiveTask

A `ProactiveTask` is an actionable unit. It may be created by a user, agent, watcher, or signal.

Use domain-specific `type` values, but map each to a generic `executionClass`.

```ts
type ProactiveExecutionClass =
  | "brief"
  | "monitor"
  | "reminder"
  | "warning"
  | "opportunity"
  | "artifact_patch"
  | "external_handoff"
  | "external_execution";
```

Recommended shape:

```ts
type ProactiveTask = {
  id: string;
  version: number;
  ownerUid: string;
  proactiveStateId: string;
  artifactId: string;
  signalId?: string;
  type: string;
  resultType: ProactiveResultType;
  executionClass: ProactiveExecutionClass;
  status:
    | "draft"
    | "needs_input"
    | "needs_approval"
    | "queued"
    | "running"
    | "succeeded"
    | "failed"
    | "cancelled"
    | "expired"
    | "skipped";
  title: string;
  summary: string;
  rationale: string;
  relatedIds?: Record<string, string>;
  inputs: Record<string, unknown>;
  result?: Record<string, unknown>;
  approvalId?: string;
  provider?: {
    id: string;
    kind: "api" | "deeplink" | "human" | "phone" | "payment" | "manual";
  };
  attempts: Array<{
    id: string;
    status: "queued" | "running" | "succeeded" | "failed";
    startedAt?: string;
    finishedAt?: string;
    errorCode?: string;
    publicSummary?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
};
```

State transition rules:

```text
draft -> needs_input -> needs_approval -> queued -> running -> succeeded
draft -> needs_approval -> queued -> running -> succeeded
draft -> queued -> running -> succeeded
* -> failed
* -> cancelled
* -> expired
needs_approval -> skipped
```

Validate transitions server-side.

## ProactiveApproval

A `ProactiveApproval` is required for external side effects, sensitive actions, costly commitments, destructive changes, provider-visible actions, and regulated advice.

Recommended shape:

```ts
type ProactiveApproval = {
  id: string;
  version: number;
  ownerUid: string;
  proactiveStateId: string;
  taskId: string;
  status: "pending" | "approved" | "rejected" | "changed" | "expired";
  title: string;
  summary: string;
  actionLabel: string;
  riskLevel: "low" | "medium" | "high";
  dataShared: string[];
  costSummary?: string;
  commitmentSummary?: string;
  providerSummary?: string;
  expiresAt?: string;
  decidedAt?: string;
  createdAt: string;
  updatedAt: string;
};
```

ProactiveApproval rules:

- Never hide cost, data sharing, commitment, or provider identity.
- ProactiveApproval should be specific, not broad blanket consent.
- Store an audit trail of approval decisions.

## Result Types

Use these universal result types unless the ADR documents a product-specific result:

| Result type | Meaning | Approval required |
|---|---|---|
| `health_finding` | Data is missing, stale, weak, unverifiable, or blocked | No |
| `notification_card` | Verified fact matters, but no artifact mutation is needed | No |
| `time_sensitive_push` | User must act soon | No, unless external action follows |
| `approval_handoff` | User must approve an external or costly action | Yes |
| `artifact_change_proposal` | Verified fact should change a durable artifact | Yes before mutation |
| `daily_brief` | Low-risk current-state summary | No |
| `document_handoff` | Ticket, QR, reservation, form, or code surfaced at the right moment | No, unless fetching/sharing externally |

## Recommended Storage

Use owner-scoped backend paths. Example:

```text
users/{uid}/sessions/{sessionId}/surfaceArtifacts/{artifactId}
users/{uid}/sessions/{sessionId}/proactive/state
users/{uid}/sessions/{sessionId}/proactiveWatchers/{watcherId}
users/{uid}/sessions/{sessionId}/proactiveSignals/{signalId}
users/{uid}/sessions/{sessionId}/proactiveTasks/{taskId}
users/{uid}/sessions/{sessionId}/proactiveApprovals/{approvalId}
users/{uid}/sessions/{sessionId}/proactiveNotifications/{notificationId}
```

If direct client reads are allowed, rules must be owner-scoped. If not, deny direct reads/writes and use verified backend Functions.

## Production Scanner

Prototype implementations may query enabled watchers directly. Production systems must not create a cron job per user, artifact, watcher, or provider key.

Every ADR must choose one scale target:

- `prototype`: acceptable for local/demo/internal proof only. Must include watcher/user ceiling and migration trigger.
- `production_mvp`: real users, bounded launch, production due index required.
- `million_user_production`: millions of users, many artifacts per user, many watchers per artifact, shared provider facts, bounded notification volume, and full operational metrics.

Recommended shared indexes:

```text
proactiveDueIndex/{shard}/{dueEntryId}
providerSnapshots/{providerKey}
providerFanout/{providerKey}/subscribers/{watcherRef}
```

Production scanner requirements:

- Query by `nextRunAt <= now`, `status == enabled`, and shard.
- Order by `nextRunAt`.
- Paginate with cursors.
- Acquire lease transactionally: `leaseOwner`, `leaseUntil`, `attempt`.
- Enqueue provider work to durable workers or task queues.
- Advance `nextRunAt` before expensive provider calls where safe.
- Retry with backoff and dead-letter handling.
- Use idempotency key = watcher id + input snapshot hash + due window.
- Use dedupe key = user/artifact/event/affected object/provider fact.
- Enforce per-user, per-artifact, per-provider, and global notification/provider-call budgets.

Required operational metrics:

- Due queue depth and due-work lag.
- Lease acquisition/failure rate.
- Provider call volume, latency, cache hit rate, and error rate.
- Signal/task creation rate by watcher type.
- Notification suppression and delivery rate.
- Approval accept/reject/change rate.
- ProactiveTask conversion and failure rate.

## Provider Adapters

Provider adapters should be isolated from the agent:

```text
ProactiveTask -> Task Executor -> Provider Adapter -> Result -> ProactiveTask state update
```

Adapters may be:

- API provider.
- Deeplink or checkout handoff.
- Human operations provider.
- Phone/call provider.
- Payment provider.
- Manual user handoff.

Never fetch provider data separately for every user when many users need the same fact. Cache provider snapshots keyed by normalized reality where safe, then fan out to subscribed watchers.

The agent may recommend or prepare a task. It should not fake provider execution.

## Notification Policy

Every notification needs:

- Priority.
- Dedupe key.
- Quiet-hours behavior.
- Expiration.
- Deep link target.
- Reason the user can understand.

Notifications should deep-link to the exact ProactiveSignal, ProactiveTask, ProactiveApproval, artifact section, or current-state surface.
