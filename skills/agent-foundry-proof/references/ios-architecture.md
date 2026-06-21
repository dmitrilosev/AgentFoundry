# iOS Architecture Guardrails

Use the user's supplied architecture template when available. These guardrails are fallback rules for the first production-proof iOS slice.

For new SwiftUI iOS AgentFoundry projects, also read `agent-foundry-modern-ios-base.md` and the peer `../../agent-foundry-design/SKILL.md`; treat them as the default architecture and design bases.

## Principles

- Keep SwiftUI views declarative and thin.
- Put network calls in services/clients, not views.
- Prefer TCA feature state, actions, reducers, dependencies, and SwiftUI views for new AgentFoundry projects.
- Keep domain models separate from transport DTOs.
- Keep preview/sample data out of production paths.
- Prefer small feature folders over one large app-wide file.
- Avoid global singleton sprawl.
- Avoid creating a polished-looking mock that cannot connect to the backend.

## Suggested Structure

Use the existing project conventions when present. For a new project, prefer a structure like:

```text
App/
  AgentFoundryApp.swift
  AppDelegate.swift
  RootFeature.swift
Modules/
  Core/
    DesignSystem/
    Models/
    Logger/
  Platform/
    Networking/
    FirebaseClient/
    AuthClient/
    RemoteConfigClient/
  Features/
    Chat/
      Interface/
      Sources/
      Testing/
      Tests/
      Example/
Tuist/
  Templates/
    TCAFeature/
```

The names may change to match the product. The separation should not.

For a new modular project, prefer Tuist for the project graph and scaffolding plus SPM for dependencies. Do not use Firebase SDK imports directly inside feature modules.

## Minimum Chat UI

The first working UI must include:

- Chat list.
- New chat button.
- Chat screen.
- Scrollable message transcript.
- Text input.
- Send action.
- Loading state while waiting for the backend.
- Error state when the backend fails.
- Rendered backend agent response.

## Agent Markdown Messages

Assistant/agent messages returned from the backend are Markdown content. Render them as Markdown in the chat transcript using the QChat-style line renderer.

Rules:

- Keep user-authored messages as plain text unless the product explicitly supports user Markdown composition.
- Render assistant/agent messages through a dedicated SwiftUI component, such as `AgentMarkdownMessageView`, instead of calling `Text(rawString)` directly.
- Normalize `\r\n` and `\r` to `\n` before rendering.
- Split the normalized message with `components(separatedBy: "\n")`, not with APIs that drop empty subsequences.
- Render each line as its own SwiftUI `Text` row in a leading-aligned `VStack(spacing: 0)`.
- Preserve empty lines by rendering a plain whitespace row, such as `Text(verbatim: " ")`, instead of dropping them.
- Parse each non-empty line with `AttributedString(markdown:options:)` using `interpretedSyntax: .inlineOnlyPreservingWhitespace` and `failurePolicy: .returnPartiallyParsedIfPossible`.
- Fall back to `Text(verbatim: line)` only when per-line Markdown parsing fails.
- Do not use full-block Markdown rendering as the default for agent bubbles. The first proof should match QChat's inline-only, whitespace-preserving behavior so the chat transcript layout stays stable.
- Keep Markdown parsing and rendering inside the UI/design-system layer. Networking clients should decode Markdown strings; reducers should store Markdown strings; views should render them.
- Style parsed lines so emphasis, links, inline code, bullet/numbered line text, and preserved blank rows are readable in both light and dark mode.
- Make link taps explicit and safe. Use `openURL` or the project's approved link router rather than custom string scanning in the feature reducer.
- Preserve Dynamic Type and avoid fixed-height message bubbles that clip multi-line Markdown.

Reference implementation shape:

