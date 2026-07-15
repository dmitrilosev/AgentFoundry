# Product-Proof Contract

Use this contract to decide whether the AgentFoundry proof skill has succeeded.

## Input

The normal input is a product idea plus local access to required developer tools and accounts.

Required concrete facts:

- Product name, provided by the user or included in the single upfront authorization manifest. If the assistant derives it from the idea, it should propose a simple user-facing name that an unfamiliar user can understand when they hear it. The name should suggest what the product is about or what it helps the user do. One or two words are both acceptable; clarity matters more than forced brevity.
- iOS app: SwiftUI.
- Target and UI baseline: apply `agent-foundry-design` for the AgentFoundry deployment target, Liquid Glass design system, clickability, and shadow/clipping QA.
- Brand icon baseline: apply `agent-foundry-app-icon` after the visual concept exists to create a product-specific metaphor, detailed English prompt, opaque 1024x1024 master, 40x40 validation, compiled AppIcon asset, and runtime evidence.
- Backend: Firebase.
- Agent runtime: OpenAI Agents SDK.
- AI provider: OpenAI.
- Agent response format: backend assistant/agent replies are Markdown and the iOS app renders assistant/agent messages with QChat-style line-by-line inline Markdown parsing that preserves blank lines.
- iOS bundle identifier. Derived identifiers are acceptable only when included in the single upfront authorization manifest. Use a clean lowercase ASCII reverse-DNS slug that communicates the product meaning. If the display name is localized or non-English, prefer a clear English/ASCII meaning-based slug over awkward transliteration, unless the user explicitly chooses the transliterated brand.
- Backend project decision: user-selected existing project ID or creation of the exact project included in the single upfront authorization manifest.
- Firebase Anonymous Auth approval: include project-specific enablement in the single upfront authorization unless metadata proves it is already enabled. After confirmation, enabling and verifying the provider is agent-owned work and must not trigger a later question.
- Firebase Pay as you go / Blaze readiness. Include automatic linkage to the exact visible billing account in the single upfront authorization when tooling exposes one. This proof uses Firebase Functions plus Secret Manager-backed secrets, so the selected Firebase project must be billing-enabled before Firebase Functions secrets or deploy are attempted. If a payment method/account step is platform-enforced, open that gate and poll metadata after completion rather than asking the user to reply `готово`. Provide the project-specific URL when browser UI is required:

```text
https://console.firebase.google.com/project/<FIREBASE_PROJECT_ID>/usage/details
```

- Service readiness. Include all predictable service enablement in the single upfront authorization and enable/metadata-verify the complete set before credential promotion or deploy: Firebase, Identity Toolkit, Secure Token, Firestore, Secret Manager, Cloud Functions, Cloud Build, Artifact Registry, Cloud Run, Eventarc, Pub/Sub, and Cloud Storage.
- OpenAI API key setup path. Use `openai-platform-api-key`, but satisfy its credential-decision gate inside the one upfront authorization rather than with a standalone question. The manifest must be the next substantive message after safe credential inspection and include reuse versus new, proposed product-scoped key name, exact ignored staging destination, `OPENAI_API_KEY` env name, Google Secret Manager destination, post-upload deletion, and smoke-test use. Do not ask for creation or destination confirmation again or invoke a separate destination form after the secure hosted picker follow-up. Promote the staged key with `scripts/promote-openai-key.mjs`, which passes plaintext only through process stdin, metadata-verifies the product-scoped backend secret, and deletes only a dedicated staging file after success. Do not ask the user to paste or type the key in chat or Terminal.

  The backend secret resource name is generated internally with the default form `AGENTFOUNDRY_<PRODUCT_SLUG>_OPENAI_API_KEY`; it is not a separate confirmation question unless the user explicitly wants to reuse another per-project secret.
- First AI-agent use case.
- Runtime target: connected real iPhone when available and usable; otherwise iOS Simulator.
- App Icon brief: product purpose, audience, proposed single-symbol metaphor, product color story, stable prompt/master paths, and whether a desired symbol was user-provided.

Credentials and account access are not content inputs. Treat them as operational prerequisites that must be handled securely.

## Kickoff Communication

The proof should begin with read-only preflight followed by the one manifest defined in `upfront-authorization.md`, not a chain of blocker questions. The agent should state:

- What it will do itself: create/select Firebase, scaffold/build iOS and backend, deploy when prerequisites are ready, run smoke tests, and write the report.
- What the single authorization covers: scaffold, project creation/reuse, billing/Blaze, required services, Anonymous Auth, Firestore, OpenAI key reuse/creation and secure transfer, App Icon Image API generation/integration, deploy, narrow conditional IAM, and Apple configuration when applicable.
- The exact Firebase Blaze URL as soon as the project ID is known.
- Which platform-owned gates may still appear: payment method/account selection, OAuth/2FA, hosted OpenAI organization/project picker, OS permissions, Apple account/team setup, and physical device trust.

