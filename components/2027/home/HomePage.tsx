/* eslint-disable @next/next/no-img-element -- review files are local-only; the official mark is a small static logo */
import "./home.css";
import { HOME, CATEGORY_NAMES } from "@/lib/content/home-2027";
import { dayAnchor } from "@/components/2027/editorial/sections";
import { winnersView } from "@/lib/content/winners-2026";
import { deployEnvironment } from "@/lib/publication";
import { Clip, Pic, reviewSrc } from "./media";
import { Mark } from "@/components/2027/site/mark";
import { WatchFilms, hasWatchFilms } from "@/components/2027/site/watch";
import { PRIZES, WATCH } from "@/lib/content/media-sections-2027";
import { PAGES } from "@/lib/content/2027-pages";
import { reviewMedia } from "./review-media";
import { pageHref, PRIORITY_CTA, PRIORITY_HREF, SITE_MENU } from "@/lib/site/2027";
import { DesignScale, ExperienceIndex, FilmControl, LiveCountdown, MobileMenu, WinnersRail } from "./client";
import { HOME_HREF, NAV } from "./links";

/**
 * A link to another 2027 page, only when that page is published here: a launch
 * that leaves the page out renders no button at all rather than a dead one.
 */
function To({ href, className, label, children }: { href: string | null; className: string; label?: string; children: React.ReactNode }) {
  return href ? <a className={className} href={href} aria-label={label}>{children}</a> : null;
}

function Hero() {
  const h = HOME.hero;
  return (
    <section className="hero">
      <div className="ph">
        <Clip id="hero-film" wide="hero-loop-wide" tall="hero-loop-tall" label="Film of the 2026 styling floor" loop autoPlay priority />
      </div>
      <div className="veil" />
      <div className="vctl-hero"><FilmControl target="hero-film" label="the styling-floor film" /></div>
      <div className="nav">
        <a href={HOME_HREF} aria-label="HEBS Lagos 2027 home"><Mark /></a>
        <nav aria-label="Main" className="links">{NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}</nav>
        <To className="pill" href={pageHref("sponsorship")}>Become a sponsor</To>
        <MobileMenu home={HOME_HREF} links={SITE_MENU} cta={{ label: PRIORITY_CTA, href: PRIORITY_HREF }} />
      </div>
      {hasWatchFilms() ? <a className="live" href={`${HOME_HREF}#watch`}><i />{h.live}<span className="wl-cue">Watch</span></a> : <div className="live"><i />{h.live}</div>}
      <div className="hcol">
        <p className="kick">{h.kicker}</p>
        <h1 className="disp">
          {h.lines.map((l) => <span key={l}>{l}</span>)}
          <span className="it gold">{h.accent}</span>
        </h1>
        <div className="rule" />
        <p className="sub">{h.sub}</p>
        <p className="when">{h.when}<br />{h.where}</p>
        <div className="ctas"><a className="btn pri" href={PRIORITY_HREF}>{PRIORITY_CTA}</a><To className="btn gh" href={pageHref("experience")}>{h.ctaSecondary}</To></div>
        <LiveCountdown />
      </div>
    </section>
  );
}

