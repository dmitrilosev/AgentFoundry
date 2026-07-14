import DesignSystem
import Models
import SwiftUI

public struct __DOMAIN_SWIFT__Row: View {
    private let record: __DOMAIN_SWIFT__Record

    public init(record: __DOMAIN_SWIFT__Record) {
        self.record = record
    }

    public var body: some View {
        HStack(spacing: 14) {
            AgentIconBadge(systemName: record.status == .completed ? "checkmark" : "tray.full")
            VStack(alignment: .leading, spacing: 4) {
                Text(record.title).font(.headline)
                if let note = record.note, !note.isEmpty {
                    Text(note).font(.subheadline).foregroundStyle(.secondary).lineLimit(2)
                }
            }
            Spacer()
            Text(record.status.rawValue.replacingOccurrences(of: "_", with: " ").capitalized)
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
        }
        .padding(16)
        .contentShape(Rectangle())
        .agentGlassSurface(cornerRadius: AgentFoundryDesign.compactCorner, interactive: true)
    }
}
