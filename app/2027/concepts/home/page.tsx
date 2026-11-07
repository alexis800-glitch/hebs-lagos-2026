import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { deployEnvironment, isPagePublishable } from "@/lib/publication";
import { previewStatuses } from "@/lib/content/2027";
import { PreferredHomepage } from "@/components/2027/home/HomePage";
import { HOME_FONTS } from "../fonts-home";

export const viewport: Viewport = { themeColor: "#0D0B08", colorScheme: "dark" };

/**
 * The preferred HEBS Lagos 2027 homepage design (owner approval of 2026-11-07).
 * Staging only: the /2027 layout withholds it on production. Real HEBS Lagos
 * 2026 and NJS media appear only in local development, from the gitignored
 * public/_review/home-2027/ folder; everywhere else each picture is a labelled
 * placeholder. See docs/design/2027-home/README.md.
 */
export default function PreferredHomepagePage() {
  // The /2027 layout already withholds this route on production. Checking here too
  // stops the page itself rendering, so none of its copy reaches a production response.
  if (!isPagePublishable(previewStatuses(), deployEnvironment())) notFound();
  return (
    <div className={HOME_FONTS}>
      <PreferredHomepage />
    </div>
  );
}
