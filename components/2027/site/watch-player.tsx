"use client";
/* eslint-disable @next/next/no-img-element -- local posters at fixed sizes */
import { useRef, useState } from "react";

/**
 * A film played on demand: a poster with a visible Play button; once pressed, the
 * browser's own player (pause, seek, fullscreen, keyboard and screen-reader
 * support) with a Replay button at the end. Nothing loads or moves until the
 * visitor presses Play, so it needs no reduced-motion exception. The crop is
 * chosen when Play is pressed: the tall cut on phones, the wide cut elsewhere.
 */
export function WatchPlayer({
  title, meta, wide, tall, widePoster, tallPoster,
}: { title: string; meta: string; wide: string; tall: string; widePoster?: string; tallPoster?: string }) {
  const v = useRef<HTMLVideoElement>(null);
  const [film, setFilm] = useState<{ src: string; poster?: string } | null>(null);
  const [ended, setEnded] = useState(false);

  const play = () => {
    const phone = window.matchMedia("(max-width: 600px)").matches;
    setFilm(phone ? { src: tall, poster: tallPoster } : { src: wide, poster: widePoster });
    setEnded(false);
    requestAnimationFrame(() => {
      const el = v.current;
      if (!el) return;
      el.currentTime = 0;
      el.play().catch(() => {});
      el.focus();
    });
  };

  return (
    <figure className="wp-film">
      <div className="wp-frame">
        {film ? (
          <video
            ref={v}
            src={film.src}
            poster={film.poster}
            controls
            playsInline
            muted
            preload="auto"
            aria-label={`${title}. ${meta}`}
            onPlay={() => setEnded(false)}
            onEnded={() => setEnded(true)}
          />
        ) : (
          <>
            {widePoster ? (
              <picture>
                {tallPoster ? <source media="(max-width: 600px)" srcSet={tallPoster} /> : null}
                <img src={widePoster} alt="" loading="lazy" decoding="async" />
              </picture>
            ) : null}
            <button type="button" className="wp-play" onClick={play} aria-label={`Play the film: ${title}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
              <span>Play</span>
            </button>
          </>
        )}
        {film && ended ? (
          <button type="button" className="wp-play wp-replay" onClick={play} aria-label={`Replay the film: ${title}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" /></svg>
            <span>Replay</span>
          </button>
        ) : null}
      </div>
      <figcaption><b>{title}</b><span>{meta}</span></figcaption>
    </figure>
  );
}
