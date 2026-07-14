import BackendClient
import ComposableArchitecture
import Foundation
import Models

public struct ChatFeature: Reducer, Sendable {
    public init() {}

    public struct State: Equatable, Sendable {
        public var snapshot = ChatSnapshot(sessions: [])
        public var selectedSessionId: String?
        public var draft = ""
        public var isLoading = false
        public var errorMessage: String?

        public init() {}

        public var selectedSession: ChatSession? {
            guard let selectedSessionId else { return snapshot.sessions.first }
            return snapshot.sessions.first(where: { $0.id == selectedSessionId })
        }

        public var canSend: Bool {
            !draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isLoading
        }
    }

    public enum Action: Sendable {
        case task
        case newSessionTapped
        case sessionSelected(String)
        case draftChanged(String)
        case errorPresentationChanged(Bool)
        case sendTapped
        case loadResponse(Result<ChatSnapshot, Error>)
        case sendResponse(Result<ChatSnapshot, Error>)
        case pollTick
    }

    @Dependency(\.backendClient) private var backendClient
    @Dependency(\.continuousClock) private var clock
    private enum CancelID { case polling }

    public var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .task:
                state.isLoading = true
                state.errorMessage = nil
                return .run { send in
                    await send(.loadResponse(Result { try await backendClient.loadChat() }))
                }

            case .newSessionTapped:
                state.selectedSessionId = nil
                state.draft = ""
                return .none

            case let .sessionSelected(id):
                state.selectedSessionId = id
                return .none

            case let .draftChanged(draft):
                state.draft = draft
                return .none

            case let .errorPresentationChanged(isPresented):
                if !isPresented { state.errorMessage = nil }
                return .none

            case .sendTapped:
                guard state.canSend else { return .none }
                let text = state.draft.trimmingCharacters(in: .whitespacesAndNewlines)
                let sessionId = state.selectedSessionId ?? UUID().uuidString
                let request = SendMessageRequest(
                    sessionId: sessionId,
                    messageId: UUID().uuidString,
                    textMarkdown: text
                )
                state.selectedSessionId = sessionId
                state.draft = ""
                state.isLoading = true
                state.errorMessage = nil
                return .run { send in
                    await send(.sendResponse(Result { try await backendClient.sendMessage(request) }))
                }

            case let .loadResponse(.success(snapshot)), let .sendResponse(.success(snapshot)):
                state.snapshot = snapshot
                state.isLoading = false
                if state.selectedSessionId == nil {
                    state.selectedSessionId = snapshot.sessions.first?.id
                }
                let isGenerating = snapshot.sessions.contains(where: { $0.status == .generating })
                return isGenerating ? pollEffect() : .cancel(id: CancelID.polling)

            case let .loadResponse(.failure(error)), let .sendResponse(.failure(error)):
                state.isLoading = false
                state.errorMessage = error.localizedDescription
                return .cancel(id: CancelID.polling)

            case .pollTick:
                return .run { send in
                    await send(.loadResponse(Result { try await backendClient.loadChat() }))
                }
            }
        }
    }

    private func pollEffect() -> Effect<Action> {
        .run { send in
            try await clock.sleep(for: .seconds(1))
            await send(.pollTick)
        }
        .cancellable(id: CancelID.polling, cancelInFlight: true)
    }
}
