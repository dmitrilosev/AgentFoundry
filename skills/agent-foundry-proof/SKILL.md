---
name: agent-foundry-proof
description: "Create the first production proof of an AgentFoundry AI-native iOS product: a SwiftUI iOS app using the mandatory agent-foundry-design companion skill, Firebase Cloud Functions backend, server-side OpenAI Agents SDK agent, authenticated durable chat sessions, Chat List, and in-app Chat. Use when the user wants to turn a product idea into a real iPhone AI product where users can start chats, send messages, receive AI agent responses, restore conversation history, and when the idea implies durable domain records such as shared calendars, bookings, CRM objects, orders, inventory, tasks, or work orders that need a Firebase data model plus safe agent tools. When this skill is used, agent-foundry-design must also be loaded and followed."
---

# AgentFoundry Proof

## Purpose

Use this skill to create the first production proof of an AgentFoundry AI-native iOS product: a SwiftUI iOS app with Firebase Cloud Functions backend, a server-side OpenAI Agents SDK agent, authenticated durable chat sessions, Chat List, and in-app Chat.

The base path is a SwiftUI iOS app with Chat List and in-app Chat, a Firebase Cloud Functions backend, and a backend-owned OpenAI Agents SDK runtime using OpenAI.

The goal is not a full product suite yet. The goal is to turn the user's product idea into a real iPhone AI product path where users can start chats, send messages, receive AI-agent responses, and restore conversation history without leaking provider credentials into the client.

The proof should already feel like a native iPhone product. Target version, Liquid Glass, visual design, clickability, and shadow/clipping QA are owned by `agent-foundry-design`; apply that skill before planning or implementing any SwiftUI UI.

## Mandatory Companion Skill

`agent-foundry-design` is a required companion skill for every `agent-foundry-proof` run.

At the start of this skill, read the peer file `../agent-foundry-design/SKILL.md` and follow it as part of the proof workflow. Load its references exactly as that skill instructs:

- `references/design-system.md` before creating, redesigning, or changing SwiftUI UI.
- `references/visual-qa.md` before declaring UI/design work complete.

If `agent-foundry-design` cannot be loaded, stop before UI planning or implementation and report the missing design companion. Do not proceed with a proof UI using only proof-local design memory.

## AgentFoundry Design Baseline

- Treat `agent-foundry-design` as the single source of truth for iOS deployment target, Liquid Glass, Apple-style design system, visual redesign, clickability, keyboard dismissal, and shadow/clipping requirements.
- Do not duplicate or weaken those rules in proof-specific code or reports.
- A proof UI is incomplete until the `agent-foundry-design` verification gate passes for the changed surfaces.

## Required References

Load references only when needed:

- Use `../agent-foundry-design/SKILL.md` before planning a new SwiftUI iOS AgentFoundry project or creating/changing user-facing UI.
- Read `references/product-proof-contract.md` before planning or accepting success.
- Read `references/agent-foundry-modern-ios-base.md` before planning a new SwiftUI iOS AgentFoundry project or creating/changing the iOS app.
- Read `references/tca-feature-template.md` before scaffolding or generating a new TCA feature module.
- Read `references/ios-architecture.md` before creating or changing the iOS app.
- Read `references/backend-architecture.md` before creating or changing the default Firebase/backend code.
- Read `references/domain-data-and-agent-tools.md` before planning or implementing a product idea that implies durable domain records beyond chat history, such as shared calendars, bookings, CRM objects, orders, inventory, tasks, work orders, client records, or other shared operational state.
- Read `references/proof-report.md` before writing the final proof report.

If the user provides their own iOS or backend architecture templates, treat those templates as authoritative and use these references only as fallback guardrails.

## Hard Gates

Do not claim proof is complete unless all are true:

