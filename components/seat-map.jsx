'use client';

export default function SeatMap({ seatMap, selectedSeats, onToggleSeat }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs text-slate-300">
        <Legend label="Available" className="bg-slate-800 text-slate-200" />
        <Legend label="Selected" className="bg-sky-400 text-slate-950" />
        <Legend label="Booked" className="bg-rose-500/70 text-white" />
        <Legend label="Business" className="border border-amber-300/50 bg-amber-400/10 text-amber-100" />
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4 sm:p-6">
        <div className="mx-auto mb-6 flex max-w-xl justify-center rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-sm uppercase tracking-[0.4em] text-sky-100">
          Cockpit
        </div>

        <div className="space-y-3">
          {seatMap.map((rowData) => (
            <div key={rowData.row} className="grid grid-cols-[40px_1fr_24px_1fr] items-center gap-3">
              <span className="text-sm font-semibold text-slate-400">{rowData.row}</span>
              <div className="grid grid-cols-3 gap-2">
                {rowData.seats.filter((seat) => seat.position === 'left').map((seat) => (
                  <SeatButton key={seat.id} seat={seat} rowData={rowData} selectedSeats={selectedSeats} onToggleSeat={onToggleSeat} />
                ))}
              </div>
              <span className="text-center text-xs uppercase tracking-[0.3em] text-slate-500">✈</span>
              <div className="grid grid-cols-3 gap-2">
                {rowData.seats.filter((seat) => seat.position === 'right').map((seat) => (
                  <SeatButton key={seat.id} seat={seat} rowData={rowData} selectedSeats={selectedSeats} onToggleSeat={onToggleSeat} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SeatButton({ seat, rowData, selectedSeats, onToggleSeat }) {
  const isSelected = selectedSeats.includes(seat.id);
  const isBooked = seat.status === 'booked';
  const isBusiness = rowData.cabin === 'business';

  let className = 'bg-slate-800 text-slate-200 hover:bg-slate-700';

  if (isBooked) {
    className = 'cursor-not-allowed bg-rose-500/70 text-white';
  } else if (isSelected) {
    className = 'bg-sky-400 text-slate-950 hover:bg-sky-300';
  } else if (isBusiness) {
    className = 'border border-amber-300/50 bg-amber-400/10 text-amber-100 hover:bg-amber-300/20';
  }

  return (
    <button
      type="button"
      disabled={isBooked}
      className={`h-10 rounded-xl text-sm font-semibold transition ${className}`}
      onClick={() => onToggleSeat(seat.id)}
    >
      {seat.id}
    </button>
  );
}

function Legend({ label, className }) {
  return <span className={`rounded-full px-3 py-1 ${className}`}>{label}</span>;
}
