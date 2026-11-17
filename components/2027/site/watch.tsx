import { posterOf, reviewMedia } from "@/components/2027/home/media";
import { WATCH } from "@/lib/content/media-sections-2027";
import { WatchPlayer } from "./watch-player";
import "./watch.css";

/**
 * Films for "Watch HEBS 2026", on the homepage and the Gallery (WATCH.films:
 * owner-approved footage only). Clips from the Lagos Event shortlist join only
 * once their exact selection and usage permissions are confirmed.
 */
const WATCH_FILMS = WATCH.films;

/** The playable films, or none when their files are unavailable (nothing is shown then). */
export function WatchFilms({ tone }: { tone: "dark" | "light" }) {
  const films = WATCH_FILMS.flatMap((f) => {
    const w = reviewMedia(f.wide);
    const t = reviewMedia(f.tall);
    return w && t ? [{ ...f, w, t }] : [];
  });
  if (films.length === 0) return null;
  return (
    <div className="wp" data-tone={tone}>
      {films.map((f) => (
        <WatchPlayer key={f.wide} title={f.title} meta={f.meta} wide={f.w.src} tall={f.t.src} widePoster={posterOf(f.w)} tallPoster={posterOf(f.t)} />
      ))}
    </div>
  );
}

/** Whether any film can be shown here (the section is left out entirely otherwise). */
export const hasWatchFilms = () => WATCH_FILMS.some((f) => reviewMedia(f.wide) && reviewMedia(f.tall));
