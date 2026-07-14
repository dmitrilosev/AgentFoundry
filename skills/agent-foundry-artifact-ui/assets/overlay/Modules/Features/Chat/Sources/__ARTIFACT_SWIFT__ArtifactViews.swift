import DesignSystem
import Models
import SwiftUI

public struct __ARTIFACT_SWIFT__InlineCard: View {
    private let artifact: __ARTIFACT_SWIFT__Artifact
    private let open: () -> Void

    public init(artifact: __ARTIFACT_SWIFT__Artifact, open: @escaping () -> Void) {
        self.artifact = artifact
        self.open = open
    }

    public var body: some View {
        Button(action: open) {
            HStack(spacing: 14) {
                AgentIconBadge(systemName: iconName)
                VStack(alignment: .leading, spacing: 5) {
                    Text(artifact.payload?.title ?? stateTitle)
                        .font(.headline)
                        .foregroundStyle(.primary)
                    Text(artifact.payload?.summary ?? stateSummary)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                }
                Spacer(minLength: 4)
                Image(systemName: "chevron.right")
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.secondary)
            }
            .padding(16)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .frame(minHeight: 72)
        .agentGlassSurface(interactive: true)
        .disabled(!artifact.isSupported || artifact.readiness == .failed)
    }

    private var iconName: String {
        switch artifact.readiness {
        case .generating: "sparkles"
        case .needsInput: "questionmark.circle"
        case .partial, .stale: "clock.badge.exclamationmark"
        case .ready: "checkmark.circle"
        case .failed: "exclamationmark.triangle"
        }
    }

    private var stateTitle: String { artifact.isSupported ? "Preparing result" : "Update required" }
    private var stateSummary: String {
        artifact.isSupported ? "The agent is building this product surface." : "This artifact version is not supported by the app."
    }
}

public struct __ARTIFACT_SWIFT__DetailView: View {
    private let artifact: __ARTIFACT_SWIFT__Artifact

    public init(artifact: __ARTIFACT_SWIFT__Artifact) {
        self.artifact = artifact
    }

    public var body: some View {
        ZStack {
            ProductAtmosphere()
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text(artifact.payload?.title ?? "Artifact")
                        .font(.largeTitle.bold())
                    Text(artifact.payload?.summary ?? fallbackSummary)
                        .font(.body)
                        .foregroundStyle(.secondary)
                    if let highlights = artifact.payload?.highlights {
                        ForEach(highlights, id: \.self) { highlight in
                            Label(highlight, systemImage: "sparkle")
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(16)
                                .agentGlassSurface(cornerRadius: AgentFoundryDesign.compactCorner)
                        }
                    }
                }
                .padding(20)
            }
            .scrollClipDisabled()
        }
        .navigationTitle(artifact.payload?.title ?? "Artifact")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var fallbackSummary: String {
        artifact.isSupported ? "This surface is not ready yet." : "Install an app version that supports this artifact."
    }
}