```swift
private func normalizedAgentMarkdown(_ text: String) -> String {
  text
    .replacingOccurrences(of: "\r\n", with: "\n")
    .replacingOccurrences(of: "\r", with: "\n")
}

@ViewBuilder
private func agentMarkdownText(_ text: String) -> some View {
  let normalizedText = normalizedAgentMarkdown(text)

  VStack(alignment: .leading, spacing: 0) {
    ForEach(Array(normalizedText.components(separatedBy: "\n").enumerated()), id: \.offset) { _, line in
      if line.isEmpty {
        Text(verbatim: " ")
      } else if let markdownText = try? AttributedString(
        markdown: line,
        options: AttributedString.MarkdownParsingOptions(
          interpretedSyntax: .inlineOnlyPreservingWhitespace,
          failurePolicy: .returnPartiallyParsedIfPossible
        )
      ) {
        Text(markdownText)
      } else {
        Text(verbatim: line)
      }
    }
  }
}
```

Suggested DTO/model naming:

```swift
struct AgentReplyResponse: Decodable, Equatable {
  var replyMarkdown: String
}

enum ChatMessageRole: Equatable {
  case user
  case assistant
}

struct ChatMessage: Equatable, Identifiable {
  var id: UUID
  var role: ChatMessageRole
  var body: String
}
```

The field may be named differently to match an existing API, but the code should make the Markdown contract obvious. Do not leave agent Markdown as an undocumented generic `text` field if the app renders roles differently.

## Networking

The iOS app should call the backend through a typed client:

- Build request DTOs explicitly.
- Decode response DTOs explicitly.
- Keep base URLs/config in a config object.
- Inject backend clients through TCA dependencies for new AgentFoundry SwiftUI projects.
- Do not store OpenAI secrets in the app.
- Do not call OpenAI directly from the app.

For the first proof, persistence can be in-memory unless Firebase Auth/Firestore is already included in the user's template. If chat persistence is added, keep it behind a service boundary.

## Target Baseline

Use the AgentFoundry target baseline from `agent-foundry-design`. Persist the value in the Tuist project graph or shared settings source so regenerated projects keep the same target.

## Real iPhone Signing

Prefer a connected real iPhone over Simulator when available and usable. The agent should own as much of the device path as possible:

- Discover connected devices with Xcode tooling or `xcrun devicectl list devices`.
- Check destinations with `xcodebuild -showdestinations`.
- Try the command-line device build first.
- If the build fails with `requires a development team` or similar signing errors, treat only the team/account selection as user-only.

When the user must choose a team in Xcode, open the workspace/project for them when possible and give precise navigation:

- Select the app under `TARGETS`, not the top-level project under `PROJECT`.
- Open `Signing & Capabilities`.
- Enable or keep `Automatically manage signing`.
- Choose the available Apple ID / Personal Team / paid team.
- Select the connected iPhone and press Run, or tell the agent when the team is selected.

After the user selects the team or confirms the app ran, the agent resumes:

- Read `DEVELOPMENT_TEAM`, `CODE_SIGN_STYLE`, and `PRODUCT_BUNDLE_IDENTIFIER` from `xcodebuild -showBuildSettings` or the generated `project.pbxproj`.
- If the project is Tuist-generated, persist the selected `DEVELOPMENT_TEAM` in `Project.swift` or the local project configuration rather than relying only on manual generated-project edits that may be lost after `tuist generate`.
- Do not consider signing persistence complete until the project has been regenerated if necessary and `xcodebuild -showBuildSettings` still reports the selected `DEVELOPMENT_TEAM`.
- Regenerate if needed.
- Rerun command-line build/install/launch on the real iPhone when tool access allows it.
- Record the signing status and exact verification command in the proof report.

Do not mark real iPhone verification complete just because the user selected a team; verify the device build/launch through tools when possible, or state that launch was user-confirmed but not tool-verified.

## Verification

Verify with command-line build or available Xcode/MCP tools. A successful implementation needs both:

- Build success.
- Runtime chat response from the backend.
- Markdown rendering verification for assistant/agent messages, using a backend response or test fixture that includes inline emphasis, a link, inline/code-style text, multiple non-empty lines, and at least one intentional blank line that remains visible.

Do not report success from screenshots, previews, or static UI alone.
