#!/usr/bin/env node
// End-to-end check of the HEBS 2027 forms through the website's own route,
// POST /api/hebs2027/submit, exactly as a browser sends them. Synthetic data
// only, in the private test's identity convention (names starting "TEST ",
// addresses at hebs-e2e.test), so nothing is mistaken for a real person.
//
// LOCAL ONLY (http://localhost, mock mode). The private test against the Base44
// copy runs signed in to the test branch's Preview, case by case, under the
// E0-E12 plan (docs/integration/private-e2e-test): no share link and no
// protection-bypass token, so this script never targets a deployment.
//
// What it proves, per form (priority, sponsor, exhibitor, enquiry):
//   - a valid submission is confirmed with a portal reference of the right form;
//   - resending the same attempt returns the SAME reference (no second record);
//   - an invalid email and a missing privacy acknowledgement are refused, nothing saved;
//   - the honeypot gets a plain thank-you and no reference;
//   - priority: the same email again is "already registered", no reference shown;
//   - the route refuses GET, a foreign origin and an oversized body.
//
// usage:
//   HEBS_FORMS_MODE=mock npx next dev -p 3000
//   node scripts/e2e-2027-forms.mjs http://localhost:3000 [evidence.json]
import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const OUT = process.argv[3];
const host = new URL(BASE).host;
if (!/^(localhost|127\.0\.0\.1)$/.test(new URL(BASE).hostname)) {
  console.error("Refused: this check runs against a local server only (see the E0-E12 plan for the private test).");
  process.exit(2);
}
const RUN = randomUUID().slice(0, 8);
let ipN = 0;

function headers(extra = {}) {
  const h = { "Content-Type": "application/json", Origin: BASE, ...extra };
  // Each request gets its own address so the 5-per-10-minutes limit does not trip locally.
  h["X-Forwarded-For"] = `198.51.100.${(++ipN % 250) + 1}`;
  return h;
}

async function post(body, extra = {}) {
  const res = await fetch(`${BASE}/api/hebs2027/submit`, { method: "POST", headers: headers(extra), body: typeof body === "string" ? body : JSON.stringify(body), redirect: "manual" });
  let json = null;
  try { json = await res.json(); } catch { json = null; }
  return { http: res.status, json };
}

const email = (form) => `e2e-${RUN}-${form}@hebs-e2e.test`;
const VALUES = {
  priority: () => ({ full_name: "TEST E2E Person", email: email("priority"), country: "Nigeria", interest: "Attendee", privacy_acknowledged: true }),
  sponsor: () => ({ company_name: "TEST E2E Brand", contact_name: "TEST Contact", email: email("sponsor"), country: "Nigeria", partnership_interest: "Sponsorship", prospectus_requested: true, privacy_acknowledged: true }),
  exhibitor: () => ({ company_name: "TEST E2E Tools", contact_name: "TEST Contact", email: email("exhibitor"), country: "Nigeria", products: "TEST combs", privacy_acknowledged: true }),
  enquiry: () => ({ full_name: "TEST E2E Person", email: email("enquiry"), topic: "General question", message: "TEST end-to-end question.", privacy_acknowledged: true }),
};
const PREFIX = { priority: "PRI", sponsor: "SPN", exhibitor: "EXH", enquiry: "ENQ" };
const REF = (form) => new RegExp(`^H27-${PREFIX[form]}-[A-HJKMNP-Z2-9]{6}$`);
const submission = (form, values, over = {}) => ({ form, values, website: "", attempt_id: randomUUID(), elapsed_ms: 4000, ...over });

const results = [];
function check(name, ok, detail) {
  results.push({ check: name, ok, ...detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail.reference ? `  ${detail.reference}` : ""}${ok ? "" : `  (${JSON.stringify(detail)})`}`);
}

for (const form of Object.keys(VALUES)) {
  const first = submission(form, VALUES[form]());
  const a = await post(first);
  const ref = a.json?.reference;
  check(`${form}: confirmed with a ${PREFIX[form]} reference`, a.http === 201 && a.json?.status === "confirmed" && REF(form).test(ref ?? ""), { http: a.http, status: a.json?.status, reference: ref });
  const b = await post(first);
  check(`${form}: resend of the same attempt returns the same reference`, b.json?.status === "confirmed" && b.json?.reference === ref, { http: b.http, status: b.json?.status, reference: b.json?.reference });
  const c = await post(submission(form, { ...VALUES[form](), email: "not-an-email" }));
  check(`${form}: invalid email refused, nothing saved`, c.http === 400 && c.json?.status === "invalid" && !!c.json?.errors?.email && !c.json?.reference, { http: c.http, status: c.json?.status });
  const d = await post(submission(form, { ...VALUES[form](), privacy_acknowledged: false }));
  check(`${form}: privacy acknowledgement required`, d.http === 400 && d.json?.status === "invalid" && !!d.json?.errors?.privacy_acknowledged, { http: d.http, status: d.json?.status });
  const e = await post(submission(form, VALUES[form](), { website: "https://spam.example" }));
  check(`${form}: honeypot gets a plain thank-you, no reference`, e.json?.status === "received" && !e.json?.reference, { http: e.http, status: e.json?.status });
}

const again = await post(submission("priority", VALUES.priority()));
check("priority: same email again is already registered, no reference shown", again.json?.status === "already_registered" && !again.json?.reference, { http: again.http, status: again.json?.status });

const get = await fetch(`${BASE}/api/hebs2027/submit`, { redirect: "manual" });
check("route: GET answers as a missing page", get.status === 404, { http: get.status });
const foreign = await post(submission("enquiry", VALUES.enquiry()), { Origin: "https://attacker.example" });
check("route: a foreign origin is refused", foreign.http === 403, { http: foreign.http });
const big = await post(JSON.stringify(submission("enquiry", { ...VALUES.enquiry(), message: "x".repeat(21_000) })));
check("route: a body over 20,000 bytes is refused", big.http === 413, { http: big.http });

const failed = results.filter((r) => !r.ok).length;
const evidence = {
  run: RUN, target: host, at: new Date().toISOString(),
  passed: results.length - failed, failed,
  references: results.filter((r) => r.reference && r.ok).map((r) => r.reference).filter((v, i, a) => a.indexOf(v) === i),
  results,
};
if (OUT) writeFileSync(OUT, JSON.stringify(evidence, null, 2) + "\n");
console.log(`\n${evidence.passed} passed, ${failed} failed. Records created: ${evidence.references.join(", ") || "none"}`);
process.exit(failed ? 1 : 0);
