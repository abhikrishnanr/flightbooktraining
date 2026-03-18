'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SeatMap from '@/components/seat-map';

async function fetchSeatData(flightId) {
  const response = await fetch(`/api/flights/${flightId}/seats`);
  if (!response.ok) {
    throw new Error('Unable to load seat map.');
  }
  return response.json();
}

async function submitBooking(payload) {
  const response = await fetch(`/api/flights/${payload.flightId}/seats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Unable to complete booking.');
  }

  return result;
}

function initialForm() {
  return {
    passengerName: '',
    email: '',
    phone: '',
    specialAssistance: ''
  };
}

export default function FlightDetailClient({ flight }) {
  const queryClient = useQueryClient();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState(null);

  const seatQuery = useQuery({
    queryKey: ['flight-seats', flight.id],
    queryFn: () => fetchSeatData(flight.id)
  });

  const mutation = useMutation({
    mutationFn: submitBooking,
    onSuccess: async (result) => {
      setFeedback({ type: 'success', message: `Booking ${result.booking.bookingId} confirmed for ${result.booking.seats.join(', ')}.` });
      setSelectedSeats([]);
      setForm(initialForm());
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['flight-seats', flight.id] }),
        queryClient.invalidateQueries({ queryKey: ['flights'] })
      ]);
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error.message });
    }
  });

  const totalPrice = useMemo(() => selectedSeats.length * flight.price, [flight.price, selectedSeats.length]);

  function toggleSeat(seatId) {
    setFeedback(null);
    setSelectedSeats((current) =>
      current.includes(seatId) ? current.filter((seat) => seat !== seatId) : [...current, seatId]
    );
  }

  function validateForm() {
    if (!form.passengerName.trim() || !form.email.trim() || !form.phone.trim()) {
      return 'Passenger name, email, and phone are required.';
    }

    if (selectedSeats.length === 0) {
      return 'Select at least one seat before booking.';
    }

    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const errorMessage = validateForm();

    if (errorMessage) {
      setFeedback({ type: 'error', message: errorMessage });
      return;
    }

    mutation.mutate({
      flightId: flight.id,
      seats: selectedSeats,
      ...form
    });
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
      <section className="space-y-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">{flight.airline}</p>
              <h1 className="mt-2 text-4xl font-semibold text-white">{flight.flightNumber}</h1>
              <p className="mt-3 max-w-3xl text-slate-300">{flight.hero}</p>
            </div>
            <Link href="/dashboard" className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-300/40 hover:text-white">
              ← Back to dashboard
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Route" value={`${flight.origin.code} → ${flight.destination.code}`} detail={`${flight.origin.city} to ${flight.destination.city}`} />
            <InfoCard label="Schedule" value={`${flight.departureTime} - ${flight.arrivalTime}`} detail={`${flight.departureDate} • ${flight.duration}`} />
            <InfoCard label="Terminal / Gate" value={`${flight.terminal} / ${flight.gate}`} detail={flight.aircraftType} />
            <InfoCard label="Baggage" value={flight.cabinBag} detail={flight.checkedBag} />
          </div>
        </div>

        {seatQuery.isLoading ? <div className="rounded-3xl border border-dashed border-white/20 p-12 text-center text-slate-300">Loading seat map…</div> : null}
        {seatQuery.isError ? <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-6 text-rose-100">{seatQuery.error.message}</div> : null}
        {seatQuery.data ? <SeatMap seatMap={seatQuery.data.seatMap} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} /> : null}
      </section>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">Booking summary</p>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl bg-slate-950/50 p-4">
              <p className="text-slate-400">Selected seats</p>
              <p className="mt-2 text-xl font-semibold text-white">{selectedSeats.length ? selectedSeats.join(', ') : 'No seats selected yet'}</p>
            </div>
            <div className="grid gap-3 rounded-2xl bg-slate-950/50 p-4">
              <div className="flex items-center justify-between"><span>Passengers</span><span>{selectedSeats.length}</span></div>
              <div className="flex items-center justify-between"><span>Seat price</span><span>${flight.price}</span></div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-lg font-semibold text-white"><span>Total</span><span>${totalPrice}</span></div>
            </div>
            <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-emerald-100">
              Live availability: {seatQuery.data?.availableSeats ?? flight.availableSeats} seats left.
            </p>
          </div>
        </div>

        <form className="rounded-3xl border border-white/10 bg-white/5 p-6" onSubmit={handleSubmit}>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">Passenger details</p>
          <div className="mt-4 space-y-4">
            <Field label="Full name" name="passengerName" value={form.passengerName} onChange={setForm} placeholder="Taylor Morgan" />
            <Field label="Email" name="email" type="email" value={form.email} onChange={setForm} placeholder="taylor@example.com" />
            <Field label="Phone" name="phone" value={form.phone} onChange={setForm} placeholder="+1 555 0118" />
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block font-medium">Special assistance</span>
              <textarea className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3" value={form.specialAssistance} onChange={(event) => setForm((current) => ({ ...current, specialAssistance: event.target.value }))} placeholder="Optional wheelchair, meal, or seating note" />
            </label>
          </div>

          {feedback ? (
            <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${feedback.type === 'success' ? 'border border-emerald-400/30 bg-emerald-400/10 text-emerald-100' : 'border border-rose-400/30 bg-rose-400/10 text-rose-100'}`}>
              {feedback.message}
            </div>
          ) : null}

          <button type="submit" disabled={mutation.isPending} className="mt-6 w-full rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-slate-500">
            {mutation.isPending ? 'Booking seats…' : 'Book selected seats'}
          </button>
        </form>
      </aside>
    </div>
  );
}

function InfoCard({ label, value, detail }) {
  return (
    <div className="rounded-2xl bg-slate-950/40 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-300">{detail}</p>
    </div>
  );
}

function Field({ label, name, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-2 block font-medium">{label}</span>
      <input
        className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3"
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange((current) => ({ ...current, [name]: event.target.value }))}
      />
    </label>
  );
}
