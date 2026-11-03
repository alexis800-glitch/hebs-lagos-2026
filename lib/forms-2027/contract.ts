/**
 * The website <-> portal contract, in one place: payload mapping and response
 * classification. PROVISIONAL: written against INTEGRATION-CONTRACT-v1.0
 * revision 1 (3 Nov 2026). v1.1, which resolves differences with the owner's
 * directive, replaces this file. `final: false` keeps real-portal mode off
 * (lib/forms-2027/config.ts) until then; only the mock portal uses it.
 *
 * Fields the directive asks for that v1.0 has no place for are listed in
 * CONTRACT_GAPS and are NOT sent: v1.0 rejects unknown fields.
 */
import type { FormId } from "../integrations/registration-2027";
import type { FormValues } from "./validate";

export const CONTRACT = { version: "1.0 revision 1", final: false } as const;

/** The privacy notice version sent with consent (directive section 9; decision D13). None exists yet. */
export const PRIVACY_NOTICE_VERSION: string | null = null;

/** Directive fields with no v1.0 equivalent, by form. For the compatibility report and the tests. */
export const CONTRACT_GAPS: Record<FormId, string[]> = {
  priority: ["interest: Educator (v1.0 enum has no Educator)", "privacy_acknowledged (no v1.0 field)"],
  sponsor: ["country", "partnership_interest", "prospectus_requested", "privacy_acknowledged", "marketing_opt_in"],
  exhibitor: ["country", "company_website", "company_profile (no upload in v1.0)", "privacy_acknowledged", "marketing_opt_in"],
  enquiry: ["privacy_acknowledged"],
};

const PORTAL_FORM: Record<FormId, string> = { priority: "priority", sponsor: "sponsor", exhibitor: "exhibitor", enquiry: "enquiry" };

/** v1.0 interest enum: Attendee, Contestant, Sponsor, Exhibitor, Media, Other. */
const INTEREST_V1: Record<string, string | null> = {
  Attendee: "Attendee", Competitor: "Contestant", Exhibitor: "Exhibitor", Sponsor: "Sponsor", Other: "Other", Educator: null,
};

export class ContractGapError extends Error {}

const str = (v: FormValues[string] | undefined) => (typeof v === "string" && v ? v : undefined);
const pick = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

/** The v1.0 request body for validated website values. Throws ContractGapError when a value cannot be represented. */
export function toPortalBody(form: FormId, v: FormValues, clientRequestId: string) {
  let data: Record<string, unknown>;
  switch (form) {
    case "priority": {
      const interest = str(v.interest);
      if (interest && INTEREST_V1[interest] === null) throw new ContractGapError(`interest "${interest}" has no v1.0 value`);
      data = pick({
        full_name: str(v.full_name), email: str(v.email), phone: str(v.phone), country: str(v.country),
        interest: interest ? INTEREST_V1[interest] : undefined,
        consent_marketing: v.marketing_opt_in === true ? true : undefined,
        consent_version: PRIVACY_NOTICE_VERSION ?? undefined,
      });
      break;
    }
    case "sponsor":
      data = pick({ company_name: str(v.company_name), contact_person: str(v.contact_name), email: str(v.email), phone: str(v.phone), message: str(v.message) });
      break;
    case "exhibitor":
      data = pick({ business_name: str(v.company_name), contact_person: str(v.contact_name), email: str(v.email), phone: str(v.phone), product_service: str(v.products) });
      break;
    case "enquiry":
      data = pick({ name: str(v.full_name), email: str(v.email), subject: str(v.topic), message: str(v.message) });
      break;
  }
  return { form: PORTAL_FORM[form], edition: "2027", client_request_id: clientRequestId, website: "", data };
}

/** What the website tells the visitor. "confirmed" only ever carries a portal reference. */
export type Outcome =
  | { status: "confirmed"; reference: string }
  | { status: "already_registered" }
  | { status: "received" }
  | { status: "closed" }
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "rate_limited" }
  | { status: "unavailable" };

const REFERENCE = /^H27-(PRI|SPN|EXH|ENQ)-[2-9A-HJKMNP-Z]{6}$/;

/** Classifies a portal answer (v1.0 response table). Anything unexpected is "unavailable", never a confirmation. */
export function classify(httpStatus: number, body: unknown): Outcome {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const ref = typeof b.reference === "string" && REFERENCE.test(b.reference) ? b.reference : null;
  if (httpStatus === 201 && ref) return { status: "confirmed", reference: ref };
  if (httpStatus === 200 && b.duplicate === true && ref) return { status: "confirmed", reference: ref };
  if (httpStatus === 200 && b.already_registered === true) return { status: "already_registered" };
  if (httpStatus === 202 && b.accepted === true) return { status: "received" };
  if (httpStatus === 403 && b.error === "not_open") return { status: "closed" };
  if (httpStatus === 400 && b.error === "invalid_email") return { status: "invalid", errors: { email: "Please enter a valid email address." } };
  if (httpStatus === 400) return { status: "invalid", errors: { _form: "Some details could not be accepted. Please check the form and try again." } };
  return { status: "unavailable" };
}

/** v1.0: retry once, after 2 s, with the same client_request_id. */
export const RETRYABLE = new Set([413, 500, 503]);
