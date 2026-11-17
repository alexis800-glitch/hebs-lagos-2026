"use client";
/* eslint-disable @next/next/no-img-element -- local photographs shown at their full prepared size */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import "./lightbox.css";

export type LightboxItem = { src: string; alt: string };

const OpenAt = createContext<((index: number, from: HTMLElement) => void) | null>(null);

/**
 * A set of photographs that open, full size, in one viewer: previous and next
 * (buttons, arrow keys, swipe), Escape or the close button to leave, focus kept
 * inside the viewer and returned to the photograph that opened it.
 */
export function LightboxGroup({ items, label, children }: { items: LightboxItem[]; label: string; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touch = useRef<number | null>(null);

  const open = useCallback((i: number, from: HTMLElement) => { opener.current = from; setIndex(i); }, []);
  const close = useCallback(() => { setIndex(null); opener.current?.focus(); }, []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (index === null) return;
    closeBtn.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [index, close, step]);

  const item = index === null ? null : items[index];
  return (
    <OpenAt.Provider value={open}>
      {children}
      {item ? (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={`${label}: photograph ${index! + 1} of ${items.length}`}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            touch.current = null;
            if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
          }}
        >
          <figure className="lb-fig">
            <img key={item.src} src={item.src} alt={item.alt} />
            <figcaption><span>{item.alt}</span><span className="lb-n">{index! + 1} / {items.length}</span></figcaption>
          </figure>
          {items.length > 1 ? (
            <>
              <button type="button" className="lb-btn lb-prev" onClick={() => step(-1)} aria-label="Previous photograph"><span aria-hidden="true">‹</span></button>
              <button type="button" className="lb-btn lb-next" onClick={() => step(1)} aria-label="Next photograph"><span aria-hidden="true">›</span></button>
            </>
          ) : null}
          <button ref={closeBtn} type="button" className="lb-btn lb-close" onClick={close} aria-label="Close"><span aria-hidden="true">×</span></button>
        </div>
      ) : null}
    </OpenAt.Provider>
  );
}

/** A photograph that opens its group's viewer at `index`. */
export function LightboxTrigger({ index, label, className = "", children }: { index: number; label: string; className?: string; children: ReactNode }) {
  const open = useContext(OpenAt);
  return (
    <button type="button" className={`lb-trigger ${className}`.trim()} aria-label={`Enlarge photograph: ${label}`} onClick={(e) => open?.(index, e.currentTarget)}>
      {children}
    </button>
  );
}
