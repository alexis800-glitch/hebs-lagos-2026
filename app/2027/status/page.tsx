import { ANNOUNCEMENT_ITEMS, HOMEPAGE_SECTIONS } from "@/lib/content/2027";
import { ASSETS, MEDIA_SLOTS } from "@/lib/assets/register";
import { Header2027 } from "@/components/2027/sections";

/** Reviewer view of what the preview contains and what each part is waiting for. */
export default function Status2027() {
  const cell = "border-b border-h27-line px-3 py-3 align-top text-left";
  return (
    <>
      <Header2027 home="/2027" />
      <main className="mx-auto max-w-6xl px-4 sm:px-8 py-16 text-sm">
        <h1 className="font-serif text-4xl text-h27-ivory">Preview approval status</h1>
        <p className="mt-3 max-w-3xl text-h27-muted">
          Generated from the same data the pages render. Nothing below is approved unless it says so.
        </p>

        <h2 className="mt-12 font-serif text-2xl text-h27-ivory">Announcement page: directive section 11</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead><tr className="text-h27-champagne"><th className={cell}>Requirement</th><th className={cell}>Where</th><th className={cell}>State</th><th className={cell}>Waiting for</th></tr></thead>
            <tbody>
              {ANNOUNCEMENT_ITEMS.map((i) => (
                <tr key={i.requirement}><td className={cell}>{i.requirement}</td><td className={cell}>{i.where}</td><td className={cell}>{i.state}</td><td className={cell}>{i.dependency || "Nothing"}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 font-serif text-2xl text-h27-ivory">Homepage: directive section 4, A–J</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead><tr className="text-h27-champagne"><th className={cell}>Section</th><th className={cell}>Structure</th><th className={cell}>Complete in phase</th><th className={cell}>Waiting for</th></tr></thead>
            <tbody>
              {HOMEPAGE_SECTIONS.map((s) => (
                <tr key={s.id}><td className={cell}>{s.id}. {s.name}</td><td className={cell}>{s.structureBuilt ? "Built" : "Not started"}</td><td className={cell}>{s.completesIn}</td><td className={cell}>{s.dependencies.join("; ")}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="program" className="mt-12 scroll-mt-24 font-serif text-2xl text-h27-ivory">Event program</h2>
        <p className="mt-2 text-h27-muted">No 2027 session times are approved. The Event Program page is built in Phase 4.</p>

        <h2 className="mt-12 font-serif text-2xl text-h27-ivory">Asset register</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead><tr className="text-h27-champagne"><th className={cell}>Asset</th><th className={cell}>Provenance</th><th className={cell}>Status</th><th className={cell}>Restriction</th></tr></thead>
            <tbody>
              {ASSETS.map((a) => (
                <tr key={a.id}><td className={cell}>{a.id}</td><td className={cell}>{a.provenance}</td><td className={cell}>{a.status}</td><td className={cell}>{a.restriction}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="mt-8 font-serif text-xl text-h27-ivory">Media slots</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {MEDIA_SLOTS.map((s) => (
            <li key={s.id} className="border border-h27-line p-3"><span className="text-h27-ivory">{s.label}</span><span className="block text-xs text-h27-muted">{s.assetId ? `Assigned: ${s.assetId}` : `Empty. Needs: ${s.dependency}`}</span></li>
          ))}
        </ul>
      </main>
    </>
  );
}
