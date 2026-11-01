import type { Viewport } from "next";
import { Announcement2027A } from "@/components/2027/editorial/pages";
import type { BrandVariant, NotesMode } from "@/components/2027/editorial/tokens";
import { deployEnvironment } from "@/lib/publication";
import { EDITORIAL_FONTS } from "./concepts/fonts-editorial";

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

/**
 * Deliverable A: the HEBS 2027 announcement landing page (directive section
 * 11), in the approved Direction A. Same review variants as the homepage.
 */
export default function Announcement2027({ searchParams }: { searchParams: { brand?: string; notes?: string } }) {
  const brand: BrandVariant = searchParams.brand === "champagne" ? "champagne" : "mark";
  const notes: NotesMode = searchParams.notes === "panel" ? "panel" : "inline";
  return (
    <div className={EDITORIAL_FONTS}>
      <Announcement2027A environment={deployEnvironment()} brand={brand} notes={notes} />
    </div>
  );
}
