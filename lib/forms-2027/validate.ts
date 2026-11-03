/**
 * Validation of the four HEBS 2027 website forms. Pure and dependency-free, so
 * the browser (instant feedback) and the server route (the check that counts)
 * run exactly the same rules from the same field lists.
 */
import { FORM_FIELDS, type FieldSpec, type FormId } from "../integrations/registration-2027";

/** What a form sends: text values and ticked checkboxes. Files are never accepted (see `inactive`). */
export type FormValues = Record<string, string | boolean>;

export interface Validated {
  ok: boolean;
  /** Trimmed, known fields only; optional empty text is dropped and unticked boxes are false. */
  values: FormValues;
  /** Field name -> message, written for the person filling in the form. */
  errors: Record<string, string>;
}

const EMAIL = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[^\s@<>()[\],;:"]{2,}$/;
const PHONE = /^[+()\d\s.-]{6,40}$/;

export function isFormId(x: unknown): x is FormId {
  return typeof x === "string" && Object.prototype.hasOwnProperty.call(FORM_FIELDS, x);
}

function checkOne(f: FieldSpec, raw: unknown): { value?: string | boolean; error?: string } {
  if (f.inactive) {
    return raw === undefined || raw === null || raw === "" ? {} : { error: "This field is not accepted yet." };
  }
  if (f.kind === "checkbox") {
    if (raw !== undefined && typeof raw !== "boolean") return { error: "Please tick or untick this box." };
    const ticked = raw === true;
    if (f.required && !ticked) return { error: "Please tick this box to continue." };
    return { value: ticked };
  }
  if (raw !== undefined && typeof raw !== "string") return { error: "Please enter text." };
  const v = (raw ?? "").trim();
  if (!v) return f.required ? { error: f.kind === "select" ? "Please choose one of the options." : `Please enter ${f.label.toLowerCase()}.` } : {};
  if (f.maxLength && v.length > f.maxLength) return { error: `Please keep this under ${f.maxLength} characters.` };
  if (f.kind === "email" && !EMAIL.test(v)) return { error: "Please enter a valid email address." };
  if (f.kind === "tel" && !PHONE.test(v)) return { error: "Please enter a valid phone number." };
  if (f.kind === "url") {
    try {
      const u = new URL(v);
      if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error();
    } catch {
      return { error: "Please enter a full web address, starting with https://." };
    }
  }
  if (f.kind === "select" && !f.options?.includes(v)) return { error: "Please choose one of the options." };
  return { value: v };
}

/** Validates `input` against the form's fields. Unknown fields are rejected, not ignored. */
export function validateForm(form: FormId, input: unknown): Validated {
  const fields = FORM_FIELDS[form];
  const errors: Record<string, string> = {};
  const values: FormValues = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, values, errors: { _form: "The form could not be read. Please try again." } };
  }
  const data = input as Record<string, unknown>;
  const known = new Set(fields.map((f) => f.name));
  for (const k of Object.keys(data)) if (!known.has(k)) errors[k] = "Unexpected field.";
  for (const f of fields) {
    const r = checkOne(f, data[f.name]);
    if (r.error) errors[f.name] = r.error;
    else if (r.value !== undefined) values[f.name] = r.value;
  }
  return { ok: Object.keys(errors).length === 0, values, errors };
}