function Welcome() {
  const w = HOME.welcome;
  return (
    <section className="wl">
      <div className="in">
        <div>
          <p className="lab">{w.label}</p>
          <h2 className="disp">{w.title} <em className="it">{w.accent}</em></h2>
          <p className="b">{w.body}</p>
          <div className="rule" />
        </div>
        <div className="art">
          <div className="archline" />
          <div className="ph arch"><Pic id="welcome-arch" className="grade kb" sizes="(max-width: 600px) 250px, 400px" /></div>
          <div className="ph inset"><Pic id="welcome-inset" className="grade" /></div>
          <svg className="seal" viewBox="0 0 200 200" aria-hidden="true">
            <defs><path id="hp-sealpath" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
            <circle cx="100" cy="100" r="96" fill="none" stroke="#B8914C" strokeWidth=".8" />
            <text fontFamily="Jost, sans-serif" fontSize="12.5" fill="#8C6B34">
              <textPath href="#hp-sealpath" textLength="486" lengthAdjust="spacing">HAIR · EDUCATION · BEAUTY · SUMMIT · LAGOS ·</textPath>
            </text>
            <path d="M100 88 L112 100 L100 112 L88 100 Z" fill="#B8914C" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function Numbers() {
  const n = HOME.numbers;
  return (
    <section className="nb" aria-label={`HEBS Lagos 2027 in numbers: ${n.items.map((i) => `${i.value} ${i.label.toLowerCase()}`).join(", ")}`}>
      <div className="top"><div><p className="lab">{n.label}</p><h2 className="disp">{n.title} <span className="it gold">{n.accent}</span></h2></div></div>
      <div className="row">
        {n.items.map((i) => {
          const src = reviewSrc(i.media);
          const fill = src ? `linear-gradient(rgba(255,236,200,.16),rgba(255,236,200,.16)),url(${src})` : undefined;
          return (
            <div className="st" key={i.label}>
              <span className={`num${src ? "" : " flat"}`} style={fill ? { backgroundImage: fill } : undefined}>{i.value}</span>
              <p className="lbl it gold">{i.label}</p>
              <p>{i.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Days() {
  const d = HOME.days;
  const cls = ["grade kb", "grade kb", "grade"];
  return (
    <section className="dy">
      <div className="head"><h2 className="disp">{d.title} <em className="it">{d.accent}</em></h2><p>{d.body}</p></div>
      <div className="line">
        {d.items.map((it, j) => (
          <div className="d" key={it.date}>
            <p className="date"><span>{it.date}</span></p>
            <div className="ph"><Pic id={it.media} className={cls[j]} sizes="(max-width: 600px) calc(100vw - 44px), (max-width: 1279px) 33vw, 460px" />{reviewSrc(it.media) ? <span className="yr">HEBS Lagos 2026</span> : null}</div>
            <h3>{it.title}</h3>
            <p>{it.text}</p>
            <To className="btn ln" href={pageHref("programme", dayAnchor(it.date))} label={`${d.cta}: ${it.date}`}>{d.cta}</To>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experiences() {
  const e = HOME.experiences;
  const images = e.items.map((it) => {
    if ("phoneMedia" in it) {
      // Networking: DSC00242 cropped on desktop, DSC00257 shown in full on the phone.
      return {
        className: "nw",
        node: (
          <>
            <Pic id={it.media} className="dsk grade" sizes="(max-width: 1279px) 560px, 540px" />
            {reviewSrc(it.phoneMedia) ? <img className="bg mob" src={reviewSrc(it.phoneMedia)!.replace(/\.webp$/, "-480.webp")} alt="" loading="lazy" decoding="async" /> : null}
            <Pic id={it.phoneMedia} className="fg mob grade" sizes="calc(100vw - 44px)" />
          </>
        ),
      };
    }
    return { node: <Pic id={it.media} className="grade" sizes="(max-width: 600px) calc(100vw - 58px), 560px" style={it.media === "exp-education" ? { objectPosition: "45% 50%" } : undefined} /> };
  });
  return (
    <section className="ex">
      <div className="in">
        <ExperienceIndex
          items={e.items.map(({ title, text }) => ({ title, text }))}
          images={images}
          heading={<><p className="lab">{e.label}</p><h2 className="disp">{e.title} <em className="it">{e.accent}</em></h2></>}
        />
      </div>
    </section>
  );
}

/**
 * The destination: a still editorial composition (owner feedback, 17 Nov 2026).
 * Real HEBS Lagos 2026 photographs taken at the 2026 summit venue, shown at their
 * true colour and labelled as the 2026 event. No resort photograph is shown until
 * verified pool, terrace or building photography is supplied; no concept scene.
 */
function Destination() {
  const d = HOME.destination;
  // The two photographed scenes, as still captioned pairs; nothing moves or advances on its own.
  const groups = d.scenes.filter((sc) => sc.pair.every((id) => reviewSrc(id)));
  return (
    <section className="ds" aria-labelledby="ds-title">
      <div className="txt">
        <p className="lab">{d.label}</p>
        <h2 id="ds-title" className="disp">{d.title} <span className="it gold">{d.accent}</span></h2>
        <div className="rule" />
        <p className="b">{d.body}</p>
        <div className="ctas"><To className="btn ol" href={pageHref("experience", "destination")}>{d.cta}</To></div>
      </div>
      {groups.length ? (
        <div className="art" role="group" aria-label="Destination scenes">
          {groups.map((sc, g) => (
            <figure className={`grp g${g}`} key={sc.title}>
              <p className="st"><b>{sc.title}</b> <span>Photographed</span></p>
              <div className="pr">
                {sc.pair.map((id) => <div className="ph" key={id}><Pic id={id} sizes="(max-width: 600px) 50vw, (max-width: 1279px) 45vw, 420px" /></div>)}
              </div>
              {g === 0 ? <figcaption className="cap"><b>PHOTOGRAPHED</b> {sc.note}</figcaption> : null}
            </figure>
          ))}
          <p className="nt">Photographed at HEBS Lagos 2026 at NJS. These are past-event photographs, not photographs of the resort&apos;s facilities.</p>
        </div>
      ) : null}
    </section>
  );
}

/**
 * The 2026 Champions block stays hidden until the winners and placings complete
 * D8 verification (Gary, 17 Nov 2026). The records, review photographs and
 * approval evidence are kept (lib/content/winners-2026.ts) for that review.
 */
const SHOW_WINNERS = false;

/**
 * Winners & Prize Presentations: review-only cheque photographs, in the protected
 * preview only (they never render on production), labelled as unverified.
 */
function Prizes() {
  const p = PRIZES;
  const shown = p.photos.filter((id) => reviewSrc(id));
  if (shown.length < 2) return null;
  return (
    <div className="aw" role="group" aria-labelledby="aw-title">
      <div className="awh">
        <div><p className="lab">{p.label}</p><h3 id="aw-title">{p.title} <em className="it">{p.accent}</em></h3></div>
        <div>
          <p className="n"><span className="tag">Internal review</span> {p.note}</p>
          <To className="btn ln" href={pageHref("gallery", "gallery-winners")}>{p.cta}</To>
        </div>
      </div>
      <div className="awg pz">
        {shown.map((id) => (
          <div className="ph" key={id}><Pic id={id} className="grade" sizes="(max-width: 600px) 50vw, 400px" /></div>
        ))}
      </div>
    </div>
  );
}

function Winners() {
  const v = winnersView(deployEnvironment());
  if (!v.visible) return null;
  const w = HOME.competitions.winners;
  return (
    <div className="wn">
      <div className="wh">
        <div><p className="lab">{w.label}</p><h3>{w.title} <em className="it">{w.accent}</em></h3></div>
        <p className="n">{w.note}</p>
      </div>
      {v.reviewFeatured.length > 0 ? (
        <>
          <p className="rvnote"><span className="tag">Internal review</span>Placings are as printed on the cheques. Winners&apos; names, placings and prizes await the organisers&apos; verification.</p>
          <div className="fpair">
            {v.reviewFeatured.map((r) => (
              <figure key={r.media}>
                <div className="slot"><Pic id={r.media} sizes="(max-width: 600px) calc((100vw - 44px) * 1.1), 602px" /></div>
                <figcaption>
                  <p className="k">{r.place}, as printed on the cheque</p>
                  <p className="cmpx">{r.competition}</p>
                  <p className="tbc">Winner and prize to be confirmed</p>
                </figcaption>
              </figure>
            ))}
          </div>
          {v.reviewHighlights.length > 0 ? (
            <div className="hpair">
              {v.reviewHighlights.map((r) => (
                <figure key={r.media}>
                  <div className="slot"><Pic id={r.media} sizes="(max-width: 600px) calc((100vw - 44px) * 1.17), 610px" /></div>
                  <figcaption><span className="k">{r.place}</span> {r.competition}</figcaption>
                </figure>
              ))}
            </div>
          ) : null}
        </>
      ) : v.featured ? (
        <div className="feat2">
          <div className="slot"><img src={v.featured.photo} alt={v.featured.name} /></div>
          <div className="meta2">
            <p className="k">Competition</p><p className="v">{v.featured.competition}</p>
            <p className="k">Winner</p><p className="v">{v.featured.name}</p>
            <p className="k">Prize</p><p className="v">{v.featured.prize}</p>
          </div>
        </div>
      ) : v.review ? (
        <div className="feat2">
          <div className="slot"><span>Featured winner photograph<small>Review only: awaiting approved image</small></span></div>
          <div className="meta2">
            <p className="k">Competition</p><p className="v ph2">To be confirmed</p>
            <p className="k">Winner</p><p className="v ph2">To be confirmed</p>
            <p className="k">Prize</p><p className="v ph2">As approved</p>
          </div>
        </div>
      ) : null}
      <WinnersRail heading={v.heading} count={v.count}>
        {v.cards.map((c, j) => (
          <div className="card2" key={`${c.competition}-${j}`}>
            {c.winner ? (
              <>
                <div className="slot"><img src={c.winner.photo} alt={c.winner.name} /></div>
                <p className="cat">{c.category} · {c.winner.place}</p>
                <p className="cmp">{c.competition}</p>
                <p className="who ok">{c.winner.name}. {c.winner.prize}</p>
              </>
            ) : c.review ? (
              <>
                <div className="slot"><Pic id={c.review.media} sizes="(max-width: 600px) 66vw, 291px" /></div>
                <p className="cat">{c.category} · {c.review.place}</p>
                <p className="cmp">{c.competition}</p>
                <p className="who">{c.review.note ?? "Winner to be confirmed"}</p>
              </>
            ) : (
              <>
                <div className="slot"><span>Photograph awaited<small>Review only</small></span></div>
                <p className="cat">{c.category}</p>
                <p className="cmp">{c.competition}</p>
                <p className="who">Winner to be confirmed</p>
              </>
            )}
          </div>
        ))}
      </WinnersRail>
    </div>
  );
}

function Competitions() {
  const c = HOME.competitions;
  // The ribbon loops by translating -50%, so the names appear twice; the copy is hidden from screen readers.
  const ribbon = [...CATEGORY_NAMES, ...CATEGORY_NAMES].map((n, j) => <span key={`${n}-${j}`} aria-hidden={j >= CATEGORY_NAMES.length || undefined}>{n}</span>);
  return (
    <section className="cp">
      <div className="in">
        <div>
          <p className="lab">{c.label}</p>
          <h2 className="disp">{c.title} <em className="it">{c.accent}</em></h2>
          <p className="b">{c.body}</p>
          <div className="btnrow"><To className="btn pri" href={pageHref("competitions", "categories")}>{c.ctaPrimary}</To><To className="btn ol" href={pageHref("competitions", "eligibility")}>{c.ctaSecondary}</To></div>
        </div>
        <div className="art">
          <div className="ph a"><Pic id="comp-main" className="grade kb" sizes="(max-width: 600px) 240px, 380px" /></div>
          <div className="ph b"><Pic id="comp-trophy" className="grade" /></div>
        </div>
      </div>
      {SHOW_WINNERS && <Winners />}
      <Prizes />
      <div className="mq" aria-label="The seven categories">
        <div className="tr">{ribbon}</div>
      </div>
    </section>
  );
}

function Watch() {
  if (!hasWatchFilms()) return null;
  const w = WATCH;
  return (
    <section className="wt" id="watch" aria-labelledby="watch-title">
      <div className="wth">
        <p className="lab">{w.label}</p>
        <h2 id="watch-title" className="disp">{w.title} <em className="it">{w.accent}</em></h2>
        <p className="b">{w.body}</p>
        <To className="btn ol" href={pageHref("gallery", "watch")}>Gallery &amp; past events</To>
      </div>
      <WatchFilms tone="dark" />
    </section>
  );
}

function Highlights() {
  const h = HOME.highlights;
  const row = (items: [string, string][]) => items.map(([id, w], j) => (
    <div className={`ph ${w}`} key={`${id}-${j}`}><Pic id={id} className="grade" alt="" sizes="(max-width: 600px) 250px, 420px" /></div>
  ));
  return (
    <section className="hx">
      <div className="hd"><div><p className="lab">{h.label}</p><h2 className="disp">{h.title} <em className="it gold">{h.accent}</em></h2></div><p className="src2">{h.credit}</p></div>
      <div className="rows">
        {h.rows.map((r, j) => (
          <div className={`rw${j ? " rev" : ""}`} key={j}>{row(r)}{row(r)}</div>
        ))}
      </div>
      <GalleryIndex />
    </section>
  );
}

/**
 * The way into the HEBS Lagos 2026 Gallery: every collection this deployment may
 * show, with its count, linked to its place on the Gallery page. The review-only
 * prize presentations are marked as internal review. Absent where the Gallery is
 * not published.
 */
function GalleryIndex() {
  const all = pageHref("gallery", "lagos-2026");
  if (!all) return null;
  const collections = PAGES.gallery.categories
    .map((c) => ({ id: c.id, title: c.title.text, review: "review" in c, count: c.photos.filter((id) => reviewMedia(id)).length }))
    .filter((c) => c.count > 0);
  if (collections.length === 0) return null;
  const total = collections.reduce((n, c) => n + c.count, 0);
  return (
    <nav className="gi" aria-labelledby="gi-title">
      <div className="gih">
        <h3 id="gi-title">Explore the HEBS 2026 galleries</h3>
        <a className="btn ol" href={all}>All {total} photographs</a>
      </div>
      <ul>
        {collections.map((c) => (
          <li key={c.id}>
            <a href={pageHref("gallery", `gallery-${c.id}`) ?? all}>
              <b>{c.title}</b>
              <span>{c.count} photographs{c.review ? <em>Internal review</em> : null}</span>
              <i aria-hidden="true">→</i>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Sponsors() {
  const s = HOME.sponsors;
  return (
    <section className="sp">
      <div className="in">
        <div>
          <p className="lab">{s.label}</p>
          <h2 className="disp">{s.title} <em className="it">{s.accent}</em></h2>
          <ul>{s.offers.map((o) => <li key={o}>{o}</li>)}</ul>
          <div className="ctas"><To className="btn dk" href={pageHref("sponsorship")}>{s.ctaPrimary}</To><To className="btn ol" href={pageHref("exhibitors")}>{s.ctaSecondary}</To></div>
        </div>
        <div className="art">
          <div className="ph a"><Pic id="sp-hall" className="grade kb" sizes="(max-width: 600px) calc(100vw - 74px), 700px" /></div>
          <div className="ph b"><Pic id="sp-exhibitor" className="grade" /></div>
          <p className="cap2">{s.caption}</p>
        </div>
      </div>
    </section>
  );
}

function Final() {
  const f = HOME.final;
  return (
    <section className="fn">
      <div className="ph"><Clip id="final-film" wide="hero-loop-wide" tall="hero-loop-tall" label="Closing film of the 2026 styling floor" loop autoPlay /></div>
      <div className="vctl-fn"><FilmControl target="final-film" label="the closing film" /></div>
      <div className="in">
        <p className="lab">{f.label}</p>
        <h2 className="disp">{f.title} <em className="it gold">{f.accent}</em></h2>
        <div className="rule" />
        <p className="when">{f.when}</p>
        <LiveCountdown />
        <a className="btn pri" href={PRIORITY_HREF}>{f.cta}</a>
      </div>
    </section>
  );
}

/** The preferred HEBS Lagos 2027 homepage design, for owner review. */
export function PreferredHomepage() {
  return (
    <div className="hp-wrap">
      <DesignScale />
      <div className="hp">
        {/* A3b: the homepage's one review strip; the shared staging banner is hidden here (home.css). */}
        {deployEnvironment() !== "production" && <div className="strip" role="note" data-staging="">
          <b>Internal concept, not for publication.</b> {HOME.strip.replace(/^Internal concept, not for publication\. /, "")} No registration or inquiry is collected.{" "}
          <a href="/2027/status">Approval status</a>
        </div>}
        <Hero />
        <Welcome />
        <Numbers />
        <Days />
        <Experiences />
        <Destination />
        <Competitions />
        <Highlights />
        <Watch />
        <Sponsors />
        <Final />
      </div>
    </div>
  );
}