- The product name was provided by the user or explicitly confirmed before implementation.
- The iOS bundle identifier was provided by the user or explicitly confirmed after being derived from the product name.
- The Firebase project was explicitly selected by the user or the user explicitly approved creating a new one. Do not auto-select a project from CLI output.
- The user explicitly approved enabling Firebase Anonymous Authentication for the selected Firebase project, or the selected project already has Anonymous Auth enabled. This is a persistent Firebase security/config change and must be approved during project setup, not discovered as a final smoke-test blocker.
- The selected Firebase project is on the Firebase Pay as you go / Blaze plan before Firebase Functions secrets or deployment are attempted. If the Firebase console shows the No-cost ($0/month) / Spark plan as the current plan, the user must switch/select Pay as you go / Blaze plan first. Treat this as an expected backend proof setup step, not as an unexpected error.
- The OpenAI API key from the OpenAI Platform API keys page is entered through a secure terminal prompt and stored as a backend secret or equivalent server-side secret.
- The backend secret resource name is generated as a unique product/project-specific name, or the user explicitly confirmed reusing an existing per-project secret. Do not default to a shared secret resource named only `OPENAI_API_KEY`.
- No AI provider key is present in client source, bundled resources, plist files, committed env files, or logs.
- The AI agent runs on the backend, not inside the iOS client.
- The iOS app creates or reuses a Firebase anonymous user by default, sends a Firebase Auth ID token to the backend, and never calls the agent endpoint as an unidentified public client.
- The backend verifies the Firebase Auth token, owns the conversation identity, and stores chat/session history in a backend-owned datastore such as Firestore under an owner-scoped path.
- If the product request implies durable domain records beyond chat/session history, the proof includes a product-specific Firestore domain model, typed backend schemas, required indexes, security rules or backend-only access policy, typed domain endpoints, and OpenAI Agents SDK tools for authorized read/create/update/delete operations.
- Agent tools that read or mutate domain data are backend-owned domain operations, not raw unrestricted database CRUD wrappers. They validate input, enforce auth and ownership/organization scope, use transactions for invariants such as booking conflicts, and require explicit approval for destructive, external, costly, regulated, or user-visible side effects.
- Sending a user message is durable before model work starts: the backend persists the user message and returns an accepted/latest-state response without requiring the iOS app to stay open.
- Agent/model work runs in a backend-owned asynchronous path, such as a Firestore trigger, task queue, or durable job, and persists the assistant message after completion so the response survives app termination.
- The iOS app restores conversation history from the backend on launch and after foregrounding, including assistant messages that were produced while the app was closed.
- Initial chat history loading is represented as loading state, not as an authoritative empty state. The app must not flash "no chats/trips" before the first backend load has completed or failed.
- Restoring or polling backend chat state must not automatically open/select the first, last, latest, or generating chat. Chat selection is caused only by an explicit user selection or an explicit new-chat action.
- If the user leaves an active chat while the backend is generating, the app stays on the chat list/selection surface. Polling may update the list and persisted messages, but it must not navigate back into the chat automatically.
- Backend agent replies are returned as Markdown content in a typed response field, and the field's Markdown contract is documented in the backend/iOS DTOs.
- The iOS app renders assistant/agent messages with a block-aware Markdown renderer. It must normalize line endings, preserve blank lines, support inline Markdown, and render common block syntax such as headings, unordered/ordered lists, blockquotes, and thematic breaks without exposing raw Markdown markers like `##`, `###`, or `---` to the user. User messages may stay plain text.
- Firebase Auth must be initialized from the app target before any `Auth.auth()`/token call, and command-line simulator/device runs must not crash with a nil default Firebase app or duplicated Firebase singleton state.
- New AgentFoundry SwiftUI iOS projects pass the `agent-foundry-design` target baseline and visual QA gate before the proof UI is accepted.
- The selected iOS app builds from the command line or an approved platform build tool.
- The selected iOS app launches on a connected real iPhone when one is available and usable; otherwise it launches on an iOS Simulator.
- A real user action from the selected iOS app reaches the backend.
- The backend returns a real AI-powered agent response.
- A proof report states the verified commands, remaining manual steps, and next product-building step.

If any gate fails, stop and report the specific next action needed to continue. Do not replace the missing piece with a mock unless the user explicitly asks for a mock-only demo.

## Command Ownership

Run every command yourself when it does not require a user-only action. Do not hand the user a command list for work the agent can perform.

User-only actions are limited to:

- Entering secrets through a secure local terminal prompt.
- Completing Firebase plan switch from No-cost / Spark to Pay as you go / Blaze, billing account selection, browser login, OAuth, 2FA, or account consent.
- Explicitly approving persistent Firebase/GCP security or configuration changes, including enabling Firebase Anonymous Authentication and narrow IAM changes, even when they are project-specific.
- Approving local permission prompts, device trust prompts, initial Apple signing team selection, or physical iPhone actions.

Agent-owned actions include:

- Inspecting files and project state.
- Installing/building dependencies when permitted.
- Running `npm`/TypeScript builds.
- Running Firebase deploys after Blaze readiness and backend secrets are configured.
- Enabling Firebase Anonymous Authentication after explicit user approval, then continuing setup and verification.
- Applying narrow IAM fixes after explicit user approval, then continuing deploy.
- Running direct backend `curl` smoke tests.
- Running Xcode/Tuist builds and simulator/device verification where possible.
- Opening the Xcode workspace when a required Apple signing choice is only available through the user's Xcode account UI.
- Extracting the selected `DEVELOPMENT_TEAM` after the user chooses it, persisting it into the Tuist/project configuration when appropriate, and rerunning device build/install/launch.
- Updating the proof report with exact commands and outcomes.

