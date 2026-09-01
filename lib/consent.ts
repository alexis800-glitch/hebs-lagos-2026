/**
 * Meta Pixel tracking consent.
 *
 * The HEBS site runs one optional tracking technology: the Meta Pixel, used to
 * measure advertising performance and how visitors interact with the site. It is
 * not needed to browse, register or contact us, so it is switched off until the
 * visitor actively asks for it.
 *
 * The decision lives in a first-party cookie. Only the two words below are ever
 * stored - no identifier, no profile, nothing about the visitor personally.
 *
 * Consent design follows the Nigeria Data Protection Act 2023, section 26:
 * the request is written in clear and simple language, consent is affirmative
 * (nothing is pre-selected and no decision is assumed from silence or from
 * dismissing the banner), and it can be withdrawn at any time from the
 * "Cookie preferences" control in the footer.
 *
 * Anything other than an exact "accepted" - a missing cookie, an empty value, a
 * stale or tampered one - reads as "no decision yet", which keeps the pixel off.
 * Absence is never acceptance.
 */

/** The HEBS advertising pixel. Declared once so no component can hard-code it. */
export const META_PIXEL_ID = "1921219138538371";

export const CONSENT_COOKIE_NAME = "hebs_tracking_consent";

export const CONSENT_ACCEPTED = "accepted";
export const CONSENT_REJECTED = "rejected";

export type ConsentDecision = typeof CONSENT_ACCEPTED | typeof CONSENT_REJECTED;

/** 12 months. After this the visitor is asked again rather than assumed. */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** The footer control dispatches this; the consent UI listens for it. */
export const OPEN_PREFERENCES_EVENT = "hebs:open-cookie-preferences";

/**
 * The stored decision, or null when the visitor has not made one.
 * Returns null on the server and for any unrecognised value.
 */
export function readConsent(): ConsentDecision | null {
  if (typeof document === "undefined") return null;

  const prefix = `${CONSENT_COOKIE_NAME}=`;
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!match) return null;

  const value = decodeURIComponent(match.slice(prefix.length));
  if (value === CONSENT_ACCEPTED) return CONSENT_ACCEPTED;
  if (value === CONSENT_REJECTED) return CONSENT_REJECTED;
  return null;
}

/**
 * Record a decision for 12 months.
 *
 * SameSite=Lax and Path=/ so the choice applies across the site and is not sent
 * on cross-site requests. Secure is set whenever the page is served over HTTPS,
 * which covers production while leaving http://localhost testable.
 */
export function writeConsent(decision: ConsentDecision): void {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${CONSENT_COOKIE_NAME}=${decision}` +
    `; Max-Age=${CONSENT_MAX_AGE_SECONDS}` +
    `; Path=/` +
    `; SameSite=Lax` +
    secure;
}
