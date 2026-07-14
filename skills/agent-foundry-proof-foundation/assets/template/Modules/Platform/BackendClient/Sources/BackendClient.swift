import ComposableArchitecture
import Foundation
import Models

public struct BackendClientError: Error, Equatable, LocalizedError, Sendable {
    public var message: String
    public init(_ message: String) { self.message = message }
    public var errorDescription: String? { message }
}

public struct BackendClient: Sendable {
    public var loadChat: @Sendable () async throws -> ChatSnapshot
    public var sendMessage: @Sendable (SendMessageRequest) async throws -> ChatSnapshot

    public init(
        loadChat: @escaping @Sendable () async throws -> ChatSnapshot,
        sendMessage: @escaping @Sendable (SendMessageRequest) async throws -> ChatSnapshot
    ) {
        self.loadChat = loadChat
        self.sendMessage = sendMessage
    }
}

public extension BackendClient {
    static func live(
        loadChatURL: URL,
        sendMessageURL: URL,
        idTokenProvider: @escaping @Sendable () async throws -> String
    ) -> Self {
        let transport = HTTPTransport(idTokenProvider: idTokenProvider)
        return Self(
            loadChat: {
                let response: SnapshotResponse = try await transport.perform(url: loadChatURL, method: "GET")
                return response.snapshot
            },
            sendMessage: { request in
                let response: SnapshotResponse = try await transport.perform(
                    url: sendMessageURL,
                    method: "POST",
                    body: request
                )
                return response.snapshot
            }
        )
    }
}

extension BackendClient: DependencyKey {
    public static let liveValue = Self(
        loadChat: { throw BackendClientError("BackendClient is not configured by the app target.") },
        sendMessage: { _ in throw BackendClientError("BackendClient is not configured by the app target.") }
    )

    public static let testValue = Self(
        loadChat: { throw BackendClientError("BackendClient.loadChat is not implemented for this test.") },
        sendMessage: { _ in throw BackendClientError("BackendClient.sendMessage is not implemented for this test.") }
    )
}

public extension DependencyValues {
    var backendClient: BackendClient {
        get { self[BackendClient.self] }
        set { self[BackendClient.self] = newValue }
    }
}

private struct SnapshotResponse: Decodable { var snapshot: ChatSnapshot }
private struct EmptyBody: Encodable {}

private final class HTTPTransport: @unchecked Sendable {
    private let idTokenProvider: @Sendable () async throws -> String
    private let decoder = JSONDecoder()
    private let encoder = JSONEncoder()

    init(idTokenProvider: @escaping @Sendable () async throws -> String) {
        self.idTokenProvider = idTokenProvider
    }

    func perform<Response: Decodable>(url: URL, method: String) async throws -> Response {
        let body: EmptyBody? = nil
        return try await perform(url: url, method: method, body: body)
    }

    func perform<Response: Decodable, Body: Encodable>(
        url: URL,
        method: String,
        body: Body?
    ) async throws -> Response {
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.timeoutInterval = 30
        request.setValue("Bearer \(try await idTokenProvider())", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        if let body {
            request.httpBody = try encoder.encode(body)
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw BackendClientError("The backend returned an invalid response.")
        }
        guard (200..<300).contains(http.statusCode) else {
            let detail = String(data: data, encoding: .utf8) ?? "HTTP \(http.statusCode)"
            throw BackendClientError(detail)
        }
        do {
            return try decoder.decode(Response.self, from: data)
        } catch {
            throw BackendClientError("Could not decode the backend response: \(error.localizedDescription)")
        }
    }
}
