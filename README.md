# AgentFoundry

Agent Foundry is an open-source Codex Skill Pack for building production-ready AI-native products: SwiftUI iOS apps using TCA / The Composable Architecture, Firebase backends, and backend-owned AI agent runtimes powered by the OpenAI Agents SDK.

A single builder can now do the work of a product team. With models like GPT-5.5 and tools like Codex, the cost of turning an idea into a working product is collapsing from weeks to hours.

Production products still need good architecture, secure handling of secrets, durable state, auth, approvals, release discipline, and product judgment. Models are powerful, but they do exactly what you tell them to do. To build real products, you need to encode real product-building experience into the workflow.

Agent Foundry is my answer. I build products as a founder and AI Product Lead across very different scales: from early ideas that move from concept to reality quickly, to consumer platforms used by 14M-65M monthly active users. Today, I build and launch AI-native products in real environments, with real users, partners, constraints, security requirements, and release pressure.

Agent Foundry turns that experience into reusable Codex Skills.

It packages product thinking, engineering patterns, AI agent architecture, release workflows, and safer defaults into a system that helps founders, PMs, and engineers build serious AI-native products faster.

The goal is to make real product creation dramatically more accessible.

## Who This Is For

Agent Foundry is for builders who want to go from idea to production-ready AI-native product from day one.

It is built for:

- CPOs, product leads, and product managers who have a product idea and want to turn it into a real AI-native iOS product.
- Founders who want to move from idea to working product faster without skipping the hard product and architecture decisions.
- Developers and engineering teams building SwiftUI iOS apps with Firebase backends and server-side OpenAI Agents SDK runtimes.
- Data scientists and AI engineers who want to turn models, research, or agent workflows into production-ready mobile products.
- Teams that need agents to generate useful native product interfaces, not only text responses.
- Products that need a self-improving loop: analyze user conversations, propose product improvements, prepare approved changes, create PRs, and move updates through the repository and release workflow.

## Reliability And Safety

AgentFoundry is designed to help teams build AI-native products with reliable architecture, safer defaults, and current Codex/OpenAI agent practices instead of one-off demo code.

It encodes patterns for:

- Server-side provider secrets.
- Firebase-authenticated app identity.
- Durable Firestore-backed chat, session, message, and artifact state.
- Backend-owned OpenAI agent runs.
- Explicit approvals before risky, costly, external, or user-visible side effects.
- Native SwiftUI rendering instead of raw model JSON.
- Restore behavior, visual QA, release notes, and reviewed product evolution.
- Current Codex and OpenAI Agents SDK patterns, so products can adopt newer model and agent-runtime capabilities as the stack evolves.

OSS maintenance, testing credits, and sponsorship support regression testing, examples, documentation, safety reviews, and safer releases.

## What Is Included

| Skill | Codex ID | Use It To | Output |
|---|---|---|---|
| AgentFoundry Proof | `agent-foundry-proof` | Build the first real product path for an idea: iOS app, Firebase backend, and server-side OpenAI agent runtime. | A production-ready SwiftUI iOS proof with Firebase backend, authenticated durable chat, and backend-owned OpenAI agents built on the OpenAI Agents SDK. |
| AgentFoundry Artifact UI | `agent-foundry-artifact-ui` | Turn useful agent outputs into durable typed artifacts and native product screens. | Typed durable artifacts, inline SwiftUI cards, renderer registry, and native detail or product surfaces. |
| AgentFoundry Design | `agent-foundry-design` | Apply the default AgentFoundry UI companion or bring a custom design direction or design system. | iOS 26.1 Liquid Glass baseline where supported, design-system rules, tap-target checks, accessibility, and visual QA gates. |
| AgentFoundry Proactive | `agent-foundry-proactive` | Make the product do useful agent work over time and notify users through native surfaces or push notifications. | A proactive system design for watchers, signals, tasks, approvals, notifications, and native UX. |
| AgentFoundry Product Evolution | `agent-foundry-product-evolution` | Turn conversation evidence into reviewed product work and approved repository changes. | An approval-gated product-management loop that analyzes conversation memory, proposes product changes, creates Codex-ready tasks, and prepares PR/release output. |

## Architecture Stance

AgentFoundry assumes the iOS app should never own model secrets or agent behavior.

```text
iOS app
-> Firebase anonymous user
-> Firebase Auth ID token
-> Firebase Cloud Functions
-> backend-owned OpenAI Agents SDK runtime
-> Firestore durable chat/session/artifact state
-> SwiftUI renders Markdown, native cards, approvals, and detail surfaces
```

