# AgentFoundry Visual QA

Use this checklist before calling an AgentFoundry UI redesign complete.

## Build And Runtime

- Build the selected app target with command-line Xcode tooling or the approved project build tool.
- Run on a Simulator or real iPhone when available.
- Inspect the changed surfaces in light and dark appearance.
- Inspect at least one larger Dynamic Type size for text clipping in messages, cards, buttons, sheets, and toolbars.

## Required States

Verify visible states for changed workflows:

- First loading.
- Empty after load.
- Happy path with real or realistic backend data.
- Generating/in-flight.
- Partial or needs-input, when the domain supports it.
- Failure with retry or next action.
- Restored state after app relaunch or reload.

## Clickability

- Buttons, chips, cards, rows, close buttons, send buttons, toolbar items, and segmented controls have a 44x44 pt minimum hit area.
- Use `.contentShape` for tappable cards/rows whose visible content does not fill the hit area.
- Transparent overlays do not intercept taps unless intentionally interactive.
- Gesture priority is explicit when a card contains nested controls.
- Sheet drag areas, scroll views, and horizontal carousels do not fight primary taps.
- In new-chat and chat composer screens, tapping free/non-interactive space dismisses the keyboard, while message scrolling, card taps, links, and explicit controls still work.
- Card taps emit typed actions through feature state/reducers, not direct backend mutations from renderer views.

## Shadows And Clipping

- Shadows and glows remain visible on all sides where intended.
- Parent stacks/scroll views leave enough padding or margins for shadows.
- Avoid applying `.clipShape`, `.mask`, or `.clipped()` to a parent that should show child shadows.
- If a rounded background must clip its own contents, apply the shadow outside that clipped background layer.
- Use `.scrollClipDisabled()` where available for horizontally scrolling cards with outer shadows.
- Check bottom floating bars and sheet content for clipped blur/shadow near safe areas.

## Liquid Glass

- Group related glass elements with `GlassEffectContainer` when using native iOS 26 APIs.
- Use `.interactive()` only on elements that can actually be interacted with.
- Glass surfaces have consistent shapes and spacing.
- Glass is not used as a blanket effect over every row. Hierarchy remains readable.
- Fallback materials are acceptable only for existing lower-target apps.

## Accessibility And Polish

- Text remains readable over glass/backgrounds in both appearances.
- Icon-only buttons have accessibility labels.
- Color is not the only indicator of status or selection.
- Progress and generating states are understandable without debug text.
- No placeholder lorem ipsum, fake data, raw JSON, or internal state labels appear in production UI.

## Final Evidence

Record:

- Build command and outcome.
- Simulator/device used.
- Screens/states inspected.
- Any unresolved visual issues.
- Whether tap target and shadow/clipping checks passed.
