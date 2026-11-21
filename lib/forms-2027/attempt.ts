/**
 * One form attempt id per set of details, kept across a page refresh (run
 * sheet E7): resending the same details from the same browser tab reuses the
 * same attempt id, so the portal sees the same client_request_id and answers
 * with the first record's reference instead of storing a second one.
 *
 * Browser only. The tab's sessionStorage holds a random salt, a salted SHA-256
 * of the details and the attempt id; never the details themselves. It is
 * cleared when the tab closes. Without storage or Web Crypto the form still
 * works, with the in-page attempt id only.
 */
import type { FormValues } from "./validate";

export interface AttemptStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

interface Saved {
  salt: string;
  fingerprint: string;
  attempt: string;
}

const key = (form: string) => `hebs27:attempt:${form}`;

function read(store: AttemptStore, form: string): Saved | null {
  try {
    const v = JSON.parse(store.get(key(form)) ?? "null") as Saved | null;
    return v && typeof v.salt === "string" && typeof v.fingerprint === "string" && typeof v.attempt === "string" ? v : null;
  } catch {
    return null;
  }
}

async function fingerprintOf(salt: string, values: FormValues, digest: (s: string) => Promise<string>) {
  const ordered = Object.keys(values).sort().map((k) => [k, values[k]]);
  return digest(`${salt}:${JSON.stringify(ordered)}`);
}

/** The attempt id to send: the saved one when these details were sent from this tab before, otherwise `current`. */
export async function attemptFor(
  form: string, values: FormValues, current: string,
  deps: { store: AttemptStore | null; digest: ((s: string) => Promise<string>) | null; newSalt: () => string },
): Promise<string> {
  if (!deps.store || !deps.digest) return current;
  try {
    const saved = read(deps.store, form);
    const salt = saved?.salt ?? deps.newSalt();
    const fingerprint = await fingerprintOf(salt, values, deps.digest);
    const attempt = saved && saved.fingerprint === fingerprint ? saved.attempt : current;
    deps.store.set(key(form), JSON.stringify({ salt, fingerprint, attempt } satisfies Saved));
    return attempt;
  } catch {
    return current;
  }
}

/** The browser's tab storage and SHA-256, or nulls where unavailable. */
export function browserAttemptDeps() {
  let store: AttemptStore | null = null;
  try {
    const s = window.sessionStorage;
    store = { get: (k) => s.getItem(k), set: (k, v) => s.setItem(k, v) };
  } catch {
    store = null;
  }
  const subtle = typeof crypto !== "undefined" ? crypto.subtle : undefined;
  const digest = subtle
    ? async (s: string) => Array.from(new Uint8Array(await subtle.digest("SHA-256", new TextEncoder().encode(s))), (b) => b.toString(16).padStart(2, "0")).join("")
    : null;
  const newSalt = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
  return { store, digest, newSalt };
}
