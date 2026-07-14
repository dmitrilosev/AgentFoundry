# AgentFoundry Product Workspace Language

## Golden Reference

TravelPlanner2 is the golden reference for AgentFoundry product composition and finish. Distill its design language; do not copy its travel vocabulary, itinerary structure, maps, destinations, or palette literally.

The transferable idea is an **atmospheric product workspace**: a durable product object is visually primary, the agent remains continuously available, and navigation preserves context between them. Color, glass, depth, and motion clarify that hierarchy instead of decorating a stack of cards.

## Product Hierarchy

Design every agent product as three cooperating layers:

1. **Navigation and continuity** — session history, product mode, selected object, and return paths.
2. **Durable workspace** — the plan, case, order, shortlist, tracker, document, booking, or other product object that remains useful after chat.
3. **Agent presence** — conversation, status, suggestions, and a floating composer that can modify or explain the selected object.

The durable workspace gets the largest visual area and strongest information hierarchy. The agent is not a full-screen wall of bubbles when a useful product object exists. Switching layers must preserve the selected session, artifact, scroll position where practical, and in-progress state.

## Atmospheric Color System

Build a product-specific color story with semantic roles:

- **Primary field:** the product's dominant mood and selection color.
- **Secondary field:** a cooler or deeper counterpoint that creates spatial depth.
- **Warm signal:** a sparingly used contrasting hue for momentum, urgency, or important moments.
- **Ambient glow:** low-opacity color fields behind content, not opaque color on every component.
- **Semantic colors:** success, warning, danger, stale, and selection remain distinguishable from brand accents.

Use two or three broad gradients or radial fields to give the app a recognizable atmosphere. Mix them with system grouped backgrounds and native materials so content remains readable in light and dark appearance. Avoid a monochrome tint wash and avoid reproducing TravelPlanner2's ocean/sunset/iris values unless they truly fit the product.

## Geometry And Depth

Use a coherent soft geometry instead of individually rounded boxes:

- Hero or primary workspace: 32–36 pt continuous corner radius.
- Major panels and artifact previews: 26–30 pt.
- Composer and prominent controls: 20–24 pt.
- Compact rows, chips, and badges: 16–18 pt.
- Minimum interactive hit area: 44×44 pt.

Use white or semantic hairline strokes at low opacity, soft shadows with vertical separation, and enough outer padding that shadows are not clipped. Keep large surfaces visually calm. Elevate only the selected object, primary action, floating input, or temporarily active tool.

## Liquid Glass Roles

Liquid Glass is navigation and interaction material, not the page wallpaper.

Good uses:

- Floating composer and contextual toolbars.
- Selected artifact preview or mode control.
- Tappable inline agent cards.
- Transient sheets, action trays, and compact controls over atmospheric content.

Prefer solid or system-material surfaces for dense text, long lists, forms, charts, and critical values. Interactive glass is reserved for interactive elements. Related glass controls belong in one `GlassEffectContainer` when visual merging helps explain their relationship.

## Workspace Composition

Use a clear top-to-bottom reading order:

1. Compact navigation and object identity.
2. Hero summary with title, current state, and one important outcome.
3. Small metric or status strip when the domain has meaningful measures.
4. Stable selector or horizontal preview rail for stages, options, dates, cases, or versions.
5. Native detail surface: timeline, list, map, chart, checklist, document, comparison, or form.
6. Contextual safe actions.
7. Floating agent composer anchored to the safe area.

Do not force every product to have every layer. A metrics strip without meaningful metrics or a carousel with one item is decorative noise.

Horizontal selectors and carousels keep stable card dimensions, predictable snapping, and visible next-item affordance. They must not jump height as selection changes. Dense detail content should use native lists, grids, charts, maps, or forms rather than nested glass cards.

## Artifact-First Detail Surfaces

An artifact detail screen must answer without requiring the transcript:

- What is this object?
- What state is it in?
- What changed or matters now?
- What can the user safely do next?
- What information is missing or stale?

Use domain-native components. A plan may use phases or a timeline; a case may use evidence and next actions; an order may use line items and fulfillment; a tracker may use trends and checkpoints. The universal language is hierarchy, continuity, and atmosphere—not a universal card layout.

Inline chat cards are compact pointers to the artifact. They show identity, readiness, two or three useful facts, and one clear open action. They do not duplicate the full detail screen.

## Agent And Composer

The composer floats above the safe area with generous internal spacing, a clear focus state, a 44 pt send target, and room for multi-line input. It stays visually connected to the selected product object. Suggested prompts are contextual actions, not generic marketing examples.

Assistant Markdown remains text-forward. Put rich artifact cards adjacent to the relevant assistant message rather than inside text bubble chrome. Generation progress should appear on the affected artifact and in the conversation without forcing navigation.

## State And Motion

Treat state changes as part of the design system:

- Empty: explain the outcome and offer one meaningful starting action.
- Loading/restoring: preserve geometry and identify what is being restored.
- Generating: show progress on the affected object without fake completion.
- Needs input/partial/stale: identify the gap and provide the smallest next action.
- Failed: retain existing valid content and offer recovery.
- Restored: return to the prior context without surprising navigation.

Use subtle spring or ease motion for selection, surface switching, card reveal, and progress completion. Motion establishes continuity; it must not delay input, obscure status, or animate the whole screen on every update.

## Adaptive Layout

Compact width favors one primary workspace with sheets or navigation destinations for detail. Regular width may show navigation/session continuity beside the durable workspace and keep the agent in a secondary column or inspector. Both layouts use the same hierarchy and product object identity; regular width is not a stretched phone screen.

Respect Dynamic Type, Reduce Motion, Increase Contrast, keyboard safe areas, and VoiceOver order. Atmospheric fields may simplify under accessibility settings, but content and state must not depend on color or blur.

## Translation Test

Before implementation, complete this sentence:

> This product feels like **[domain mood]**; its durable workspace is **[core object]**; the agent helps by **[continuous capability]**; the warm signal means **[specific semantic moment]**.

If the answer still uses travel terms for a non-travel product, the design has not been distilled far enough. If removing color and glass destroys the information hierarchy, the underlying composition is not strong enough.