After a user-only step completes, continue immediately with the next agent-owned command. If a command needs network or broader filesystem permissions in Codex, request the appropriate tool escalation and run it yourself. If a deployed backend secret was just set by the user, verify it with a metadata-only CLI check where possible before deploying, such as `gcloud secrets describe <SECRET_NAME> --project=<FIREBASE_PROJECT_ID>`. Do not run a command that prints the secret value, such as unredacted `firebase functions:secrets:access`, and never ask the user to run deploy or curl when the agent can run them.

For persistent IAM changes, prefer the narrowest resource scope that resolves the exact deploy failure. If Firebase Functions deploy fails because a service account cannot read `gs://gcf-v2-sources-<PROJECT_NUMBER>-<REGION>`, propose a bucket-level `roles/storage.objectViewer` binding for only that service account and bucket, not a project-wide role. Ask the user to explicitly approve that IAM change; after approval, run the binding command yourself and immediately continue with deploy and smoke tests.

For real iPhone signing, do not stop at "open Xcode and run it" unless no tool path remains. Try the device build yourself first. If it fails because signing requires a development team, open the generated workspace in Xcode and give the user the exact minimal UI action:

- Select the app under `TARGETS`, not the project under `PROJECT`.
- Open `Signing & Capabilities`.
- Enable/keep `Automatically manage signing`.
- Choose their Apple ID / Personal Team / paid team.
- Trust the device or approve prompts if iOS/Xcode asks.

After the user confirms the app builds/runs or the team is selected, resume agent-owned work: read the selected `DEVELOPMENT_TEAM` from Xcode build settings or the generated project, persist it in the Tuist source/project configuration if the project is generated, regenerate if needed, and rerun command-line device build/install/launch. Record which parts were user-only and which parts the agent verified.

## Kickoff Communication

At the start of a new proof, communicate the setup path as an execution handoff, not as a blocker list. Use the user's language. Keep it short and concrete:

- Confirm only the product name, derived bundle identifier, and whether to create a new Firebase project or use a selected existing one.
- Tell the user what the agent will do next: create/select the Firebase project, scaffold the SwiftUI/Tuist/TCA app, create the Firebase iOS app, build the Firebase Functions backend, install dependencies, run local builds/tests, deploy when prerequisites are ready, run backend smoke tests, and update the proof report.
- Tell the user what only they may need to do: approve enabling Firebase Anonymous Auth for the selected project, switch Firebase to Pay as you go / Blaze, create/copy an OpenAI API key without pasting it into chat, enter that key through the secure terminal prompt when instructed, approve any explicit IAM repair, and choose an Apple Development Team in Xcode if device signing blocks the run.
- If a Firebase project ID is already known, give the exact Blaze URL immediately: `https://console.firebase.google.com/project/<FIREBASE_PROJECT_ID>/usage/details`. If the project still needs to be created, say that the exact URL will be given as soon as creation succeeds.
- Ask the user to open the OpenAI Platform API keys page and have a new key ready while the agent works locally, but do not ask them to enter the key until Blaze readiness is confirmed and the generated project-specific Firebase secret command is available.
- While the user completes Blaze/API-key preparation, keep doing all agent-owned local work that does not require Blaze: app/backend scaffolding, dependency install, TypeScript build, Tuist generation, simulator builds/tests, Firestore rules, and proof report updates.
- When local work reaches a user-only gate, stop with a short `Next actions` section containing only the exact user action(s), not a long generic blocker dump. Do not include agent-owned commands such as deploy, smoke tests, or report updates in the user's action list.
- When the user has already approved Anonymous Auth and returns with "Blaze done", "key added", or equivalent, verify readiness with metadata-only checks, then continue the remaining one-shot path yourself: enable/verify Auth, deploy Functions, repair IAM only after explicit approval, run durable backend smoke tests, rerun iOS build/launch verification, persist signing if available, and update the proof report.

## Workflow

### 1. Establish The Product Path

Ask only for the facts needed to start implementation. Prefer a small number of concrete questions and frame them positively: "Для начала реализации нужно подтвердить три вещи", not "без них skill не разрешает начинать".

