import Foundation

enum AppConfiguration {
    static let backendBaseURL: URL = {
        guard let rawValue = Bundle.main.object(forInfoDictionaryKey: "AgentFoundryBackendBaseURL") as? String,
              let url = URL(string: rawValue) else {
            preconditionFailure("AgentFoundryBackendBaseURL is missing or invalid.")
        }
        return url
    }()

    static var loadChatURL: URL {
        backendBaseURL.appending(path: "loadChat")
    }

    static var sendMessageURL: URL {
        backendBaseURL.appending(path: "sendMessage")
    }
}
