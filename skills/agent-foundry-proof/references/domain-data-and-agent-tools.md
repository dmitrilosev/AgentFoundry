# Domain Data And Agent Tools

Use this reference when a product idea needs durable domain records beyond chat/session history.

Trigger examples:

- Shared calendars, salon bookings, appointment scheduling, reservations.
- CRM clients, leads, support cases, work orders, task boards.
- Orders, carts, inventory, watchlists, approvals, documents, operations state.
- Any UI where multiple users or sessions read and mutate the same product object.

The goal is not to bolt generic CRUD onto chat. The proof must define the product's data model and expose safe backend-owned domain operations that both iOS and the backend agent can use.

## Required Output

For every domain-backed proof, define:

- Core domain objects and lifecycle states.
- Firestore collection paths and ownership or organization scope.
- Document fields, server-owned fields, timestamps, status enums, and audit fields.
- Primary query patterns for iOS screens and agent tools.
- Required composite indexes.
- Firestore security rules, or an explicit backend-only access policy with client reads/writes denied.
- TypeScript/Zod schemas for create/update/read DTOs and persisted records.
- Swift transport DTOs and domain models.
- Firebase Functions endpoints for the primary read/create/update/delete operations.
- OpenAI Agents SDK tools that call the same validated backend domain functions.
- Tests or smoke checks for allowed access, denied access, validation failures, idempotency, and conflict handling.

## Modeling Workflow

1. Identify the durable product object the user actually asked for.
2. List actors and scopes: owner user, organization, staff member, customer, operator, admin, or anonymous proof user.
3. Define the smallest useful domain model for the first proof. Do not build a whole enterprise schema unless the first workflow needs it.
4. Write the Firestore paths before UI implementation.
5. Define query patterns and indexes from real screens and tools, not from imagined reporting needs.
6. Decide whether iOS reads domain data directly with owner-scoped rules or only through verified Functions. Prefer backend-only writes for shared operational data.
7. Implement all mutating operations behind Functions so invariants can be enforced transactionally.
8. Wrap those operations as OpenAI Agents SDK tools with narrow names and narrow parameter schemas.
9. Verify the agent can use the tools without bypassing auth, validation, ownership, or conflict checks.

## Firestore Shape Rules

Prefer paths that make authorization and common queries obvious.

Use organization-scoped paths for shared operational products:

```text
orgs/{orgId}
orgs/{orgId}/members/{uid}
orgs/{orgId}/<domainCollection>/{recordId}
```

Use user-scoped paths for private single-user data:

```text
users/{uid}/<domainCollection>/{recordId}
```

Avoid top-level shared collections unless the proof explicitly defines tenant ids, query filters, and rules that prevent cross-tenant reads.

Server-owned fields should include:

```text
createdAt
updatedAt
createdByUid
updatedByUid
ownerUid or orgId
status
version
```

For collaborative records, add audit-friendly fields:

```text
deletedAt?
deletedByUid?
lastMutationId?
source: user | agent | system
```

Use subcollections when child records are normally loaded with a parent, and top-level or collection-group-friendly paths when global time/range queries are primary. For calendars and bookings, design time-range queries explicitly.

## Agent Tool Rules

Agent tools must be domain operations, not raw database access.

Good tool names:

```text
listMasters
getMasterAvailability
findAppointmentSlots
createAppointment
updateAppointment
cancelAppointment
upsertClient
listAppointments
```

Bad tool names:

```text
readFirestore
writeFirestoreDocument
runQuery
deleteDocument
adminDbMutation
```

Every tool must:

- Accept a typed schema with only the fields needed for that operation.
- Resolve Firebase Auth and actor scope server-side.
- Check ownership, organization membership, and role permissions.
- Validate references such as master id, service id, client id, or record id.
- Use a transaction or equivalent lock for shared-state invariants.
- Return a stable app-owned DTO, not a raw Firestore snapshot or provider envelope.
- Log enough operation metadata to debug failures without logging secrets or private free text unnecessarily.

Write/update/delete tools must additionally:

