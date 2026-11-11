"use client";

import { useId, useState, useSyncExternalStore } from "react";
import type { SignoffDecision, SignoffDecisionKind } from "@/lib/content/signoff-decisions-2027";

/**
 * Drafting sign-off decisions on the review page (/2027/review).
 *
 * Drafts stay in this browser only (localStorage): nothing is sent anywhere and
 * no form is submitted. The reviewer exports the drafts as a decision record and
 * sends it to Veridion, who records it in lib/content/signoff-decisions-2027.ts.
 * A draft is tied to the wording it was made on; if the wording changes, the
 * draft no longer counts.
 */

interface Draft {
  decision: SignoffDecisionKind;
  /** The wording the decision was made on. */
  text: string;
  note: string;
}
type Drafts = Record<string, Draft>;

const KEY = "hebs27-signoff-drafts-v1";
const NAME_KEY = "hebs27-signoff-reviewer-v1";
const EMPTY: Drafts = {};
const listeners = new Set<() => void>();
let cache: Drafts | null = null;

function read(): Drafts {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Drafts;
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: Drafts) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private windows may refuse storage; drafts then last until the page closes.
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

const useDrafts = () => useSyncExternalStore(subscribe, read, () => EMPTY);

const CHOICES: { value: SignoffDecisionKind; label: string }[] = [
  { value: "approved", label: "Approved" },
  { value: "revision-required", label: "Revision required" },
  { value: "pending-decision", label: "Pending decision" },
];

/** The three-way decision for one item, with a note for revisions and pending decisions. */
export function DecisionControl({ id, text, proposed }: { id: string; text: string; proposed?: string }) {
  const drafts = useDrafts();
  const uid = useId();
  const draft = drafts[id];
  const stale = draft && draft.text !== text;
  const current = stale ? undefined : draft;
  const set = (patch: Partial<Draft>) => {
    const base: Draft = current ?? { decision: "approved", text, note: "" };
    write({ ...read(), [id]: { ...base, ...patch, text } });
  };
  const clear = () => {
    const next = { ...read() };
    delete next[id];
    write(next);
  };
  return (
    <fieldset className="mt-4 border-t border-h27-line pt-4">
      <legend className="sr-only">Decision for {id}</legend>
      {stale && <p className="mb-2 text-xs text-h27-champagne">The wording changed after you drafted a decision. Decide again.</p>}
      <div className="flex flex-wrap gap-2">
        {CHOICES.map((c) => (
          <label key={c.value} className={`rv-choice${current?.decision === c.value ? " is-on" : ""}`} data-kind={c.value}>
            <input type="radio" name={`${uid}-d`} value={c.value} checked={current?.decision === c.value} onChange={() => set({ decision: c.value })} />
            {c.label}
          </label>
        ))}
        {current && (
          <button type="button" className="rv-clear" onClick={clear}>Clear</button>
        )}
      </div>
      {current && current.decision !== "approved" && (
        <div className="mt-3">
          <label htmlFor={`${uid}-n`} className="block text-xs text-h27-muted">
            {current.decision === "revision-required" ? "Wording you want instead, or what to change" : "What it waits for"}
          </label>
          <textarea
            id={`${uid}-n`}
            rows={2}
            className="rv-note"
            value={current.note}
            placeholder={current.decision === "revision-required" && proposed ? "Leave empty to accept the proposed wording above" : undefined}
            onChange={(e) => set({ note: e.target.value })}
          />
        </div>
      )}
    </fieldset>
  );
}

/** The record a reviewer sends to Veridion, in the shape lib/content/signoff-decisions-2027.ts keeps. */
function record(drafts: Drafts, by: string, proposals: Record<string, string>, texts: Record<string, string>): SignoffDecision[] {
  const on = new Date().toISOString().slice(0, 10);
  return Object.entries(drafts)
    .filter(([id, d]) => texts[id] === d.text)
    .map(([item, d]) => ({
      item,
      decision: d.decision,
      ...(d.decision === "approved" ? { text: d.text } : {}),
      by,
      on,
      reference: `Content sign-off page, ${on}`,
      ...(d.note || (d.decision === "revision-required" && proposals[item]) ? { note: d.note || `Use the proposed wording: ${proposals[item]}` } : {}),
    }));
}

const useName = () =>
  useSyncExternalStore(subscribe, () => {
    try {
      return localStorage.getItem(NAME_KEY) ?? "";
    } catch {
      return "";
    }
  }, () => "");

/**
 * The bar that exports the drafts. `texts` is every item's current wording, so a
 * draft made on older wording is left out of the record.
 */
export function DecisionTray({ texts, proposals }: { texts: Record<string, string>; proposals: Record<string, string> }) {
  const drafts = useDrafts();
  const name = useName();
  const [said, say] = useState("");
  const live = Object.entries(drafts).filter(([id, d]) => texts[id] === d.text);
  const count = (k: SignoffDecisionKind) => live.filter(([, d]) => d.decision === k).length;
  const setName = (v: string) => {
    try {
      localStorage.setItem(NAME_KEY, v);
    } catch {
      // Not kept; the field still works for this visit.
    }
    listeners.forEach((l) => l());
  };
  const json = () => JSON.stringify(record(drafts, name.trim(), proposals, texts), null, 2);
  const ready = live.length > 0 && name.trim().length > 0;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json());
      say("Record copied. Paste it into an email to Veridion.");
    } catch {
      say("The browser blocked copying. Use Download instead.");
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([json()], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `hebs-2027-signoff-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    say("Record downloaded. Send the file to Veridion.");
  };
  const clearAll = () => {
    if (confirm(`Clear all ${live.length} drafted decisions in this browser?`)) write({});
  };
  return (
    <div className="rv-tray" role="region" aria-label="Your drafted decisions">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-8 lg:flex-row lg:items-center">
        <p className="text-sm text-h27-ivory" aria-live="polite">
          <b>{live.length}</b> drafted: {count("approved")} approved, {count("revision-required")} for revision, {count("pending-decision")} pending.
          {said && <span className="block text-xs text-h27-champagne">{said}</span>}
          {!said && live.length > 0 && !name.trim() && <span className="block text-xs text-h27-muted">Add your name to export the record.</span>}
        </p>
        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          <label className="sr-only" htmlFor="rv-name">Your name, for the record</label>
          <input id="rv-name" className="rv-name" placeholder="Your name, for the record" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="button" className="s27-btn s27-btn--pri" disabled={!ready} onClick={copy}>Copy record</button>
          <button type="button" className="s27-btn s27-btn--gh" disabled={!ready} onClick={download}>Download</button>
          {live.length > 0 && <button type="button" className="rv-clear" onClick={clearAll}>Clear all</button>}
        </div>
      </div>
    </div>
  );
}
