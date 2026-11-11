import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { deployEnvironment } from "@/lib/publication";
import { pagePublished } from "@/lib/launch-2027";
import { pageMetadata } from "@/lib/site/seo-2027";
import { EventJsonLd } from "@/components/2027/site/EventJsonLd";
import { PreferredHomepage } from "@/components/2027/home/HomePage";

export function generateMetadata() {
  return pageMetadata("home");
}

export const viewport: Viewport = { themeColor: "#0D0B08", colorScheme: "dark" };

/**
 * The HEBS Lagos 2027 homepage: the preferred cinematic design (owner approval of
 * 2026-11-07), canonical from A2 (2026-11-10). Staging only. Production never
 * reaches it (middleware), and the page refuses to render there as well, so none
 * of its copy can enter a production response. Real HEBS Lagos 2026 and NJS
 * media appear only in development and in the protected review preview; see
 * docs/design/2027-home/README.md.
 */
export default function Home2027() {
  if (!pagePublished("home", deployEnvironment())) notFound();
  return (
    <>
      <EventJsonLd />
      <PreferredHomepage />
    </>
  );
}
