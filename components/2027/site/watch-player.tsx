"use client";
/* eslint-disable @next/next/no-img-element -- local posters at fixed sizes */
import { useRef, useState } from "react";

export type LibraryCut = { src: string; poster?: string; w: number; h: number };
export type LibraryFilm = {
  key: string;
  category: string;
  title: string;
  meta: string;
  status: "approved" | "internal-review";
  wide: LibraryCut;
  /** A phone crop, when the film has one; otherwise the wide cut plays everywhere. */
  tall?: LibraryCut;
};

const STATUS_LABEL = { approved: "Cleared for the website", "internal-review": "Internal review, not cleared for publication" } as const;

/**
 * Watch HEBS 2026: one player and a list of films. Nothing loads or plays until a
 * visitor chooses a film; then the browser's own player (pause, seek, fullscreen,
 * keyboard and screen-reader support) plays it, with Replay at the end. Choosing
 * another film stops the first, so two never play at once. Films are silent.
 */
export function WatchLibrary({ films, tone }: { films: LibraryFilm[]; tone: "dark" | "light" }) {
  const v = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState<LibraryCut | null>(null);
  const [ended, setEnded] = useState(false);
  const film = films[current];

  const cutFor = (f: LibraryFilm) => (f.tall && window.matchMedia("(max-width: 600px)").matches ? f.tall : f.wide);
  const play = (i: number) => {
    v.current?.pause();
    setCurrent(i);
    setPlaying(cutFor(films[i]));
    setEnded(false);
    requestAnimationFrame(() => {
      const el = v.current;
      if (!el) return;
      el.currentTime = 0;
      el.play().catch(() => {});
      el.focus();
    });
  };

  const shape = playing ?? film.wide;
  return (
    <div className="wp" data-tone={tone} data-layout={films.length > 1 ? "library" : "single"}>
      <figure className="wp-film">
        <div className="wp-frame" style={{ aspectRatio: `${shape.w} / ${shape.h}` }} data-tall={film.tall ? "" : undefined}>
          {playing ? (
            <video
              key={playing.src}
              ref={v}
              src={playing.src}
              poster={playing.poster}
              controls
              playsInline
              muted
              preload="auto"
              aria-label={`${film.title}. ${film.meta}`}
              onPlay={() => setEnded(false)}
              onEnded={() => setEnded(true)}
            />
          ) : (
            <>
              {film.wide.poster ? (
                <picture>
                  {film.tall?.poster ? <source media="(max-width: 600px)" srcSet={film.tall.poster} /> : null}
                  <img src={film.wide.poster} alt="" loading="lazy" decoding="async" />
                </picture>
              ) : null}
              <button type="button" className="wp-play" onClick={() => play(current)} aria-label={`Play the film: ${film.title}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
                <span>Play</span>
              </button>
            </>
          )}
          {playing && ended ? (
            <button type="button" className="wp-play wp-replay" onClick={() => play(current)} aria-label={`Replay the film: ${film.title}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" /></svg>
              <span>Replay</span>
            </button>
          ) : null}
        </div>
        <figcaption>
          <b>{film.title}</b><span>{film.meta}</span>
          <em className={`wp-status wp-${film.status}`}>{STATUS_LABEL[film.status]}</em>
        </figcaption>
      </figure>
      {films.length > 1 ? (
        <ul className="wp-list" aria-label="Films">
          {films.map((f, i) => (
            <li key={f.key}>
              <button type="button" className="wp-card" aria-current={i === current ? "true" : undefined} onClick={() => play(i)} aria-label={`Play the film: ${f.title}`}>
                <span className="wp-thumb">{f.wide.poster ? <img src={f.tall?.poster ?? f.wide.poster} alt="" loading="lazy" decoding="async" /> : null}<i aria-hidden="true" /></span>
                <span className="wp-ct">
                  <small>{f.category}</small>
                  <b>{f.title}</b>
                  <em className={`wp-status wp-${f.status}`}>{f.status === "approved" ? "Cleared" : "Internal review"}</em>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
