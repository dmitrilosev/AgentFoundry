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
- Backend:
- Backend project:
- Backend project decision:
- Firebase Anonymous Auth approval/status:
- Firebase Pay as you go / Blaze readiness:
- Agent runtime:
- AI provider:
- Agent response format:
- Backend secret resource:
- Runtime target:
- Domain data model:
- Agent tools:

## Created

- ...

## Secret Handling

- Firebase plan status:
- OpenAI API key setup:
- Backend secret resource:
- Client secret exposure check:
- Remaining secret actions:

## IAM Changes

- User-approved persistent IAM changes:
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

## Verification

- iOS app build:
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
- State whether the product name, bundle identifier, and backend project were user-provided or explicitly confirmed.
- State whether Firebase Anonymous Auth was already enabled or explicitly approved by the user, and whether the agent verified/enabled it before e2e smoke testing.
- State whether Firebase Pay as you go / Blaze readiness was confirmed before backend secrets/deploy or whether the project is still on No-cost / Spark pending switch.
- If the product required durable domain records beyond chat history, document the Firestore paths, ownership/organization scope, required indexes, rules/backend-only access policy, DTO schemas, and whether domain data/tool tests passed.
- If OpenAI Agents SDK tools were added for domain operations, document each tool name, allowed operation, validation/conflict behavior, approval-gated side effects, and smoke-test outcome.
- State whether the OpenAI API key was loaded through the secure terminal prompt and stored in the generated backend secret resource. Do not include the key value.
- Record persistent IAM changes separately. Include the exact role, member, resource scope, user approval, and the deploy/smoke verification that followed.
- Record real iPhone signing separately. State whether team selection was user-only, whether `DEVELOPMENT_TEAM` was persisted into source/project config, and whether the agent tool-verified device build/launch.
- Record assistant/agent Markdown rendering separately. State whether the backend returned Markdown in a documented field and whether the iOS app used QChat-style line-by-line rendering with `.inlineOnlyPreservingWhitespace`, per-line fallback, and preserved blank lines rather than raw plain text or dropped spacing.
- If the end-to-end agent path did not work, say so directly.
- If a local emulator was used during development, state that it did not replace deployed backend verification.
- Recommend product scoping or feature decomposition only after the chat path is verified.
