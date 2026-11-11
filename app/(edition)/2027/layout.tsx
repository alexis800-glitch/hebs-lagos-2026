import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deployEnvironment } from "@/lib/publication";
import { site2027Open } from "@/lib/launch-2027";
import { PreviewBanner } from "@/components/2027/sections";
import { SiteFooter } from "@/components/2027/site/SiteFooter";

/**
 * The HEBS 2027 site, staging until launch.
 *
 * Fails closed: on a production deployment the pages are withheld (404) until
 * lib/launch-2027.ts opens the site. Each page's own metadata (lib/site/seo-2027.ts)
 * sets its title, description, canonical address, social card and indexing.
 */
const withheld = () => !site2027Open(deployEnvironment());

/**
 * Metadata follows the same gate. A withheld page gets none of its own, so its
 * 404 is identical to any other missing page and says nothing about 2027.
 * Previews drop the 2026 keywords inherited from the root layout.
 */
export function generateMetadata(): Metadata {
  if (withheld()) return {};
  return {
    title: "HEBS Lagos 2027 — Staging Preview",
    description: "Staging preview of the HEBS Lagos 2027 website. Not published.",
    keywords: null,
    robots: deployEnvironment() === "production" ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
    alternates: { canonical: null },
    openGraph: null,
    twitter: null,
  };
}

export default function Layout2027({ children }: { children: React.ReactNode }) {
  if (withheld()) notFound();
  return (
    <div className="min-h-screen bg-h27-ink text-h27-ivory">
      <PreviewBanner />
      {children}
      <SiteFooter />
    </div>
  );
}
