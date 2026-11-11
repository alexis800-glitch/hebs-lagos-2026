import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site2027Open } from "@/lib/launch-2027";
import { deployEnvironment } from "@/lib/publication";
import { SOCIAL_CARD } from "@/lib/site/seo-2027";

/**
 * The 2027 social sharing card: type only, in the site's Bodoni Moda and Jost,
 * black and champagne, with the summit's name and confirmed dates. It uses no
 * photograph (none is cleared for public use) and no logo (the 2027 mark is
 * provisional, D3). Fonts: ./fonts/README.md.
 */
const font = (name: string) => readFile(join(process.cwd(), "app/(edition)/2027/social-card/fonts", name));

export async function GET() {
  if (!site2027Open(deployEnvironment())) return new Response("Not Found", { status: 404 });
  const [bodoni, bodoniItalic, jost] = await Promise.all([font("bodoni-moda-500.ttf"), font("bodoni-moda-italic-400.ttf"), font("jost-500.ttf")]);
  const gold = "linear-gradient(100deg, #C9A35E 0%, #F6E6BD 34%, #D8B776 55%, #FFF1CF 76%, #C29A55 100%)";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 96px", background: "radial-gradient(70% 80% at 78% 30%, #2A2016 0%, #0D0B08 70%)", color: "#F6EFE2" }}>
        <div style={{ fontFamily: "Jost", fontSize: 22, letterSpacing: 9, color: "#D9C192" }}>{SOCIAL_CARD.lines.kicker}</div>
        <div style={{ display: "flex", alignItems: "baseline", fontFamily: "Bodoni", fontSize: 128, marginTop: 22, lineHeight: 1 }}>
          <span style={{ marginRight: 34 }}>{SOCIAL_CARD.lines.name}</span>
          <span style={{ fontFamily: "Bodoni Italic", backgroundImage: gold, backgroundClip: "text", color: "transparent" }}>{SOCIAL_CARD.lines.city}</span>
        </div>
        <div style={{ fontFamily: "Bodoni", fontSize: 128, lineHeight: 1.05 }}>{SOCIAL_CARD.lines.year}</div>
        <div style={{ width: 180, height: 2, background: "linear-gradient(90deg, #8C6B34, #E9D4A2 50%, #B8914C)", marginTop: 34 }} />
        <div style={{ fontFamily: "Jost", fontSize: 28, letterSpacing: 7, marginTop: 28, color: "#F0E2C4" }}>{SOCIAL_CARD.lines.dates}</div>
      </div>
    ),
    {
      width: SOCIAL_CARD.width,
      height: SOCIAL_CARD.height,
      fonts: [
        { name: "Bodoni", data: bodoni, weight: 500, style: "normal" },
        { name: "Bodoni Italic", data: bodoniItalic, weight: 400, style: "italic" },
        { name: "Jost", data: jost, weight: 500, style: "normal" },
      ],
    },
  );
}
