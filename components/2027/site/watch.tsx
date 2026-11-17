import { posterOf, reviewMedia } from "@/components/2027/home/media";
import { WATCH } from "@/lib/content/media-sections-2027";
import { WatchLibrary, type LibraryCut, type LibraryFilm } from "./watch-player";
import "./watch.css";

type Cut = { id: string; w: number; h: number };

/** A film's cut as this deployment may show it, or null (unavailable, or review-only on production). */
function cutOf(c: Cut): (LibraryCut & { published: boolean }) | null {
  const a = reviewMedia(c.id);
  return a ? { src: a.src, poster: posterOf(a), w: c.w, h: c.h, published: a.published } : null;
}

/**
 * The films for "Watch HEBS 2026" (WATCH.films), on the homepage and the Gallery:
 * owner-approved films marked as cleared, and review-only candidates marked as
 * internal review. Review-only films never reach production (reviewMedia).
 */
export function libraryFilms(): LibraryFilm[] {
  return (WATCH.films as readonly { key: string; title: string; meta: string; wide: Cut; tall?: Cut }[]).flatMap((f) => {
    const wide = cutOf(f.wide);
    const tall = f.tall ? cutOf(f.tall) : undefined;
    if (!wide || tall === null) return [];
    const status = wide.published && (!tall || tall.published) ? "approved" : "internal-review";
    return [{ key: f.key, title: f.title, meta: f.meta, status, wide, ...(tall ? { tall } : {}) }];
  });
}

/** The film library, or nothing when no film can be shown here. */
export function WatchFilms({ tone }: { tone: "dark" | "light" }) {
  const films = libraryFilms();
  return films.length ? <WatchLibrary films={films} tone={tone} /> : null;
}

/** Whether any film can be shown here (the section is left out entirely otherwise). */
export const hasWatchFilms = () => libraryFilms().length > 0;
