import type { Metadata } from "next";
import { deployEnvironment, isPagePublishable } from "@/lib/publication";
import { previewStatuses } from "@/lib/content/2027";

/**
 * Creative concepts for owner review. Inherits the /2027 layout, so these
 * routes carry the staging banner, are noindex, and return 404 on production.
 * Each page loads only its own fonts (fonts-editorial.ts, fonts-destination.ts).
 */
export function generateMetadata(): Metadata {
  // Withheld in production by the /2027 layout: no metadata of its own then.
  if (!isPagePublishable(previewStatuses(), deployEnvironment())) return {};
  return { title: "HEBS Lagos 2027 — Creative Concepts (Staging)", robots: { index: false, follow: false, nocache: true } };
}

export default function ConceptsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
