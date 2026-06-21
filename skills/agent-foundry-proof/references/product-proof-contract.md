# Product-Proof Contract

Use this contract to decide whether the AgentFoundry proof skill has succeeded.

## Input

The normal input is a product idea plus local access to required developer tools and accounts.

Required concrete facts:

- Product name, provided by the user or explicitly confirmed. If the assistant derives it from the idea, it should propose a simple user-facing name that an unfamiliar user can understand when they hear it. The name should suggest what the product is about or what it helps the user do. One or two words are both acceptable; clarity matters more than forced brevity.
- iOS app: SwiftUI.
- Target and UI baseline: apply `agent-foundry-design` for the AgentFoundry deployment target, Liquid Glass design system, clickability, and shadow/clipping QA.
- Backend: Firebase.
- Agent runtime: OpenAI Agents SDK.
- AI provider: OpenAI.
- Agent response format: backend assistant/agent replies are Markdown and the iOS app renders assistant/agent messages with QChat-style line-by-line inline Markdown parsing that preserves blank lines.
- iOS bundle identifier. Derived identifiers are acceptable only after user confirmation. Use a clean lowercase ASCII reverse-DNS slug that communicates the product meaning. If the display name is localized or non-English, prefer a clear English/ASCII meaning-based slug over awkward transliteration, unless the user explicitly chooses the transliterated brand.
- Backend project decision: user-selected existing project ID or explicit permission to create a new project.
- Firebase Anonymous Auth approval. As soon as the Firebase project ID is known or the user has approved creating a new project, the agent should ask for explicit project-specific approval to enable Anonymous Auth unless metadata shows it is already enabled. This is a persistent Firebase security/config change and should be handled in the initial setup checklist, for example: `Разрешаю включить Anonymous Auth для <FIREBASE_PROJECT_ID>`. After approval, enabling and verifying the provider is agent-owned work.
- Firebase Pay as you go / Blaze readiness. This proof uses Firebase Functions plus Secret Manager-backed secrets, so the selected Firebase project must use Pay as you go / Blaze plan before Firebase Functions secrets or deploy are attempted. If the Firebase console shows No-cost ($0/month) / Spark plan as Current Plan, the user must switch/select Pay as you go / Blaze plan. Treat this as a planned setup step, not a command error. Provide the project-specific URL after the project is known:

```text
https://console.firebase.google.com/project/<FIREBASE_PROJECT_ID>/usage/details
```

- Secret Manager API readiness. After Blaze readiness is confirmed and before asking the user to enter the OpenAI API key, the agent must enable and metadata-verify `secretmanager.googleapis.com` for the selected project. If Secret Manager API cannot be verified as enabled, the agent must stop before showing the hidden key-entry prompt. This prevents the user from entering a hidden key only to hit `SERVICE_DISABLED` inside `gcloud secrets create` or `gcloud secrets versions add`.
- OpenAI API key setup path. The user should create or copy an OpenAI API key from the OpenAI Platform API keys page, but must not paste it into chat. The initial setup checklist should state the current required OpenAI action clearly. If product slug and Firebase project are already known, provide only the ordinary Terminal.app zsh-compatible command that reads the key without echoing it and writes it directly into the generated Google Secret Manager secret resource. If they are not yet known, tell the user to have the OpenAI API key ready now and say that the exact command follows immediately after product/project confirmation. Do not use Codex hidden prompts, macOS `osascript` dialogs, helper scripts, `read -rsp`, `read -r -s`, inline exports, temporary secret files, or `firebase functions:secrets:set` for the user-facing key entry path.

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

  The backend secret resource name is generated internally with the default form `AGENTFOUNDRY_<PRODUCT_SLUG>_OPENAI_API_KEY`; it is not a user confirmation question unless the user explicitly wants to reuse an existing per-project secret. The command must be run in Terminal.app. If it fails before unsetting `OPENAI_KEY`, tell the user to run `unset OPENAI_KEY` before retrying.
- First AI-agent use case.
- Runtime target: connected real iPhone when available and usable; otherwise iOS Simulator.

Credentials and account access are not content inputs. Treat them as operational prerequisites that must be handled securely.

## Kickoff Communication

The proof should begin with a short execution handoff, not a passive blocker list. The agent should state:

- What it will do itself: create/select Firebase, scaffold/build iOS and backend, deploy when prerequisites are ready, run smoke tests, and write the report.
- What the user may need to do: approve enabling Firebase Anonymous Auth for the selected project, switch Firebase to Pay as you go / Blaze, create/copy an OpenAI API key without pasting it into chat, enter it through the secure terminal prompt, approve explicit IAM repair, and choose an Apple Development Team if signing requires it.
- The exact Firebase Blaze URL as soon as the project ID is known.
- That the user can prepare the OpenAI API key from the OpenAI Platform API keys page while the agent continues local implementation, but key entry should wait until Blaze readiness and the generated Firebase secret command are available.

When waiting on a user-only step, report only the exact next user actions. Do not include agent-owned deploy/build/smoke/report commands in the user's task list. After the user confirms completion, the agent resumes with metadata verification and continues the one-shot proof path.

## Command Ownership

