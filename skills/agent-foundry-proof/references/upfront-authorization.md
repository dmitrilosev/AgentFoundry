# Single Upfront Authorization

Use one setup authorization before scaffold or persistent external changes. Do not split predictable permissions into milestone-by-milestone questions.

## Read-Only Preflight

Before asking for authorization, perform every safe read-only check needed to make the request concrete:

- derive and present the product display name, Swift name, slug, bundle identifier, target directory, first workflow, durable object, and capability contours;
- inspect the target directory without modifying it;
- inspect Firebase/GCP login, project availability, current billing linkage, visible active billing accounts, enabled services, existing Firebase app registrations, Anonymous Auth state, Firestore database state, and deploy region when accessible;
- inspect for a usable `OPENAI_API_KEY` without printing or reading its value into ordinary tool output;
- inspect available Apple development teams and connected devices when local tools expose them;
- derive a proposed App Icon metaphor, palette direction, stable prompt/master paths, asset catalog path, and selected runtime target;
- choose deterministic product-scoped names for the Firebase project, backend secret, and new OpenAI key;
- choose an ignored dedicated key staging file such as `<TARGET>/.env.agentfoundry-key.local`.

Read-only discovery does not authorize selecting a project, billing account, Apple team, or existing API key. If multiple valid choices exist, put the recommended choice and alternatives into this same authorization request. Do not ask a preliminary question and then a permission question.

## One Request

Show one concise manifest containing every proposed value and persistent action, then request exactly one reply: `Подтверждаю единый план выше.` Localize that sentence when the conversation uses another language. This manifest is also the credential-decision message required by `openai-platform-api-key`; make it the next substantive message after safe credential inspection and include the credential branch explicitly instead of sending that skill's question separately.

The manifest must cover all applicable items:

1. Product identity and local scope: names, bundle identifier, exact target directory, scaffold/adaptation, and capability contours.
2. Firebase scope: exact project id; create or reuse decision; region; exact billing account when automatic linking is proposed; Pay as you go / Blaze linkage; iOS app registration; `GoogleService-Info.plist` installation; Anonymous Auth; default Firestore database in the immutable selected location; rules and indexes.
3. Required services: enable and verify `firebase.googleapis.com`, `identitytoolkit.googleapis.com`, `securetoken.googleapis.com`, `firestore.googleapis.com`, `secretmanager.googleapis.com`, `cloudfunctions.googleapis.com`, `cloudbuild.googleapis.com`, `artifactregistry.googleapis.com`, `run.googleapis.com`, `eventarc.googleapis.com`, `pubsub.googleapis.com`, and `storage.googleapis.com`, plus only an additional service proven necessary by the selected contour.
4. Deployment: create the product-scoped secret resource; install dependencies; build; deploy rules, indexes, and Functions; run authenticated smoke tests; and use the deployed resources for the proof.
5. OpenAI credential decision: reuse the detected key or create a new product-scoped key; the proposed key name; selection of its OpenAI organization/project in the secure Platform picker; exact ignored staging path and env name; transfer to the named Google Secret Manager resource without displaying plaintext; deletion of a dedicated staging file after metadata-verified upload; and use for build/runtime verification. Never include the key value.
6. Narrow conditional IAM: if a deploy error proves it necessary, grant only bucket-scoped `roles/storage.objectViewer` on `gs://gcf-v2-sources-<PROJECT_NUMBER>-<REGION>` to the exact service account named by the error; grant `roles/run.invoker` to `allUsers` only on the exact client-facing Cloud Run/2nd-gen Functions service when Firebase ID-token verification remains enforced in application code. Do not pre-authorize project-wide roles, unrelated principals, private workers, or broad IAM repair.
7. Apple execution scope when relevant: selected development team, persistence of `DEVELOPMENT_TEAM`, Simulator/device build, install, and launch. Account sign-in, 2FA, device trust, and OS permission prompts remain platform gates.
8. App Icon scope: use the authorized OpenAI credential for one high-quality Image API generation plus targeted correction when needed; save the detailed English prompt and opaque 1024x1024 master under `output/imagegen`; create/update `AppIcon.appiconset`; regenerate the project; validate the 40x40 silhouette, `actool`, bundle primary-icon metadata, install, and launch. Include this generated-image API use and its cost consequence explicitly.

State the cost/security consequence of billing linkage, immutable Firestore location, OpenAI key creation/use for both the server agent and App Icon generation, public function transport, and conditional IAM in the manifest. Keep it scannable; one authorization can be explicit without becoming a transcript of commands.

Example closing line:

```text
Ответьте одной строкой: Подтверждаю единый план выше.
```

## Authorization Ledger

After confirmation, record the manifest and confirmation in the proof report as the setup authorization ledger. Treat every exact action and narrow conditional repair in that ledger as already approved for the rest of the proof, including after context compaction or tool/widget follow-up.

Hard rules:

- Do not ask again before scaffold, project creation, billing linkage, Anonymous Auth, Firestore creation, service enablement, secret creation, deploy, covered IAM repair, or covered Apple configuration.
- Do not ask again before covered App Icon generation, targeted iteration, asset installation, build, device install, or launch.
- Do not ask the user to reply `готово`. Verify external state directly and resume automatically.
- Do not turn a sandbox, browser, connector, OAuth, 2FA, payment-method, device-trust, or OS permission dialog into a second chat confirmation. Open or request the platform gate directly, then continue from its result or poll metadata.
- A secure OpenAI Platform picker selection is target selection, not a second permission request. The initial manifest must already authorize key creation and the exact local destination, so the widget follow-up continues directly into secure creation, staging, Secret Manager transfer, and cleanup without another conversational confirmation or local-destination form.
- Do not silently broaden the ledger. If a genuinely unforeseeable mutation falls outside it, prefer a safe non-mutating workaround or report the exact blocker. Ask one additional scoped authorization only when completion is impossible without that materially different action.

## Autonomous Continuation

Once authorized, run every agent-capable action without waiting for status messages:

- If a billing account is selected and authorized, link it with available tooling and verify billing/Blaze metadata. If the provider forces a browser payment/account step, drive the browser as far as available, surface only the platform gate, and poll until the state changes.
- Enable services in one operation when tooling supports it, then metadata-verify the complete set before continuing.
- Retry Anonymous Auth initialization after billing/API propagation instead of asking for another approval.
- Create the default Firestore database once in the authorized immutable location and treat `ALREADY_EXISTS` as a verification path.
- Invoke the `openai-platform-api-key` workflow using the ledger's reuse/new decision and exact staging destination. After a hosted picker follow-up, do not ask to confirm creation or destination again.
- Promote a staged key with `scripts/promote-openai-key.mjs`; never print, paste, or place the key in command arguments. Delete only the dedicated staging file and only after the Secret Manager version succeeds.
- Deploy, repair only ledger-covered IAM, rerun deploy, smoke-test, build, launch, and complete the report without milestone confirmations.
- After the product color story exists, run `agent-foundry-app-icon`, securely expose the authorized product-scoped key only to the image-generation process, inspect at 1024 and 40 pixels, install the asset catalog, and verify the compiled primary icon without a second credential or cost question.

User participation after the initial authorization is limited to platform-enforced actions the agent cannot perform: choosing/adding a payment method, OAuth or 2FA consent, the hosted OpenAI organization/project picker, macOS permission dialogs, initial Apple account/team setup when tooling cannot select it, and physical device trust. Continue automatically after each tool/widget result whenever the platform can signal completion.
