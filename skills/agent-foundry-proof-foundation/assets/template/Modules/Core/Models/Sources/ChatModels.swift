import Foundation

public enum ChatSessionStatus: String, Codable, Equatable, Sendable {
    case idle
    case generating
    case completed
    case failed
}

public enum ChatMessageRole: String, Codable, Equatable, Sendable {
    case user
    case assistant
}

public struct ChatMessage: Codable, Equatable, Identifiable, Sendable {
    public var id: String
    public var role: ChatMessageRole
    public var bodyMarkdown: String
    public var responseToMessageId: String?
    public var createdAt: String

    public init(
        id: String,
        role: ChatMessageRole,
        bodyMarkdown: String,
        responseToMessageId: String? = nil,
        createdAt: String
    ) {
        self.id = id
        self.role = role
        self.bodyMarkdown = bodyMarkdown
        self.responseToMessageId = responseToMessageId
        self.createdAt = createdAt
    }
}

public struct ChatSession: Codable, Equatable, Identifiable, Sendable {
    public var id: String
    public var title: String
    public var status: ChatSessionStatus
    public var updatedAt: String
    public var messages: [ChatMessage]

    public init(
        id: String,
        title: String,
        status: ChatSessionStatus,
        updatedAt: String,
        messages: [ChatMessage]
    ) {
        self.id = id
        self.title = title
        self.status = status
        self.updatedAt = updatedAt
        self.messages = messages
    }
}

public struct ChatSnapshot: Codable, Equatable, Sendable {
    public var sessions: [ChatSession]

    public init(sessions: [ChatSession]) {
        self.sessions = sessions
    }
}

public struct SendMessageRequest: Codable, Equatable, Sendable {
    public var sessionId: String
    public var messageId: String
    public var textMarkdown: String

    public init(sessionId: String, messageId: String, textMarkdown: String) {
        self.sessionId = sessionId
        self.messageId = messageId
        self.textMarkdown = textMarkdown
    }
}
