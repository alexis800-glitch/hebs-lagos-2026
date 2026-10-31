import type { Metadata } from "next";
import { CONCEPT_FONT_VARIABLES } from "./fonts";

/**
 * Creative concepts for owner review. Inherits the /2027 layout, so these
 * routes carry the staging banner, are noindex, and return 404 on production.
 */
export const metadata: Metadata = {
  title: "HEBS Lagos 2027 — Creative Concepts (Staging)",
  robots: { index: false, follow: false, nocache: true },
};

export default function ConceptsLayout({ children }: { children: React.ReactNode }) {
  return <div className={CONCEPT_FONT_VARIABLES}>{children}</div>;
}
