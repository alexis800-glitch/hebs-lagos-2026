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
}

export function logSubmit(entry: SubmitLog, sink: (line: string) => void = (l) => console.info(l)): void {
  const safe: SubmitLog = { form: entry.form, outcome: entry.outcome };
  if (entry.portalStatus !== undefined) safe.portalStatus = entry.portalStatus;
  if (entry.clientRequestId) safe.clientRequestId = entry.clientRequestId;
  sink(`[hebs2027-forms] ${JSON.stringify(safe)}`);
}