The agent should run every non-secret command it can run itself. User-only actions are limited to secret entry, Firebase plan switch from No-cost / Spark to Pay as you go / Blaze, billing account selection, browser login/OAuth/2FA/account consent, explicit approval for persistent Firebase/GCP security or configuration changes such as enabling Anonymous Auth and IAM changes, local permission prompts, initial Apple signing/team selection, and physical device trust actions.

Do not ask the user to run `npm` builds, Firebase deploys, direct backend `curl` smoke tests, Xcode/Tuist builds, or proof report updates when the agent can run them through tools. After the user completes a user-only step, the agent resumes with the next command and records the outcome.

Enabling Firebase Anonymous Auth requires explicit user approval when it is not already enabled, but after approval the agent should enable/verify the provider itself and continue setup. Do not let missing Anonymous Auth first appear as the final e2e smoke blocker if the Firebase project was known earlier.

Persistent IAM changes require explicit user approval, but after approval the agent should run the command itself. For Firebase Functions Cloud Build source bucket read failures, prefer a bucket-scoped `roles/storage.objectViewer` binding on `gs://gcf-v2-sources-<PROJECT_NUMBER>-<REGION>` for the exact service account from the error. Do not request or apply a project-wide role when the bucket-level binding is sufficient.

For real iPhone signing, the agent should first try command-line device build. If Xcode requires a development team, only the initial team/account selection is user-only. After the user selects a team, the agent should extract `DEVELOPMENT_TEAM`, persist it into the Tuist/project configuration when appropriate, regenerate if needed, rerun device build/install/launch when tools allow it, and update the proof report.

## Output

The output is a verified product proof, not a full product:

- Selected SwiftUI iOS app.
- Minimal user interaction UI: chat list, new chat action, chat detail, message input, plain user messages, and line-by-line Markdown-rendered assistant/agent messages.
- AgentFoundry target/UI baseline from `agent-foundry-design`, persisted in project configuration rather than only generated Xcode UI state.
- Firebase backend.
- Server-side agent endpoint.
- Server-side OpenAI API key stored in a generated product/project-specific backend secret resource.
- Build/run verification.
- Proof report.

## Acceptance Checks

The setup is complete only when:

- Product name, bundle identifier, backend project decision, Firebase Anonymous Auth approval/enabled state, and secure OpenAI API key setup action were provided or explicitly completed by the user.
- Firebase Pay as you go / Blaze readiness was confirmed before deployed Functions secrets/deploy.
- The agent ran all feasible build, deploy, smoke-test, and report-update commands itself; any user-run commands were limited to user-only actions.
- Any IAM repair was explicitly approved by the user, applied at the narrowest sufficient scope, and followed by a rerun of deploy/smoke verification.
- Real iPhone verification was tool-verified when possible, or the report clearly states that a required Apple signing/team/device action was user-only and whether the agent later persisted/verified the signing configuration.
- A user can launch the selected iOS app.
- The selected iOS app passes the `agent-foundry-design` visual QA gate for changed first-party surfaces.
- A user can trigger the first agent interaction.
- The message is sent to the backend.
- The backend calls OpenAI through the OpenAI Agents SDK.
- The backend call uses the generated server-side project-specific backend secret resource, not a client-side or hardcoded key.
- The response is returned to the iOS app as documented Markdown content.
- The iOS app renders assistant/agent Markdown line-by-line, parses inline Markdown with whitespace preserved, and keeps intentional blank lines as visible rows.
- The proof report records evidence and remaining manual steps.

## Non-Acceptable Substitutes

These do not count as success:

- Static assistant text generated in the client.
- A hardcoded response.
- A local mock server presented as production proof.
- AI provider calls from the client.
- A backend endpoint that exists but was not called from the selected iOS app.
- A successful build without a verified chat response.
- A pretty UI with no working backend path.
- An invented product name or bundle identifier used without user confirmation.
- A Firebase/GCP project auto-selected from CLI output without user choice.
- Treating missing Firebase Anonymous Auth as a final smoke-test blocker after the project setup phase instead of asking for explicit project-specific approval as soon as the Firebase project is known.
- Asking the user to enter the OpenAI API key before Blaze readiness is confirmed for Firebase backend secret setup and deploy.
- Asking the user to run deploy, direct backend curl smoke tests, build commands, or proof report updates when the agent can run them.
- Applying a project-wide IAM role when a bucket-level Firebase Functions source bucket binding would resolve the observed deploy failure.
- Stopping at "open Xcode and run it" after the user selects a Development Team, without trying to extract/persist signing settings and rerun device verification.
- A generic shared secret resource named only `OPENAI_API_KEY` used by default for a new project.
- Raw inline Markdown returned by the agent displayed in iOS as ordinary plain text.
- Assistant Markdown rendered with a block parser that changes chat transcript line spacing or drops intentional blank lines, unless the user explicitly requested a rich document surface instead of QChat-style chat bubbles.
- Server/system/debug text shown as the user-facing assistant answer instead of a clean agent Markdown response.

## Production-Proof Boundary

This first workflow may defer:

- Payments.
- Analytics.
- Store or deploy metadata.
- TestFlight submission.
- Advanced auth.
- Rate limiting.
- Agent tools beyond the basic chat agent.
- Long-term memory.
- Multi-agent routing.

If a deferred item creates a security or release blocker, document it in the proof report.
