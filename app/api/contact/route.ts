import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Rate-limit state — persists across hot reloads in dev
const g = globalThis as typeof globalThis & {
  _hebsRateLimit?: Map<string, { count: number; reset: number }>;
};
if (!g._hebsRateLimit) g._hebsRateLimit = new Map();
const rl = g._hebsRateLimit;

const RATE_LIMIT = 5;
const RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rl.get(ip);
  if (!entry || now > entry.reset) {
    rl.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  // ── Diagnostic: env check (safe — never logs the key value) ──────────────
  const apiKeyExists = !!process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM ?? "(not set — using hardcoded fallback)";
  console.log("[contact] RESEND_API_KEY present:", apiKeyExists);
  console.log("[contact] RESEND_FROM:", fromAddress);

  // ── Guard: fail fast if API key is missing ────────────────────────────────
  if (!apiKeyExists) {
    console.error("[contact] RESEND_API_KEY is not configured in environment");
    return NextResponse.json(
      { error: "Email service is not configured. Please contact us directly at info@thehebs.com." },
      { status: 500 }
    );
  }

  // ── Rate limiting ─────────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: {
    name?: string;
    email?: string;
    message?: string;
    bot_field?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, message, bot_field } = body;

  console.log("CONTACT FORM RECEIVED", { name, email, messageLength: message?.length, bot_field: !!bot_field });

  // ── Honeypot ──────────────────────────────────────────────────────────────
  if (bot_field) {
    console.log("[contact] Honeypot triggered — dropping silently");
    return NextResponse.json({ ok: true });
  }

  // ── Field validation ──────────────────────────────────────────────────────
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (message.trim().length < 10) {
    return NextResponse.json(
      { error: "Message must be at least 10 characters." },
      { status: 400 }
    );
  }

  // ── Build email content ───────────────────────────────────────────────────
  const FROM =
    process.env.RESEND_FROM ?? "HEBS Lagos 2026 <noreply@hebslagos.com>";
  const TO_TEAM = "info@thehebs.com";

  const safeName    = escHtml(name.trim());
  const safeEmail   = escHtml(email.trim());
  const safeMessage = escHtml(message.trim()).replace(/\n/g, "<br>");

  // ── Initialise Resend inside the handler so a missing key never crashes the
  //    module on cold start — the guard above already caught that case.
  const resend = new Resend(process.env.RESEND_API_KEY);

  // ── Send emails ───────────────────────────────────────────────────────────
  // Resend SDK v2+ never throws — it returns { data, error }.
  // We check error objects AND wrap in try/catch for belt-and-suspenders safety.
  try {
    const [notif, confirm] = await Promise.all([
      // 1. Notification to the HEBS team
      resend.emails.send({
        from: FROM,
        to: TO_TEAM,
        replyTo: email.trim(),
        subject: `New inquiry from ${name.trim()} — HEBS Lagos 2026`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#0d0d0d;color:#e4e4e7;border-radius:12px;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#a1a1aa;">HEBS Lagos 2026</p>
            <h2 style="margin:0 0 28px;font-size:22px;font-weight:600;color:#f59e0b;">New Website Inquiry</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr>
                <td style="padding:12px 16px 12px 0;border-bottom:1px solid #27272a;color:#a1a1aa;white-space:nowrap;vertical-align:top;width:80px;">Name</td>
                <td style="padding:12px 0;border-bottom:1px solid #27272a;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px 12px 0;border-bottom:1px solid #27272a;color:#a1a1aa;vertical-align:top;">Email</td>
                <td style="padding:12px 0;border-bottom:1px solid #27272a;">
                  <a href="mailto:${safeEmail}" style="color:#f59e0b;text-decoration:none;">${safeEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 16px 0 0;color:#a1a1aa;vertical-align:top;">Message</td>
                <td style="padding:12px 0;line-height:1.65;">${safeMessage}</td>
              </tr>
            </table>
            <p style="margin:28px 0 0;font-size:11px;color:#52525b;border-top:1px solid #27272a;padding-top:16px;">
              Sent via the HEBS 2026 contact form · ${new Date().toUTCString()}
            </p>
          </div>`,
      }),

      // 2. Confirmation to the visitor
      resend.emails.send({
        from: FROM,
        to: email.trim(),
        subject: "We received your message — HEBS Lagos 2026",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#0d0d0d;color:#e4e4e7;border-radius:12px;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#a1a1aa;">HEBS Lagos 2026</p>
            <h2 style="margin:0 0 20px;font-size:22px;font-weight:600;color:#f59e0b;">Thank you, ${safeName}!</h2>
            <p style="margin:0 0 16px;line-height:1.7;color:#d4d4d8;">
              We've received your message and will get back to you within <strong style="color:#fff;">1–2 business days</strong>.
            </p>
            <p style="margin:0 0 28px;line-height:1.7;color:#d4d4d8;">
              For urgent inquiries, reach us directly at
              <a href="mailto:info@thehebs.com" style="color:#f59e0b;text-decoration:none;">info@thehebs.com</a>
              or via WhatsApp at
              <a href="https://wa.me/14843571812" style="color:#f59e0b;text-decoration:none;">+1 (484) 357-1812</a>.
            </p>
            <div style="border-top:1px solid #27272a;padding-top:20px;">
              <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa;">Hair Education Beauty Summit 2026</p>
              <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa;">October 23–25, 2026 · Lagos, Nigeria</p>
              <p style="margin:8px 0 0;font-size:13px;">
                <a href="https://hebseventportal.com/register" style="color:#f59e0b;text-decoration:none;">Register Now ↗</a>
              </p>
            </div>
          </div>`,
      }),
    ]);

    console.log("ADMIN EMAIL RESULT", { data: notif.data, error: notif.error });
    console.log("CONFIRM EMAIL RESULT", { data: confirm.data, error: confirm.error });

    // ── Surface any Resend-level errors to the client ───────────────────────
    if (notif.error || confirm.error) {
      const sdkErr = notif.error ?? confirm.error;
      console.error("[contact] Resend rejected at least one send:", sdkErr);
      return NextResponse.json(
        {
          error:
            "Failed to send your message. Please try again or contact us directly at info@thehebs.com.",
        },
        { status: 500 }
      );
    }

    console.log("[contact] Both emails dispatched successfully");
    return NextResponse.json({ ok: true });

  } catch (err) {
    // Catches network-level failures or unexpected SDK throws
    console.error("[contact] Unexpected error during Resend call:", err);
    return NextResponse.json(
      {
        error:
          "Failed to send your message. Please try again or contact us directly at info@thehebs.com.",
      },
      { status: 500 }
    );
  }
}
