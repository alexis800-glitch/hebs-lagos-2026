/**
 * The shared store behind the 2027 forms' rate limit and request ids, over the
 * REST protocol of Upstash / Vercel KV (lib/forms-2027/store.ts), after the
 * E2 store_error of 13 Nov 2026. A fake REST store follows the documented
 * /multi-exec behaviour: atomic, one result or error per command, a whole
 * transaction discarded with one error object, 401 for a bad token. It accepts
 * only the basic commands the adapter needs and refuses any other command or
 * option, so a Redis 7 option such as EXPIRE ... NX fails here as it may on
 * the real store. Synthetic data only; no network.
 */
import { describe, expect, it } from "vitest";
import { handleSubmit, RATE_LIMIT, type SubmitDeps } from "../lib/forms-2027/handler";
import { MOCK_NOTICES, MOCK_SECRET, type SubmitConfig } from "../lib/forms-2027/config";
import { createMockPortal } from "../lib/forms-2027/mock-portal";
import { probeStore } from "../lib/forms-2027/reachability";
import { StoreError, restStore, storeReason } from "../lib/forms-2027/store";

const URL_ = "https://synthetic-store.kv.test";
const TOKEN = "synthetic-store-token-not-a-real-credential-0001";
const NOW = 1793750400;

type Cmd = (string | number)[];

