/**
 * /api/contact must deliver both emails exactly as before while never writing
 * a visitor's name, email address or message to the server logs.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/contact/route";

// vi.mock is hoisted above the imports, so the route gets this mock.
const send = vi.hoisted(() => vi.fn());
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const VISITOR = {
  name: "Adaeze Testperson",
  email: "adaeze.private@example.com",
  message: "Private enquiry text about my booking needs.",
};
const PII = [VISITOR.name, VISITOR.email, VISITOR.message, "adaeze"];

let ipCounter = 0;
function request(body: unknown): NextRequest {
  ipCounter += 1;
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `203.0.113.${ipCounter}` },
    body: JSON.stringify(body),
  });
}

let logged: string[] = [];
beforeEach(() => {
  logged = [];
  process.env.RESEND_API_KEY = "re_test_key";
  send.mockReset();
  for (const level of ["log", "info", "warn", "error", "debug"] as const) {
    vi.spyOn(console, level).mockImplementation((...args: unknown[]) => {
      logged.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
    });
  }
});
afterEach(() => vi.restoreAllMocks());

function expectNoPersonalData() {
  const all = logged.join("\n").toLowerCase();
  for (const value of PII) expect(all).not.toContain(value.toLowerCase());
}

describe("POST /api/contact", () => {
  it("sends the team notification and the visitor confirmation, logging no personal data", async () => {
    send.mockResolvedValue({ data: { id: "email_1" }, error: null });
    const res = await POST(request(VISITOR));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[0][0]).toMatchObject({ to: "info@thehebs.com", replyTo: VISITOR.email });
    expect(send.mock.calls[1][0]).toMatchObject({ to: VISITOR.email });
    expect(logged.some((l) => l.includes("dispatched successfully"))).toBe(true);
    expectNoPersonalData();
  });

  it("reports a provider rejection without echoing the recipient into the logs", async () => {
    send
      .mockResolvedValueOnce({ data: { id: "email_1" }, error: null })
      .mockResolvedValueOnce({
        data: null,
        error: { name: "validation_error", statusCode: 422, message: `Invalid \`to\` field: ${VISITOR.email}` },
      });
    const res = await POST(request(VISITOR));
    expect(res.status).toBe(500);
    const line = logged.find((l) => l.includes("Resend rejected"));
    expect(line).toContain("validation_error");
    expect(line).toContain("422");
    expect(line).toContain("[redacted-email]");
    expectNoPersonalData();
  });

  it("redacts addresses from unexpected thrown errors", async () => {
    send.mockRejectedValue(new Error(`socket closed while sending to ${VISITOR.email}`));
    const res = await POST(request(VISITOR));
    expect(res.status).toBe(500);
    expect(logged.some((l) => l.includes("Unexpected error") && l.includes("[redacted-email]"))).toBe(true);
    expectNoPersonalData();
  });

  it("drops honeypot submissions silently, without sending or logging personal data", async () => {
    const res = await POST(request({ ...VISITOR, bot_field: "filled-by-bot" }));
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
    expectNoPersonalData();
  });

  it("still validates input", async () => {
    expect((await POST(request({ ...VISITOR, email: "not-an-email" }))).status).toBe(400);
    expect((await POST(request({ ...VISITOR, message: "short" }))).status).toBe(400);
    expect((await POST(request({ name: "", email: "", message: "" }))).status).toBe(400);
    expect(send).not.toHaveBeenCalled();
    expectNoPersonalData();
  });

  it("fails clearly when the email service is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    const res = await POST(request(VISITOR));
    expect(res.status).toBe(500);
    expect(logged.some((l) => l.includes("RESEND_API_KEY is not configured"))).toBe(true);
    expectNoPersonalData();
  });

  it("keeps the per-address rate limit", async () => {
    send.mockResolvedValue({ data: { id: "x" }, error: null });
    const same = () =>
      new NextRequest("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.7" },
        body: JSON.stringify(VISITOR),
      });
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await POST(same())).status);
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    expectNoPersonalData();
  });
});
