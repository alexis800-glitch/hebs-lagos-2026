/**
 * The website's address on links to the booking portal, so the portal's "Back to
 * website" returns visitors to the deployment they came from (portal contract:
 * validated `site` parameter, Claude Desktop, 17 Nov 2026).
 *
 * Only the origin (https://host) is ever sent: never a path or query, which on a
 * protected preview can carry a Vercel share token, and never credentials. The
 * origin is read in the browser at navigation time (window.location.origin), not
 * from VERCEL_URL, so it is always the deployment actually being viewed, even on a
 * CLI prebuilt preview. Kept free of server configuration so it can run in the browser.
 */
export const SITE_PARAM = "site";

/** The https origin of `raw`, or null when it is not a plain https address. */
export function siteOrigin(raw: string): string | null {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" || u.username || u.password || !u.hostname) return null;
  return u.origin;
}

/**
 * `link` with `site=<origin>` added, or `link` unchanged when the origin is not valid
 * or, given `allow` (a pattern source), does not match it (fails safe).
 */
export function withSite(link: string, origin: string, allow?: string): string {
  const o = siteOrigin(origin);
  if (!o) return link;
  if (allow !== undefined && !new RegExp(allow).test(o)) return link;
  let u: URL;
  try {
    u = new URL(link);
  } catch {
    return link;
  }
  u.searchParams.set(SITE_PARAM, o);
  return u.toString();
}