The backend owns provider credentials, identity verification, model calls, persistence, typed artifacts, async work, and external side effects.

The iOS app owns native rendering, navigation, input quality, restoration, accessibility, and approval surfaces.

## Install In Codex

Open Codex and use `skill-installer` to install these skills from `dmitrilosev/AgentFoundry`:

```text
Use $skill-installer to install AgentFoundry skills from dmitrilosev/AgentFoundry:
skills/agent-foundry-proof
skills/agent-foundry-artifact-ui
skills/agent-foundry-design
skills/agent-foundry-proactive
skills/agent-foundry-product-evolution
```

Restart Codex after installation so the new skills are available.

There is no build step for this repository.

## Start With One Prompt

Have a product idea? Open Codex in your app repository and start here:

```text
Use AgentFoundry Proof for: <your product idea>.
```

Example:

```text
Use AgentFoundry Proof for: an AI-native iOS app for my fitness club that lets members book personal training sessions by voice.
```

AgentFoundry will guide Codex through the first real product path: SwiftUI app, Firebase backend, authenticated durable chat, backend-owned OpenAI agents, native UI, approvals, and release-ready product structure.

## Build From There

Once the first product path exists, use the other AgentFoundry skills to turn it into a stronger product: native artifact UI, product design, proactive workflows, push notifications, approvals, and product-evolution loops.

### Turn Agent Output Into Native Product UI

```text
Use Agent Foundry Artifact UI.
When the agent creates a booking, training plan, membership recommendation, or schedule summary, save it as a durable typed artifact and render it as a native SwiftUI product surface with structured cards, editable fields, status, history, confirmation actions, and follow-up suggestions.
```

### Bring Your Product Design To Life

```text
Use Agent Foundry Design.
Bring my product design direction to life in SwiftUI. Use this style: <describe the brand, mood, references, design system, or visual direction>. Apply it consistently across onboarding, agent chat, native cards, approval screens, artifact detail views, empty states, loading states, error states, accessibility checks, and visual QA gates.
```

### Add Proactive Agent Behavior

```text
Use AgentFoundry Proactive.
Design proactive workflows for a fitness club app: remind members about upcoming sessions, suggest available slots when they miss a workout, notify them when a preferred trainer has an opening, ask for approval before changing bookings, and surface useful actions through push notifications and native iOS screens.
```

### Create A Product-Evolution Loop

```text
Use Agent Foundry Product Evolution.
Analyze approved user conversations, booking behavior, cancellations, repeated questions, and failed flows. Propose product improvements, create Codex-ready implementation tasks, prepare PR output, and let the product owner review, test, approve, and release changes through a controlled workflow.
```

## Business Use Cases

AgentFoundry can help turn practical business workflows into AI-native iOS products:

- Fitness clubs: voice booking, trainer discovery, workout reminders, membership upgrades.
- Clinics and wellness studios: appointment booking, intake flows, follow-up reminders, care plans.
- Beauty salons and barbershops: service selection, specialist booking, schedule changes, repeat visits.
- Restaurants and cafes: reservations, menu guidance, loyalty flows, private event requests.
- Real estate teams: property search, client qualification, viewing scheduling, follow-up workflows.
- Education and coaching businesses: lesson booking, progress tracking, homework plans, reminders.
- Local service companies: quote intake, technician scheduling, approvals, customer updates.
- Vertical SaaS products: chat, durable artifacts, approvals, workflow automation, and product evolution.

## Repository Structure

```text
AgentFoundry/
  README.md
  LICENSE
  skills/
    agent-foundry-proof/
      SKILL.md
      references/
      agents/openai.yaml
    agent-foundry-artifact-ui/
    agent-foundry-design/
    agent-foundry-proactive/
    agent-foundry-product-evolution/
```

Each skill directory contains the main skill instructions plus references that Codex loads only when the task needs them.

## Notes For First-Time Users

- Run these skills from the target app repository, not from this skill-pack repository.
- Expect the proof skill to ask for product name, bundle identifier, Firebase project decisions, Firebase Anonymous Auth approval, Firebase Blaze readiness, and server-side OpenAI API key setup.
- Do not paste API keys into chat. The proof skill references define a terminal-based secret setup path.
- The detailed hard gates live in each skill's `SKILL.md`. This README is only the entry point.

## Maintainer

Created and maintained by [Dmitrii Losev](https://github.com/dmitrilosev).

## License

MIT.
