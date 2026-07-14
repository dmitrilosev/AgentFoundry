import Models
import XCTest

final class ChatModelTests: XCTestCase {
    func testDurableSnapshotRoundTrip() throws {
        let snapshot = ChatSnapshot(sessions: [
            ChatSession(
                id: "session-1",
                title: "First conversation",
                status: .completed,
                updatedAt: "2026-01-01T00:00:00.000Z",
                messages: [
                    ChatMessage(
                        id: "message-1",
                        role: .assistant,
                        bodyMarkdown: "Ready",
                        createdAt: "2026-01-01T00:00:00.000Z"
                    ),
                ]
            ),
        ])

        let encoded = try JSONEncoder().encode(snapshot)
        XCTAssertEqual(try JSONDecoder().decode(ChatSnapshot.self, from: encoded), snapshot)
    }

    func testSendRequestPreservesIdempotencyKey() throws {
        let request = SendMessageRequest(
            sessionId: "session-1",
            messageId: "message-1",
            textMarkdown: "Plan this"
        )

        let encoded = try JSONEncoder().encode(request)
        XCTAssertEqual(try JSONDecoder().decode(SendMessageRequest.self, from: encoded), request)
    }
}
