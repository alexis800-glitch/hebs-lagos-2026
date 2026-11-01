import type { Viewport } from "next";
import { Homepage2027A } from "@/components/2027/editorial/pages";
import type { BrandVariant, NotesMode } from "@/components/2027/editorial/tokens";
import { deployEnvironment } from "@/lib/publication";
import { EDITORIAL_FONTS } from "../concepts/fonts-editorial";

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

/**
 * Deliverable B: the complete homepage, sections A-J of directive section 4,
 * in the approved Direction A. Review variants: ?notes=panel lists the staging
 * notes after the page instead of beside each section; ?brand=champagne shows
 * the champagne-and-ivory colour study of the official mark (D3 comparison).
 */
export default function Homepage2027({ searchParams }: { searchParams: { brand?: string; notes?: string } }) {
  const brand: BrandVariant = searchParams.brand === "champagne" ? "champagne" : "mark";
  const notes: NotesMode = searchParams.notes === "panel" ? "panel" : "inline";
  return (
    <div className={EDITORIAL_FONTS}>
      <Homepage2027A environment={deployEnvironment()} brand={brand} notes={notes} />
    </div>
  );
}