- Product name. This is required; ask before implementation when missing. When deriving a product name from the user's idea, propose a simple user-facing name that an unfamiliar user can understand when they hear it. The name should suggest what the product is about or what it helps the user do. One or two words are both acceptable; prefer clarity over forced brevity or cleverness. Use the confirmed product name to derive app names and identifiers, but ask the user to confirm derived identifiers before using them.
- iOS app: SwiftUI.
- Target and design: apply `agent-foundry-design` for the AgentFoundry iOS target baseline, Liquid Glass design system, visual redesign rules, clickability checks, and shadow/clipping QA.
- Backend: Firebase. Do not ask the user to confirm Firebase; it is the base backend for this skill.
- Agent runtime: OpenAI Agents SDK. Do not ask the user to confirm this; it is the base agent runtime for this skill.
- AI provider: OpenAI. Do not ask the user to confirm this; it is the base AI provider for this skill.
- iOS bundle identifier. If missing, propose one derived from the confirmed product name and ask for confirmation. Use a clean lowercase ASCII reverse-DNS slug that communicates the product meaning. If the display name is localized or non-English, prefer a clear English/ASCII meaning-based slug over awkward transliteration, unless the user explicitly chooses the transliterated brand.
- Firebase project choice: ask whether to use an existing Firebase project or create a new one. If listing existing Firebase/GCP projects, present them as options and wait for the user's selection; never pick production, staging, first, or latest automatically.
- Firebase project ID for an existing project, or explicit permission to create a new project.
- Firebase Anonymous Auth approval. As soon as the Firebase project ID is known or the user has approved creating a new project, ask for explicit approval to enable Anonymous Auth for that exact project unless metadata shows it is already enabled. Phrase it as one of the initial project setup confirmations, for example: `Разрешаю включить Anonymous Auth для <FIREBASE_PROJECT_ID>`. Explain that the proof requires anonymous Firebase users so the iOS app can send a Firebase Auth ID token and the backend can verify ownership before storing chat history. Do not wait until deploy or final e2e smoke to ask for this approval. After approval, enabling/verifying the provider is agent-owned work.
- Firebase Blaze readiness. After the Firebase project is selected or created, explain that this proof uses Firebase Functions plus Secret Manager-backed secrets, so the project needs Firebase Pay as you go / Blaze plan before backend secrets/deploy can be configured. If the Firebase console shows No-cost ($0/month) / Spark plan as the current plan, tell the user to switch/select Pay as you go / Blaze plan. Frame it as a planned setup step. Mention that Blaze links a billing account and is pay-as-you-go with no-cost quotas for many Cloud Functions/Secret Manager usage levels, but it is still a billing-enabled plan; recommend setting a budget alert. Provide the project-specific Firebase console URL:

```text
https://console.firebase.google.com/project/<FIREBASE_PROJECT_ID>/usage/details
```

  Ask the user to complete the switch to Pay as you go / Blaze plan. Do not ask the user to enter the OpenAI API key until Blaze readiness is confirmed for Firebase backend secret setup and deploy, because `functions:secrets:set` will fail on Spark and the cleanup step unsets the key.
- Secret Manager API readiness. After Blaze readiness is confirmed and before showing the OpenAI key entry block, the agent must enable and verify Secret Manager API itself: run `gcloud services enable secretmanager.googleapis.com --project <FIREBASE_PROJECT_ID>` and then verify `secretmanager.googleapis.com` appears in `gcloud services list --enabled --project <FIREBASE_PROJECT_ID> --filter='config.name:secretmanager.googleapis.com' --format='value(config.name)'`. If enablement or propagation fails, stop before asking the user to enter the key. If the user already hit a hidden prompt failure, first tell them to press `Ctrl+C` and run `stty echo` before retrying.
- OpenAI API key setup path. Make the required user action clear in the initial setup checklist. The user must create or copy an OpenAI API key from the OpenAI Platform API keys page, but must not paste it into chat. If the product slug and Firebase project are already known, give only the exact ordinary Terminal.app zsh-compatible command that reads the key without echoing it and writes it directly into the generated Google Secret Manager secret resource. If the product slug or Firebase project is still unconfirmed, say that the user should have the OpenAI API key ready now and that the exact command follows immediately after product/project confirmation. Do not use vague phrasing like "when we get to backend secret."

Use only this command block for user-facing OpenAI key entry after Blaze readiness is confirmed. Do not use Codex hidden prompts, macOS `osascript` dialogs, helper scripts, `read -rsp`, `read -r -s`, inline `export OPENAI_API_KEY=...`, temporary secret files, or `firebase functions:secrets:set` for this path.

```sh
printf "OpenAI API key: "
stty -echo
IFS= read -r OPENAI_KEY
stty echo
printf "
"

if [ -z "$OPENAI_KEY" ]; then
  echo "Key is empty; aborting."
else
  gcloud secrets describe <GENERATED_SECRET_RESOURCE_NAME> --project <FIREBASE_PROJECT_ID> >/dev/null 2>&1 || \
    gcloud secrets create <GENERATED_SECRET_RESOURCE_NAME> --project <FIREBASE_PROJECT_ID> --replication-policy=automatic

  printf "%s" "$OPENAI_KEY" | gcloud secrets versions add <GENERATED_SECRET_RESOURCE_NAME> --project <FIREBASE_PROJECT_ID> --data-file=-
  unset OPENAI_KEY
fi
```

