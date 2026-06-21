# AgentFoundry Modern iOS Project Base

Use this as the default foundation for new SwiftUI iOS AgentFoundry products unless the user supplies a stronger project template.

## Default Decisions

- Use SwiftUI for the product surface.
- Use The Composable Architecture for feature state, actions, reducers, effects, navigation, dependencies, previews, and tests.
- Use Tuist for the project graph, generated Xcode project, target templates, feature scaffolding, schemes, settings, resource wiring, and CI-friendly structure.
- Use Swift Package Manager for third-party dependencies, including TCA, Firebase, and supporting packages. Do not frame this as Tuist versus SPM; use Tuist plus SPM.
- Apply the `agent-foundry-design` target and UI baseline, and make the generated project buildable immediately from command line or approved Xcode tooling.
- Use Firebase through platform/client adapters only. Do not import Firebase SDKs from feature modules, reducers, or SwiftUI views.
- Keep AI provider calls on the backend. The iOS app talks to the user's backend, never directly to OpenAI or another AI provider.
- Render backend assistant/agent messages in the iOS UI with the QChat-style line Markdown renderer. User messages can remain plain text.

## Project Shape

For a new iOS project, prefer this shape:

```text
App/
  Sources/
    AgentFoundryApp.swift
    AppDelegate.swift
    RootFeature.swift
  Resources/
    GoogleService-Info-Debug.plist
    GoogleService-Info-Release.plist

Modules/
  Core/
    DesignSystem/
      MarkdownText/
    Models/
    Logger/
    AnalyticsClient/
    FeatureFlagsClient/
    KeychainClient/

  Platform/
    Networking/
    FirebaseClient/
    AuthClient/
    RemoteConfigClient/
    PushNotificationsClient/
    CrashlyticsClient/

  Features/
    Home/
    Auth/
    Profile/
    Settings/

Tuist/
  Package.swift
  ProjectDescriptionHelpers/
  Templates/
    TCAFeature/

Project.swift
Workspace.swift
```

Keep names aligned with the product. Preserve the boundaries even when names change.

## Design Baseline

New AgentFoundry SwiftUI products must use `agent-foundry-design` as the source of truth for target version, Liquid Glass, design system, visual redesign, clickability, and shadow/clipping QA.

Read the peer skill `../../agent-foundry-design/SKILL.md` before creating or changing user-facing SwiftUI UI.

## Module Responsibilities

- App is the composition root: lifecycle, Firebase configuration, root store, environment selection, and top-level routing only.
- Core modules contain reusable product-neutral code such as design system, shared models, logging, analytics interfaces, feature flag interfaces, and keychain interfaces.
- Platform modules contain concrete adapters for external systems: URLSession networking, Firebase Auth, Firestore, Functions, Remote Config, Messaging, Crashlytics, and analytics adapters.
- Feature modules contain user-facing TCA features and should depend on client interfaces, not concrete platform SDKs.
- Shared domain modules are allowed only when at least two features really share the same domain concept.

## Agent Markdown Rendering

New AgentFoundry chat surfaces should include a design-system Markdown text component for assistant/agent messages. The default behavior should match QChat: line-by-line rendering, inline-only Markdown parsing, whitespace preservation, and explicit blank-line rows.

Rules:

- Keep the backend response as Markdown string data in models/state.
- Render user messages as plain text by default.
- Render assistant/agent messages through a reusable component such as `AgentMarkdownText` or `MarkdownText`.
- Normalize line endings, split with `components(separatedBy: "\n")`, and render every resulting line.
- Preserve blank lines by rendering a whitespace text row instead of dropping empty components.
- Parse each non-empty line with `AttributedString(markdown:options:)` using `.inlineOnlyPreservingWhitespace` and `.returnPartiallyParsedIfPossible`.
- Fall back to verbatim text per line only when Markdown parsing fails.
- Do not default to a block-level Markdown renderer for agent bubbles. Add one only for a product-specific rich document surface, not for the first chat proof.
- Keep the renderer theme aligned with the product design system: text color, link color, inline code treatment, line spacing, and Dynamic Type.
- Verify that inline Markdown syntax is not visible as ordinary unformatted text in assistant bubbles and that blank lines are preserved.

