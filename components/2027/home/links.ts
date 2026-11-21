import { HOME } from "@/lib/content/home-2027";
import { pageHref, sitePage } from "@/lib/site/2027";

/**
 * Where the preferred homepage links to. Every target comes from the 2027 site map,
 * so the homepage can only link to pages that are built, at their staging paths.
 */

/** The canonical 2027 homepage (the preferred cinematic design), the destination of every header mark. */
export const HOME_HREF = "/2027";

/** The header links, labelled as in the rest of the 2027 site. */
export const NAV = HOME.nav.flatMap((id) => { const href = pageHref(id); return href ? [{ label: sitePage(id).nav, href }] : []; });
