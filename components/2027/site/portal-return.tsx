"use client";
import { useEffect } from "react";
import { withSite } from "@/lib/integrations/portal-site";

/**
 * Adds the website's own origin (`site`) to every booking-portal link on the page
 * (a[data-portal]) once the page is running, from window.location.origin. Before
 * that, or if the origin is not https, the links work exactly as before, without it.
 */
export function PortalReturn({ allow }: { allow?: string }) {
  // `allow`: on production booking links, the website origins that may be sent
  // (portalReturnRule); unset on staging links, which behave as before.
  useEffect(() => {
    for (const a of Array.from(document.querySelectorAll<HTMLAnchorElement>("a[data-portal]"))) {
      a.href = withSite(a.href, window.location.origin, allow);
    }
  }, [allow]);
  return null;
}
