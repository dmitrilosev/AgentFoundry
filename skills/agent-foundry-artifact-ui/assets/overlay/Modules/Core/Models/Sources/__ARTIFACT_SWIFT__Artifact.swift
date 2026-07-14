import Foundation

public enum __ARTIFACT_SWIFT__Readiness: String, Codable, Equatable, Sendable {
    case generating
    case needsInput = "needs_input"
    case partial
    case ready
    case stale
    case failed
}

public struct __ARTIFACT_SWIFT__Payload: Codable, Equatable, Sendable {
    public var title: String
    public var summary: String
    public var highlights: [String]

    public init(title: String, summary: String, highlights: [String]) {
        self.title = title
        self.summary = summary
        self.highlights = highlights
    }
}

public struct __ARTIFACT_SWIFT__Artifact: Codable, Equatable, Identifiable, Sendable {
    public static let type = "__ARTIFACT_TYPE__"
    public static let version = 1

    public var id: String
    public var type: String
    public var version: Int
    public var readiness: __ARTIFACT_SWIFT__Readiness
    public var payload: __ARTIFACT_SWIFT__Payload?
    public var updatedAt: String

    public init(
        id: String,
        readiness: __ARTIFACT_SWIFT__Readiness,
        payload: __ARTIFACT_SWIFT__Payload?,
        updatedAt: String,
        type: String = Self.type,
        version: Int = Self.version
    ) {
        self.id = id
        self.type = type
        self.version = version
        self.readiness = readiness
        self.payload = payload
        self.updatedAt = updatedAt
    }

    public var isSupported: Bool { type == Self.type && version == Self.version }
}
