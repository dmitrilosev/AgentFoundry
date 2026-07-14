import ProjectDescription

let deploymentTargets = DeploymentTargets.iOS("26.1")

let baseSettings: SettingsDictionary = [
    "IPHONEOS_DEPLOYMENT_TARGET": "26.1",
    "SWIFT_VERSION": "6.0",
    "ENABLE_USER_SCRIPT_SANDBOXING": "NO",
]

let appSettings: SettingsDictionary = baseSettings.merging([
    "CODE_SIGN_STYLE": "Automatic",
    "MARKETING_VERSION": "1.0",
    "CURRENT_PROJECT_VERSION": "1",
    "OTHER_LDFLAGS": "$(inherited) -ObjC",
], uniquingKeysWith: { _, new in new })

let project = Project(
    name: "__PRODUCT_SWIFT__",
    organizationName: "__ORGANIZATION_NAME__",
    options: .options(automaticSchemesOptions: .disabled),
    settings: .settings(base: baseSettings),
    targets: [
        .target(
            name: "Models",
            destinations: .iOS,
            product: .framework,
            bundleId: "__BUNDLE_ID__.models",
            deploymentTargets: deploymentTargets,
            infoPlist: .default,
            sources: ["Modules/Core/Models/Sources/**"]
        ),
        .target(
            name: "DesignSystem",
            destinations: .iOS,
            product: .framework,
            bundleId: "__BUNDLE_ID__.designsystem",
            deploymentTargets: deploymentTargets,
            infoPlist: .default,
            sources: ["Modules/Core/DesignSystem/Sources/**"]
        ),
        .target(
            name: "BackendClient",
            destinations: .iOS,
            product: .framework,
            bundleId: "__BUNDLE_ID__.backendclient",
            deploymentTargets: deploymentTargets,
            infoPlist: .default,
            sources: ["Modules/Platform/BackendClient/Sources/**"],
            dependencies: [
                .target(name: "Models"),
                .external(name: "ComposableArchitecture"),
            ]
        ),
        .target(
            name: "ChatFeature",
            destinations: .iOS,
            product: .framework,
            bundleId: "__BUNDLE_ID__.chatfeature",
            deploymentTargets: deploymentTargets,
            infoPlist: .default,
            sources: ["Modules/Features/Chat/Sources/**"],
            dependencies: [
                .target(name: "BackendClient"),
                .target(name: "DesignSystem"),
                .target(name: "Models"),
                .external(name: "ComposableArchitecture"),
            ]
        ),
        .target(
            name: "ChatFeatureTests",
            destinations: .iOS,
            product: .unitTests,
            bundleId: "__BUNDLE_ID__.chatfeature.tests",
            deploymentTargets: deploymentTargets,
            infoPlist: .default,
            sources: ["Modules/Features/Chat/Tests/**"],
            dependencies: [
                .target(name: "Models"),
            ]
        ),
        .target(
            name: "__PRODUCT_SWIFT__",
            destinations: .iOS,
            product: .app,
            bundleId: "__BUNDLE_ID__",
            deploymentTargets: deploymentTargets,
            infoPlist: .extendingDefault(with: [
                "CFBundleDisplayName": "__PRODUCT_NAME__",
                "UILaunchScreen": [:],
                "UIApplicationSceneManifest": [
                    "UIApplicationSupportsMultipleScenes": false,
                ],
                "AgentFoundryBackendBaseURL": "__BACKEND_BASE_URL__",
            ]),
            sources: ["App/Sources/**"],
            resources: ["App/Resources/**"],
            dependencies: [
                .target(name: "BackendClient"),
                .target(name: "ChatFeature"),
                .target(name: "DesignSystem"),
                .external(name: "ComposableArchitecture"),
                .external(name: "FirebaseAuth"),
                .external(name: "FirebaseCore"),
                .sdk(name: "SystemConfiguration", type: .framework),
                .sdk(name: "c++", type: .library),
            ],
            settings: .settings(base: appSettings)
        ),
    ],
    schemes: [
        .scheme(
            name: "__PRODUCT_SWIFT__",
            shared: true,
            buildAction: .buildAction(targets: ["__PRODUCT_SWIFT__"]),
            testAction: .targets(["ChatFeatureTests"]),
            runAction: .runAction(configuration: .debug),
            archiveAction: .archiveAction(configuration: .release),
            profileAction: .profileAction(configuration: .release),
            analyzeAction: .analyzeAction(configuration: .debug)
        ),
    ]
)
