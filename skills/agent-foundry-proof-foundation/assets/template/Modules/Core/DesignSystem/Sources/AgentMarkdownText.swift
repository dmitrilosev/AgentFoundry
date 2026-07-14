import SwiftUI

public struct AgentMarkdownText: View {
    private let markdown: String

    public init(_ markdown: String) {
        self.markdown = markdown
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 7) {
            ForEach(Array(lines.enumerated()), id: \.offset) { _, line in
                lineView(line)
            }
        }
        .textSelection(.enabled)
    }

    private var lines: [String] {
        markdown.components(separatedBy: .newlines)
    }

    @ViewBuilder
    private func lineView(_ line: String) -> some View {
        let trimmed = line.trimmingCharacters(in: .whitespaces)
        if trimmed.isEmpty {
            Color.clear.frame(height: 3)
        } else if trimmed.hasPrefix("### ") {
            inline(String(trimmed.dropFirst(4))).font(.headline)
        } else if trimmed.hasPrefix("## ") {
            inline(String(trimmed.dropFirst(3))).font(.title3.weight(.semibold))
        } else if trimmed.hasPrefix("# ") {
            inline(String(trimmed.dropFirst(2))).font(.title2.weight(.bold))
        } else if trimmed.hasPrefix("- ") || trimmed.hasPrefix("* ") {
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                Text("•").foregroundStyle(AgentFoundryDesign.primary)
                inline(String(trimmed.dropFirst(2)))
            }
        } else if trimmed.hasPrefix("> ") {
            inline(String(trimmed.dropFirst(2)))
                .foregroundStyle(.secondary)
                .padding(.leading, 10)
                .overlay(alignment: .leading) {
                    Capsule().fill(AgentFoundryDesign.primary.opacity(0.45)).frame(width: 3)
                }
        } else {
            inline(line)
        }
    }

    private func inline(_ value: String) -> Text {
        if let attributed = try? AttributedString(
            markdown: value,
            options: .init(interpretedSyntax: .inlineOnlyPreservingWhitespace)
        ) {
            return Text(attributed)
        }
        return Text(value)
    }
}
