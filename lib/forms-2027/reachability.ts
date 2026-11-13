/**
 * Run sheet E0 / P8: from the Vercel Preview server itself, one unsigned and
 * one signed request to the private test copy, before any form opens. Reached
 * only through the existing submit route, only in private-test mode and only
 * with the operator token (HEBS_PRIVATE_TEST_PROBE_TOKEN, sent as
 * X-HEBS-Probe-Token; handler.ts); there is no separate self-check endpoint,
 * and none in production.
 *
 * Neither request can store anything: the unsigned one is refused at the
 * signature check, and the signed one carries no form fields, so it is refused
 * as not_open (forms closed) or missing_field (form open). The answer reports
 * HTTP status and error code only, never a body, header or secret.
 *
 * It also checks the website's shared store (probeStore) the way a submission
 * uses it: one rate-limit count and one request-id claim, on two fresh probe
 * keys that expire after 60 seconds. Nothing else is written, and nothing at all
 * in Base44.
 */
import { randomUUID } from "node:crypto";
import { signedRequest } from "./sign";
import type { FetchLike } from "./portal-client";
import { storeReason, type SharedStore } from "./store";

export interface ProbeResult {
  request: "unsigned" | "signed" | "store";
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

/** The store check: status 200 when a count and a claim both work as a submission needs, else 0 with the store's reason. */
export async function probeStore(store: SharedStore | null, prefix: string, newId: () => string = randomUUID): Promise<ProbeResult> {
  if (!store) return { request: "store", status: 0, error: "no_store" };
  const id = newId();
  try {
    const n = await store.hit(`${prefix}probe:rl:${id}`, 60);
    const claimed = await store.claim(`${prefix}probe:id:${id}`, id, 60);
    return n === 1 && claimed === id ? { request: "store", status: 200, error: null } : { request: "store", status: 0, error: "bad_response" };
  } catch (e) {
    return { request: "store", status: 0, error: storeReason(e) };
  }
}
