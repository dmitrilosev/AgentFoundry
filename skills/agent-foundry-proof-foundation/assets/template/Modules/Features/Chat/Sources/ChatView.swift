import ComposableArchitecture
import DesignSystem
import Models
import SwiftUI

public struct ChatView: View {
    private let store: StoreOf<ChatFeature>

    public init(store: StoreOf<ChatFeature>) {
        self.store = store
    }

    public var body: some View {
        WithViewStore(store, observe: { $0 }) { viewStore in
            ZStack {
                ProductAtmosphere()
                NavigationStack {
                    VStack(spacing: 0) {
                        if viewStore.snapshot.sessions.isEmpty && viewStore.selectedSession == nil {
                            emptyState
                        } else {
                            messageTimeline(viewStore)
                        }
                        composer(viewStore)
                    }
                    .padding(.horizontal, 16)
                    .navigationTitle("__PRODUCT_NAME__")
                    .toolbar { sessionMenu(viewStore) }
                    .background(Color.clear)
                }
                .scrollContentBackground(.hidden)
            }
            .task { await viewStore.send(.task).finish() }
            .alert(
                "Couldn’t connect",
                isPresented: viewStore.binding(
                    get: { $0.errorMessage != nil },
                    send: ChatFeature.Action.errorPresentationChanged
                )
            ) {
                Button("Try again") { viewStore.send(.task) }
                Button("Dismiss", role: .cancel) { viewStore.send(.errorPresentationChanged(false)) }
            } message: {
                Text(viewStore.errorMessage ?? "Please try again.")
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 18) {
            Spacer()
            AgentIconBadge(systemName: "sparkles")
            VStack(spacing: 8) {
                Text("What should we work on?")
                    .font(.title.bold())
                    .multilineTextAlignment(.center)
                Text("Describe an outcome. The agent will keep the conversation available across launches.")
                    .font(.body)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
            }
            .frame(maxWidth: 520)
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    private func messageTimeline(_ viewStore: ViewStore<ChatFeature.State, ChatFeature.Action>) -> some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 14) {
                    if let session = viewStore.selectedSession {
                        ForEach(session.messages) { message in
                            messageRow(message)
                                .id(message.id)
                        }
                        if session.status == .generating {
                            generatingRow.id("generating")
                        }
                    }
                }
                .padding(.vertical, 20)
            }
            .onChange(of: viewStore.selectedSession?.messages.count) {
                guard let id = viewStore.selectedSession?.messages.last?.id else { return }
                withAnimation(.easeOut(duration: 0.25)) { proxy.scrollTo(id, anchor: .bottom) }
            }
        }
    }

    private func messageRow(_ message: ChatMessage) -> some View {
        HStack {
            if message.role == .user { Spacer(minLength: 44) }
            AgentMarkdownText(message.bodyMarkdown)
                .font(.body)
                .padding(.horizontal, 16)
                .padding(.vertical, 13)
                .agentGlassSurface(
                    cornerRadius: AgentFoundryDesign.controlCorner,
                    tint: message.role == .user ? AgentFoundryDesign.primary.opacity(0.22) : nil
                )
            if message.role == .assistant { Spacer(minLength: 44) }
        }
    }

    private var generatingRow: some View {
        HStack(spacing: 10) {
            ProgressView()
            Text("Working…").foregroundStyle(.secondary)
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 13)
        .agentGlassSurface(cornerRadius: AgentFoundryDesign.controlCorner)
    }

    private func composer(_ viewStore: ViewStore<ChatFeature.State, ChatFeature.Action>) -> some View {
        HStack(alignment: .bottom, spacing: 10) {
            TextField(
                "Message the agent",
                text: viewStore.binding(get: \.draft, send: ChatFeature.Action.draftChanged),
                axis: .vertical
            )
            .lineLimit(1...6)
            .textFieldStyle(.plain)
            .padding(.leading, 6)
            .onSubmit { viewStore.send(.sendTapped) }
            Button { viewStore.send(.sendTapped) } label: {
                Image(systemName: "arrow.up")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundStyle(.white)
                    .frame(width: 40, height: 40)
                    .background(AgentFoundryDesign.accentGradient, in: Circle())
            }
            .buttonStyle(.plain)
            .disabled(!viewStore.canSend)
            .opacity(viewStore.canSend ? 1 : 0.42)
        }
        .padding(10)
        .agentGlassSurface(cornerRadius: AgentFoundryDesign.controlCorner, interactive: true)
        .padding(.bottom, 10)
    }

    @ToolbarContentBuilder
    private func sessionMenu(_ viewStore: ViewStore<ChatFeature.State, ChatFeature.Action>) -> some ToolbarContent {
        ToolbarItem(placement: .topBarTrailing) {
            Menu {
                Button("New conversation", systemImage: "square.and.pencil") {
                    viewStore.send(.newSessionTapped)
                }
                ForEach(viewStore.snapshot.sessions) { session in
                    Button(session.title) { viewStore.send(.sessionSelected(session.id)) }
                }
            } label: {
                Image(systemName: "clock.arrow.circlepath")
            }
        }
    }
}