Replace `<GENERATED_SECRET_RESOURCE_NAME>` with the internally generated product-scoped name such as `AGENTFOUNDRY_<PRODUCT_SLUG>_OPENAI_API_KEY`, and replace `<FIREBASE_PROJECT_ID>` with the selected Firebase project ID. Do not ask the user to confirm or name that secret unless they explicitly want to reuse an existing per-project secret. Do not ask the user to paste the OpenAI API key into chat. Tell the user to run the block in Terminal.app, paste the key at the prompt, and press Enter; the key is hidden by `stty -echo`, piped directly into Google Secret Manager, and then unset. If the command fails before `unset OPENAI_KEY`, tell the user to run `unset OPENAI_KEY` before retrying.
- Runtime target: automatically prefer a connected real iPhone when one is available and usable. If no real iPhone is connected or usable, use an iOS Simulator. Ask only if code signing or device selection blocks the run.
- First chat-based agent use case in one sentence.

Default to a simple agent if the user has no agent spec yet: a concise product assistant that answers user messages and can later be replaced by a domain-specific agent.

### 2. Inspect The Local Environment

Check the repository and available tooling before editing:

- Locate existing iOS app projects, backend projects, package files, and source layout.
- Locate an Xcode project and check Xcode command-line build availability.
- Locate `firebase.json`, `functions/`, Firebase CLI availability, Firebase auth state, and Google Cloud CLI availability when needed.
- As soon as a Firebase project is selected or created, check whether Firebase Anonymous Auth is already enabled when metadata access is available. If it is disabled or cannot be confirmed, ask for explicit approval to enable Anonymous Auth for that exact project before treating backend smoke testing as reachable. Do not defer this to the final e2e smoke.
- Check whether the selected Firebase project can use Firebase Functions secrets. If `functions:secrets:set` or deployment reports that Blaze is required, communicate it as the planned switch from No-cost / Spark to Pay as you go / Blaze, not as a generic command failure. Stop before asking the user to re-enter the OpenAI API key until the user switches the project plan.
- Before asking the user to run the OpenAI key entry block, enable and metadata-verify `secretmanager.googleapis.com` for the selected project. Do this even if Firebase Functions APIs were already enabled, because a fresh Firebase project may not have Secret Manager API enabled yet.
- Check Node/npm or the backend runtime required by the selected backend.
- Check whether a usable OpenAI API key is already available through the generated project-specific backend secret resource, the current shell's `OPENAI_API_KEY`, or another secure local mechanism.
- If an OpenAI API key or backend secret is missing, ask the user to create/copy an OpenAI API key from the OpenAI Platform API keys page and run only the Terminal.app zsh-compatible `stty -echo` + `gcloud secrets versions add --data-file=-` command block above. Do not ask for the key in chat, do not use Codex/GUI prompts or helper scripts, and do not silently continue with a mock, hardcoded response, or unverified assumption.
- Check for connected real iPhones before choosing a simulator. Prefer a connected real iPhone when available and usable; otherwise choose an iOS Simulator.
- If CLI tools list existing Firebase/GCP projects, treat the list as discovery only. Ask the user which project to use before setting defaults, writing config, deploying, or checking project-specific secrets.
- If the user is currently doing Blaze/API-key setup, continue every independent local task instead of idling. Stop only when the remaining work truly depends on a user-only action.

Use MCP/Xcode tools when available for iOS build/run work. Use shell commands when that is the project norm or the MCP tool is unavailable.

### 3. Plan The Smallest Production-Proof Implementation

Create a short implementation plan that covers:

- iOS app architecture and target location.
- For a new SwiftUI iOS app, apply the AgentFoundry modern iOS base and `agent-foundry-design`: Tuist project graph, AgentFoundry target/design baseline, SPM dependencies, SwiftUI + TCA feature modules, Firebase hidden behind platform clients, and backend-owned AI calls.
- Backend architecture and target location.
- Server-owned chat state plan: anonymous Firebase Auth, token verification, Firestore/session schema, send endpoint, load/restore endpoint, and asynchronous assistant-response worker.
- Domain data plan when the product idea implies shared records or CRUD workflows: Firestore collections/documents, ownership or organization scope, DTO/Zod schemas, indexes, Firestore rules or backend-only access, typed endpoints, and OpenAI Agents SDK domain tools.
- Secret handling plan, including the generated project-specific backend secret resource and the secure `OPENAI_API_KEY` terminal setup path.
- Firebase Anonymous Auth approval/enabling plan, including whether it is already enabled or the exact project-specific approval still needed from the user.
- Firebase Blaze readiness plan, including the project-specific console URL and whether the user has switched from No-cost / Spark plan to Pay as you go / Blaze plan or still needs to do it.
- Backend agent endpoint shape.
- Durable conversation lifecycle: `sendMessage` persists the user message and returns accepted/latest state; backend async worker generates and stores the assistant message; `loadChat` restores sessions/messages on app launch and polling/foreground refresh.
- Client-to-backend networking path.
- Agent response Markdown rendering path in iOS, including block Markdown handling for headings, lists, blockquotes, thematic breaks, inline emphasis/code/links, and preserved blank lines.
- Chat navigation/state path: initial loading, load failure/retry, empty-after-load, list display, explicit selection only, no automatic restored-chat or generating-chat navigation, and background polling that does not mutate selection.
- Verification commands.
- The proof report path.

