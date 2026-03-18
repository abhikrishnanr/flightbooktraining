import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16 lg:px-10">
      <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.45em] text-sky-200/70">FlightBook Demo</p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Learn full-stack flight booking with a simple JSON-powered backend.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Explore flight search, seat selection, passenger details, and booking persistence in a readable training project built with Next.js App Router, React Query, and Tailwind CSS.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/dashboard" className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
              Open dashboard
            </Link>
            <span className="rounded-full border border-white/15 px-6 py-3 text-sm text-slate-300">No database • File-based APIs • Training-ready</span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-950/30 backdrop-blur">
          <div className="rounded-[1.5rem] bg-slate-950/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Featured route</p>
                <p className="mt-1 text-2xl font-semibold text-white">JFK → LAX</p>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-medium text-emerald-200">Live seat availability</span>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ['Browse flights', 'Client-side filters with cached API data'],
                ['Seat map', 'Reusable helpers for aircraft layouts'],
                ['Passenger form', 'Clean booking flow with validation'],
                ['JSON persistence', 'Bookings saved to local files']
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm text-slate-300">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
