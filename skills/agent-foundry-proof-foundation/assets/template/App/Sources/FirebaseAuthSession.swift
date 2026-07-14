import FirebaseAuth
import Foundation

actor FirebaseAuthSession {
    static let shared = FirebaseAuthSession()

    func idToken() async throws -> String {
        let user: User
        if let currentUser = Auth.auth().currentUser {
            user = currentUser
        } else {
            user = try await Auth.auth().signInAnonymously().user
        }
        return try await user.getIDToken()
    }
}
