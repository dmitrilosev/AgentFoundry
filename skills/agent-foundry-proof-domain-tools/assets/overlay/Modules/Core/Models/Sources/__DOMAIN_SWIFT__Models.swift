import Foundation

public enum __DOMAIN_SWIFT__Status: String, Codable, Equatable, Sendable {
    case active
    case completed
    case archived
}

public struct __DOMAIN_SWIFT__Record: Codable, Equatable, Identifiable, Sendable {
    public var id: String
    public var title: String
    public var note: String?
    public var status: __DOMAIN_SWIFT__Status
    public var version: Int
    public var createdAt: String
    public var updatedAt: String

    public init(
        id: String,
        title: String,
        note: String? = nil,
        status: __DOMAIN_SWIFT__Status,
        version: Int,
        createdAt: String,
        updatedAt: String
    ) {
        self.id = id
        self.title = title
        self.note = note
        self.status = status
        self.version = version
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}
