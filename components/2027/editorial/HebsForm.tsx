"use client";
/**
 * A HEBS 2027 website form: priority registration, sponsorship inquiry,
 * exhibitor application or general enquiry. The browser checks fields with
 * the same rules as the server (lib/forms-2027/validate.ts), then sends them
 * to the website's own route only; the browser never talks to the portal.
 *
 * Closed forms render with every control disabled and send nothing.
 */
import { useId, useRef, useState } from "react";
import type { FieldSpec, FormId } from "@/lib/integrations/registration-2027";
import { validateForm, type FormValues } from "@/lib/forms-2027/validate";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "confirmed"; reference: string }
  | { kind: "already" }
  | { kind: "received" }
  | { kind: "closed" }
  | { kind: "rate_limited" }
  | { kind: "busy"; seconds: number }
  | { kind: "error" };

const ENDPOINT = "/api/hebs2027/submit";
const ink = "#000000", body = "#3B362F", muted = "#5E5546", atlantic = "#0E3A3F", champ = "#C8A96A", error = "#8A1F11";

function newAttempt() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
}

const PDF_MAX = 3_000_000;

export default function HebsForm({
  form, fields, enabled, uploads = false, gate, submitLabel, title,
}: {
  form: FormId;
  fields: readonly FieldSpec[];
  enabled: boolean;
  /** Whether the company-profile upload is accepted (server decision; off until malware checking is approved). */
  uploads?: boolean;
  /** Shown while the form is closed. */
  gate: string;
  submitLabel: string;
  /** Accessible name of the form. */
  title: string;
}) {
  const uid = useId();
  const started = useRef(Date.now());
  const attempt = useRef(newAttempt());
  const [values, setValues] = useState<FormValues>({});
  const [honey, setHoney] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [file, setFile] = useState<File | null>(null);
  const [prospectus, setProspectus] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const result = useRef<HTMLDivElement>(null);

  const id = (name: string) => `${uid}-${name}`;
  const set = (name: string, v: string | boolean) => setValues((s) => ({ ...s, [name]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const local = validateForm(form, values);
    if (file) {
      if (!/\.pdf$/i.test(file.name) || file.name.length > 120 || file.type !== "application/pdf") local.errors.company_profile = "Please choose a PDF file.";
      else if (file.size > PDF_MAX) local.errors.company_profile = "Please choose a PDF of 3 MB or less.";
      else if (file.size < 1) local.errors.company_profile = "The file is empty.";
      if (local.errors.company_profile) local.ok = false;
    }
    setErrors(local.errors);
    if (!local.ok) {
      requestAnimationFrame(() => {
        const first = fields.find((f) => local.errors[f.name]);
        if (first) document.getElementById(id(first.name))?.focus();
      });
      return;
    }
    setStatus({ kind: "sending" });
    let next: Status = { kind: "error" };
    try {
      const payload = JSON.stringify({ form, values: local.values, website: honey, attempt_id: attempt.current, elapsed_ms: Date.now() - started.current });
      let init: RequestInit = { method: "POST", headers: { "Content-Type": "application/json" }, body: payload };
      if (file && uploads) {
        // The file travels to the website's own route; the server checks it and computes its hash.
        const fd = new FormData();
        fd.set("payload", payload);
        fd.set("company_profile", file, file.name);
        init = { method: "POST", body: fd };
      }
      const res = await fetch(ENDPOINT, init);
      const out = (await res.json().catch(() => ({}))) as { status?: string; reference?: string; errors?: Record<string, string>; retryAfterSeconds?: number };
      if (out.status === "confirmed" && out.reference) next = { kind: "confirmed", reference: out.reference };
      else if (out.status === "already_registered") next = { kind: "already" };
      else if (out.status === "received") next = { kind: "received" };
      else if (out.status === "closed") next = { kind: "closed" };
      else if (out.status === "rate_limited") next = { kind: "rate_limited" };
      // Busy: nothing is confirmed. The attempt id is kept, so a resend cannot create a second record.
      else if (out.status === "busy") next = { kind: "busy", seconds: Math.min(60, Math.max(1, Number(out.retryAfterSeconds) || 30)) };
      else if (out.status === "invalid" && out.errors) {
        setErrors(out.errors);
        next = { kind: "idle" };
      }
    } catch {
      next = { kind: "error" };
    }
    if (next.kind === "confirmed" || next.kind === "already" || next.kind === "received") {
      setProspectus(local.values.prospectus_requested === true);
      attempt.current = newAttempt();
      setValues({});
      setFile(null);
    }
    setStatus(next);
    requestAnimationFrame(() => (next.kind === "idle" ? summary.current : result.current)?.focus());
  }

  const done = status.kind === "confirmed" || status.kind === "already" || status.kind === "received";
  const errorList = Object.entries(errors);
  const field = "mt-2 block w-full border bg-white px-3 py-3 text-[15px] text-black aria-[invalid=true]:border-[#8A1F11]";
  const fieldStyle = { borderColor: "rgba(0,0,0,.28)" };

  return (
    <div className="border bg-[#FBF8F2] p-6 sm:p-8" style={{ borderColor: "rgba(0,0,0,.14)", colorScheme: "light", color: ink }}>
      {!enabled && <p id={id("gate")} className="text-[14px] font-semibold" style={{ color: atlantic }}>{gate}</p>}

      <div ref={result} tabIndex={-1} aria-live="polite" className="outline-none">
        {status.kind === "confirmed" && (
          <div className="border-l-2 pl-4" style={{ borderColor: champ }}>
            <p className="text-[17px] font-semibold">Thank you. Your details are saved.</p>
            <p className="mt-2 text-[15px]" style={{ color: body }}>Your reference is <strong className="tabular-nums tracking-wide">{status.reference}</strong>. Keep it for your records.</p>
            {prospectus && <p className="mt-2 text-[15px]" style={{ color: body }}>Our team will send the prospectus.</p>}
          </div>
        )}
        {status.kind === "already" && (
          <p className="border-l-2 pl-4 text-[16px]" style={{ borderColor: champ }}>You are already on the HEBS 2027 priority list. There is nothing more to do.</p>
        )}
        {status.kind === "received" && <p className="border-l-2 pl-4 text-[16px]" style={{ borderColor: champ }}>Thank you.</p>}
        {status.kind === "closed" && <p className="border-l-2 pl-4 text-[16px]" style={{ borderColor: atlantic, color: atlantic }}>This form is not open yet. Nothing was saved.</p>}
        {status.kind === "rate_limited" && <p className="border-l-2 pl-4 text-[16px]" style={{ borderColor: error, color: error }}>Too many attempts from this connection. Please wait ten minutes and try again. Nothing was saved.</p>}
        {status.kind === "busy" && <p className="border-l-2 pl-4 text-[16px]" style={{ borderColor: error, color: error }}>The registration system is busy, so nothing is confirmed yet. Please send the form again in about {status.seconds} seconds.</p>}
        {status.kind === "error" && <p className="border-l-2 pl-4 text-[16px]" style={{ borderColor: error, color: error }}>Your details could not be saved just now, so nothing is confirmed. Please try again later.</p>}
      </div>

      {!done && (
        <form noValidate aria-label={title} onSubmit={submit} className={status.kind === "idle" || status.kind === "sending" ? "mt-5" : "mt-6"}>
          <div ref={summary} tabIndex={-1} className="outline-none">
            {errorList.length > 0 && (
              <div role="alert" className="mb-5 border-l-2 pl-4 text-[15px]" style={{ borderColor: error, color: error }}>
                <p className="font-semibold">Please check {errorList.length === 1 ? "one field" : `${errorList.length} fields`}.</p>
                {errors._form && <p className="mt-1">{errors._form}</p>}
              </div>
            )}
          </div>
          <fieldset disabled={!enabled || status.kind === "sending"} aria-describedby={enabled ? undefined : id("gate")} className="grid gap-5 sm:grid-cols-2">
            <legend className="sr-only">{title}</legend>
            {/* Corrected v1.1 section 6: no upload control while uploads are off. */}
            {fields.filter((f) => f.kind !== "file" || uploads).map((f) => {
              const err = errors[f.name];
              const describedBy = [f.hint || f.inactive ? id(`${f.name}-hint`) : "", err ? id(`${f.name}-error`) : ""].filter(Boolean).join(" ") || undefined;
              const half = f.kind === "tel" || f.name === "country";
              const help = (f.hint || f.inactive) && (
                <span id={id(`${f.name}-hint`)} className="mt-1.5 block text-[13px] font-normal" style={{ color: muted }}>{f.kind === "file" && uploads ? f.hint : f.inactive ?? f.hint}</span>
              );
              const errNode = err && <span id={id(`${f.name}-error`)} className="mt-1.5 block text-[13px] font-medium" style={{ color: error }}>{err}</span>;
              if (f.kind === "checkbox") {
                return (
                  <div key={f.name} className="sm:col-span-2">
                    <label className="flex items-start gap-3 text-[14px]">
                      <input
                        id={id(f.name)} type="checkbox" name={f.name} className="mt-1 h-4 w-4 shrink-0"
                        checked={values[f.name] === true} onChange={(e) => set(f.name, e.target.checked)}
                        aria-invalid={err ? true : undefined} aria-describedby={describedBy} aria-required={f.required || undefined}
                      />
                      <span>{f.label}{!f.required && <span style={{ color: muted }}> (optional)</span>}</span>
                    </label>
                    {errNode}
                  </div>
                );
              }
              const common = {
                id: id(f.name), name: f.name, autoComplete: f.autoComplete, className: field, style: fieldStyle,
                "aria-invalid": err ? true : undefined, "aria-describedby": describedBy, "aria-required": f.required || undefined,
              } as const;
              const value = typeof values[f.name] === "string" ? (values[f.name] as string) : "";
              return (
                <div key={f.name} className={half ? "" : "sm:col-span-2"}>
                  <label htmlFor={id(f.name)} className="text-[14px] font-medium">
                    {f.label}{!f.required && <span className="font-normal" style={{ color: muted }}> (optional)</span>}
                  </label>
                  {f.kind === "select" ? (
                    <select {...common} value={value} onChange={(e) => set(f.name, e.target.value)}>
                      <option value="" disabled>Choose one</option>
                      {f.options?.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : f.kind === "textarea" ? (
                    <textarea {...common} rows={4} maxLength={f.maxLength} value={value} onChange={(e) => set(f.name, e.target.value)} />
                  ) : f.kind === "file" ? (
                    // Off until malware checking is approved; then a PDF of up to 3 MB.
                    <input
                      {...common} type="file" accept="application/pdf,.pdf" disabled={!uploads}
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  ) : (
                    <input
                      {...common} type={f.kind} maxLength={f.maxLength} value={value} onChange={(e) => set(f.name, e.target.value)}
                      inputMode={f.kind === "email" ? "email" : f.kind === "tel" ? "tel" : f.kind === "url" ? "url" : undefined}
                      spellCheck={f.kind === "email" || f.kind === "url" ? false : undefined}
                    />
                  )}
                  {help}
                  {errNode}
                </div>
              );
            })}
            {/* Honeypot (contract field "website"): hidden from people and assistive technology; bots fill it in. */}
            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
              <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} /></label>
            </div>
            <button
              type="submit"
              className={`s27-btn ${enabled ? "s27-btn--pri" : ""} disabled:cursor-not-allowed sm:col-span-2`}
              style={enabled ? undefined : { border: "1px solid rgba(0,0,0,.25)", color: muted, background: "transparent" }}
            >
              {!enabled ? "Not open yet" : status.kind === "sending" ? "Sending…" : submitLabel}
            </button>
          </fieldset>
        </form>
      )}
    </div>
  );
}