Keep the first slice narrow: chat list, new chat action, chat screen, message input, sent user messages, backend agent response rendering.

### 4. Build The Backend

Use Firebase as the owner for OpenAI calls.

Implementation requirements:

- Put OpenAI interaction in Firebase Functions.
- Use the OpenAI Agents SDK on the server.
- Before setting Firebase secrets or deploying Functions, confirm Pay as you go / Blaze readiness for the selected Firebase project. If the project is still on No-cost / Spark, present the switch to Pay as you go / Blaze as a planned backend setup step and give the project-specific URL; do not ask for the OpenAI API key yet.
- Before asking the user to enter the OpenAI API key, run `gcloud services enable secretmanager.googleapis.com --project <FIREBASE_PROJECT_ID>` and metadata-verify that Secret Manager API is enabled. Do not let the first `gcloud secrets create` command be the thing that discovers `SERVICE_DISABLED` after the user's hidden key entry.
- Store the OpenAI API key from the OpenAI Platform API keys page through Google Secret Manager/Firebase-compatible secrets or an equivalent server-only secret system using the generated product/project-specific secret resource name. The user-facing step must use the Terminal.app zsh-compatible `stty -echo` + `IFS= read -r OPENAI_KEY` command block above, piping the value directly to `gcloud secrets versions add --data-file=-`. Do not use Codex hidden prompts, `osascript`, helper scripts, `read -rsp`, `read -r -s`, inline exports, temporary secret files, or `firebase functions:secrets:set` for this user-facing key entry path.
- Do not create or reference a generic shared secret resource named only `OPENAI_API_KEY` unless the user explicitly selected that existing secret for this project. If a provider library expects `OPENAI_API_KEY` as a process environment variable, map it inside the backend runtime from the generated project-specific secret without exposing it to the client.
- Prefer authenticated app calls when Firebase Auth is already in scope; otherwise document the temporary unauthenticated state in the proof report.
- For the default first agent app, use Firebase anonymous Auth end to end: register the iOS Firebase app, include `GoogleService-Info.plist`, enable Anonymous Auth, have iOS fetch an ID token, and have the backend verify it with Firebase Admin before reading or writing any chat state.
- Persist chat state on the backend before model work starts. Store sessions and messages in Firestore or an equivalent backend-owned datastore with at least: owner user id, session id, message id, role, Markdown text, generation status, creation/update timestamps, and response-to linkage for assistant messages.
- If the product idea requires durable domain records beyond chat, design and implement the product-specific Firestore domain model before finishing backend work. Include collection paths, document schemas, ownership/organization boundaries, read/write query patterns, required composite indexes, Firestore rules or backend-only access, validation schemas, and migration/seed data only when needed for a real first use.
- Implement product domain operations as typed Firebase Functions and OpenAI Agents SDK tools. Use names from the user workflow, such as `findAppointmentSlots`, `createAppointment`, `updateAppointment`, and `cancelAppointment`, rather than generic tools such as `writeFirestoreDocument`. Read tools may only return authorized scoped data. Write/update/delete tools must validate input, enforce permissions, use transactions for shared-state invariants, record server timestamps/audit fields, and return stable typed DTOs.
- Do not implement the default proof as a stateless request/response chat. A stateless HTTP call is acceptable only as an explicitly documented temporary smoke test, not as the app architecture.
- Make user-message submission idempotent by accepting caller-supplied session/message ids or another stable dedupe key. A repeated request must not create duplicate messages or leave a completed session stuck in a generating state.
- Run the agent in a backend-owned asynchronous path after the user message is committed. Prefer a Firestore document trigger for the first simple Firebase proof; use task queues or jobs when the work needs retries, scheduling, or stronger operational controls.
- Provide a backend load/restore endpoint that returns the user's sessions and messages from persistent storage. The iOS app should use this endpoint on launch and while polling/refreshing in-flight sessions.
- If the iOS client does not read Firestore directly, Firestore rules should deny client reads/writes by default and all transcript access should go through verified backend Functions. If direct client listeners are intentionally used, rules must be owner-scoped and deny cross-user reads/writes.
- Return typed response data that the selected iOS app can decode or consume.
- Return the assistant/agent answer as Markdown content, preferably in a clearly named field such as `replyMarkdown` or `messageMarkdown`. If an existing response field is reused, document that it contains Markdown.
- Avoid committing generated secrets, local credentials, or environment files.

When setting the generated backend secret, use only the Terminal.app zsh-compatible Google Secret Manager command block from the OpenAI API key setup path above. Verify completion with metadata only:

