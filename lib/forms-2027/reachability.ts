/**
 * Run sheet E0 / P8: from the Vercel Preview server itself, one unsigned and
 * one signed request to the private test copy, before any form opens. Reached
 * only through the existing submit route, only in private-test mode and only
 * with the operator token (HEBS_PRIVATE_TEST_PROBE_TOKEN, sent as
 * X-HEBS-Probe-Token; handler.ts); there is no separate self-check endpoint,
 * and none in production. It writes nothing on the website side either.
 *
 * Neither request can store anything: the unsigned one is refused at the
 * signature check, and the signed one carries no form fields, so it is refused
 * as not_open (forms closed) or missing_field (form open). The answer reports
 * HTTP status and error code only, never a body, header or secret.
 */
import { randomUUID } from "node:crypto";
import { signedRequest } from "./sign";
import type { FetchLike } from "./portal-client";

export interface ProbeResult {
  request: "unsigned" | "signed";
  status: number;
  error: string | null;
}

const CODE = /^[a-z_]{1,40}$/;

async function send(fetchImpl: FetchLike, url: string, headers: Record<string, string>, raw: string, timeoutMs: number) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { method: "POST", headers, body: raw, signal: ctrl.signal, cache: "no-store", redirect: "error" });
    const json = (await res.json().catch(() => null)) as { error?: unknown } | null;
    const error = json && typeof json.error === "string" && CODE.test(json.error) ? json.error : null;
    return { status: res.status, error };
  } catch {
    return { status: 0, error: null };
  } finally {
    clearTimeout(t);
  }
}

/** A signed body with no form fields: the portal can refuse it but never store it. */
export function probeBody(clientRequestId: string) {
  return { form: "priority", edition: "2027", client_request_id: clientRequestId, website: "", data: {} };
}

export async function probePortal(p: {
  url: string; appId: string; secret: string;
  fetch?: FetchLike; nowSeconds?: () => number; newId?: () => string; timeoutMs?: number;
}): Promise<ProbeResult[]> {
  const fetchImpl = p.fetch ?? fetch;
  const timeoutMs = p.timeoutMs ?? 10_000;
  const unsignedRaw = JSON.stringify(probeBody((p.newId ?? randomUUID)()));
  const unsigned = await send(fetchImpl, p.url, { "Content-Type": "application/json; charset=utf-8", "X-App-Id": p.appId }, unsignedRaw, timeoutMs);
  const now = (p.nowSeconds ?? (() => Math.floor(Date.now() / 1000)))();
  const { raw, headers } = signedRequest(p.secret, p.appId, probeBody((p.newId ?? randomUUID)()), now);
  const signed = await send(fetchImpl, p.url, headers, raw, timeoutMs);
  return [{ request: "unsigned", ...unsigned }, { request: "signed", ...signed }];
}
