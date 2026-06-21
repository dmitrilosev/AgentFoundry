# TCA Feature Module Template

Use this reference when scaffolding a new AgentFoundry SwiftUI feature module. Replace `FeatureName` with the actual feature name and keep generated names idiomatic Swift.

## Generated Layout

```text
Modules/Features/FeatureName/
  Interface/
    FeatureNameRoute.swift
    FeatureNamePublicModels.swift

  Sources/
    FeatureNameFeature.swift
    FeatureNameView.swift
    FeatureNameDestination.swift
    FeatureNameAnalytics.swift
    FeatureNameStrings.swift

  Testing/
    FeatureNameMocks.swift
    FeatureNamePreviewState.swift

  Tests/
    FeatureNameFeatureTests.swift

  Example/
    FeatureNameExampleApp.swift
```

If the project uses Tuist targets, map these folders to `FeatureNameInterface`, `FeatureName`, `FeatureNameTesting`, `FeatureNameTests`, and `FeatureNameExample`.

## Dependency Rules

- `Interface` exposes routes and public models only.
- `Sources` may import TCA, SwiftUI, DesignSystem, Interface, and client interfaces.
- `Sources` must not import Firebase SDKs directly.
- `Testing` provides mocks, preview dependencies, and sample states.
- `Tests` uses `TestStore` and Swift Testing by default.
- `Example` wires the feature with preview or demo dependencies only.

## Interface Route

```swift
public enum FeatureNameRoute: Equatable, Sendable {
    case root
}
```

## Feature Reducer

```swift
import ComposableArchitecture
import Foundation

@Reducer
public struct FeatureNameFeature {
    public init() {}

    @ObservableState
    public struct State: Equatable, Sendable {
        public var isLoading = false
        public var message = ""
        public var response: String?
        public var alert: AlertState<Action.Alert>?

        public init() {}
    }

    public enum Action: ViewAction, Equatable, Sendable {
        case view(View)
        case response(Result<String, FeatureNameError>)
        case alert(PresentationAction<Alert>)
        case delegate(Delegate)

        public enum View: Equatable, Sendable {
            case didAppear
            case messageChanged(String)
            case sendButtonTapped
        }

        public enum Alert: Equatable, Sendable {}

        public enum Delegate: Equatable, Sendable {
            case didReceiveResponse(String)
        }
    }

    @Dependency(\.featureNameClient) private var client

    public var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case let .view(viewAction):
                return reduceViewAction(viewAction, state: &state)

            case let .response(.success(response)):
                state.isLoading = false
                state.response = response
                return .send(.delegate(.didReceiveResponse(response)))

            case let .response(.failure(error)):
                state.isLoading = false
                state.alert = AlertState {
                    TextState(error.localizedDescription)
                }
                return .none

            case .alert:
                return .none

            case .delegate:
                return .none
            }
        }
        .ifLet(\.$alert, action: \.alert)
    }

    private func reduceViewAction(
        _ action: Action.View,
        state: inout State
    ) -> EffectOf<Self> {
        switch action {
        case .didAppear:
            return .none

        case let .messageChanged(message):
            state.message = message
            return .none

        case .sendButtonTapped:
            let message = state.message.trimmingCharacters(in: .whitespacesAndNewlines)
            guard message.isEmpty == false else { return .none }
            state.isLoading = true
            return sendMessageEffect(message)
        }
    }

    private func sendMessageEffect(_ message: String) -> EffectOf<Self> {
        .run { send in
            let result = await Result {
                try await client.send(message)
            }
            .mapError { FeatureNameError(error: $0) }

            await send(.response(result))
        }
    }
}

public struct FeatureNameError: Error, Equatable, Sendable, LocalizedError {
    public var message: String

    public init(message: String) {
        self.message = message
    }

    public init(error: Error) {
        self.message = error.localizedDescription
    }

    public var errorDescription: String? { message }
}
```

## Feature View

```swift
import ComposableArchitecture
import SwiftUI

@ViewAction(for: FeatureNameFeature.self)
public struct FeatureNameView: View {
    @Perception.Bindable public var store: StoreOf<FeatureNameFeature>

    public init(store: StoreOf<FeatureNameFeature>) {
        self.store = store
    }

    public var body: some View {
        WithPerceptionTracking {
            VStack(spacing: 16) {
                if let response = store.response {
                    Text(response)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }

                TextField("Message", text: $store.message.sending(\.view.messageChanged))
                    .textFieldStyle(.roundedBorder)

                Button("Send") {
                    send(.sendButtonTapped)
                }
                .disabled(store.isLoading)

                if store.isLoading {
                    ProgressView()
                }
            }
            .padding()
        }
        .onAppear { send(.didAppear) }
        .alert($store.scope(state: \.alert, action: \.alert))
    }
}
```

## Client Dependency

Put the interface in a client module or in the feature only if it is feature-local. Put Firebase implementations in Platform modules.

```swift
import ComposableArchitecture

@DependencyClient
public struct FeatureNameClient: Sendable {
    public var send: @Sendable (_ message: String) async throws -> String
}

extension FeatureNameClient: TestDependencyKey {
    public static let testValue = Self()
    public static let previewValue = Self(
        send: { message in "Preview response: \(message)" }
    )
}

public extension DependencyValues {
    var featureNameClient: FeatureNameClient {
        get { self[FeatureNameClient.self] }
        set { self[FeatureNameClient.self] = newValue }
    }
}
```

## Reducer Test

```swift
import ComposableArchitecture
import Testing
@testable import FeatureName

@Suite("FeatureName")
@MainActor
struct FeatureNameFeatureTests {
    @Test("Sends message and stores response")
    func sendsMessage() async {
        let store = TestStore(initialState: FeatureNameFeature.State()) {
            FeatureNameFeature()
        } withDependencies: {
            $0.featureNameClient.send = { message in
                #expect(message == "Hello")
                return "Hi"
            }
        }

        await store.send(.view(.messageChanged("Hello"))) {
            $0.message = "Hello"
        }

        await store.send(.view(.sendButtonTapped)) {
            $0.isLoading = true
        }

        await store.receive(.response(.success("Hi"))) {
            $0.isLoading = false
            $0.response = "Hi"
        }

        await store.receive(.delegate(.didReceiveResponse("Hi")))
    }
}
```

## Generation Checklist

- Generate the feature route/public models first.
- Generate reducer, view, client dependency, mocks, and one reducer test.
- Register all targets in Tuist or the local project graph.
- Add the feature to the root reducer only through a route/destination.
- Build the app target.
- Run the generated reducer test.
- Search generated feature sources for `import Firebase`; there should be no direct Firebase imports.