```sh
gcloud secrets describe <GENERATED_SECRET_RESOURCE_NAME> --project <FIREBASE_PROJECT_ID> --format="value(name)"
```

Do not print or access the secret value.

Before writing agent runtime code, check the installed package typings or current official docs. Do not guess SDK APIs when a package or docs can be inspected.

### 5. Build The iOS App

Create or update the SwiftUI iOS app using the architecture reference or the user's supplied architecture template while preserving client/backend separation.

Implementation requirements:

- Keep networking out of SwiftUI views.
- Prefer TCA feature state, actions, reducers, dependencies, and SwiftUI views over MVVM/ViewModel-first architecture for new AgentFoundry iOS projects.
- Keep domain models, transport DTOs, feature state, dependency clients, and UI components separated.
- If domain records exist, keep domain record DTOs and backend clients typed. SwiftUI views and reducers call app-owned clients/actions; they do not assemble raw Firestore paths or expose unrestricted database mutation controls.
- Use async/await for backend calls.
- Render loading, success, and failure states.
- Initialize Firebase in the app target before requesting an Auth token. The Firebase config file may be bundled as client configuration, but no server/provider secrets may be bundled.
- Keep Firebase iOS SDK ownership in the app target unless the project has a proven dynamic-linking setup. With Tuist/XcodeProj package integration, prefer dynamic `.framework` product types for `FirebaseAuth` and `FirebaseCore`, add package target search paths for Firebase generated targets when needed, and include `-ObjC` in `OTHER_LDFLAGS` for Firebase/GoogleUtilities categories. Do not place `FirebaseAuth` token providers inside a separate dynamic platform framework while also configuring Firebase in the app target; that can duplicate Firebase singleton state and make `Auth.auth()` crash because its default app registry is nil.
- Create/reuse an anonymous Firebase user before sending chat requests. Networking clients should attach the Firebase ID token as `Authorization: Bearer <token>`.
- Load backend chat state on app launch before showing an empty transcript as authoritative. While the first load is in progress, show a spinner/loading state. If loading fails, show a retryable failure state. If loading succeeds with no sessions, show the empty/new-chat state. If loading succeeds with sessions, show the list and a neutral detail placeholder; do not select or open a restored session automatically.
- After sending a message, optimistically render the local user message, then treat backend state as source of truth. Poll or refresh in-flight sessions until the backend persisted assistant message appears, so closing and reopening the app shows the saved result.
- Poll in-flight sessions by backend generation state across the whole session list, not only by the currently selected session. Polling/refreshing backend state must preserve a nil selection and must not reopen a chat after the user navigates back to the list.
- Keep chat reducers explicit about load attempts and selection ownership. Track initial load attempt/completion separately from `sessions.isEmpty`, and clear selection when a detail view is intentionally dismissed or when the selected session disappears from backend state.
- Keep previews and sample data isolated from production execution paths.
- Render assistant/agent messages with a Markdown-capable SwiftUI component. Do not display Markdown returned by the backend with plain `Text(rawString)` or equivalent raw string rendering.
- Prefer an existing product Markdown renderer such as QChat's MarkdownUI-based message view when that dependency is already in the app. For the default lightweight proof, implement a small block-aware SwiftUI renderer: normalize `\r\n`/`\r` to `\n`, split with `components(separatedBy: "\n")`, render empty lines as visible whitespace rows, render `#`/`##`/`###` headings as styled text with markers removed, render `---`/`***`/`___` as dividers, render `-`/`*`/`+` and `1.` list rows with stable indentation, render `>` blockquotes with a leading accent, and parse inline spans in each text fragment with `AttributedString.MarkdownParsingOptions(interpretedSyntax: .inlineOnlyPreservingWhitespace, failurePolicy: .returnPartiallyParsedIfPossible)`.
- Keep Markdown rendering in a UI component or design-system text renderer; do not mix Markdown parsing into networking clients or reducers.
- For Tuist-generated projects, never treat a manual `DEVELOPMENT_TEAM` edit inside the generated `.xcodeproj` as durable. After the user chooses a team in Xcode, extract the team from build settings or `project.pbxproj`, persist it in `Project.swift` target settings or a checked-in/local xcconfig referenced by `Project.swift`, regenerate the project if needed, and verify `xcodebuild -showBuildSettings` still reports the same team.
- Apply `agent-foundry-design` to the proof UI and target configuration. Persist the required target baseline, use the AgentFoundry Liquid Glass design system, and run the design-skill clickability and shadow/clipping QA before accepting the UI.

The first UI must be functional, not decorative: chat list, create chat, chat detail, message input, and visible agent response.

### 6. Connect And Verify

Verify the real vertical path:

