"use client";

import Script from "next/script";
import { META_PIXEL_ID } from "@/lib/consent";

/**
 * Loads the Meta Pixel.
 *
 * Rendered only while the consent cookie says "accepted", so mounting this
 * component IS the consent gate - there is no other path to fbevents.js in the
 * codebase. Nothing here runs before the visitor has chosen Accept.
 *
 * The guard flag makes initialisation idempotent: React may remount this on
 * navigation, and Meta's own snippet only guards the loader, not the init and
 * PageView calls that follow it. Without the flag a remount would fire a second
 * PageView for the same visit.
 */
export default function MetaPixel() {
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`if (!window.__hebsMetaPixelInitialised) {
  window.__hebsMetaPixelInitialised = true;
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${META_PIXEL_ID}');
  fbq('track', 'PageView');
}`}
    </Script>
  );
}

declare global {
  interface Window {
    __hebsMetaPixelInitialised?: boolean;
  }
}

/**
 * True once the pixel has actually run in this document.
 *
 * Withdrawal uses this: a script cannot be unloaded, so if the pixel is already
 * live the page has to be reloaded to be rid of it. If it never ran, no reload
 * is needed.
 */
export function metaPixelIsLive(): boolean {
  return typeof window !== "undefined" && window.__hebsMetaPixelInitialised === true;
}
