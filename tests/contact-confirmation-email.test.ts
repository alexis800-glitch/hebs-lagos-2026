/**
 * The visitor's confirmation email must not advertise the finished 2026 event
 * or send people to the closed registration page. Delivery is unchanged.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/contact/route";

// vi.mock is hoisted above the imports, so the route gets this mock.
const send = vi.hoisted(() => vi.fn());
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

let ip = 0;
function request(body: unknown): NextRequest {
  ip += 1;
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `192.0.2.${ip}` },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  process.env.RESEND_API_KEY = "re_test_key";
  send.mockReset().mockResolvedValue({ data: { id: "x" }, error: null });
  for (const level of ["log", "error", "warn"] as const) vi.spyOn(console, level).mockImplementation(() => {});
});

describe("contact confirmation email", () => {
  it("still sends the team notification and the visitor confirmation", async () => {
    const res = await POST(request({ name: "Test Visitor", email: "visitor@example.com", message: "A question about HEBS." }));
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[0][0].to).toBe("info@thehebs.com");
    expect(send.mock.calls[1][0].to).toBe("visitor@example.com");
    expect(send.mock.calls[1][0].html).toContain("Thank you, Test Visitor!");
  });

  it("does not advertise the 2026 event or link to registration", async () => {
    await POST(request({ name: "Test Visitor", email: "visitor2@example.com", message: "A question about HEBS." }));
    const confirmation = send.mock.calls[1][0];
    const text = `${confirmation.subject}\n${confirmation.html}`;
    for (const banned of ["2026", "October 23", "hebseventportal", "/register", "Visit HEBS Portal"]) {
      expect(text).not.toContain(banned);
    }
    expect(confirmation.html).toContain("https://www.hebslagos.com");
  });
});