Never request a `готово` status message. When a platform-owned gate is open, report only that exact action, poll or consume the tool/widget result, metadata-verify it, and continue the one-shot proof path automatically.

## Command Ownership

The agent should run every command and browser/tool flow it can run itself. The single upfront authorization supplies approval for every exact persistent action and narrow conditional repair in its ledger. User-only actions are limited to platform-enforced payment method/account selection, browser login/OAuth/2FA/account consent, hosted OpenAI picker selection, local permission prompts, initial Apple account/team selection when tooling cannot perform it, and physical device trust actions.

Do not ask the user to run `npm` builds, Firebase deploys, direct backend `curl` smoke tests, Xcode/Tuist builds, or proof report updates when the agent can run them through tools. After the user completes a user-only step, the agent resumes with the next command and records the outcome.

Enabling Firebase Anonymous Auth requires project-specific approval in the initial ledger when it is not already enabled. After that single approval, the agent must enable/verify it and continue without another question.

Pre-authorize only predictable narrow conditional IAM in the initial ledger. For Firebase Functions Cloud Build source bucket read failures, this may cover a bucket-scoped `roles/storage.objectViewer` binding on `gs://gcf-v2-sources-<PROJECT_NUMBER>-<REGION>` for the exact service account from the error. Do not request or apply a project-wide role when the bucket-level binding is sufficient. A materially different IAM mutation remains outside the ledger.

For real iPhone signing, the agent should first try command-line device build. If Xcode requires a development team, only the initial team/account selection is user-only. After the user selects a team, the agent should extract `DEVELOPMENT_TEAM`, persist it into the Tuist/project configuration when appropriate, regenerate if needed, rerun device build/install/launch when tools allow it, and update the proof report.

## Output

The output is a verified product proof, not a full product:

- Selected SwiftUI iOS app.
- Minimal user interaction UI: chat list, new chat action, chat detail, message input, plain user messages, and line-by-line Markdown-rendered assistant/agent messages.
- AgentFoundry target/UI baseline from `agent-foundry-design`, persisted in project configuration rather than only generated Xcode UI state.
- Product-specific App Icon from `agent-foundry-app-icon`, with prompt/master artifacts, asset catalog integration, and compiled primary-icon metadata.
- Firebase backend.
- Server-side agent endpoint.
- Server-side OpenAI API key stored in a generated product/project-specific backend secret resource.
- Build/run verification.
- Proof report.

## Acceptance Checks

The setup is complete only when:

- The single upfront authorization ledger records product identity, local scope, backend project/region, billing decision, Firebase mutations, required services, OpenAI credential decision/destination, deployment, and any narrow conditional IAM/Apple scope.
- Firebase Pay as you go / Blaze readiness was confirmed before deployed Functions secrets/deploy.
- The agent ran all feasible build, deploy, smoke-test, and report-update commands itself; any user-run commands were limited to user-only actions.
- Any IAM repair was covered by the upfront ledger or by a genuinely necessary later scoped approval, applied at the narrowest sufficient scope, and followed by a rerun of deploy/smoke verification.
- Real iPhone verification was tool-verified when possible, or the report clearly states that a required Apple signing/team/device action was user-only and whether the agent later persisted/verified the signing configuration.
- A user can launch the selected iOS app.
- The selected iOS app passes the `agent-foundry-design` visual QA gate for changed first-party surfaces.
- The selected App Icon uses one ownable metaphor, is opaque 1024x1024 without pre-rounded corners, remains readable at 40x40, and has no text, watermark, UI mockup, or unintended category cliché.
- `actool` compiled `AppIcon`; the built app contains icon renditions and/or `Assets.car`; primary-icon metadata names `AppIcon`; and the build containing it was installed/launched on the selected runtime target.
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
- A generated logo PNG that was never wired into `AppIcon.appiconset`, or a successful build whose app bundle lacks primary-icon metadata/renditions.
- A transparent, text-bearing, pre-rounded, multi-symbol, unreadable-at-40px, or generic placeholder App Icon presented as final.
- An invented product name or bundle identifier used without inclusion in the confirmed upfront manifest.
- A Firebase/GCP project auto-selected from CLI output without user choice.
- Splitting scaffold, Firebase creation, billing, Anonymous Auth, Firestore, service enablement, OpenAI key setup, deploy, or predictable narrow IAM into serial permission questions instead of one upfront authorization.
- Asking the user to reply `готово` instead of verifying changed Firebase/GCP state directly.
- Asking the user to paste or type an OpenAI API key instead of using the secure Platform workflow and staged promotion.
- Asking for OpenAI key creation or local destination confirmation again when the confirmed upfront ledger already contains both.
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
