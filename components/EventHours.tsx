import { EVENT_DAYS } from '@/lib/competitions'

/**
 * Full operating hours for each summit day, derived from lib/competitions.ts.
 *
 * This sits above the competition line-up so a visitor cannot mistake a single
 * competition's slot for the hours the event itself is open. The distinction is
 * stated in the copy, not just implied by the layout.
 */
export default function EventHours() {
  return (
    <section
      aria-labelledby="event-hours"
      className="border border-white/[0.06] bg-zinc-900/50 rounded-2xl p-5 sm:p-6"
    >
      <span className="text-xs font-mono tracking-widest text-amber-400 uppercase block mb-2">
        Event Hours
      </span>
      <h2
        id="event-hours"
        className="font-serif text-2xl sm:text-3xl text-white font-semibold tracking-tight"
      >
        Full Event-Day Hours
      </h2>
      <p className="text-zinc-300 text-sm leading-relaxed mt-3 max-w-3xl">
        These are the hours the summit is open each day at {EVENT_DAYS[0].venue}. Individual
        competitions run at their own scheduled times within them — see the competition
        schedule below for each one.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {EVENT_DAYS.map((day) => (
          <div
            key={day.isoDate}
            className="rounded-xl border border-amber-500/20 bg-zinc-950 px-5 py-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-300 mb-1.5">
              {day.date}
            </p>
            <p className="text-2xl sm:text-[1.7rem] font-bold text-white tracking-tight tabular-nums leading-tight">
              {day.hours}
            </p>
            <p className="font-sans text-xs text-zinc-400 mt-1">{day.venue}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
