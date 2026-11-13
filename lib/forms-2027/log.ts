/**
 * The only logging the submission path does: form, outcome, HTTP status and
 * the request id. Never names, emails, phone numbers, message text, raw
 * bodies, IP addresses, secrets or signatures.
 */
export interface SubmitLog {
  form: string;
  outcome: string;
  portalStatus?: number;
  clientRequestId?: string;
  /** Why the shared store failed (store.ts, storeReason): a short code, never error text. */
  store?: string;
}

const STORE_REASON = /^[A-Za-z0-9_]{1,40}$/;

export function logSubmit(entry: SubmitLog, sink: (line: string) => void = (l) => console.info(l)): void {
  const safe: SubmitLog = { form: entry.form, outcome: entry.outcome };
  if (entry.portalStatus !== undefined) safe.portalStatus = entry.portalStatus;
  if (entry.clientRequestId) safe.clientRequestId = entry.clientRequestId;
  if (entry.store) safe.store = STORE_REASON.test(entry.store) ? entry.store : "unknown";
  sink(`[hebs2027-forms] ${JSON.stringify(safe)}`);
}
