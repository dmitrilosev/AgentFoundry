import ComposableArchitecture
import Foundation
import Models

public struct __DOMAIN_SWIFT__Client: Sendable {
    public var list: @Sendable () async throws -> [__DOMAIN_SWIFT__Record]
    public var create: @Sendable (_ title: String, _ note: String?, _ mutationId: String) async throws -> __DOMAIN_SWIFT__Record
    public var update: @Sendable (_ record: __DOMAIN_SWIFT__Record) async throws -> __DOMAIN_SWIFT__Record
    public var archive: @Sendable (_ id: String, _ expectedVersion: Int, _ confirmed: Bool) async throws -> __DOMAIN_SWIFT__Record

    public init(
        list: @escaping @Sendable () async throws -> [__DOMAIN_SWIFT__Record],
        create: @escaping @Sendable (String, String?, String) async throws -> __DOMAIN_SWIFT__Record,
        update: @escaping @Sendable (__DOMAIN_SWIFT__Record) async throws -> __DOMAIN_SWIFT__Record,
        archive: @escaping @Sendable (String, Int, Bool) async throws -> __DOMAIN_SWIFT__Record
    ) {
        self.list = list
        self.create = create
        self.update = update
        self.archive = archive
    }
}

extension __DOMAIN_SWIFT__Client: DependencyKey {
    public static let liveValue = Self(
        list: { throw BackendClientError("__DOMAIN_SWIFT__Client is not configured.") },
        create: { _, _, _ in throw BackendClientError("__DOMAIN_SWIFT__Client is not configured.") },
        update: { _ in throw BackendClientError("__DOMAIN_SWIFT__Client is not configured.") },
        archive: { _, _, _ in throw BackendClientError("__DOMAIN_SWIFT__Client is not configured.") }
    )
    public static let testValue = liveValue
}

public extension DependencyValues {
    var __DOMAIN_CAMEL__Client: __DOMAIN_SWIFT__Client {
        get { self[__DOMAIN_SWIFT__Client.self] }
        set { self[__DOMAIN_SWIFT__Client.self] = newValue }
    }
}
