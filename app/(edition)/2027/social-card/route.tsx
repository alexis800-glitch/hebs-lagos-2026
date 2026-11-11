import { ImageResponse } from "next/og";
import { site2027Open } from "@/lib/launch-2027";
import { deployEnvironment } from "@/lib/publication";
import { SOCIAL_CARD } from "@/lib/site/seo-2027";

/**
 * The 2027 social sharing card: type only, in the site's black and champagne,
 * with the summit's name and confirmed dates. It uses no photograph (none is
 * cleared for public use) and no logo (the 2027 mark is provisional, D3).
 */
export function GET() {
  if (!site2027Open(deployEnvironment())) return new Response("Not Found", { status: 404 });
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 96px", background: "#0D0B08", color: "#F5EFE4" }}>
        <div style={{ fontSize: 30, letterSpacing: 8, color: "#C8A96A" }}>HAIR EDUCATION BEAUTY SUMMIT</div>
        <div style={{ fontSize: 132, fontWeight: 700, marginTop: 24, lineHeight: 1 }}>HEBS Lagos 2027</div>
        <div style={{ width: 160, height: 2, background: "#C8A96A", marginTop: 48 }} />
        <div style={{ fontSize: 44, marginTop: 40 }}>July 23–25, 2027</div>
      </div>
    ),
    { width: SOCIAL_CARD.width, height: SOCIAL_CARD.height },
  );
}
