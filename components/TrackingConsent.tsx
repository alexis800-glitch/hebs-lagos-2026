"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import MetaPixel, { metaPixelIsLive } from "./MetaPixel";
import {
  CONSENT_ACCEPTED,
  CONSENT_REJECTED,
  OPEN_PREFERENCES_EVENT,
  readConsent,
  writeConsent,
  type ConsentDecision,
} from "@/lib/consent";

/**
 * The one place the Meta Pixel can enter the page.
 *
 * <MetaPixel /> is rendered only while the stored decision is "accepted", so on a
 * first visit, after a rejection, and while the banner is still open, no request
 * to connect.facebook.net or facebook.com/tr is ever made. The old unconditional
 * <noscript> beacon was removed rather than kept: a visitor without JavaScript
 * cannot have consented, so it must not fire.
 *
 * The banner asks for a decision; dismissing it is not one. There is no close
 * button on it, and nothing is pre-selected - Accept and Reject are the same
 * size, weight and colour, so neither is nudged.
 */
export default function TrackingConsent() {
  const [decision, setDecision] = useState<ConsentDecision | null>(null);
  // The cookie is only readable in the browser, so the first render must not
  // guess. Until this flips, no banner is shown and no pixel is mounted.
  const [ready, setReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    setDecision(readConsent());
    setReady(true);
  }, []);

  useEffect(() => {
    const open = () => setPreferencesOpen(true);
    window.addEventListener(OPEN_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open);
  }, []);

  const accept = useCallback(() => {
    writeConsent(CONSENT_ACCEPTED);
    setDecision(CONSENT_ACCEPTED);
    setPreferencesOpen(false);
  }, []);

  const reject = useCallback(() => {
    writeConsent(CONSENT_REJECTED);
    setDecision(CONSENT_REJECTED);
    setPreferencesOpen(false);
    // Withdrawal after the pixel has already run: unmounting the <Script> does
    // not remove fbevents.js from the document, so reload to get a page that has
    // never contained it. Earlier page loads are unaffected - withdrawal stops
    // further tracking, it does not undo what already happened.
    if (metaPixelIsLive()) window.location.reload();
  }, []);

  const showBanner = ready && decision === null && !preferencesOpen;

  return (
    <>
      {decision === CONSENT_ACCEPTED && <MetaPixel />}
      {showBanner && <ConsentBanner onAccept={accept} onReject={reject} />}
      {preferencesOpen && (
        <PreferencesDialog
          decision={decision}
          onAccept={accept}
          onReject={reject}
          onClose={() => setPreferencesOpen(false)}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Shared button - Accept and Reject must be indistinguishable in      */
/* prominence, so they share one style and differ only in their label. */
/* ------------------------------------------------------------------ */

const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]";

function ChoiceButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 sm:min-w-[140px] rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors ${FOCUS_RING}`}
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.45)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
      }}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* First-visit banner                                                  */
/* ------------------------------------------------------------------ */

function ConsentBanner({
  onAccept,
  onReject,
}: {
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="hebs-consent-title"
      aria-describedby="hebs-consent-description"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4"
    >
      <div
        className="mx-auto max-w-4xl rounded-xl p-5 sm:p-6"
        style={{
          background: "rgba(18,18,18,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(155,89,182,0.35)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
        }}
      >
        <h2
          id="hebs-consent-title"
          className="text-base sm:text-lg font-semibold text-white tracking-tight"
        >
          Your privacy choices
        </h2>
        <div id="hebs-consent-description" className="mt-3 space-y-2">
          <p className="text-sm leading-relaxed" style={{ color: "#cfcfcf" }}>
            HEBS Lagos uses Meta Pixel to understand advertising performance and how
            visitors interact with our website. This tracking is optional and will only
            be activated if you choose Accept.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#cfcfcf" }}>
            You can reject tracking and continue using the website normally. You can
            change your choice at any time through Cookie preferences.
          </p>
        </div>
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <Link
            href="/privacy"
            className={`text-xs underline underline-offset-4 sm:mr-auto rounded ${FOCUS_RING}`}
            style={{ color: "#b9b9b9" }}
          >
            Privacy &amp; Cookie Notice
          </Link>
          <div className="flex gap-3">
            <ChoiceButton onClick={onAccept}>Accept</ChoiceButton>
            <ChoiceButton onClick={onReject}>Reject</ChoiceButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Preferences dialog, reopened from the footer                        */
/* ------------------------------------------------------------------ */

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function PreferencesDialog({
  decision,
  onAccept,
  onReject,
  onClose,
}: {
  decision: ConsentDecision | null;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  // This dialog is opened deliberately, so it takes focus and hands it back on
  // close. Escape closes it without changing the stored decision.
  useEffect(() => {
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    const restore = restoreFocusTo;
    return () => restore.current?.focus?.();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;

    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const status =
    decision === CONSENT_ACCEPTED
      ? "Meta Pixel tracking is currently accepted."
      : decision === CONSENT_REJECTED
        ? "Meta Pixel tracking is currently rejected."
        : "You have not made a choice yet. Meta Pixel tracking is off.";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-3 sm:p-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hebs-preferences-title"
        aria-describedby="hebs-preferences-description"
        onKeyDown={onKeyDown}
        className="w-full max-w-lg rounded-xl p-5 sm:p-6"
        style={{
          background: "rgba(18,18,18,0.98)",
          border: "1px solid rgba(155,89,182,0.35)",
          boxShadow: "0 10px 50px rgba(0,0,0,0.6)",
        }}
      >
        <h2
          id="hebs-preferences-title"
          className="text-lg font-semibold text-white tracking-tight"
        >
          Cookie preferences
        </h2>
        <div id="hebs-preferences-description" className="mt-3 space-y-2">
          <p className="text-sm leading-relaxed" style={{ color: "#cfcfcf" }}>
            HEBS Lagos uses Meta Pixel to understand advertising performance and how
            visitors interact with our website. This tracking is optional and the
            website works normally without it.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#9b9b9b" }}>
            {status}
          </p>
        </div>
        <div className="mt-5 flex gap-3">
          <ChoiceButton onClick={onAccept}>Accept</ChoiceButton>
          <ChoiceButton onClick={onReject}>Reject</ChoiceButton>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <Link
            href="/privacy"
            className={`text-xs underline underline-offset-4 rounded ${FOCUS_RING}`}
            style={{ color: "#b9b9b9" }}
          >
            Privacy &amp; Cookie Notice
          </Link>
          <button
            type="button"
            onClick={onClose}
            className={`text-xs rounded px-2 py-1 ${FOCUS_RING}`}
            style={{ color: "#b9b9b9" }}
          >
            Close without changing
          </button>
        </div>
      </div>
    </div>
  );
}
