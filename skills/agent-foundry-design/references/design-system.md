# AgentFoundry iOS 26 Design System

Use this reference when creating or redesigning AgentFoundry SwiftUI surfaces.

## Visual Concept

AgentFoundry products should feel like native Apple productivity software for AI-native workflows: calm enough for repeated work, vivid enough to feel modern, and tactile enough to make generated artifacts feel real.

Default concept ingredients:

- A full-window/screen background scene made from product-specific color fields, subtle gradients, or real product imagery when relevant.
- Floating Liquid Glass controls for top-level navigation, primary actions, input bars, and high-value artifact cards.
- Rounded, layered surfaces with depth and separation instead of boxy rectangles.
- Dense but readable product information. Avoid marketing hero layouts inside tools.
- Motion that clarifies state changes: generating, selecting, opening detail, switching between Agent and artifact.

## Target And Availability

- New SwiftUI AgentFoundry apps: iOS 26.1 minimum deployment target when local Xcode supports it.
- Existing apps with lower support: use `#available(iOS 26, *)` around Liquid Glass API usage and keep a native material fallback.
- Persist targets in Tuist/project settings, not only in generated Xcode UI.

Example fallback shape:

```swift
@ViewBuilder
func dfGlassSurface<Content: View>(
  cornerRadius: CGFloat = 28,
  interactive: Bool = false,
  @ViewBuilder content: () -> Content
) -> some View {
  let shape = RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)

  if #available(iOS 26, *) {
    content()
      .padding()
      .glassEffect(interactive ? .regular.interactive() : .regular, in: .rect(cornerRadius: cornerRadius))
  } else {
    content()
      .padding()
      .background(.ultraThinMaterial, in: shape)
      .overlay(shape.stroke(.white.opacity(0.18), lineWidth: 1))
  }
}
```

Tailor this to the project's Swift version and API availability. Prefer a real project component over copying this helper everywhere.

## Tokens

Create tokens as Swift code, not magic numbers scattered through feature views.

Recommended roles:

- `DFColor.background`: app background.
- `DFColor.backgroundAccent`: product-specific ambient color.
- `DFColor.surfaceGlassTint`: subtle tint for glass surfaces.
- `DFColor.surfaceElevated`: non-glass fallback/elevated surface.
- `DFColor.textPrimary`, `textSecondary`, `textTertiary`.
- `DFColor.accent`, `success`, `warning`, `danger`.
- `DFRadius.control`, `card`, `panel`, `sheet`, `capsule`.
- `DFSpacing.xs/s/m/l/xl`.
- `DFShadow.soft`, `floating`, `prominent`.

Use system colors and semantic roles where possible. Avoid a one-note palette dominated by one hue. Use product-specific accents as highlights, not as a whole-screen wash.

## Components

Core components for new AgentFoundry UI:

- `DFBackgroundScene`: product-specific background, safe-area aware.
- `DFGlassPanel`: grouped surface for navigation, state summaries, and focused tools.
- `DFGlassCard`: tappable repeated domain object or artifact preview.
- `DFFloatingInputBar`: chat/composer input with send action and disabled/generating states.
- `DFIconButton`: 44x44 minimum hit area, symbol-first, tooltip/accessibility label where relevant.
- `DFPrimaryButton` and `DFSecondaryButton`: native glass styles on iOS 26, material fallback elsewhere.
- `DFSegmentedControl`: stable width, no layout jump between segments.
- `DFStatusView`: loading, empty, failed, partial, stale, and generating states.
- `DFAgentMarkdownText`: assistant/agent Markdown renderer, styled by the design system.
- `DFArtifactInlineCard`: compact typed artifact card used inside chat.

## Layout

- Use safe-area-aware backgrounds and `safeAreaInset` for floating input/toolbars.
- Leave visual breathing room around glass surfaces and shadows.
- Keep repeated lists stable: row height can grow for content, but selection, icons, and action areas should not jump.
- Use `containerRelativeFrame`, `ViewThatFits`, `Grid`, or explicit min/max dimensions when controls need stable geometry.
- Avoid fixed heights for text-heavy cards and message bubbles.
- Avoid nested cards. If a card needs subgroups, use dividers, labels, or subtle background bands inside the same surface.

## Chat Surface

- Chat list should show durable sessions, generation status, last message preview, and clear new-chat affordance.
- Chat detail should keep messages readable and place rich artifact previews outside assistant text chrome.
- The input bar should feel native and reachable, with disabled/generating states and a clear send icon button.
- On new-chat and chat composer screens, tapping free/non-interactive space dismisses the keyboard. Prefer SwiftUI focus state or the app-approved keyboard dismissal helper; do not use a global gesture that steals taps from message rows, cards, links, scroll views, or controls.
- Assistant Markdown should be rendered through a reusable design-system component. Preserve intentional blank lines and avoid exposing raw Markdown markers.
- Background polling must not navigate the user into a restored/generating chat automatically; preserve selection ownership.

## Artifact Surface

- Inline card: small, tactile, tappable, tied to a durable artifact id or known message payload.
- Detail screen: full product surface with its own navigation, state, and restore behavior.
- Use tabs/segmented controls/charts/maps/lists only when the underlying artifact data exists.
- Preserve artifact context when switching `Artifact -> Agent -> Artifact`: selected tab, scroll position, map pin, comparison row, or current item where practical.

## Motion

Use motion to clarify state:

- Soft card reveal when an artifact becomes ready.
- Subtle progress/glass shimmer while a backend run is generating.
- Matched transitions only when hierarchy actually changes and the project can implement them cleanly.
- Respect Reduce Motion and avoid constant decorative animation.

## Anti-Patterns

- Square gray cards and rectangular buttons.
- Web-dashboard sidebars copied into iPhone layouts.
- Raw JSON/debug inspector output as user-facing UI.
- Placeholder cards presented as real data.
- Custom blur stacks when native Liquid Glass APIs are available.
- Card-in-card page layouts.
- Tiny icon-only controls without a 44x44 hit area.
- Clipped shadows caused by parent masks, scroll clipping, or tight padding.
