/**
 * The website side of the HEBS 2027 registration system (Base44, built
 * separately by Claude Desktop). Nothing here sends data anywhere.
 *
 * The pattern proposed for review: the website never handles a registration.
 * Every form on the site is a preview until its Base44 2027 page is approved;
 * from then on the button becomes a plain link to that page, so names, emails
 * and payments are entered on the portal only and never pass through this site.
 * A link is also what a printed QR code needs (directive section 9).
 *
 * A destination becomes a live link only when ALL of these hold:
 *   - its address is `approved` (lib/publication.ts) - set only on owner approval;
 *   - it is https, carries no credentials, and its host is in PORTAL_HOSTS;
 *   - PORTAL_HOSTS names the 2027 portal - empty until that host is confirmed.
 * Anything else renders "Opens soon".
 *
 * The field lists are the website's proposal for the Base44 2027 schemas, taken
 * from directive sections 6 and 8. They are to be checked against the schemas
 * Claude Desktop builds (decision D1), not assumed to match them.
 */
import { gatedValue, type DeployEnvironment, type Gated } from "../publication";

export type PortalDestination =
  | "priority-list"
  | "sponsor-inquiry"
  | "exhibitor-application"
  | "competition-application"
  | "education-registration"
  | "tickets";

const PENDING_ROUTE = (what: string): Gated<string> => ({
  status: "awaiting-confirmation",
  note: `Base44 2027 ${what} page not yet built and approved (D1).`,
});

/** One Base44 2027 page per destination. None is approved yet. */
export const PORTAL_2027: Record<PortalDestination, Gated<string>> = {
  "priority-list": PENDING_ROUTE("priority list"),
  "sponsor-inquiry": PENDING_ROUTE("sponsor inquiry"),
  "exhibitor-application": PENDING_ROUTE("exhibitor application"),
  "competition-application": PENDING_ROUTE("competition application"),
  "education-registration": PENDING_ROUTE("education registration"),
  // Directive section 6: ticket categories, prices and payment gateways are approved separately.
  tickets: { status: "awaiting-confirmation", note: "Ticket sales not authorised; categories, prices and payment gateway awaiting approval." },
};

/**
 * Hosts a portal link may point at. Deliberately empty: the 2026 portal
 * (hebseventportal.com) is not assumed to be the 2027 system's host.
 */
export const PORTAL_HOSTS: readonly string[] = [];

/** The live portal address for a destination, or null ("Opens soon"). */
export function portalLink(
  destination: PortalDestination,
  environment: DeployEnvironment,
  routes: Record<PortalDestination, Gated<string>> = PORTAL_2027,
  hosts: readonly string[] = PORTAL_HOSTS,
): string | null {
  const field = routes[destination];
  if (field.status !== "approved") return null;
  const raw = gatedValue(field, environment);
  if (!raw) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" || u.username || u.password || !hosts.includes(u.hostname)) return null;
  return u.toString();
}

/* ------------------------------------------------------------------ */
/* Field contracts                                                     */
/* ------------------------------------------------------------------ */

export type FieldKind = "text" | "email" | "tel" | "url" | "select" | "textarea" | "checkbox" | "file";

export interface FieldSpec {
  /** Proposed Base44 field name. */
  name: string;
  label: string;
  kind: FieldKind;
  required: boolean;
  autoComplete?: string;
  options?: readonly string[];
  /** Short helper text under the control. */
  hint?: string;
}

/** Directive section 6, "Area of interest". */
export const INTEREST_OPTIONS = ["Attendee", "Competitor", "Educator", "Exhibitor", "Sponsor", "Other"] as const;

/** Directive section 6: the priority list collects exactly these. */
export const PRIORITY_LIST_FIELDS: readonly FieldSpec[] = [
  { name: "full_name", label: "Full name", kind: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email address", kind: "email", required: true, autoComplete: "email" },
  { name: "country", label: "Country of residence", kind: "text", required: true, autoComplete: "country-name" },
  { name: "phone", label: "Phone number", kind: "tel", required: false, autoComplete: "tel" },
  { name: "interest", label: "Area of interest", kind: "select", required: true, options: INTEREST_OPTIONS },
  { name: "consent_updates", label: "I agree to receive HEBS 2027 event updates.", kind: "checkbox", required: true },
];

/** Directive 4H and section 8: the four kinds of partnership. */
export const PARTNERSHIP_OPTIONS = ["Sponsorship", "Exhibition", "Brand activation", "Strategic partnership"] as const;

/** Directive section 8: submit a sponsorship inquiry, request the prospectus. */
export const SPONSOR_INQUIRY_FIELDS: readonly FieldSpec[] = [
  { name: "company_name", label: "Company or brand", kind: "text", required: true, autoComplete: "organization" },
  { name: "contact_name", label: "Your name", kind: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Work email", kind: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone number", kind: "tel", required: false, autoComplete: "tel" },
  { name: "country", label: "Country", kind: "text", required: true, autoComplete: "country-name" },
  { name: "partnership_interest", label: "Interested in", kind: "select", required: true, options: PARTNERSHIP_OPTIONS },
  { name: "message", label: "What would you like to achieve at HEBS 2027?", kind: "textarea", required: false },
  { name: "prospectus_requested", label: "Send me the 2027 sponsorship prospectus when it is available.", kind: "checkbox", required: false },
];

/** Directive section 8: apply for exhibition participation, upload basic company information. */
export const EXHIBITOR_APPLICATION_FIELDS: readonly FieldSpec[] = [
  { name: "company_name", label: "Company or brand", kind: "text", required: true, autoComplete: "organization" },
  { name: "contact_name", label: "Your name", kind: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Work email", kind: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone number", kind: "tel", required: false, autoComplete: "tel" },
  { name: "country", label: "Country", kind: "text", required: true, autoComplete: "country-name" },
  { name: "website", label: "Website or social page", kind: "url", required: false, autoComplete: "url" },
  { name: "products", label: "What you would exhibit", kind: "textarea", required: true },
  { name: "company_profile", label: "Company profile", kind: "file", required: false, hint: "PDF, up to the size the portal allows." },
];

if (PRIORITY_LIST_FIELDS.filter((f) => f.required).length !== 5) {
  throw new Error("[registration-2027] the priority list makes every field but the phone number required");
}
