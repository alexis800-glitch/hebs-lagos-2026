"use client";
import { useEffect, useState } from "react";
import "./gallery-nav.css";

export type GalleryNavItem = { id: string; title: string; count: number; review: boolean };

/**
 * The Gallery's collection navigation. The collection in view (or the one chosen)
 * is marked with aria-current and a champagne fill on ivory, dark text throughout,
 * so the selected item always stays readable; hover and keyboard focus are distinct.
 */
export function GalleryNav({ items }: { items: GalleryNavItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace(/^#gallery-/, "");
      if (items.some((i) => i.id === h)) setActive(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (seen) setActive(seen.target.id.replace(/^gallery-/, ""));
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const i of items) {
      const el = document.getElementById(`gallery-${i.id}`);
      if (el) io.observe(el);
    }
    return () => { io.disconnect(); window.removeEventListener("hashchange", fromHash); };
  }, [items]);
  return (
    <nav aria-label="Photograph collections" className="gn">
      <ul>
        {items.map((c) => (
          <li key={c.id}>
            <a href={`#gallery-${c.id}`} aria-current={active === c.id ? "true" : undefined} onClick={() => setActive(c.id)}>
              <span className="t">{c.title}</span>
              <span className="n">{c.count}</span>
              {c.review ? <span className="r">Review</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