- Backend installs/builds.
- Selected Firebase project is Blaze-ready before deployed Functions secrets/deploy verification.
- Backend secrets are configured with the OpenAI API key from the OpenAI Platform API keys page via the secure `OPENAI_API_KEY` terminal setup or an explicitly confirmed existing secure backend secret.
- Firebase project is selected by the user or created after explicit user approval.
- Firebase iOS app registration, `GoogleService-Info.plist`, Anonymous Auth, and Firestore database are configured for the selected project. If Anonymous Auth is missing and no earlier project-specific approval exists, stop with the smallest setup action: `Разрешаю включить Anonymous Auth для <FIREBASE_PROJECT_ID>`.
- Firebase app startup is verified on simulator/device without the known nil-default-app crash. If using Tuist/XcodeProj package integration, verify that FirebaseAuth/FirebaseCore ownership, dynamic product types, package target search paths, and `-ObjC` linker flags match the app-target Firebase bootstrap plan.
- Backend deploys to the selected Blaze-ready Firebase project.
- Selected iOS app builds for the connected real iPhone when one is available and usable; otherwise for an iOS Simulator.
- Selected iOS app launches on the connected real iPhone when one is available and usable; otherwise on an iOS Simulator.
- Sending a user action from the selected iOS app reaches the backend.
- Backend calls the selected AI provider through the selected agent runtime.
- A direct backend smoke test proves durable server chat: create/sign in an anonymous Firebase user, send a message, observe an accepted/generating server state, wait for the asynchronous backend worker, and verify `loadChat` returns the persisted assistant Markdown without any client-side memory.
- If domain data and agent tools were required, backend tests or smoke checks prove the primary domain tool path, including at least one authorized read, one valid create/update mutation, one validation failure, and one ownership/conflict denial where applicable.
- The selected iOS app renders or presents the returned agent response.
- The selected iOS app renders assistant/agent Markdown line-by-line: inline emphasis, links, and inline/code-style text are parsed per line; bullet/numbered list lines keep their line structure; blank lines remain visible as separate rows. Raw inline Markdown syntax should not appear as ordinary unformatted text unless parsing fails and the fallback is documented.

If a step requires user credentials, CLI login, Team ID, paid account setup, store access, or deploy access, stop at that point with a precise blocker and the exact command or action the user must take.

### 7. Write The Proof Report

Write a proof report at the project root, normally `AGENTFOUNDRY_PROOF_REPORT.md`.

The report must include:

- Selected iOS app, Firebase backend, OpenAI Agents SDK runtime, and OpenAI provider.
- What was created.
- Project IDs, bundle IDs, app names, and backend secret resource names, excluding secret values.
- Firebase billing/readiness status: Pay as you go / Blaze confirmed or still on No-cost / Spark pending switch.
- Firebase iOS app registration, Anonymous Auth, Firestore database, Functions, Firestore rules, and backend transcript ownership status.
- Domain data model status when applicable: Firestore paths, ownership/organization scope, required indexes, rules/backend-only access, DTO schemas, and migration/seed status.
- Agent tool contract when applicable: tool names, authorized operations, validation/conflict behavior, approval-gated operations, and smoke-test outcome.
- Chat persistence contract: where sessions/messages are stored, how auth is verified, which endpoint accepts user messages, which backend worker writes assistant messages, and how iOS restores history.
- Secret handling status.
- Commands that passed.
- Commands that failed or need manual action.
- Whether connected real iPhone launch was verified, or which iOS Simulator was used when no real iPhone was available.
- Whether a real agent response was verified.
- Whether assistant/agent Markdown rendering was verified in the iOS app.
- The next recommended skill or workflow.

## Stop Rules

Stop instead of improvising when:

- Product name is missing and the user has not confirmed one.
- Bundle identifier is missing and the user has not confirmed a derived value.
- Multiple Firebase/GCP projects exist and the user has not selected one.
- Firebase Anonymous Auth is not enabled for the selected project and the user has not explicitly approved enabling it for that exact project.
- Firebase project is still on No-cost / Spark plan or otherwise not on Pay as you go / Blaze, and the user has not completed the planned switch.
- Required backend CLI is missing or unauthenticated and cannot be installed/login completed.
- Google Cloud access is required but unavailable.
- No safe OpenAI API key setup path exists from the OpenAI Platform API keys page through a secure terminal prompt, or an explicitly confirmed existing secure backend secret is unavailable.
- The selected iOS app cannot build.
- The backend cannot call the selected AI provider.
- The backend cannot persist user messages before model work starts or cannot restore persisted chat history.
- The async backend response path cannot persist assistant messages independently of the app staying open.
- The selected iOS app only talks to a mock.
- The required/default AgentFoundry design target baseline is unsupported locally and the user has not approved lowering it.
- The implementation would require changing unrelated user code or overwriting existing architecture.

Report the blocker with the smallest next action. Do not broaden the workflow into product planning, payments, analytics, store submission, deployment, or growth features until the production-proof agent path works.