## TCA Feature Module Template

Before generating a feature, read `tca-feature-template.md` for the concrete file skeleton.

For each feature, prefer targets or folders equivalent to:

```text
Features/Profile/
  Interface/
    ProfileRoute.swift
    ProfilePublicModels.swift

  Sources/
    ProfileFeature.swift
    ProfileView.swift
    ProfileDestination.swift
    ProfileAnalytics.swift
    ProfileStrings.swift

  Testing/
    ProfileMocks.swift
    ProfilePreviewState.swift

  Tests/
    ProfileFeatureTests.swift

  Example/
    ProfileExampleApp.swift
```

Use these dependency rules:

- `ProfileInterface` has no dependency on TCA, Firebase, or concrete platform SDKs.
- `Profile` depends on `ProfileInterface`, TCA, DesignSystem, and required client interfaces.
- `ProfileTesting` depends on `ProfileInterface` and provides mocks and preview helpers.
- `ProfileTests` depends on `Profile`, `ProfileTesting`, and TCA test tools.
- `ProfileExample` depends on `Profile` and `ProfileTesting`.

## TCA Implementation Rules

- Use `@Reducer`, `@ObservableState`, `Action`, `@Dependency`, and `Effect`.
- Use async/await for backend work.
- Use dependency clients instead of service locators and global singletons.
- Keep SwiftUI views declarative and thin.
- Keep transport DTOs separate from domain models and feature state.
- Put navigation in TCA destinations or the project-approved TCA navigation pattern.
- Test reducers with `TestStore`.
- Prefer Swift Testing (`@Test`, `@Suite`) for new tests unless the existing project requires XCTest.

## Networking Base

Create a `Platform/Networking` module with typed boundaries:

- `HTTPClient`
- `Endpoint`
- request DTOs
- response DTOs
- `RequestBuilder`
- `ResponseDecoder`
- auth middleware
- retry policy
- `NetworkError`

Use `URLSession` and async/await by default. Add Apollo or another GraphQL client only when the product actually needs GraphQL, and keep it in a separate platform/client module.

## Firebase Base

- Add Firebase through SPM.
- Configure Firebase only in the App layer.
- In SwiftUI apps, use an app delegate adapter when Firebase setup or notifications require app delegate hooks.
- Keep `GoogleService-Info` files in app resources and wire environment-specific files through Tuist.
- Wrap Firebase Auth, Firestore, Functions, Remote Config, Messaging, Analytics, and Crashlytics in platform client modules.
- Never expose Firebase concrete types as feature API unless the user explicitly accepts that coupling.
- Never store AI provider secrets in Firebase plist files, app resources, client source, or client logs.

## Scaffolding Rule

For a new AgentFoundry SwiftUI iOS project, create a Tuist scaffold/template named `TCAFeature` before building multiple features. The scaffold should generate the feature module targets, base TCA files, test file, example app target, and project registration. Do not rely on Xcode file templates for the core architecture.

## Target Baseline

Use the target baseline from `agent-foundry-design`. Persist it in the Tuist project graph or shared settings source, not only in generated Xcode UI state.

## Verification

Before calling the base complete:

- Generate the project with Tuist.
- Verify the generated project satisfies the `agent-foundry-design` target baseline.
- Verify the first UI passes the `agent-foundry-design` visual QA gate.
- Build the app target.
- Run at least one reducer test for the generated TCA feature.
- Verify no feature module imports Firebase SDKs directly.
- Verify the first user action reaches the backend through a typed client.
- Verify assistant/agent Markdown renders line-by-line in the chat UI, parses inline Markdown with whitespace preserved, and keeps blank lines as visible rows.
