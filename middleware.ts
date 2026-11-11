import { NextResponse, type NextRequest } from "next/server";
import { deployEnvironment, type DeployEnvironment, type PublicationStatus } from "@/lib/publication";
import { previewStatuses } from "@/lib/content/2027";
import { pathPublished, type LaunchInputs } from "@/lib/launch-2027";

/**
 * Withholds the unpublished HEBS 2027 pages on production before Next.js renders anything.
 *
 * The /2027 layout already answers 404 on production, but by then the page has been
 * rendered, and its copy and staging notes travel inside the 404's HTML and RSC
 * payload. Here the request never reaches a 2027 route: it is rewritten to a path
 * that does not exist, so production answers exactly as it does for any other
 * missing page. That covers page loads, RSC requests and router prefetches alike,
 * since all three are requests for the same path. Review media is withheld the same way.
 *
 * The gate is lib/launch-2027.ts, the same one the layout and pages use, so they
 * can only open together: on production, once launch is authorised, every
 * mandatory requirement is met, and only for the pages listed for launch.
 */

/** A path with no route, so Next.js serves its standard 404 for it. */
export const WITHHELD_PATH = "/_withheld";

/**
 * Whether `pathname` must be answered as a missing page in `environment`.
 * Review media is internal-review material and never served on production; the
 * 2027 pages follow the publication gate.
 */
export function isWithheld(pathname: string, environment: DeployEnvironment, statuses: readonly PublicationStatus[], inputs: LaunchInputs = {}): boolean {
  if (/^\/_review(\/|$)/.test(pathname)) return environment === "production";
  if (/^\/2027(\/|$)/.test(pathname)) return !pathPublished(pathname, environment, { statuses, ...inputs });
  return false;
}

/**
 * The deployment's environment, read in a form the Edge runtime is sure to provide:
 * Next.js passes a variable to middleware only when the code names it literally as
 * `process.env.NAME`. On Vercel without a VERCEL_ENV, it fails closed to production.
 */
export function middlewareEnvironment(env: { VERCEL?: string; VERCEL_ENV?: string } = { VERCEL: process.env.VERCEL, VERCEL_ENV: process.env.VERCEL_ENV }): DeployEnvironment {
  if (env.VERCEL === "1" && !env.VERCEL_ENV) return "production";
  return deployEnvironment({ VERCEL_ENV: env.VERCEL_ENV });
}

export function middleware(request: NextRequest) {
  if (!isWithheld(request.nextUrl.pathname, middlewareEnvironment(), previewStatuses())) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = WITHHELD_PATH;
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/2027", "/2027/:path*", "/_review/:path*"],
};
