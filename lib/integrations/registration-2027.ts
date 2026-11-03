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
  | "contact"
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
  contact: PENDING_ROUTE("contact message"),
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

/**
 * Whether each website form accepts submissions. All false: submission is not
 * implemented (INTEGRATION-CONTRACT-v1.0 reviewed, implementation not yet
 * authorised) and no portal form is open. Calls to action read these, so no
 * button promises a registration that cannot happen.
 */
export const FORMS_OPEN = { priority: false, sponsor: false, exhibitor: false, enquiry: false } as const;

export type FormId = keyof typeof FORMS_OPEN;

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
  /** Longest accepted value, in characters (text kinds). */
  maxLength?: number;
  /** Rendered but not usable: the contract does not yet define secure handling for it. */
  inactive?: string;
  /**
   * Checkboxes only. "acknowledgement": required to submit, records that the
   * person was told how their details are used for what they asked for.
   * "marketing": optional, unticked by default, never a condition of submitting.
   */
  consent?: "acknowledgement" | "marketing";
}

/**
 * Consent, split (owner review of 2026-11-03): the details needed to handle
 * the request are acknowledged; marketing is a separate, optional opt-in. The
 * privacy notice they refer to is decision D13 and must exist before any form opens.
 */
const ACKNOWLEDGE = (purpose: string): FieldSpec => ({
  name: "privacy_acknowledged",
  label: `I understand HEBS will use these details to ${purpose}, as described in the privacy notice.`,
  kind: "checkbox",
  required: true,
  consent: "acknowledgement",
});
const MARKETING: FieldSpec = {
  name: "marketing_opt_in",
  label: "Send me HEBS news and event updates by email. I can unsubscribe at any time.",
  kind: "checkbox",
  required: false,
  consent: "marketing",
};

/** Directive section 6, "Area of interest". */
export const INTEREST_OPTIONS = ["Attendee", "Competitor", "Educator", "Exhibitor", "Sponsor", "Other"] as const;

/** Directive section 6: the priority list collects exactly these. */
export const PRIORITY_LIST_FIELDS: readonly FieldSpec[] = [
  { name: "full_name", label: "Full name", kind: "text", required: true, autoComplete: "name", maxLength: 200 },
  { name: "email", label: "Email address", kind: "email", required: true, autoComplete: "email", maxLength: 200 },
  { name: "country", label: "Country of residence", kind: "text", required: true, autoComplete: "country-name", maxLength: 100 },
  { name: "phone", label: "Phone number", kind: "tel", required: false, autoComplete: "tel", maxLength: 40 },
  { name: "interest", label: "Area of interest", kind: "select", required: true, options: INTEREST_OPTIONS },
  ACKNOWLEDGE("tell me when HEBS 2027 registration, tickets and the programme open"),
  MARKETING,
];

/** Directive 4H and section 8: the four kinds of partnership. */
export const PARTNERSHIP_OPTIONS = ["Sponsorship", "Exhibition", "Brand activation", "Strategic partnership"] as const;

/** Directive section 8: submit a sponsorship inquiry, request the prospectus. */
export const SPONSOR_INQUIRY_FIELDS: readonly FieldSpec[] = [
  { name: "company_name", label: "Company or brand", kind: "text", required: true, autoComplete: "organization", maxLength: 200 },
  { name: "contact_name", label: "Your name", kind: "text", required: true, autoComplete: "name", maxLength: 200 },
  { name: "email", label: "Work email", kind: "email", required: true, autoComplete: "email", maxLength: 200 },
  { name: "phone", label: "Phone number", kind: "tel", required: false, autoComplete: "tel", maxLength: 40 },
  { name: "country", label: "Country", kind: "text", required: true, autoComplete: "country-name", maxLength: 100 },
  { name: "partnership_interest", label: "Interested in", kind: "select", required: true, options: PARTNERSHIP_OPTIONS },
  { name: "message", label: "What would you like to achieve at HEBS 2027?", kind: "textarea", required: false, maxLength: 2000 },
  { name: "prospectus_requested", label: "Send me the 2027 sponsorship prospectus when it is available.", kind: "checkbox", required: false },
  ACKNOWLEDGE("respond to my partnership inquiry"),
  MARKETING,
];

/** Directive section 8: apply for exhibition participation, upload basic company information. */
export const EXHIBITOR_APPLICATION_FIELDS: readonly FieldSpec[] = [
  { name: "company_name", label: "Company or brand", kind: "text", required: true, autoComplete: "organization", maxLength: 200 },
  { name: "contact_name", label: "Your name", kind: "text", required: true, autoComplete: "name", maxLength: 200 },
  { name: "email", label: "Work email", kind: "email", required: true, autoComplete: "email", maxLength: 200 },
  { name: "phone", label: "Phone number", kind: "tel", required: false, autoComplete: "tel", maxLength: 40 },
  { name: "country", label: "Country", kind: "text", required: true, autoComplete: "country-name", maxLength: 100 },
  { name: "company_website", label: "Website or social page", kind: "url", required: false, autoComplete: "url", maxLength: 200 },
  { name: "products", label: "What you would exhibit", kind: "textarea", required: true, maxLength: 1000 },
  { name: "company_profile", label: "Company profile", kind: "file", required: false,
    inactive: "Uploads open once the integration contract defines secure file handling. Nothing is uploaded until then." },
  ACKNOWLEDGE("assess my exhibitor application and contact me about it"),
  MARKETING,
];

/** Directive section 5, Contact us: a general message. */
export const CONTACT_TOPICS = ["General question", "Attending", "Competing", "Education", "Press", "Other"] as const;
export const CONTACT_FIELDS: readonly FieldSpec[] = [
  { name: "full_name", label: "Your name", kind: "text", required: true, autoComplete: "name", maxLength: 200 },
  { name: "email", label: "Email address", kind: "email", required: true, autoComplete: "email", maxLength: 200 },
  { name: "topic", label: "Topic", kind: "select", required: true, options: CONTACT_TOPICS },
  { name: "message", label: "Message", kind: "textarea", required: true, maxLength: 2000 },
  ACKNOWLEDGE("reply to my message"),
];

for (const list of [PRIORITY_LIST_FIELDS, SPONSOR_INQUIRY_FIELDS, EXHIBITOR_APPLICATION_FIELDS, CONTACT_FIELDS]) {
  for (const f of list) {
    if (f.consent === "marketing" && f.required) throw new Error(`[registration-2027] marketing consent "${f.name}" must be optional`);
    if (f.consent && f.kind !== "checkbox") throw new Error(`[registration-2027] consent field "${f.name}" must be a checkbox`);
  }
  if (list.filter((f) => f.consent === "acknowledgement").length !== 1) throw new Error("[registration-2027] every form carries one privacy acknowledgement");
}

/** The four website forms (owner instruction of 2026-11-04), by form id. */
export const FORM_FIELDS: Record<FormId, readonly FieldSpec[]> = {
  priority: PRIORITY_LIST_FIELDS,
  sponsor: SPONSOR_INQUIRY_FIELDS,
  exhibitor: EXHIBITOR_APPLICATION_FIELDS,
  enquiry: CONTACT_FIELDS,
};
