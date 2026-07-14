---
name: agent-foundry-proof
description: "Orchestrate the first production proof of an AgentFoundry AI-native iOS product. Use for a new product idea that needs a real SwiftUI/TCA iPhone app, Firebase-authenticated durable chat, backend OpenAI Agents SDK work, and optionally typed artifact UI or safe operational domain tools. This skill selects and applies reusable proof contours instead of regenerating boilerplate."
---

# AgentFoundry Proof

## Outcome

Turn a product idea into the smallest real AgentFoundry iPhone proof:

- native SwiftUI/TCA app targeting iOS 26.1;
- Firebase Anonymous Auth with backend token verification;
- server-owned OpenAI Agents SDK runtime and secret;
- durable sessions/messages with asynchronous agent work and restore;
- product-specific design derived from the TravelPlanner2 golden reference;
- optional native durable artifact and/or operational records;
- build, deployment, runtime evidence, and a completed proof report.

Do not generate this architecture from scratch. Compose the bundled capability skills and customize only product-specific behavior.

## Required Companions And References

Always read and apply:

1. `references/product-proof-contract.md` for completion and stop gates.
2. `../agent-foundry-design/SKILL.md`, including its routed design references.
3. `../agent-foundry-proof-foundation/SKILL.md` for every new proof.

Load only when needed:

- `references/backend-architecture.md` before Firebase project mutation, secret setup, deploy, or IAM repair.
- `references/ios-architecture.md` when modifying generated module boundaries or adapting an existing iOS app.
- `../agent-foundry-artifact-ui/SKILL.md` for a generated plan, shortlist, comparison, dashboard, document, case packet, or other durable product artifact.
- `../agent-foundry-proof-domain-tools/SKILL.md` for bookings, CRM records, orders, inventory, tasks, approvals, work orders, or other mutable operational records.
- `references/proof-report.md` when completing the report and final verification.

The older prose templates in `references/agent-foundry-modern-ios-base.md`, `references/tca-feature-template.md`, and `references/domain-data-and-agent-tools.md` are compatibility guidance for existing projects. For new projects use the executable foundation and overlay assets.

## Capability Selection

Choose before implementation and record the choice in the proof report.

| Product need | Foundation | Artifact UI | Domain tools |
|---|---:|---:|---:|
| Conversation/assistant only | required | no | no |
| Agent creates a durable result the user views or edits | required | required | optional |
| Agent reads or mutates operational records | required | optional | required |
| Agent manages records and produces a plan/dashboard/document | required | required | required |

Do not add domain tools merely because the backend uses Firestore for chat. Do not omit artifact UI when the useful output is a durable product object and text alone would leave the app as a chat wrapper. Keep `agent-foundry-proactive` outside the first proof unless the user explicitly asks for proactive behavior.

## Setup Handshake

Confirm or discover without guessing:

- product display name, Swift name, slug, and bundle identifier;
- one-sentence first agent workflow and durable core object;
- existing target directory versus a new project;
- Firebase project chosen by the user, or explicit approval to create a named project;
- Firebase region;
- selected capability contours;
- preferred real iPhone when connected, otherwise Simulator.

Lists of local Firebase/GCP projects are discovery only. Never select a project, change Firebase configuration, enable Anonymous Auth, enable APIs, attach billing, create secrets, deploy, or change IAM merely because a matching project exists.

Once the Firebase project is selected, check these early while independent local work continues:

1. Anonymous Auth state. Enabling it is persistent and requires explicit project-specific approval.
2. Pay as you go / Blaze readiness. Functions plus Secret Manager require billing-enabled backend setup; switching plans is a user action.
3. Secret Manager API state. Enabling it is persistent and requires approval if not already authorized.
4. Generated product-scoped secret metadata: `AGENTFOUNDRY_<PRODUCT_SLUG>_OPENAI_API_KEY`.

Read `references/backend-architecture.md` for the exact secure Terminal.app key-entry block and project-specific Blaze URL. Never request an API key in chat, pass it to a scaffold script, write it to a file, print it, or use a generic cross-project secret by default.

## Execution

