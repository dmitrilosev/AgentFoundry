# Proof Report Template

Write the proof report at the project root as `AGENTFOUNDRY_PROOF_REPORT.md` unless the user asks for another path.

Use this structure:

```md
# AgentFoundry Proof Report

## Summary

- Product:
- iOS app:
- Bundle identifier:
- Bundle identifier confirmation:
- Upfront authorization ledger:
- Backend:
- Backend project:
- Backend project decision:
- Firebase Anonymous Auth approval/status:
- Firebase Pay as you go / Blaze readiness:
- Agent runtime:
- AI provider:
- Agent response format:
- App Icon metaphor:
- App Icon prompt/master paths:
- Backend secret resource:
- Runtime target:
- Domain data model:
- Agent tools:

## Created

- ...

## Secret Handling

- Firebase plan status:
- OpenAI API key setup:
- Temporary key staging path/status:
- Backend secret resource:
- Client secret exposure check:
- Remaining secret actions:

## IAM Changes

- Upfront-authorized persistent IAM changes:
- Scope:
- Reason:
- Follow-up verification:

## iPhone Signing

- Connected device:
- Signing team selection:
- DEVELOPMENT_TEAM:
- Persistence location:
- Device build:
- Device launch:

## App Icon

- Product purpose/audience:
- Selected metaphor and rationale:
- Palette/material direction:
- Detailed English prompt path:
- Opaque 1024x1024 master path:
- 40x40 inspection:
- Asset catalog path:
- Project-graph resource integration:
- `actool` result:
- Built bundle icon renditions/`Assets.car`:
- Primary-icon metadata:
- Installed build target/result:

## Verification

- iOS app build:
- App Icon generation/integration:
- App Icon bundle/runtime verification:
- Backend build:
- Backend deploy:
- Domain data/tool tests:
- iOS app launch:
- End-to-end agent response:
- Assistant Markdown rendering:
- Assistant blank-line preservation:

## Commands

Agent-run:

- ...

User-only:

- ...

Passed:

- ...

Failed or not run:

- ...

## Blockers

- ...

## Next Step

- ...
```

Rules:

- Do not include secret values.
- Include concrete commands and outcomes.
- State the single upfront authorization manifest and confirmation without secret values. Distinguish covered actions from any genuinely unforeseeable later authorization.
- State whether the product name, bundle identifier, and backend project were user-provided or included in the confirmed manifest.
- State whether Firebase Anonymous Auth was already enabled or covered by the upfront ledger, and whether the agent verified/enabled it before e2e smoke testing.
- State whether Firebase Pay as you go / Blaze readiness was confirmed before backend secrets/deploy or whether the project is still on No-cost / Spark pending switch.
- If the product required durable domain records beyond chat history, document the Firestore paths, ownership/organization scope, required indexes, rules/backend-only access policy, DTO schemas, and whether domain data/tool tests passed.
- If OpenAI Agents SDK tools were added for domain operations, document each tool name, allowed operation, validation/conflict behavior, approval-gated side effects, and smoke-test outcome.
- State whether the OpenAI API key was reused or created through the secure Platform workflow, the ignored staging path, whether the dedicated staging file was removed, and the generated backend secret resource. Do not include the key value.
- Record persistent IAM changes separately. Include the exact role, member, resource scope, authorization-ledger coverage, error evidence, and the deploy/smoke verification that followed.
- Record real iPhone signing separately. State whether team selection was user-only, whether `DEVELOPMENT_TEAM` was persisted into source/project config, and whether the agent tool-verified device build/launch.
- Record the App Icon separately. Include the single-symbol metaphor, final English prompt path, final opaque master path, 40x40 result, asset catalog location, `actool` output, built bundle renditions/`Assets.car`, primary-icon metadata, and installed runtime target. Do not mark it complete from a generated PNG alone.
- Record assistant/agent Markdown rendering separately. State whether the backend returned Markdown in a documented field and whether the iOS app used QChat-style line-by-line rendering with `.inlineOnlyPreservingWhitespace`, per-line fallback, and preserved blank lines rather than raw plain text or dropped spacing.
- If the end-to-end agent path did not work, say so directly.
- If a local emulator was used during development, state that it did not replace deployed backend verification.
- Recommend product scoping or feature decomposition only after the chat path is verified.