- Be idempotent where retries are likely, using caller mutation ids or stable request keys.
- Reject stale updates when version or updatedAt preconditions fail.
- Use soft delete when the record may appear in history, audit, billing, or notifications.
- Require explicit user approval before external, costly, irreversible, regulated, or user-visible side effects.

## Calendar And Booking Pattern

For a salon shared calendar, use a model like:

```text
salons/{salonId}
  name
  timezone
  createdAt
  updatedAt

salons/{salonId}/members/{uid}
  role: owner | admin | master | receptionist
  displayName
  status

salons/{salonId}/masters/{masterId}
  displayName
  serviceIds[]
  workingHours
  status

salons/{salonId}/clients/{clientId}
  displayName
  phone?
  notesSummary?
  createdAt
  updatedAt

salons/{salonId}/services/{serviceId}
  name
  durationMinutes
  price?
  status

salons/{salonId}/appointments/{appointmentId}
  clientId
  masterId
  serviceId
  startsAt
  endsAt
  status: held | booked | completed | cancelled | no_show
  source: user | agent | system
  createdByUid
  updatedByUid
  createdAt
  updatedAt
  cancelledAt?
  cancellationReason?
```

Primary indexes:

```text
appointments: masterId ASC, startsAt ASC
appointments: clientId ASC, startsAt DESC
appointments: status ASC, startsAt ASC
appointments: startsAt ASC
```

Primary invariants:

- Appointment `endsAt` is derived from service duration unless explicitly overridden by an authorized role.
- A master cannot have overlapping active appointments.
- Appointments use the salon timezone for local display but store timestamps in a stable backend format.
- Cancelled appointments remain visible in history and no longer block availability.
- Booking mutations must run in a transaction that checks overlapping active appointments for the same master.

Minimum tools:

```text
listMasters(salonId)
listServices(salonId)
findAppointmentSlots(salonId, serviceId, masterId?, dateRange)
createAppointment(salonId, client, serviceId, masterId, startsAt, mutationId)
updateAppointment(appointmentId, patch, expectedVersion)
cancelAppointment(appointmentId, reason, expectedVersion)
listAppointments(salonId, dateRange, masterId?)
```

For the first proof, do not add payments, SMS, external calendar sync, or customer self-booking unless the user explicitly asks for them. If added, treat them as external side effects and approval-gate them.

## Security Policy

Default for shared operational data:

- iOS authenticates with Firebase Auth.
- iOS calls Firebase Functions for writes and conflict-sensitive reads.
- Firestore client writes are denied.
- Direct client reads are either denied or scoped to membership and read-only screens.
- Backend Functions use Admin SDK only after verifying the Firebase ID token and membership/role.

Rules must prevent:

- Cross-user or cross-organization reads.
- Client-side role escalation.
- Client writes to server-owned fields.
- Client writes that can bypass booking conflicts or status transitions.

## iOS Integration

Keep UI and database concerns separated:

- SwiftUI views render state and send actions.
- Reducers/features call typed clients such as `SalonCalendarClient`.
- Clients call Functions or authorized read endpoints with DTOs.
- Views never construct raw Firestore paths for writes.
- Loading, empty, conflict, validation, permission-denied, stale-update, and restored states are visible.

For a calendar UI, implement the first workflow before expanding views:

1. Load masters, services, and appointments for a date range.
2. Show day/week schedule by master.
3. Create an appointment from an available slot.
4. Edit or cancel an appointment.
5. Refresh from backend state and preserve selection.

## Verification Checklist

At minimum, verify:

- TypeScript build passes.
- Zod schema tests cover valid and invalid create/update payloads.
- Rules tests or backend authorization tests deny cross-scope access.
- Create appointment succeeds for an available slot.
- Create appointment fails for overlapping active appointments.
- Update appointment rejects stale `expectedVersion`.
- Cancel appointment stops blocking availability.
- Agent tool smoke test can read availability and create/update/cancel through the same validated backend operations.
- iOS smoke test shows backend-created records after relaunch or refresh.
