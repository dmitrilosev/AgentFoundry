// swift-tools-version: 6.0
import PackageDescription

#if TUIST
    import struct ProjectDescription.PackageSettings
    import struct ProjectDescription.Settings

    let packageSettings = PackageSettings(
        productTypes: [
            "CasePaths": .framework,
            "CasePathsCore": .framework,
            "Clocks": .framework,
            "CombineSchedulers": .framework,
            "ComposableArchitecture": .framework,
            "ConcurrencyExtras": .framework,
            "CustomDump": .framework,
            "Dependencies": .framework,
            "IdentifiedCollections": .framework,
            "IssueReporting": .framework,
            "OrderedCollections": .framework,
            "Perception": .framework,
            "PerceptionCore": .framework,
            // Sharing 2.0.x contains resilient Swift class metadata that
            // crashes XCTest when split into dynamic Tuist frameworks.
            // Embed these three products statically into TCA instead.
            "Sharing": .staticFramework,
            "Sharing1": .staticFramework,
            "Sharing2": .staticFramework,
            "SwiftNavigation": .framework,
            "SwiftUINavigation": .framework,
            "UIKitNavigation": .framework,
            "UIKitNavigationShim": .framework,
            "XCTestDynamicOverlay": .framework,
            "FirebaseAuth": .framework,
            "FirebaseAuthInterop": .framework,
            "FirebaseCore": .framework,
            "FirebaseCoreExtension": .framework,
            "FirebaseCoreInternal": .framework,
            "FirebaseInstallations": .framework,
            "FBLPromises": .framework,
            "GTMSessionFetcherCore": .framework,
            "GoogleUtilities-AppDelegateSwizzler": .framework,
            "GoogleUtilities-Environment": .framework,
            "GoogleUtilities-Logger": .framework,
            "GoogleUtilities-NSData": .framework,
            "GoogleUtilities-Network": .framework,
            "GoogleUtilities-Privacy": .framework,
            "GoogleUtilities-Reachability": .framework,
            "GoogleUtilities-UserDefaults": .framework,
            "RecaptchaInterop": .framework,
            "nanopb": .framework,
            "third-party-IsAppEncrypted": .framework,
        ],
        baseSettings: .settings(
            base: [
                "LIBRARY_SEARCH_PATHS": "$(inherited) $(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME)",
                "FRAMEWORK_SEARCH_PATHS": "$(inherited) $(SDKROOT)/System/Library/SubFrameworks",
            ]
        ),
        targetSettings: [
            // TCA 1.20.2 declares Swift tools 5.9. The proof uses SwiftUI
            // navigation, so omit its UIKit-only adapter that Xcode 26.2 rejects
            // against the package's iOS 13 back-deployment floor.
            "ComposableArchitecture": [
                "SWIFT_VERSION": "5.0",
                "EXCLUDED_SOURCE_FILE_NAMES": "NavigationStackControllerUIKit.swift",
            ],
        ]
    )
#endif

let package = Package(
    name: "__PRODUCT_SWIFT__Packages",
    dependencies: [
        .package(url: "https://github.com/pointfreeco/swift-composable-architecture", exact: "1.20.2"),
        // TCA 1.20.2 accepts any Sharing version below 3.0, but newer
        // releases are not binary-compatible with its original dependency
        // graph when Tuist emits dynamic frameworks. Keep the known-good pin
        // from TCA 1.20.2's own Package.resolved.
        .package(url: "https://github.com/pointfreeco/swift-sharing", exact: "2.0.2"),
        .package(url: "https://github.com/firebase/firebase-ios-sdk", from: "12.0.0"),
    ]
)
