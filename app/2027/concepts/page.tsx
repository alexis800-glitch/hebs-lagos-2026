/**
 * Side-by-side overview of the two creative concepts for owner review:
 * direction, palette, type pairing and links to each full concept.
 */
const CONCEPTS = [
  {
    key: "a",
    name: "Concept A — The Beauty Editorial",
    line: "International fashion and beauty editorial: dramatic Didone display type, black and champagne, a single striking portrait, magazine page furniture.",
    bg: "#0B0A08",
    fg: "#F4EEE3",
    accent: "#C9A96E",
    displayVar: "var(--c-bodoni)",
    textVar: "var(--c-manrope)",
    displayName: "Bodoni Moda",
    textName: "Manrope",
    sample: "Bigger. Bolder. Beyond Beauty.",
    swatches: ["#0B0A08", "#141210", "#C9A96E", "#E6CF9F", "#F4EEE3"],
  },
  {
    key: "b",
    name: "Concept B — The Luxury Destination",
    line: "Premium beachfront hospitality: ivory and champagne light, an ocean horizon, refined capitals, arched resort-architecture shapes and generous space.",
    bg: "#F7F2E9",
    fg: "#1C1A17",
    accent: "#7A5C2B",
    displayVar: "var(--c-italiana)",
    textVar: "var(--c-jost)",
    displayName: "Italiana",
    textName: "Jost",
    sample: "Bigger. Bolder. Beyond Beauty.",
    swatches: ["#F7F2E9", "#EFE6D6", "#BE9A5E", "#32686A", "#1F4E57"],
  },
];

export default function ConceptsOverview() {
  return (
    <main className="min-h-screen bg-[#ECE7DE] px-4 py-14 text-[#1C1A17] sm:px-8" style={{ fontFamily: "var(--c-manrope), sans-serif" }}>
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#5F5A52]">HEBS Lagos 2027 · Creative direction · For owner review</p>
        <h1 className="mt-4 text-4xl sm:text-6xl" style={{ fontFamily: "var(--c-bodoni), serif", fontWeight: 500 }}>
          Two concepts
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[#4A453E]">
          Each concept shows the navigation, the hero (desktop and mobile) and the first two homepage sections below the hero.
          Choose a direction; the full ten-section homepage is then rebuilt in it. Images are labelled concept references and
          illustrations, not approved HEBS 2027 or NJS photography.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {CONCEPTS.map((c) => (
            <article key={c.key} className="flex flex-col overflow-hidden border border-black/10 bg-white">
              <div className="px-8 py-12" style={{ background: c.bg, color: c.fg }}>
                <p className="text-[10px] uppercase tracking-[0.34em]" style={{ fontFamily: c.textVar, color: c.accent }}>
                  {c.displayName} + {c.textName}
                </p>
                <p className="mt-6 uppercase" style={{ fontFamily: c.displayVar, fontSize: "44px", lineHeight: 1 }}>
                  HEBS Lagos 2027
                </p>
                <p className="mt-3" style={{ fontFamily: c.displayVar, fontSize: "26px", fontStyle: c.key === "a" ? "italic" : "normal", color: c.accent }}>
                  {c.sample}
                </p>
                <p className="mt-5 max-w-sm text-[14px] leading-relaxed" style={{ fontFamily: c.textVar, opacity: 0.8 }}>
                  Three extraordinary days of beauty, education, innovation, competition, networking, and unforgettable beachfront experiences.
                </p>
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h2 className="text-2xl" style={{ fontFamily: "var(--c-bodoni), serif", fontWeight: 500 }}>{c.name}</h2>
                <p className="mt-3 text-[14px] leading-relaxed text-[#4A453E]">{c.line}</p>
                <ul className="mt-6 flex gap-2" aria-label="Palette">
                  {c.swatches.map((s) => (
                    <li key={s} className="flex flex-col items-center gap-1 text-[9px] uppercase tracking-wider text-[#5F5A52]">
                      <span className="block h-10 w-10 border border-black/10" style={{ background: s }} />
                      {s}
                    </li>
                  ))}
                </ul>
                <a href={`/2027/concepts/${c.key}`} className="mt-8 inline-flex min-h-[48px] w-fit items-center bg-[#1C1A17] px-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
                  View concept {c.key.toUpperCase()} <span aria-hidden="true" className="ml-2">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-14 border-t border-black/15 pt-10" aria-labelledby="type-title">
          <h2 id="type-title" className="text-3xl" style={{ fontFamily: "var(--c-bodoni), serif", fontWeight: 500 }}>Typography explored</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "Bodoni Moda", v: "var(--c-bodoni)", note: "Didone with an optical-size axis: hairline contrast at display sizes, sturdier at text sizes." },
              { n: "Italiana", v: "var(--c-italiana)", note: "Light, high-waisted capitals; calm and hospitable, display use only (single weight)." },
              { n: "Manrope", v: "var(--c-manrope)", note: "Clean geometric-humanist sans; open shapes, tabular figures for the countdown." },
              { n: "Jost", v: "var(--c-jost)", note: "Futura-lineage geometry; elegant when wide-tracked in capitals." },
            ].map((t) => (
              <div key={t.n} className="border border-black/10 bg-white p-6">
                <p style={{ fontFamily: t.v, fontSize: "40px", lineHeight: 1 }}>Aa</p>
                <p className="mt-3 text-[13px] font-semibold">{t.n}</p>
                <p className="mt-2 text-[12px] leading-relaxed text-[#4A453E]">{t.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
