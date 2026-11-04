/**
 * The website <-> portal contract, in one place: payload mapping and response
 * classification, following INTEGRATION-CONTRACT-v1.1 (docs/integration/
 * hebs-2027-contract-v1.1, "for review (Gate A)").
 *
 * `final` stays false, which keeps real-portal mode off (lib/forms-2027/
 * config.ts), until Gate A is accepted AND the contract's interest list matches
 * the owner's six (v1.1 still lists Media; the website never sends it).
 *
 * Nothing is dropped: every website field has a portal field in FIELD_MAP, or
 * the request is refused before anything is sent (ContractGapError). Fields in
 * BLOCKED_FIELDS are collected on the form but have no agreed contract field
 * yet, so a submission carrying one is refused rather than sent without it or
 * under another field's name.
 */
import type { FormId } from "../integrations/registration-2027";
import type { FormValues } from "./validate";
import type { PreparedPdf } from "./pdf";

export const CONTRACT = { version: "1.1 (Gate A review)", final: false } as const;

/** The owner's six priority interests (2026-11-04). v1.1 also accepts Media; the website never sends it. */
export const OWNER_INTERESTS = ["Attendee", "Competitor", "Educator", "Exhibitor", "Sponsor", "Other"] as const;

/**
 * Website field -> v1.1 portal field, per form. The privacy acknowledgement and
 * marketing consent are sent with their notice versions (section 5) and are
 * mapped in toPortalBody; the company profile is the separate file part.
 */
export const FIELD_MAP: Record<FormId, Record<string, string>> = {
  priority: { full_name: "full_name", email: "email", phone: "phone", country: "country", interest: "interest" },
  sponsor: {
    company_name: "company_name", contact_name: "contact_person", email: "email", phone: "phone", country: "country",
    message: "message", prospectus_requested: "prospectus_requested", website_url: "website_url", social_media: "social_media",
  },
  exhibitor: {
    company_name: "business_name", contact_name: "contact_person", email: "email", phone: "phone", country: "country",
    products: "product_service", website_url: "website_url", social_media: "social_media",
  },
  enquiry: { full_name: "name", email: "email", topic: "subject", message: "message" },
};

/**
 * Website fields with no agreed v1.1 field. Transmission is blocked until
 * Claude Desktop adds a matching field or formally confirms an equivalent
 * (Gary's review, 2026-11-04: partnership type is not tier_interest).
 */
export const BLOCKED_FIELDS: Record<FormId, Record<string, string>> = {
  priority: {},
  sponsor: { partnership_interest: "Sponsorship partnership type: no v1.1 field; tier_interest is a different concept." },
  exhibitor: {},
  enquiry: {},
};

const CONSENT_FIELDS = new Set(["privacy_acknowledged", "marketing_opt_in"]);

/** Portal field -> website field, to show a portal 400 against the right control. */
export function websiteFieldFor(form: FormId, portalField: string | undefined): string {
  if (!portalField) return "_form";
  if (portalField === "privacy_acknowledged" || portalField === "privacy_notice_version") return "privacy_acknowledged";
  if (portalField === "consent_marketing" || portalField === "consent_version") return "marketing_opt_in";
  if (portalField === "company_profile") return "company_profile";
  const hit = Object.entries(FIELD_MAP[form]).find(([, p]) => p === portalField);
  return hit ? hit[0] : "_form";
}

export class ContractGapError extends Error {}

/** The notice versions sent with the acknowledgement and the consent (decision D13). */
export interface NoticeVersions {
  privacy: string | null;
  consent: string | null;
}

/** No privacy notice is approved yet (D13), so no real submission can be built. */
export const NOTICE_VERSIONS: NoticeVersions = { privacy: null, consent: null };

/** The v1.1 request body for validated website values. Throws ContractGapError rather than drop or remap anything. */
export function toPortalBody(form: FormId, v: FormValues, clientRequestId: string, notices: NoticeVersions, profile?: PreparedPdf) {
  if (!notices.privacy) throw new ContractGapError("no privacy notice version (D13)");
  const map = FIELD_MAP[form];
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(v)) {
    if (CONSENT_FIELDS.has(key)) continue;
    if (BLOCKED_FIELDS[form][key] && value !== "" && value !== undefined) {
      throw new ContractGapError(`website field "${key}" is blocked until the contract defines it`);
    }
    const portal = map[key];
    if (!portal) throw new ContractGapError(`website field "${key}" has no v1.1 field`);
    if (value === "" || value === undefined) continue;
    data[portal] = value;
  }
  if (form === "priority" && typeof data.interest === "string" && !(OWNER_INTERESTS as readonly string[]).includes(data.interest)) {
    throw new ContractGapError(`interest "${data.interest}" is not one of the owner's six`);
  }
  if (v.privacy_acknowledged !== true) throw new ContractGapError("privacy acknowledgement missing");
  data.privacy_acknowledged = true;
  data.privacy_notice_version = notices.privacy;
  if (v.marketing_opt_in === true) {
    if (!notices.consent) throw new ContractGapError("no marketing consent version (D13)");
    data.consent_marketing = true;
    data.consent_version = notices.consent;
  }
  if (profile) {
    if (form !== "exhibitor") throw new ContractGapError("only the exhibitor form carries a company profile");
    data.company_profile = profile;
  }
  return { form, edition: "2027", client_request_id: clientRequestId, website: "", data };
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

/** v1.1 section 7, 400 codes, worded for the person filling in the form. */
const MESSAGES: Record<string, string> = {
  missing_field: "Please fill in this field.",
  invalid_email: "Please enter a valid email address.",
  invalid_url: "Please enter a full web address, starting with https://.",
  invalid_value: "Please check this value.",
  too_long: "Please shorten this.",
  privacy_ack_required: "Please tick this box to continue.",
  unsupported_file_type: "Please choose a PDF file.",
  file_too_large: "Please choose a PDF of 3 MB or less.",
  file_mismatch: "The file could not be read. Please choose it again.",
};

/** Classifies a portal answer (v1.1 section 7). Anything unexpected is "unavailable", never a confirmation. */
export function classify(form: FormId, httpStatus: number, body: unknown): Outcome {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const ref = typeof b.reference === "string" && REFERENCE.test(b.reference) ? b.reference : null;
  if (httpStatus === 201 && ref) return { status: "confirmed", reference: ref };
  if (httpStatus === 200 && b.duplicate === true && ref) return { status: "confirmed", reference: ref };
  if (httpStatus === 200 && b.already_registered === true) return { status: "already_registered" };
  if (httpStatus === 202 && b.accepted === true) return { status: "received" };
  if (httpStatus === 403 && b.error === "not_open") return { status: "closed" };
  if (httpStatus === 400 && typeof b.error === "string" && MESSAGES[b.error]) {
    return { status: "invalid", errors: { [websiteFieldFor(form, typeof b.field === "string" ? b.field : undefined)]: MESSAGES[b.error] } };
  }
  if (httpStatus === 400 || httpStatus === 413) {
    // unknown_field, unknown_form, invalid_json, too_large...: the website built a request the portal refused.
    return { status: "invalid", errors: { _form: "Some details could not be accepted. Please check the form and try again." } };
  }
  return { status: "unavailable" };
}

/** v1.1: retry once, after 2 s, with the same client_request_id; not for 413. */
export const RETRYABLE = new Set([500, 503]);

/** v1.1 section 2 and 12. */
export const LIMITS = {
  bodyBytes: 20_000,
  bodyWithFileBytes: 4_200_000,
  timeoutMs: 10_000,
  timeoutWithFileMs: 30_000,
} as const;
