# Foundation Template Contract

## Contents

The template owns only repeatable production infrastructure:

- Tuist project graph and SPM package integration.
- SwiftUI application composition root.
- Firebase bootstrap in the app target.
- Anonymous Firebase ID-token provider injected into a Firebase-free feature/client layer.
- Typed chat/session/message models.
- TCA chat lifecycle with explicit first load, explicit selection, optimistic send, restore, and all-session polling.
- TravelPlanner2-derived universal design-system primitives and a block-aware line Markdown renderer.
- Firebase Functions TypeScript project with authenticated `sendMessage`, `loadChat`, and Firestore-triggered agent work.
- Owner-scoped Firestore transcript paths and deny-by-default client rules.
- Proof report shell and local validation.

The template does not own product schemas, provider integrations, proactive behavior, payments, analytics, or release distribution.

## Placeholders

All text assets may use only these placeholders:

- `__PRODUCT_NAME__`
- `__PRODUCT_SWIFT__`
- `__PRODUCT_SLUG__`
- `__BUNDLE_ID__`
- `__FIREBASE_PROJECT_ID__`
- `__REGION__`
- `__BACKEND_BASE_URL__`
- `__SECRET_NAME__`
- `__COLLECTION_ROOT__`
- `__ORGANIZATION_NAME__`

Keep placeholder values out of binary assets. Add a replacement to `scaffold-proof.mjs` before adding a new placeholder.

## Stable Boundaries

- Keep Firebase SDK imports in `App/Sources`; do not import Firebase from feature modules.
- Keep `BackendClient` transport independent of Firebase by injecting an ID-token closure.
- Keep user-message submission idempotent by caller-supplied session/message ids.
- Persist the user message before model work starts.
- Generate the assistant response in a backend-owned asynchronous trigger.
- Preserve nil chat selection during restore and polling.
- Render assistant Markdown through `AgentMarkdownText`; render user messages as plain text.
- Deny direct Firestore client access unless a product explicitly replaces the policy with reviewed owner-scoped rules.

## Overlay Contract

Overlay skills read `.agentfoundry-proof.json` and add files or replace explicitly documented extension files. They must append their id to `capabilities` and run foundation validation after application.

Do not make overlays depend on generated Xcode project files. Modify Tuist source configuration only.
