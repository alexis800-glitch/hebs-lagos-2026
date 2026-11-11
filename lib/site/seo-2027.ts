/**
 * Search and social metadata for the HEBS Lagos 2027 pages: title, description,
 * canonical address, social card and indexing, built only from the site's own
 * copy (lib/content), so nothing here states a fact that is not already on the
 * page and approved with it.
 *
 * Behind the launch gate (lib/launch-2027.ts): a withheld page gets no metadata
 * at all, so its production 404 says nothing about 2027. Only a launched
 * production page may be indexed; previews carry the same tags with noindex.
 */
import type { Metadata } from "next";
import { COPY } from "../content/2027";
import { PAGES } from "../content/2027-pages";
import { pagePublished, siteOrigin, type LaunchInputs } from "../launch-2027";
import { clientPreview, deployEnvironment, type DeployEnvironment } from "../publication";
import { BASE, SITE_PAGES, sitePage, type PageId } from "./2027";

export const SITE_NAME = "HEBS Lagos 2027";

export const SOCIAL_CARD = {
  path: `${BASE}/social-card`,
  width: 1200,
  height: 630,
  alt: "HEBS Lagos 2027, July 23–25, 2027",
  /** The card's wording, line by line (app/(edition)/2027/social-card/route.tsx). */
  lines: { kicker: "HAIR EDUCATION BEAUTY SUMMIT", name: "HEBS", city: "Lagos", year: "2027", dates: "JULY 23–25, 2027" },
} as const;

/** Shortens to at most `max` characters at a word boundary. */
export function clip(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}

export function pageTitle(id: PageId): string {
  return id === "home" ? COPY.seo.homeTitle.text : `${sitePage(id).title} | ${SITE_NAME}`;
}

export function pageDescription(id: PageId): string {
  if (id === "home") return clip(COPY.seo.homeDescription.text);
  if (id === "about") return clip(COPY.seo.aboutDescription.text);
  return clip(PAGES[id].intro.text);
}

/** The page's absolute address on the 2027 site. */
export function canonicalUrl(id: PageId, inputs: LaunchInputs = {}): string {
  return `${siteOrigin(inputs.config)}${sitePage(id).path}`;
}

export function pageMetadata(id: PageId, environment: DeployEnvironment = deployEnvironment(), inputs: LaunchInputs = {}): Metadata {
  if (!pagePublished(id, environment, inputs)) return {};
  const live = environment === "production" && !clientPreview();
  const title = pageTitle(id);
  const description = pageDescription(id);
  const url = canonicalUrl(id, inputs);
  const image = { url: `${siteOrigin(inputs.config)}${SOCIAL_CARD.path}`, width: SOCIAL_CARD.width, height: SOCIAL_CARD.height, alt: SOCIAL_CARD.alt };
  return {
    title: { absolute: live ? title : `${title} (staging)` },
    description,
    keywords: null,
    alternates: { canonical: url },
    robots: live ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
    openGraph: { type: "website", url, siteName: SITE_NAME, title, description, locale: "en_NG", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/**
 * The 2027 sitemap: every published page and nothing else. On production it
 * exists only after launch (the middleware withholds it until then) and lists
 * only the pages launched; previews list every built page and are not indexed.
 * The live 2026 site has no robots.txt or sitemap, and this adds none at the root.
 */
export function sitemapXml(environment: DeployEnvironment = deployEnvironment(), inputs: LaunchInputs = {}): string | null {
  const pages = SITE_PAGES.filter((p) => pagePublished(p.id, environment, inputs));
  if (pages.length === 0) return null;
  const origin = siteOrigin(inputs.config);
  const urls = pages.map((p) => `  <url><loc>${origin}${p.path}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
