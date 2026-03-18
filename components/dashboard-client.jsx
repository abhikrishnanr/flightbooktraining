'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FlightCard from '@/components/flight-card';

async function fetchFlights() {
  const response = await fetch('/api/flights');
  if (!response.ok) {
    throw new Error('Unable to load flights.');
  }
  return response.json();
}

export default function DashboardClient() {
  const { data, isLoading, isError, error } = useQuery({ queryKey: ['flights'], queryFn: fetchFlights });
  const [filters, setFilters] = useState({ from: '', to: '', departureDate: '', airline: '', sort: 'recommended' });

  const flights = useMemo(() => data?.flights ?? [], [data]);
  const airlines = useMemo(() => [...new Set(flights.map((flight) => flight.airline))], [flights]);

  const filteredFlights = useMemo(() => {
    const normalized = flights.filter((flight) => {
      const fromMatch = `${flight.origin.city} ${flight.origin.code}`.toLowerCase().includes(filters.from.toLowerCase());
      const toMatch = `${flight.destination.city} ${flight.destination.code}`.toLowerCase().includes(filters.to.toLowerCase());
      const dateMatch = !filters.departureDate || flight.departureDate === filters.departureDate;
      const airlineMatch = !filters.airline || flight.airline === filters.airline;
      return fromMatch && toMatch && dateMatch && airlineMatch;
    });

    return normalized.sort((left, right) => {
      switch (filters.sort) {
        case 'price-asc':
          return left.price - right.price;
        case 'price-desc':
          return right.price - left.price;
        case 'availability':
          return right.availableSeats - left.availableSeats;
        default:
          return left.departureTime.localeCompare(right.departureTime);
      }
    });
  }, [filters, flights]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">Flight dashboard</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Search and compare demo flights</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Client-side filters keep the training architecture simple while React Query handles loading, caching, and error states.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-950/40 px-5 py-4 text-right">
            <p className="text-sm text-slate-400">Flights loaded</p>
            <p className="text-3xl font-bold text-white">{flights.length}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm" placeholder="From airport or city" value={filters.from} onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))} />
          <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm" placeholder="To airport or city" value={filters.to} onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))} />
          <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm" type="date" value={filters.departureDate} onChange={(event) => setFilters((current) => ({ ...current, departureDate: event.target.value }))} />
          <select className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm" value={filters.airline} onChange={(event) => setFilters((current) => ({ ...current, airline: event.target.value }))}>
            <option value="">All airlines</option>
            {airlines.map((airline) => <option key={airline} value={airline}>{airline}</option>)}
          </select>
          <select className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm" value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}>
            <option value="recommended">Sort by departure</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="availability">Best availability</option>
          </select>
        </div>
      </section>

      {isLoading ? <div className="rounded-3xl border border-dashed border-white/20 p-12 text-center text-slate-300">Loading flights…</div> : null}
      {isError ? <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-6 text-rose-100">{error.message}</div> : null}
      {!isLoading && !isError ? (
        filteredFlights.length > 0 ? (
          <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredFlights.map((flight) => <FlightCard key={flight.id} flight={flight} />)}
          </section>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 p-12 text-center text-slate-300">No flights matched the current search filters.</div>
        )
      ) : null}
    </div>
  );
}
