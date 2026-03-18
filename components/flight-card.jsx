import Link from 'next/link';

export default function FlightCard({ flight }) {
  return (
    <Link
      href={`/dashboard/flight/${flight.slug}`}
      className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-sky-950/20 transition hover:-translate-y-1 hover:border-sky-300/40 hover:bg-white/10"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-200/70">{flight.airline}</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{flight.flightNumber}</h3>
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            {flight.stops === 0 ? 'Nonstop' : '1 stop'}
          </span>
        </div>

        <div className="grid gap-4 text-sm text-slate-200 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div>
            <p className="text-xl font-semibold text-white">{flight.origin.code}</p>
            <p>{flight.origin.city}</p>
            <p className="text-slate-400">{flight.departureTime}</p>
          </div>
          <div className="text-center text-slate-400">
            <p>{flight.duration}</p>
            <p className="text-xl">→</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xl font-semibold text-white">{flight.destination.code}</p>
            <p>{flight.destination.city}</p>
            <p className="text-slate-400">{flight.arrivalTime}</p>
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl bg-slate-950/40 p-4 text-sm text-slate-300 sm:grid-cols-2">
          <p><span className="text-slate-500">Date:</span> {flight.departureDate}</p>
          <p><span className="text-slate-500">Aircraft:</span> {flight.aircraftType}</p>
          <p><span className="text-slate-500">Available seats:</span> {flight.availableSeats}</p>
          <p><span className="text-slate-500">Terminal / Gate:</span> {flight.terminal} / {flight.gate}</p>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">From</p>
          <p className="text-3xl font-bold text-white">${flight.price}</p>
        </div>
        <span className="text-sm font-semibold text-sky-200 transition group-hover:text-white">View seats →</span>
      </div>
    </Link>
  );
}
