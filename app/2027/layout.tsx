import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deployEnvironment, isPagePublishable } from "@/lib/publication";
import { previewStatuses } from "@/lib/content/2027";
import { Footer2027, PreviewBanner } from "@/components/2027/sections";

/**
 * Staging-only HEBS 2027 preview.
 *
 * Fails closed: the 2027 pages hold provisional and awaiting-confirmation
 * material, so on a production deployment they are withheld (404) until every
 * item they render is approved. Previews are also kept out of search engines.
 */
export const metadata: Metadata = {
  title: "HEBS Lagos 2027 — Staging Preview",
  description: "Staging preview of the HEBS Lagos 2027 website. Not published.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function Layout2027({ children }: { children: React.ReactNode }) {
  if (!isPagePublishable(previewStatuses(), deployEnvironment())) notFound();
  return (
    <div className="min-h-screen bg-h27-ink text-h27-ivory">
      <PreviewBanner />
      {children}
      <Footer2027 />
    </div>
  );
}