### 1. Scaffold Or Adapt

For a new project, run the foundation scaffold exactly as its skill specifies. Do not read or retype its assets. It creates the Tuist/TCA graph, Firebase-only app composition boundary, authenticated backend client, durable chat lifecycle, block-aware Markdown renderer, asynchronous Functions worker, deny-by-default rules, and proof report.

For an existing project, inspect current architecture first. Reuse compatible files and patch deliberately; never apply an overlay that would overwrite user code. Use the foundation template only as a comparison source when needed.

### 2. Apply Product Design

Use TravelPlanner2 as the golden reference through `agent-foundry-design/references/product-workspace-language.md`:

- define navigation/continuity, durable workspace, and agent presence;
- replace the neutral palette with a product-specific atmospheric color story;
- keep soft coherent geometry and selective Liquid Glass;
- make the durable product object visually primary when one exists;
- preserve context between artifact/domain surfaces and chat;
- design empty, loading, generating, partial/stale, failed, and restored states.

Do not ship the neutral template palette/copy as final design and do not copy travel-specific metaphors into unrelated products.

### 3. Apply Optional Contours

If artifact UI is selected, run its bundled overlay once for the first artifact type, replace the generic payload with the real schema, persist it as the product source of truth, and wire its inline card to a typed TCA detail route.

If domain tools are selected, run its bundled overlay once for the first operational model, replace generic fields and tool names with workflow language, derive owner/org scope from verified auth context, and wire validated endpoints plus agent tools. Use transactions, expected versions, idempotency, audit fields, and confirmation gates.

Both contours may be used together. The artifact may summarize or organize domain records, but it must not bypass domain authorization or mutation invariants.

### 4. Customize The Agent

Change the generated server agent name/instructions for the one-sentence product workflow. Add only tools required for the first slice. The backend remains the sole owner of model calls and provider credentials.

The message lifecycle remains:

```text
iOS creates stable session/message ids
-> authenticated sendMessage validates and commits the user message/job
-> response returns accepted/latest durable snapshot
-> backend worker runs the agent
-> assistant Markdown and optional artifact/domain changes are validated and persisted
-> iOS polling/foreground refresh restores latest state without changing selection unexpectedly
```

Repeated submission of the same message id must not duplicate messages or jobs.

### 5. Configure Firebase

After the relevant approvals/user actions:

- register the exact iOS bundle id and install `GoogleService-Info.plist` without committing secrets;
- enable/verify Anonymous Auth;
- enable/verify Secret Manager API;
- verify the generated product-specific secret by metadata only;
- install/build backend dependencies;
- deploy rules/indexes/functions to the user-selected project;
- repair deploy IAM only with narrow, explicit approval as described in `references/backend-architecture.md`.

If Blaze, login, project ownership, API-key entry, or another user-only prerequisite blocks deployment, finish all independent code and tests, then report the single exact action still required. Never replace the real agent with a mock to claim completion.

### 6. Verify

Run the foundation validator, backend build/tests, Tuist generation, iOS tests/build, and real runtime smoke test. Prefer a connected usable iPhone; otherwise use Simulator.

Evidence must prove:

- launch and anonymous authentication;
- authenticated message acceptance;
- real backend Agents SDK response, not hardcoded text;
- user message persisted before model work;
- generating state followed by durable assistant Markdown;
- close/relaunch restores sessions and selected context safely;
- retrying a message id is idempotent;
- selected artifact/domain contour restores and enforces its contract;
- no provider secret or Firebase import exists in feature modules;
- main design states pass clickability, shadow/clipping, light/dark, and Dynamic Type QA.

Scaffold validation alone is not production-proof evidence.

## Completion

Complete `AGENTFOUNDRY_PROOF_REPORT.md` using `references/proof-report.md`. Include capability selection, architecture, Firebase project/region, secret resource name only, approved persistent changes, build/deploy commands and outcomes, runtime evidence, design concept, verified states, and remaining blockers.

Claim the proof complete only when `references/product-proof-contract.md` passes. Otherwise state the exact smallest blocker and do not describe planned or mocked behavior as verified.