/** A REST store that keeps strings with expiry, on a clock the test controls. */
function fakeRestStore(opts: { token?: string; status?: number } = {}) {
  let clock = 0;
  const data = new Map<string, { v: string; until: number }>();
  const calls: { path: string; commands: Cmd[] }[] = [];
  const live = (k: string) => {
    const e = data.get(k);
    if (e && e.until <= clock) data.delete(k);
    return data.get(k);
  };
  // Supported here: SET key value [NX] [EX seconds], INCR key, GET key. Nothing else.
  const supported = (c: Cmd) => {
    const [name, ...args] = c.map(String);
    if (name === "INCR" || name === "GET") return args.length === 1;
    if (name !== "SET" || args.length < 2) return false;
    const rest = args.slice(2);
    for (let i = 0; i < rest.length; i++) {
      if (rest[i] === "NX") continue;
      if (rest[i] === "EX" && /^\d+$/.test(rest[i + 1] ?? "")) { i++; continue; }
      return false;
    }
    return true;
  };
  const run = (c: Cmd): { result?: unknown; error?: string } => {
    const [name, key, ...args] = c.map(String);
    if (name === "GET") return { result: live(key)?.v ?? null };
    if (name === "INCR") {
      const e = live(key);
      const n = Number(e?.v ?? "0");
      if (!Number.isInteger(n)) return { error: "ERR value is not an integer or out of range" };
      data.set(key, { v: String(n + 1), until: e?.until ?? Infinity });
      return { result: n + 1 };
    }
    const [value, ...flags] = args;
    if (flags.includes("NX") && live(key)) return { result: null };
    const ex = flags.indexOf("EX");
    data.set(key, { v: value, until: ex >= 0 ? clock + Number(flags[ex + 1]) * 1000 : Infinity });
    return { result: "OK" };
  };
  const fetchImpl = async (url: string, init: RequestInit) => {
    const path = new URL(url).pathname;
    const commands = JSON.parse(String(init.body)) as Cmd[];
    calls.push({ path, commands });
    if ((init.headers as Record<string, string>).Authorization !== `Bearer ${opts.token ?? TOKEN}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    if (opts.status) return new Response("unavailable", { status: opts.status });
    if (path !== "/multi-exec") return new Response(JSON.stringify({ error: "ERR not used by this adapter" }), { status: 400 });
    if (!commands.every(supported)) return new Response(JSON.stringify({ error: "ERR unsupported command" }), { status: 400 });
    return new Response(JSON.stringify(commands.map(run)));
  };
  return { fetchImpl, calls, data, advance: (ms: number) => { clock += ms; } };
}

describe("REST store adapter", () => {
  it("counts in a window that starts with the first hit and ends after it, using basic commands in one transaction", async () => {
    const f = fakeRestStore();
    const s = restStore({ url: URL_, token: TOKEN }, f.fetchImpl);
    expect(await s.hit("k", 600)).toBe(1);
    expect(await s.hit("k", 600)).toBe(2);
    f.advance(599_000);
    expect(await s.hit("k", 600)).toBe(3);
    f.advance(1_000);
    expect(await s.hit("k", 600)).toBe(1);
    expect(f.calls.every((c) => c.path === "/multi-exec")).toBe(true);
    expect(f.calls[0].commands).toEqual([["SET", "k", "0", "EX", 600, "NX"], ["INCR", "k"]]);
  });

  it("claims a value once and returns the first value to every later claim until it expires", async () => {
    const f = fakeRestStore();
    const s = restStore({ url: URL_, token: TOKEN }, f.fetchImpl);
    expect(await s.claim("id", "first", 3600)).toBe("first");
    expect(await s.claim("id", "second", 3600)).toBe("first");
    f.advance(3_600_000);
    expect(await s.claim("id", "third", 3600)).toBe("third");
  });

  it("would have failed on the old commands: EXPIRE with NX is refused by a store without Redis 7 options", async () => {
    const f = fakeRestStore();
    const res = await f.fetchImpl(`${URL_}/multi-exec`, {
      method: "POST", headers: { Authorization: `Bearer ${TOKEN}` }, body: JSON.stringify([["INCR", "k"], ["EXPIRE", "k", 600, "NX"]]),
    });
    expect(res.status).toBe(400);
  });

  it("reports each failure with a short reason and never the URL, token, key or error text", async () => {
    const cases: [Parameters<typeof restStore>[1], string][] = [
      [fakeRestStore({ token: "a-different-token" }).fetchImpl, "http_401"],
      [fakeRestStore({ status: 503 }).fetchImpl, "http_503"],
      [async () => { throw new TypeError(`fetch failed ${URL_}`); }, "network"],
      [async () => new Response(JSON.stringify({ error: "ERR max daily request limit exceeded" }), { status: 400 }), "command_ERR"],
      [async () => new Response(JSON.stringify([{ result: "OK" }, { error: "NOPERM this user has no permissions to run the 'incr' command" }])), "command_NOPERM"],
      [async () => new Response(JSON.stringify([{ result: "OK" }, { error: "WRONGTYPE Operation against a key holding the wrong kind of value" }]), { status: 400 }), "command_WRONGTYPE"],
      [async () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }), "http_401"],
      [async () => new Response("<html>not json</html>"), "bad_response"],
      [async () => new Response(JSON.stringify([{ result: "OK" }])), "bad_response"],
    ];
    for (const [fetchImpl, reason] of cases) {
      const err = await restStore({ url: URL_, token: TOKEN }, fetchImpl).hit("hebs27-e2e:rl:secret-key", 600).catch((e) => e);
      expect(err, reason).toBeInstanceOf(StoreError);
      expect(storeReason(err)).toBe(reason);
      for (const s of [TOKEN, URL_, "secret-key", "daily", "permissions"]) expect(`${err.message} ${err.reason}`).not.toContain(s);
    }
    expect(storeReason(new Error(`boom ${TOKEN}`))).toBe("unknown");
  });

  it("times out a store that does not answer", async () => {
    const hang = (_u: string, init: RequestInit) => new Promise<Response>((_, reject) => init.signal?.addEventListener("abort", () => reject(new Error("aborted"))));
    const err = await restStore({ url: URL_, token: TOKEN }, hang, 20).claim("k", "v", 60).catch((e) => e);
    expect(storeReason(err)).toBe("timeout");
  });
});

/* ── The submission path on the REST store ──────────────────────────── */

const priority = { full_name: "Synthetic Person", email: "person@synthetic.test", country: "Testland", interest: "Attendee", privacy_acknowledged: true };
let n = 0;
const uuid = () => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`;

function rig(fetchImpl: Parameters<typeof restStore>[1]) {
  const config: SubmitConfig = {
    environment: "development", mode: "mock", store: { kind: "rest", url: URL_, token: TOKEN }, ipSalt: "test-salt", notices: MOCK_NOTICES, uploads: false,
    portal: { url: "https://mock.portal.invalid/evSubmitPublicForm", appId: "mock-app", secret: MOCK_SECRET },
  };
  const portal = createMockPortal({ secret: MOCK_SECRET, open: { priority: true, sponsor: true, exhibitor: true, enquiry: true }, nowSeconds: () => NOW });
  const lines: string[] = [];
  const deps: SubmitDeps = {
    config, store: restStore({ url: URL_, token: TOKEN }, fetchImpl), portalFetch: portal.fetch, nowSeconds: () => NOW, sleep: async () => {}, log: (l) => lines.push(l),
  };
  const send = (values: Record<string, unknown>, attempt = uuid(), ip = "203.0.113.7") =>
    handleSubmit({
      method: "POST", contentType: "application/json", origin: "https://staging.example.test", host: "staging.example.test", ip,
      body: JSON.stringify({ form: "priority", values, elapsed_ms: 5000, website: "", attempt_id: attempt }),
    }, deps);
  return { portal, lines, send };
}

describe("submissions on the REST store", () => {
  it("confirms a submission, then enforces the rate limit per visitor", async () => {
    const r = rig(fakeRestStore().fetchImpl);
    const first = await r.send(priority);
    expect(first.outcome).toMatchObject({ status: "confirmed" });
    for (let i = 1; i < RATE_LIMIT.max; i++) await r.send({ ...priority, email: `p${i}@synthetic.test` });
    expect((await r.send({ ...priority, email: "over@synthetic.test" })).outcome).toEqual({ status: "rate_limited" });
    expect((await r.send({ ...priority, email: "other@synthetic.test" }, uuid(), "198.51.100.9")).outcome).toMatchObject({ status: "confirmed" });
  });

  it("sends a resent attempt with the same client_request_id, so the portal answers with the first reference", async () => {
    const r = rig(fakeRestStore().fetchImpl);
    const attempt = uuid();
    const a = await r.send(priority, attempt);
    const b = await r.send(priority, attempt);
    expect(a.outcome).toMatchObject({ status: "confirmed" });
    expect(b.outcome).toMatchObject({ status: "confirmed", reference: (a.outcome as { reference: string }).reference });
    const ids = r.portal.calls.map((c) => c.body?.client_request_id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(1);
    expect(r.portal.stored()).toBe(1);
  });

  it("fails closed when the store is unavailable: nothing reaches the portal, and the log names the reason only", async () => {
    for (const [fetchImpl, reason] of [
      [fakeRestStore({ token: "a-different-token" }).fetchImpl, "rate_limit_http_401"],
      [async () => { throw new TypeError("fetch failed"); }, "rate_limit_network"],
    ] as const) {
      const r = rig(fetchImpl);
      expect((await r.send(priority)).outcome).toEqual({ status: "unavailable" });
      expect(r.portal.calls).toHaveLength(0);
      expect(r.lines).toEqual([`[hebs2027-forms] {"form":"priority","outcome":"store_error","store":"${reason}"}`]);
      expect(r.lines.join("\n")).not.toContain(TOKEN);
    }
  });

  it("fails closed when only the request-id claim fails", async () => {
    const f = fakeRestStore();
    const flaky: Parameters<typeof restStore>[1] = async (url, init) =>
      String(init.body).includes('"GET"') ? new Response(JSON.stringify({ error: "ERR synthetic" }), { status: 400 }) : f.fetchImpl(url, init);
    const r = rig(flaky);
    expect((await r.send(priority)).outcome).toEqual({ status: "unavailable" });
    expect(r.portal.calls).toHaveLength(0);
    expect(r.lines.at(-1)).toContain('"store":"request_id_command_ERR"');
  });
});

describe("E0 store check (probeStore)", () => {
  it("passes on a working store, writing two short-lived probe keys only", async () => {
    const f = fakeRestStore();
    expect(await probeStore(restStore({ url: URL_, token: TOKEN }, f.fetchImpl), "hebs27-e2e:")).toEqual({ request: "store", status: 200, error: null });
    const keys = Array.from(f.data.keys());
    expect(keys).toHaveLength(2);
    for (const k of keys) {
      expect(k).toMatch(/^hebs27-e2e:probe:(rl|id):/);
      expect(f.data.get(k)!.until).toBe(60_000);
    }
  });

  it("reports the store's reason, or no_store, when it fails", async () => {
    expect(await probeStore(restStore({ url: URL_, token: TOKEN }, fakeRestStore({ token: "x" }).fetchImpl), "hebs27-e2e:")).toEqual({ request: "store", status: 0, error: "http_401" });
    expect(await probeStore(null, "hebs27-e2e:")).toEqual({ request: "store", status: 0, error: "no_store" });
  });
});
