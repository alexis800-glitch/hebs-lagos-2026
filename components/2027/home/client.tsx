"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { COUNTDOWN_TARGET_ISO } from "@/lib/editions/2027";
import { timeLeftSeconds, type TimeLeftSeconds } from "@/lib/countdown";
import { OPEN_PREFERENCES_EVENT } from "@/lib/consent";

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

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The destination sequence. It runs only while the section is on screen, plays
 * each scene's film from its start, and dissolves into the next. With reduced
 * motion it does not advance or play by itself: the chapters are buttons. The
 * corner label always says whether the scene is a concept or a photograph.
 */
export function DestinationSequence({ scenes, children }: { scenes: Scene[]; children: ReactNode }) {
  const [k, setK] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    setReduced(prefersReducedMotion());
    const el = root.current?.closest("section");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const running = inView && !paused && !reduced;
  useEffect(() => {
    refs.current.forEach((r, j) => {
      const v = r?.querySelector("video");
      if (!v) return;
      if (j === k && running) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else v.pause();
    });
    if (!running) return;
    const id = setTimeout(() => setK((x) => (x + 1) % scenes.length), scenes[k].seconds * 1000);
    return () => clearTimeout(id);
  }, [k, running, scenes]);
  const s = scenes[k];
  return (
    <>
      <div className="stage" ref={root}>
        {scenes.map((sc, j) => (
          <div key={sc.title} ref={(el) => { refs.current[j] = el; }} className={`scene${sc.plain ? "" : " ph"}${j === k ? " on" : ""}`} aria-hidden={j !== k}>
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
      <ul className="chap" aria-label="Destination scenes">
        {scenes.map((sc, j) => (
          <li key={sc.title} className={j === k ? "on" : undefined}>
            <button type="button" aria-pressed={j === k} onClick={() => setK(j)}>
              <span className="bar">
                <i key={j === k ? `run-${k}-${running}` : j < k ? "done" : "idle"} className={j === k && running ? "run" : j < k || (j === k && !running) ? "done" : undefined} style={{ ["--dur" as string]: `${sc.seconds}s` }} />
              </span>
              <b>{sc.title}</b>
              <span>{sc.kind === "photographed" ? "Photographed" : "Concept"}</span>
            </button>
          </li>
        ))}
      </ul>
      {!reduced ? (
        <button type="button" className="vctl dzctl" aria-label={paused ? "Play the destination films" : "Pause the destination films"} onClick={() => setPaused((p) => !p)}>
          <span aria-hidden="true">{paused ? "\u25B6" : "\u275A\u275A"}</span>
        </button>
      ) : null}
    </>
  );
}

/**
 * A film that never holds up the page. Its first-frame still (a <picture> with
 * the phone and desktop crops) paints first; the film fades in once it plays.
 * Autoplaying films start only on screen and without reduced motion, pause when
 * scrolled away, and stay paused once a visitor pauses them. If the browser
 * refuses to play (iPhone Low Power Mode, data saver), the still remains.
 */
export function SmartVideo({
  id, wide, tall, widePoster, tallPoster, label, loop = false, autoPlay = false, priority = false,
}: {
  id?: string; wide: string; tall: string; widePoster?: string; tallPoster?: string; label: string;
  loop?: boolean; autoPlay?: boolean; priority?: boolean;
}) {
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // The crop is chosen here, not with <source media>: Safari ignores `media` on
  // video sources and would load the desktop crop on an iPhone. Nothing loads
  // before hydration, so the still is always the first thing painted.
  const [src, setSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    setSrc(window.matchMedia("(max-width: 600px)").matches ? tall : wide);
  }, [tall, wide]);
  useEffect(() => {
    const el = v.current;
    if (!el || !src || !autoPlay || prefersReducedMotion()) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (el.dataset.userPaused !== "1") el.play().catch(() => setPlaying(false));
      } else el.pause();
    }, { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [autoPlay, src]);
  return (
    <>
      {widePoster ? (
        <picture className="vposter">
          {tallPoster ? <source media="(max-width: 600px)" srcSet={tallPoster} /> : null}
          {/* eslint-disable-next-line @next/next/no-img-element -- local review still */}
          <img src={widePoster} alt="" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />
        </picture>
      ) : null}
      <video
        ref={v}
        id={id}
        className={playing ? "on" : undefined}
        muted
        playsInline
        loop={loop}
        preload={priority ? "metadata" : "none"}
        aria-label={label}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setPlaying(false)}
        src={src}
      />
    </>
  );
}

/** Pause and play for a background film (WCAG 2.2.2), placed above the film's overlays. */
export function FilmControl({ target, label }: { target: string; label: string }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const el = document.getElementById(target) as HTMLVideoElement | null;
    if (!el) return;
    const sync = () => setPlaying(!el.paused);
    sync();
    el.addEventListener("play", sync);
    el.addEventListener("pause", sync);
    return () => {
      el.removeEventListener("play", sync);
      el.removeEventListener("pause", sync);
    };
  }, [target]);
  const toggle = () => {
    const el = document.getElementById(target) as HTMLVideoElement | null;
    if (!el) return;
    if (el.paused) {
      el.dataset.userPaused = "0";
      el.play().catch(() => {});
    } else {
      el.dataset.userPaused = "1";
      el.pause();
    }
  };
  return (
    <button type="button" className="vctl" aria-label={`${playing ? "Pause" : "Play"} ${label}`} onClick={toggle}>
      <span aria-hidden="true">{playing ? "\u275A\u275A" : "\u25B6"}</span>
    </button>
  );
}

/**
 * The phone menu: a button that opens every 2027 page over the hero. Escape or the
 * close button shuts it and returns focus to the button; Tab stays inside while open.
 */
export function MobileMenu({ home, links, cta }: { home: string; links: { label: string; href: string }[]; cta: { label: string; href: string } }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    window.scrollTo(0, 0);
    const focusables = () => Array.from(panel.current?.querySelectorAll<HTMLElement>("a[href],button") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      } else if (e.key === "Tab") {
        const f = focusables();
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);
  const close = () => {
    setOpen(false);
    button.current?.focus();
  };
  return (
    <>
      <button ref={button} type="button" className="menu" aria-expanded={open} aria-controls="hp-menu" onClick={() => setOpen(true)}>
        Menu
      </button>
      <div ref={panel} id="hp-menu" className="mpanel" role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <button type="button" className="mclose" onClick={close}>Close</button>
        <nav aria-label="All HEBS 2027 pages">
          <ul>
            <li><a href={home} onClick={() => setOpen(false)}>Home</a></li>
            {links.map((l) => (
              <li key={l.href}><a href={l.href} onClick={() => setOpen(false)}>{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <a className="btn pri" href={cta.href} onClick={() => setOpen(false)}>{cta.label}</a>
      </div>
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

/** Opens the site's cookie preferences dialog (TrackingConsent), where the visitor can change their choice. */
export function CookiePreferencesButton() {
  return (
    <button type="button" className="pf-link" onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))}>
      Cookie preferences
    </button>
  );
}
