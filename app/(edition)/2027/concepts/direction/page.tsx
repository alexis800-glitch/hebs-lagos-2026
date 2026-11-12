import type { Viewport } from "next";
import DirectionA, { type BrandVariant, type NotesMode } from "@/components/2027/concepts/DirectionA";
import { deployEnvironment } from "@/lib/publication";
import { EDITORIAL_FONTS } from "../fonts-editorial";

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

/**
 * Review variants: ?brand=type compares an internal typographic wordmark with
 * the official mark; ?notes=panel moves the staging notes out of the
 * composition into a list after it. Anything else falls back to the defaults.
 */
export default function DirectionAPage({ searchParams }: { searchParams: { brand?: string; notes?: string } }) {
  const brand: BrandVariant = searchParams.brand === "type" ? "type" : "mark";
  const notes: NotesMode = searchParams.notes === "panel" ? "panel" : "inline";
  return (
    <div className={EDITORIAL_FONTS}>
      <DirectionA environment={deployEnvironment()} brand={brand} notes={notes} />
    </div>
  );
}
