/**
 * The website <-> portal contract, in one place: payload mapping and response
 * classification, following INTEGRATION-CONTRACT-v1.1, Gate A corrections
 * revision of 4 Nov 2026 (docs/integration/hebs-2027-contract-v1.1).
 *
 * `final` stays false, which keeps real-portal mode off (lib/forms-2027/
 * config.ts), until the final contract and the private integration test are
 * approved.
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

export const CONTRACT = { version: "1.1 (Gate A corrections revision, 4 Nov 2026)", final: false } as const;

/** The owner's six priority interests (2026-11-04), as the corrected v1.1 lists them. */
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
    // Corrected v1.1 (G2): its own required field, the same four values. Never tier_interest.
    partnership_interest: "partnership_interest",
    message: "message", prospectus_requested: "prospectus_requested", website_url: "website_url", social_media: "social_media",
  },
  exhibitor: {
    company_name: "business_name", contact_name: "contact_person", email: "email", phone: "phone", country: "country",
    products: "product_service", website_url: "website_url", social_media: "social_media",
  },
  enquiry: { full_name: "name", email: "email", topic: "subject", message: "message" },
};

/**
 * Website fields with no agreed v1.1 field: a submission carrying one is
 * refused rather than sent without it. None since the Gate A corrections
 * revision added partnership_interest (G2).
 */
export const BLOCKED_FIELDS: Record<FormId, Record<string, string>> = { priority: {}, sponsor: {}, exhibitor: {}, enquiry: {} };

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
    // Corrected v1.1 section 6: company_profile is not accepted in this release (owner decision 7).
    if (!PROFILE_ACCEPTED || form !== "exhibitor") throw new ContractGapError("company profiles are not accepted in this release");
    data.company_profile = profile;
  }
  return { form, edition: "2027", client_request_id: clientRequestId, website: "", data };
}

/** Corrected v1.1 section 6: the portal answers 400 upload_disabled to any company_profile in this release. */
export const PROFILE_ACCEPTED = false;

/** What the website tells the visitor. "confirmed" only ever carries a portal reference. */
export type Outcome =
  | { status: "confirmed"; reference: string }
  | { status: "already_registered" }
  | { status: "received" }
  | { status: "closed" }
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "rate_limited" }
  /** The portal is at its platform read limit; nothing is confirmed. The visitor may resend after `retryAfterSeconds`. */
  | { status: "busy"; retryAfterSeconds: number }
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
  upload_disabled: "Uploads are not accepted yet.",
};

/**
 * The busy delay in whole seconds, clamped to the contract's 1-60: from the
 * body's retry_after_s, else the Retry-After header, else 2 s. Never unbounded.
 */
export function busyDelaySeconds(body: unknown, retryAfterHeader: string | null): number {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const header = retryAfterHeader && /^\s*\d+(\.\d+)?\s*$/.test(retryAfterHeader) ? Number(retryAfterHeader) : NaN;
  const raw = typeof b.retry_after_s === "number" ? b.retry_after_s : header;
  if (!Number.isFinite(raw)) return RETRY_DELAY_MS / 1000;
  return Math.min(60, Math.max(1, Math.ceil(raw)));
}

export const isBusy = (httpStatus: number, body: unknown) =>
  httpStatus === 503 && !!body && typeof body === "object" && (body as Record<string, unknown>).error === "busy";

/** Classifies a portal answer (v1.1 section 7). Anything unexpected is "unavailable", never a confirmation. */
export function classify(form: FormId, httpStatus: number, body: unknown, retryAfterHeader: string | null = null): Outcome {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  if (isBusy(httpStatus, body)) return { status: "busy", retryAfterSeconds: busyDelaySeconds(body, retryAfterHeader) };
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

/**
 * v1.1: retry once with the same client_request_id on 500 and 503 (including
 * audit_failed), after 2 s; on 503 busy, after retry_after_s. Never on 413.
 * One retry at most, whatever the answer: no loop is possible.
 */
export const RETRYABLE = new Set([500, 503]);
export const RETRY_DELAY_MS = 2000;
/** The longest busy delay waited inside one request; a longer one goes back to the visitor. */
export const MAX_INLINE_BUSY_WAIT_S = 5;

/** Corrected v1.1 sections 2 and 12: 20,000 bytes for every request this release; 10 s per call. */
export const LIMITS = {
  bodyBytes: 20_000,
  bodyWithFileBytes: 4_200_000,
  timeoutMs: 10_000,
  timeoutWithFileMs: 30_000,
} as const;
