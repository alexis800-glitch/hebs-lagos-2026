"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { COUNTDOWN_TARGET_ISO } from "@/lib/editions/2027";
import { timeLeftSeconds, type TimeLeftSeconds } from "@/lib/countdown";

/** Scales the 1440 px desktop composition to the window (see .hp in home.css). */
export function DesignScale() {
  useEffect(() => {
    const root = document.documentElement;
    const set = () => root.style.setProperty("--hpz", String(Math.min(1, window.innerWidth / 1440)));
    set();
    window.addEventListener("resize", set);
    return () => {
      window.removeEventListener("resize", set);
      root.style.removeProperty("--hpz");
    };
  }, []);
  return null;
}

const UNITS = [
  ["days", "Days"],
  ["hours", "Hours"],
  ["minutes", "Minutes"],
  ["seconds", "Seconds"],
] as const;

/**
 * Live countdown to July 23, 2027, midnight in Lagos, ticking each second.
 * The server renders dashes so hydration never disagrees with the clock.
 */
export function LiveCountdown() {
  const [left, setLeft] = useState<TimeLeftSeconds | null | undefined>(undefined);
  useEffect(() => {
    const tick = () => setLeft(timeLeftSeconds(COUNTDOWN_TARGET_ISO, Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (left === null) return null;
  const label = left
    ? `${left.days} days, ${left.hours} hours, ${left.minutes} minutes and ${left.seconds} seconds until July 23, 2027, Lagos time`
    : "Counting down to July 23, 2027";
  return (
    <div className="count" role="timer" aria-label={label}>
      {UNITS.map(([key, name], i) => (
        <span className="u" key={key} aria-hidden="true">
          <span className="n">{left ? (i === 0 ? String(left[key]) : String(left[key]).padStart(2, "0")) : "–"}</span>
          <span className="l">{name}</span>
        </span>
      ))}
    </div>
  );
}

/** Six experiences: the index advances every 3.8 s and the framed image follows. */
export function ExperienceIndex({
  items,
  images,
  heading,
}: {
  items: { title: string; text: string }[];
  images: { node: ReactNode; className?: string }[];
  heading: ReactNode;
}) {
  const [k, setK] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setK((v) => (v + 1) % items.length), 3800);
    return () => clearInterval(id);
  }, [items.length]);
  return (
    <>
      <div className="feat">
        <div className="frm" />
        {images.map((im, j) => (
          <div key={j} className={`ph ${im.className ?? ""} ${j === k ? "on" : ""}`}>
            {im.node}
          </div>
        ))}
      </div>
      <div>
        {heading}
        <ExperienceList items={items} active={k} />
      </div>
    </>
  );
}

function ExperienceList({ items, active }: { items: { title: string; text: string }[]; active: number }) {
  return (
    <ol>
      {items.map((it, j) => (
        <li key={it.title} className={j === active ? "on" : undefined}>
          <h3>{it.title}</h3>
          <span className="bar">
            <i key={j === active ? `run-${active}` : "idle"} className={j === active ? "run" : undefined} style={{ ["--dur" as string]: "3.8s" }} />
          </span>
          <p>{it.text}</p>
        </li>
      ))}
    </ol>
  );
}

export interface Scene {
  title: string;
  kind: "concept" | "photographed";
  seconds: number;
  note: string;
  node: ReactNode;
  plain?: boolean;
}

/**
 * The destination sequence: each scene plays once from its start and dissolves
 * into the next. The corner label always says whether the scene is a concept or
 * a photograph.
 */
export function DestinationSequence({ scenes, children }: { scenes: Scene[]; children: ReactNode }) {
  const [k, setK] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const v = refs.current[k]?.querySelector("video");
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
    const id = setTimeout(() => setK((x) => (x + 1) % scenes.length), scenes[k].seconds * 1000);
    return () => clearTimeout(id);
  }, [k, scenes]);
  const s = scenes[k];
  return (
    <>
      <div className="stage">
        {scenes.map((sc, j) => (
          <div key={sc.title} ref={(el) => { refs.current[j] = el; }} className={`scene${sc.plain ? "" : " ph"}${j === k ? " on" : ""}`}>
            {sc.node}
          </div>
        ))}
      </div>
      <div className="frameline" />
      <div className={`badge${s.kind === "photographed" ? " photo" : ""}`}>
        <b>{s.kind === "photographed" ? "PHOTOGRAPHED" : "CONCEPT"}</b>
        <span>{s.note}</span>
      </div>
      {children}
      <ul className="chap">
        {scenes.map((sc, j) => (
          <li key={sc.title} className={j === k ? "on" : undefined}>
            <span className="bar">
              <i key={j === k ? `run-${k}` : j < k ? "done" : "idle"} className={j === k ? "run" : j < k ? "done" : undefined} style={{ ["--dur" as string]: `${sc.seconds}s` }} />
            </span>
            <b>{sc.title}</b>
            <span>{sc.kind === "photographed" ? "Photographed" : "Concept"}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

/** The winners row, scrolled by the gold arrows on desktop and by swipe on the phone. */
export function WinnersRail({ heading, count, children }: { heading: string; count: string | null; children: ReactNode }) {
  const rail = useRef<HTMLDivElement>(null);
  const go = (dir: number) => rail.current?.scrollBy({ left: dir * rail.current.clientWidth, behavior: "smooth" });
  return (
    <>
      <div className="bar2">
        <p>
          {heading} {count ? <span className="cnt">{count}</span> : null}
        </p>
        <div className="arrows">
          <button type="button" aria-label="Previous winners" onClick={() => go(-1)}>←</button>
          <button type="button" aria-label="Next winners" onClick={() => go(1)}>→</button>
        </div>
      </div>
      <div className="rail" ref={rail}>
        {children}
      </div>
    </>
  );
}
