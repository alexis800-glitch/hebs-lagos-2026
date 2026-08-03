import { scheduleByDay, multiDayCompetitions } from '@/lib/competitions'

/**
 * Two-day competition schedule, derived entirely from lib/competitions.ts.
 *
 * Overlapping start times are intentional and preserved exactly as the organiser
 * supplied them. They are not treated as a data error and carry no explanatory note.
 */
export default function CompetitionSchedule() {
  const days = scheduleByDay()
  const multiDay = multiDayCompetitions()

  return (
    <section aria-labelledby="competition-schedule">
      <span className="text-xs font-mono tracking-widest text-amber-400 uppercase block mb-2">
        October 24–25, 2026
      </span>
      <h2
        id="competition-schedule"
        className="font-serif text-2xl sm:text-4xl text-white font-semibold tracking-tight mb-6"
      >
        Competition Schedule
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {days.map((day) => (
          <div
            key={day.isoDate}
            className="border border-white/[0.06] bg-zinc-900/50 rounded-2xl p-5 sm:p-6"
          >
            <h3 className="font-serif text-lg sm:text-xl text-white font-semibold tracking-tight mb-4">
              {day.date}
            </h3>

            <ul className="flex flex-col">
              {day.rows.map(({ competition, session }) => (
                <li
                  key={`${day.isoDate}-${competition.slug}`}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 py-3 border-b border-white/[0.06] last:border-b-0"
                >
                  <span className="text-zinc-100 text-sm leading-snug sm:flex-1">
                    {competition.name}
                    {competition.sessions.length > 1 && (
                      <span className="ml-2 align-middle inline-block text-[10px] font-mono uppercase tracking-widest text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5">
                        Both days
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xs text-zinc-300 tabular-nums whitespace-nowrap sm:text-right">
                    {session.time}
                    <span className="text-zinc-500"> · {session.duration}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {multiDay.length > 0 && (
        <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
          {multiDay.map((c) => c.name).join(', ')} runs across both event days.
        </p>
      )}
    </section>
  )
}
