# Backend Architecture Guardrails

Use the user's supplied backend architecture template when available. These guardrails are fallback rules for the first production-proof Firebase/OpenAI backend slice.

## Principles

- The backend owns all OpenAI calls.
- The iOS app never receives or stores the OpenAI API key.
- Secrets are configured through Firebase/Google secret management or an equivalent server-only secret mechanism.
- AI provider secret resources are generated per product/project unless the user explicitly confirms reusing an existing per-project secret.
- Endpoint request and response shapes are typed.
- Backend code is deployable or runnable through Firebase tooling.
- Local emulator usage may be used only as a temporary development aid; it does not satisfy the deployed proof.

## Firebase Shape

Prefer Firebase Functions with TypeScript for the first backend unless the existing project uses another supported backend runtime.

Expected backend responsibilities:

- Receive a chat message from the app.
- Validate required input.
- Call the OpenAI Agents SDK on the server.
- Return the assistant response as Markdown content in a typed DTO field.
- Log enough operational context to debug failures without logging secrets.

Prefer Firebase callable functions for authenticated app flows. Use HTTP functions when the app needs streaming, custom auth, or a simpler first proof. Document the choice in the setup report.

## Anonymous Auth Setup

The default proof uses Firebase Anonymous Auth so the iOS app can obtain a Firebase Auth ID token and the backend can verify the user before storing or loading chat history.

During read-only preflight, check whether Anonymous Auth is already enabled when metadata access is available. If it is not enabled or cannot be confirmed, include project-specific enablement in the single upfront authorization manifest.

Treat enabling Anonymous Auth as a persistent Firebase security/config change covered by that ledger. After confirmation, the agent owns enabling and verifying the provider and must not ask again before retrying after billing/API propagation.

## Agent Response Markdown Contract

For agent apps, the backend response to the iOS chat should treat the assistant answer as Markdown, not as opaque plain text.

Implementation rules:

- Add an instruction to the backend-hosted agent that user-facing answers should be concise, useful, line-oriented Markdown that works well with an inline-only chat renderer.
- Return the user-facing assistant answer in a typed response field with an obvious Markdown contract, preferably `replyMarkdown` or `messageMarkdown`.
- If an existing endpoint already returns `text`, either rename it during the proof or document in the DTO and client code that `text` contains assistant Markdown.
- Do not return raw provider envelopes to the iOS app for the first proof. Extract the user-facing agent answer on the backend and return a stable app-owned DTO.
- Do not mix server/system/debug messages into the user-facing Markdown field. Errors should use typed error responses, not assistant Markdown.
- Keep Markdown generation server-side and Markdown rendering client-side. The backend should not pre-render HTML for the iOS app unless the product explicitly requires an HTML renderer.
- Do not rely on block-level Markdown semantics for the first chat proof. Prefer readable lines, bullets or numbered lines, bold/emphasis, links, and inline code. Intentional blank lines are allowed and should be preserved by the iOS renderer.

Example response shape:

```json
{
  "sessionId": "chat-123",
  "replyMarkdown": "**3-day plan**\n\n- **Day 1:** ...\n- **Day 2:** ...",
  "model": "openai-model-name"
}
```

## Blaze Readiness

For Firebase Functions and Secret Manager-backed secrets in the AgentFoundry proof, treat Firebase Pay as you go / Blaze as a required planned setup prerequisite. Discover visible billing accounts during read-only preflight and include the exact proposed billing link in the single upfront authorization.

After the Firebase project ID is known, tell the user:

- This proof uses Firebase Functions and Secret Manager-backed secrets.
- The selected Firebase project needs Pay as you go / Blaze plan before backend secrets/deploy can be configured.
- If the Firebase console shows No-cost ($0/month) / Spark plan as Current Plan, link the authorized billing account with available tooling or open the project-specific browser flow when the provider requires it.
- Blaze links a billing account and is usage-based; many Firebase/Google Cloud services include no-cost quotas, but this is still a billing-enabled plan.
- They should set a budget alert if they are concerned about spend.
- Upgrade URL: `https://console.firebase.google.com/project/<FIREBASE_PROJECT_ID>/usage/details`

Frame this in the upfront manifest as planned backend setup, including usage-based cost and payment-method implications. If the provider forces a payment/account action, surface that platform gate and poll billing metadata afterward. Do not ask for another permission or a `готово` reply.

## OpenAI Agents SDK

Before implementing SDK calls:

- Inspect installed package docs/types when the package is present.
- Otherwise consult current official OpenAI documentation.
- Do not invent SDK APIs from memory.

The first agent can be simple:

- Short name.
- Clear instruction.
- No tools unless the product idea requires one immediately.
- Deterministic enough to verify through a basic chat response.

## Secret Handling

Acceptable approaches:

- Firebase Functions secrets with a generated product/project-specific secret resource name.
- Google Secret Manager wired into the function runtime with a generated product/project-specific secret resource name.
- Existing project-approved secret mechanism.
- Existing per-project secret explicitly selected by the user.

Unacceptable approaches:

- API key in iOS source.
- API key in a committed `.env`.
- API key in `GoogleService-Info.plist`.
- API key printed in logs.
- API key passed from iOS to backend.
- A generic shared secret resource named only `OPENAI_API_KEY` chosen by default for a new project.
- Auto-selecting a secret from a different Firebase/GCP project without user confirmation.

