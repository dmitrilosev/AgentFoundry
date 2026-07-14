import BackendClient
import ChatFeature
import ComposableArchitecture
import SwiftUI

@main
@MainActor
struct __PRODUCT_SWIFT__App: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate

    private let store: StoreOf<ChatFeature>

    init() {
        store = Store(initialState: ChatFeature.State()) {
            ChatFeature()
        } withDependencies: {
            $0.backendClient = .live(
                loadChatURL: AppConfiguration.loadChatURL,
                sendMessageURL: AppConfiguration.sendMessageURL,
                idTokenProvider: { try await FirebaseAuthSession.shared.idToken() }
            )
        }
    }

    var body: some Scene {
        WindowGroup {
            ChatView(store: store)
        }
    }
}
