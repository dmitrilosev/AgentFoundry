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

As soon as the Firebase project ID is known or the user approves creating a new project, check whether Anonymous Auth is already enabled when metadata access is available. If it is not enabled or cannot be confirmed, ask for explicit approval for that exact project in the initial setup checklist, for example: `Разрешаю включить Anonymous Auth для <FIREBASE_PROJECT_ID>`.

Treat enabling Anonymous Auth as a persistent Firebase security/config change requiring user approval. After approval, the agent owns enabling and verifying the provider. Do not defer this request until deploy or the final e2e smoke test.

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

For Firebase Functions and Secret Manager-backed secrets in the AgentFoundry proof, treat Firebase Pay as you go / Blaze plan as a required planned setup prerequisite. Communicate this before asking the user to enter an OpenAI API key, because deployed Functions and backend secret wiring require the selected project to be billing-enabled.

After the Firebase project ID is known, tell the user:

- This proof uses Firebase Functions and Secret Manager-backed secrets.
- The selected Firebase project needs Pay as you go / Blaze plan before backend secrets/deploy can be configured.
- If the Firebase console shows No-cost ($0/month) / Spark plan as Current Plan, the user needs to click/select Pay as you go / Blaze plan.
- Blaze links a billing account and is usage-based; many Firebase/Google Cloud services include no-cost quotas, but this is still a billing-enabled plan.
- They should set a budget alert if they are concerned about spend.
- Upgrade URL: `https://console.firebase.google.com/project/<FIREBASE_PROJECT_ID>/usage/details`

Frame this as "planned backend setup" or "next setup step", not as an error. If the project is still on No-cost / Spark plan, stop with "switch Firebase to Pay as you go / Blaze plan" as the exact blocker before backend secret setup or deploy.

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

## Secret Setup

Generate a product-scoped provider secret resource name internally:

- OpenAI default: `AGENTFOUNDRY_<PRODUCT_SLUG>_OPENAI_API_KEY`.
- Sanitize the product slug for the backend secret system: uppercase letters, digits, and underscores.
- Keep the secret resource name distinct from other AgentFoundry projects so multiple products can use different OpenAI keys.
- Do not ask the user to confirm the generated secret resource name unless they explicitly want to reuse an existing per-project secret.
- If a provider SDK expects `OPENAI_API_KEY` as an environment variable, map the generated project-specific secret to that runtime variable inside the backend only.

Before asking the user to enter the OpenAI API key, the agent must make Secret Manager ready for the selected project:

```sh
gcloud services enable secretmanager.googleapis.com --project <FIREBASE_PROJECT_ID>
gcloud services list --enabled --project <FIREBASE_PROJECT_ID> --filter='config.name:secretmanager.googleapis.com' --format='value(config.name)'
```

The second command must print `secretmanager.googleapis.com` before the user sees the key entry block. If it does not, stop before key entry and report the Secret Manager API blocker. If the user already reached a hidden prompt and then saw `SERVICE_DISABLED`, tell them to press `Ctrl+C`, run `stty echo`, wait for API propagation, and retry only after the metadata check passes.

If the key is not available locally and the backend secret is missing, ask the user to create or copy an OpenAI API key from the OpenAI Platform API keys page and run only the ordinary Terminal.app zsh-compatible command below. Make this a clear current user action in the initial setup checklist; do not use vague deferred language like "when we get to backend secret."

Do not ask the user to enter the OpenAI API key until Blaze readiness is confirmed for Firebase backend secret setup and deploy.

Do not ask the user to paste the API key into chat. Do not use Codex hidden prompts, macOS `osascript` dialogs, helper scripts, `read -rsp`, `read -r -s`, inline `export OPENAI_API_KEY=...`, temporary secret files, or `firebase functions:secrets:set` for the user-facing key entry path.

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

The generated secret resource name should be product/project-specific. Verify only metadata with `gcloud secrets describe <GENERATED_SECRET_RESOURCE_NAME> --project=<FIREBASE_PROJECT_ID> --format="value(name)"`; do not print or access the secret value.

## Cloud Build Source Bucket IAM

Firebase Functions deploy may fail during Cloud Build if the Functions runtime service account cannot read the generated source bucket, usually named like:

```text
gs://gcf-v2-sources-<PROJECT_NUMBER>-<REGION>
```

Typical error shape:

```text
serviceAccount:<PROJECT_NUMBER>-compute@developer.gserviceaccount.com cannot read bucket gcf-v2-sources-<PROJECT_NUMBER>-<REGION>
```

Treat this as a targeted IAM repair, not as a reason to hand deploy back to the user. Persistent IAM changes still require explicit user approval. Prefer the narrow bucket-level binding over a project-wide role:

```sh
gcloud storage buckets add-iam-policy-binding gs://gcf-v2-sources-<PROJECT_NUMBER>-<REGION> \
  --member=serviceAccount:<PROJECT_NUMBER>-compute@developer.gserviceaccount.com \
  --role=roles/storage.objectViewer \
  --project=<FIREBASE_PROJECT_ID>
```

After the user approves this exact change, run it yourself, then immediately rerun `firebase deploy --only functions --project <FIREBASE_PROJECT_ID>` and the backend `curl` smoke test. Record the IAM change in the proof report as user-approved, bucket-scoped, and project-specific.

## Verification

Backend verification should include:

- Dependency install/build passes.
- Firebase Anonymous Auth is enabled for the selected project, or the proof stops with the earlier project-specific approval action.
- Generated project-specific secret is set. If it is missing, ask the user to run the secure OpenAI API key setup command, then treat unresolved setup as the explicit blocker.
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

If deployment requires billing, project ownership, account login, or region selection that is unavailable, stop and record the exact required user action.