## Service And Secret Setup

Generate a product-scoped provider secret resource name internally:

- OpenAI default: `AGENTFOUNDRY_<PRODUCT_SLUG>_OPENAI_API_KEY`.
- Sanitize the product slug for the backend secret system: uppercase letters, digits, and underscores.
- Keep the secret resource name distinct from other AgentFoundry projects so multiple products can use different OpenAI keys.
- Do not ask the user to confirm the generated secret resource name unless they explicitly want to reuse an existing per-project secret.
- If a provider SDK expects `OPENAI_API_KEY` as an environment variable, map the generated project-specific secret to that runtime variable inside the backend only.

Enable and verify all predictable backend services covered by the upfront ledger before credential promotion:

```sh
gcloud services enable \
  firebase.googleapis.com \
  identitytoolkit.googleapis.com \
  securetoken.googleapis.com \
  firestore.googleapis.com \
  secretmanager.googleapis.com \
  cloudfunctions.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  eventarc.googleapis.com \
  pubsub.googleapis.com \
  storage.googleapis.com \
  --project <FIREBASE_PROJECT_ID>
```

Metadata-verify the complete enabled set. Retry initialization after normal propagation. Do not turn a transient `SERVICE_DISABLED` or billing propagation delay into another approval question.

Resolve reuse-versus-new and the exact ignored staging destination in the single upfront authorization. Use the `openai-platform-api-key` workflow. A hosted picker may require organization/project selection, but after its follow-up continue directly without asking for key creation or destination confirmation again.

Do not ask the user to paste or manually enter the OpenAI API key. Do not inspect or print its value.

For a newly created key, use the dedicated ignored file confirmed in the upfront ledger, normally `<TARGET>/.env.agentfoundry-key.local`. Promote it without putting plaintext in command arguments:

```sh
node <proof-skill-dir>/scripts/promote-openai-key.mjs \
  --env-file <ABSOLUTE_CONFIRMED_STAGING_PATH> \
  --env-name OPENAI_API_KEY \
  --secret <GENERATED_SECRET_RESOURCE_NAME> \
  --project <FIREBASE_PROJECT_ID> \
  --delete-source
```

Use `--delete-source` only for the dedicated staging file and only when it contains no unrelated variables. For reuse from an existing local env file, omit `--delete-source`. The helper creates the product-scoped resource when absent, sends the value through stdin, metadata-verifies it, and deletes the dedicated source only after a successful version add. Never print or access the stored secret value.

## Cloud Build Source Bucket IAM

Firebase Functions deploy may fail during Cloud Build if the Functions runtime service account cannot read the generated source bucket, usually named like:

```text
gs://gcf-v2-sources-<PROJECT_NUMBER>-<REGION>
```

Typical error shape:

```text
serviceAccount:<PROJECT_NUMBER>-compute@developer.gserviceaccount.com cannot read bucket gcf-v2-sources-<PROJECT_NUMBER>-<REGION>
```

Treat this as a targeted IAM repair, not as a reason to hand deploy back to the user. Include this exact conditional repair class in the single upfront ledger. Prefer the narrow bucket-level binding over a project-wide role:

```sh
gcloud storage buckets add-iam-policy-binding gs://gcf-v2-sources-<PROJECT_NUMBER>-<REGION> \
  --member=serviceAccount:<PROJECT_NUMBER>-compute@developer.gserviceaccount.com \
  --role=roles/storage.objectViewer \
  --project=<FIREBASE_PROJECT_ID>
```

If the ledger covers this exact condition, run it without another question, then immediately rerun `firebase deploy --only functions --project <FIREBASE_PROJECT_ID>` and the backend smoke test. Record the IAM change in the proof report as upfront-authorized, bucket-scoped, error-proven, and project-specific. Ask again only if the necessary mutation is materially different from the ledger.

## Verification

Backend verification should include:

- Dependency install/build passes.
- Firebase Anonymous Auth is enabled for the selected project under the upfront ledger, or the proof stops at the exact platform blocker.
- Generated project-specific secret is set through the secure Platform/staging promotion path. If it is missing, resume that workflow rather than handing a Terminal command to the user.
- Function runs locally or is deployed.
- Endpoint responds to a test request.
- Endpoint response includes the assistant answer as Markdown in the documented typed field.
- iOS app can call the endpoint.
- OpenAI response is real, not hardcoded.

The agent should run build, deploy, and backend smoke-test commands itself after user-only prerequisites are complete. Do not ask the user to run `npm --prefix functions run build`, `firebase deploy`, or `curl` smoke tests when Codex can run them through tools.

When verifying that a backend secret exists, use metadata-only checks such as:

```sh
gcloud secrets describe <GENERATED_SECRET_RESOURCE_NAME> --project=<FIREBASE_PROJECT_ID> --format="value(name)"
```

Do not run unredacted secret access commands that print the secret value.

If deployment requires a platform-owned payment, ownership, login, OAuth/2FA, immutable region choice, or other action the agent cannot perform, surface only that exact gate and record it. Do not ask for a status reply; poll or consume the platform result when available.
