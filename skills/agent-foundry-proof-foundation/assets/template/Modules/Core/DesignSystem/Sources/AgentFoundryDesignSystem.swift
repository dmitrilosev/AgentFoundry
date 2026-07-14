import SwiftUI

public enum AgentFoundryDesign {
    // Replace these product-neutral colors with a semantic palette for the product.
    public static let primary = Color(red: 0.10, green: 0.45, blue: 0.62)
    public static let secondary = Color(red: 0.46, green: 0.38, blue: 0.86)
    public static let warm = Color(red: 0.96, green: 0.48, blue: 0.32)
    public static let glow = Color(red: 0.98, green: 0.75, blue: 0.36)

    public static let heroCorner: CGFloat = 34
    public static let panelCorner: CGFloat = 28
    public static let controlCorner: CGFloat = 24
    public static let compactCorner: CGFloat = 18

    public static var accentGradient: LinearGradient {
        LinearGradient(
            colors: [primary, secondary],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}

public struct ProductAtmosphere: View {
    public init() {}

    public var body: some View {
        ZStack {
            LinearGradient(
                colors: [
                    AgentFoundryDesign.primary.opacity(0.18),
                    AgentFoundryDesign.warm.opacity(0.10),
                    Color(.systemGroupedBackground),
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            RadialGradient(
                colors: [AgentFoundryDesign.secondary.opacity(0.16), .clear],
                center: .topTrailing,
                startRadius: 20,
                endRadius: 420
            )
            Rectangle().fill(.ultraThinMaterial).opacity(0.12)
        }
        .ignoresSafeArea()
    }
}

public extension View {
    @ViewBuilder
    func agentGlassSurface(
        cornerRadius: CGFloat = AgentFoundryDesign.panelCorner,
        interactive: Bool = false,
        tint: Color? = nil
    ) -> some View {
        let shape = RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
        if #available(iOS 26.0, *) {
            if interactive, let tint {
                clipShape(shape)
                    .glassEffect(.regular.tint(tint).interactive(), in: .rect(cornerRadius: cornerRadius))
                    .agentSurfaceFinish(shape: shape)
            } else if interactive {
                clipShape(shape)
                    .glassEffect(.regular.interactive(), in: .rect(cornerRadius: cornerRadius))
                    .agentSurfaceFinish(shape: shape)
            } else if let tint {
                clipShape(shape)
                    .glassEffect(.regular.tint(tint), in: .rect(cornerRadius: cornerRadius))
                    .agentSurfaceFinish(shape: shape)
            } else {
                clipShape(shape)
                    .glassEffect(.regular, in: .rect(cornerRadius: cornerRadius))
                    .agentSurfaceFinish(shape: shape)
            }
        } else {
            clipShape(shape)
                .background(.ultraThinMaterial, in: shape)
                .agentSurfaceFinish(shape: shape)
        }
    }

    private func agentSurfaceFinish(shape: RoundedRectangle) -> some View {
        overlay { shape.stroke(.white.opacity(0.34), lineWidth: 1) }
            .shadow(color: AgentFoundryDesign.primary.opacity(0.10), radius: 18, x: 0, y: 10)
    }
}

public struct AgentIconBadge: View {
    private let systemName: String
    private let tint: Color

    public init(systemName: String, tint: Color = AgentFoundryDesign.primary) {
        self.systemName = systemName
        self.tint = tint
    }

    public var body: some View {
        Image(systemName: systemName)
            .font(.system(size: 18, weight: .semibold))
            .symbolRenderingMode(.hierarchical)
            .foregroundStyle(tint)
            .frame(width: 44, height: 44)
            .background(tint.opacity(0.14), in: RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}
