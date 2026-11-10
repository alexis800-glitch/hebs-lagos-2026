import type { Metadata } from "next";
import "../globals.css";
import TrackingConsent from "@/components/TrackingConsent";
import { deployEnvironment } from "@/lib/publication";
import { HOME_FONTS } from "./2027/concepts/fonts-home";

/**
 * Root layout of the HEBS Lagos 2027 site (staging until publication).
 *
 * Separate from the live 2026 root layout in app/(site), so 2027 pages load only
 * the 2027 typefaces (Bodoni Moda and Jost) and none of the 2026 site's fonts.
 * The consent banner and its production-only Meta Pixel behave exactly as on the
 * 2026 site. Withholding on production is unchanged: the middleware answers every
 * /2027 address as a missing page before this layout renders, and the /2027
 * layout fails closed as well.
 *
 * The route group's name is deliberately neutral: both root layouts share client
 * code, so live 2026 pages reference a chunk named after this folder.
 */
export const metadata: Metadata = { metadataBase: new URL("https://hebslagos.com") };

/**
 * globals.css (shared with the 2026 site) hides sideways overflow on html and
 * body, which makes the body a scroll container and stops the sticky 2027
 * header. `clip` hides the overflow the same way without that side effect.
 * The body text is Jost; the 2026 body font is not loaded here.
 */
const BODY_FONT = { fontFamily: "var(--c-jost), Futura, \"Avenir Next\", system-ui, sans-serif" };

export default function Root2027({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth overflow-x-clip ${HOME_FONTS}`}>
      <body className="antialiased overflow-x-clip bg-[#0D0B08] text-white" style={BODY_FONT}>
        {children}
        <TrackingConsent trackingAllowed={deployEnvironment() === "production"} />
      </body>
    </html>
  );
}
