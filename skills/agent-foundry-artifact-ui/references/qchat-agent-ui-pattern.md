# QChat Agent Artifact UI Pattern

Observed source files in QChat:

- `QChat/Models/Agent/AgentChatModels.swift`
- `QChat/Models/Agent/ChatViewPayload.swift`
- `QChat/Views/Screens/Agent/AgentChatPresentationModels.swift`
- `QChat/Views/Screens/Agent/AgentChatMessageMapper.swift`
- `QChat/Views/Screens/Agent/AgentChatBubbleView.swift`
- `QChat/Views/Screens/Agent/ChatViewRenderer.swift`
- `QChat/Views/Screens/Agent/AgentChatView.swift`
- `QChat/Views/Screens/Agent/RentalDetailSheet.swift`
- `QChat/Views/Screens/Agent/RentalResultsMapScreen.swift`

## Core Shape

QChat attaches native UI payloads to messages:

```swift
struct AgentMessage {
    var text: String
    var chatViews: [ChatViewPayload]?
}

struct ChatMessage {
    var text: String
    var chatViews: [ChatViewPayload]?
}
```

`AgentChatMessageMapper` maps persisted `AgentMessage.chatViews` into presentation `ChatMessage.chatViews`.

`AgentChatBubbleView` renders, in order:

- optional visual/agent header
- images
- `chatViews` through `ChatViewRenderer`
- assistant Markdown text

This lets one assistant message contain both native UI and a textual answer.

## Renderer Registry

`ChatViewRenderer` switches on `chatView.type` and returns explicit SwiftUI views:

```swift
switch chatView.type {
case "rental_carousel":
    RentalCarouselChatView(...)
case "rental_detail_preview":
    RentalDetailPreviewChatView(...)
case "commerce_cart_summary":
    CommerceCartSummaryChatView(...)
default:
    EmptyView()
}
```

For new AgentFoundry products, prefer a visible unsupported-card fallback instead of `EmptyView` unless the product intentionally hides unknown cards.

## Action Routing

Cards emit `ChatViewAction`.

`AgentChatView` receives `onChatViewAction`, switches on semantic type, and opens native surfaces:

- `openRentalDetail` resolves a `RentalDetailPresentation` and presents `RentalDetailSheet`.
- rental map routes open `RentalResultsMapScreen` as a full-screen cover.
- wishlist/cart/checkout actions route through app state or send a new agent request.

The important pattern is: card tap -> typed action -> chat screen/reducer state -> native presentation. The card does not own navigation.

## Streaming UI

QChat can receive a streaming step where `step.kind == "chat_views"`. The view model creates or updates the current assistant message and sets `chatViews` before or alongside final text.

Use streaming cards only when the artifact is stable enough to display. Otherwise, persist the final card with the assistant message after schema validation.

## Detail Surface

`RentalDetailSheet` shows the full native product screen. The inline card carries enough reference data to open the detail; the detail service can fetch/enrich the rest.

For AgentFoundry products, prefer detail routes that can recover from:

- cached inline preview only
- artifact id present but payload still loading
- backend artifact missing or deleted
- unsupported artifact version

## Lessons To Preserve

- Keep rich content outside the text bubble chrome.
- Keep assistant Markdown readable even when visual content exists.
- Use explicit action semantic types, not raw button labels.
- Keep card actions typed and allowlisted.
- Do not let renderer views perform backend mutations directly; route actions through feature state.
