/* eslint-disable @next/next/no-img-element -- review files are local-only; the official mark is a small static logo */
import "./home.css";
import { HOME, CATEGORY_NAMES } from "@/lib/content/home-2027";
import { dayAnchor } from "@/components/2027/editorial/sections";
import { winnersView } from "@/lib/content/winners-2026";
import { deployEnvironment } from "@/lib/publication";
import { Clip, Pic, reviewMedia, reviewSrc } from "./media";
import { pageHref, PRIORITY_CTA, PRIORITY_HREF, SITE_MENU } from "@/lib/site/2027";
import { DesignScale, DestinationSequence, ExperienceIndex, LiveCountdown, MobileMenu, WinnersRail, type Scene } from "./client";
import { HOME_HREF, NAV } from "./links";

/** Official mark, used whenever the provisional 2027 mark isn't loaded for review. */
const OFFICIAL_MARK = "/assets/logos/hebs_logo_nav.png";

function Mark() {
  const provisional = reviewMedia("mark-2027-a");
  return <img className="logo" src={provisional?.src ?? OFFICIAL_MARK} alt={provisional ? provisional.alt : "HEBS, Hair Education Beauty Summit"} />;
}

function Hero() {
  const h = HOME.hero;
  return (
    <section className="hero">
      <div className="ph">
        <Clip wide="hero-loop-wide" tall="hero-loop-tall" poster="hero-poster" loop autoPlay />
      </div>
      <div className="veil" />
      <div className="nav">
        <a href={HOME_HREF} aria-label="HEBS Lagos 2027 home"><Mark /></a>
        <nav aria-label="Main" className="links">{NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}</nav>
        <a className="pill" href={pageHref("sponsorship")!}>Become a sponsor</a>
        <MobileMenu home={HOME_HREF} links={SITE_MENU} cta={{ label: PRIORITY_CTA, href: PRIORITY_HREF }} />
      </div>
      <div className="live"><i />{h.live}</div>
      <div className="hcol">
        <p className="kick">{h.kicker}</p>
        <h1 className="disp">
          {h.lines.map((l) => <span key={l}>{l}</span>)}
          <span className="it gold">{h.accent}</span>
        </h1>
        <div className="rule" />
        <p className="sub">{h.sub}</p>
        <p className="when">{h.when}<br />{h.where}</p>
        <div className="ctas"><a className="btn pri" href={PRIORITY_HREF}>{PRIORITY_CTA}</a><a className="btn gh" href={pageHref("experience")!}>{h.ctaSecondary}</a></div>
        <LiveCountdown />
      </div>
      <div className="cards">
        <div className="card"><div className="ph"><Pic id={h.cards[0].media} className="grade kb" /></div><p>{h.cards[0].label}</p></div>
        <div className="card tall"><div className="ph"><Pic id={h.cards[1].media} className="grade" style={{ objectPosition: "50% 60%" }} /></div><p>{h.cards[1].label}</p></div>
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
          <div className="ph arch"><Pic id="welcome-arch" className="grade kb" /></div>
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
  const cls = ["grade kb", "grade kb", "grade zoomgold"];
  return (
    <section className="dy">
      <div className="head"><h2 className="disp">{d.title} <em className="it">{d.accent}</em></h2><p>{d.body}</p></div>
      <div className="line">
        {d.items.map((it, j) => (
          <div className="d" key={it.date}>
            <p className="date"><span>{it.date}</span></p>
            <div className="ph"><Pic id={it.media} className={cls[j]} /></div>
            <h3>{it.title}</h3>
            <p>{it.text}</p>
            <a className="btn ln" href={pageHref("programme", dayAnchor(it.date))!} aria-label={`${d.cta}: ${it.date}`}>{d.cta}</a>
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
            <Pic id={it.media} className="dsk grade" />
            {reviewSrc(it.phoneMedia) ? <img className="bg mob" src={reviewSrc(it.phoneMedia)!} alt="" /> : null}
            <Pic id={it.phoneMedia} className="fg mob grade" />
          </>
        ),
      };
    }
    return { node: <Pic id={it.media} className="grade" style={it.media === "exp-education" ? { objectPosition: "45% 50%" } : undefined} /> };
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

function Destination() {
  const d = HOME.destination;
  const scenes: Scene[] = d.scenes.map((s) => {
    if ("pair" in s) {
      return {
        title: s.title, kind: s.kind, seconds: s.seconds, note: s.note, plain: true,
        node: <div className="pair">{s.pair.map((id) => <div className="ph" key={id}><Pic id={id} /></div>)}</div>,
      };
    }
    return { title: s.title, kind: s.kind, seconds: s.seconds, note: s.note, node: <Clip wide={s.wide} tall={s.tall} poster={s.wide === "dest-guests-wide" ? "dest-poster" : undefined} /> };
  });
  return (
    <section className="dz">
      <DestinationSequence scenes={scenes}>
        <div className="txt">
          <p className="lab">{d.label}</p>
          <h2 className="disp">{d.title} <span className="it gold">{d.accent}</span></h2>
          <div className="rule" />
          <p className="b">{d.body}</p>
          <div className="ctas"><a className="btn gh" href={pageHref("experience", "destination")!}>{d.cta}</a></div>
        </div>
      </DestinationSequence>
    </section>
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
      {v.featured ? (
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
            ) : (
              <>
                <div className="slot"><span>Winner photograph<small>Review only</small></span></div>
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
          <div className="btnrow"><a className="btn pri" href={pageHref("competitions", "categories")!}>{c.ctaPrimary}</a><a className="btn ol" href={pageHref("competitions", "eligibility")!}>{c.ctaSecondary}</a></div>
        </div>
        <div className="art">
          <div className="ph a"><Pic id="comp-main" className="grade kb" /></div>
          <div className="ph b"><Pic id="comp-trophy" className="grade" /></div>
        </div>
      </div>
      <Winners />
      <div className="mq" aria-label="The seven categories">
        <div className="tr">{ribbon}</div>
      </div>
    </section>
  );
}

function Highlights() {
  const h = HOME.highlights;
  const row = (items: [string, string][]) => items.map(([id, w], j) => (
    <div className={`ph ${w}`} key={`${id}-${j}`}><Pic id={id} className={id === "hl-runway" ? "grade zoomgold" : "grade"} alt="" /></div>
  ));
  return (
    <section className="hx">
      <div className="hd"><div><p className="lab">{h.label}</p><h2 className="disp">{h.title} <em className="it gold">{h.accent}</em></h2></div><p className="src2">{h.credit}</p></div>
      <div className="rows">
        {h.rows.map((r, j) => (
          <div className={`rw${j ? " rev" : ""}`} key={j}>{row(r)}{row(r)}</div>
        ))}
      </div>
    </section>
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
          <div className="ctas"><a className="btn dk" href={pageHref("sponsorship")!}>{s.ctaPrimary}</a><a className="btn ol" href={pageHref("exhibitors")!}>{s.ctaSecondary}</a></div>
        </div>
        <div className="art">
          <div className="ph a"><Pic id="sp-hall" className="grade kb" /></div>
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
      <div className="ph"><Clip wide="hero-loop-wide" tall="hero-loop-tall" poster="hero-poster" loop autoPlay /></div>
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
        <div className="strip"><b>Internal concept, not for publication.</b> {HOME.strip.replace(/^Internal concept, not for publication\. /, "")}</div>
        <Hero />
        <Welcome />
        <Numbers />
        <Days />
        <Experiences />
        <Destination />
        <Competitions />
        <Highlights />
        <Sponsors />
        <Final />
        <footer><span>HEBS Lagos 2027</span><span>hebslagos.com</span></footer>
      </div>
    </div>
  );
}
