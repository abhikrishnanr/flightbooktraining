import { buildSeatMap, getAvailableSeatCount } from '@/lib/seat-map';
import { readJsonFile, writeJsonFile } from '@/lib/file-db';

export async function getFlights() {
  const [flights, bookings] = await Promise.all([
    readJsonFile('flights.json'),
    readJsonFile('bookings.json')
  ]);

  return flights.map((flight) => {
    const bookedSeats = (bookings[flight.id] || []).flatMap((entry) => entry.seats);

    return {
      ...flight,
      availableSeats: getAvailableSeatCount(flight.seatConfig, bookedSeats)
    };
  });
}

export async function getFlightById(id) {
  const flights = await getFlights();
  return flights.find((flight) => flight.id === id) || null;
}

export async function getFlightBySlug(slug) {
  const flights = await getFlights();
  return flights.find((flight) => flight.slug === slug) || null;
}

export async function getFlightSeatData(id) {
  const [flight, bookings] = await Promise.all([getFlightById(id), readJsonFile('bookings.json')]);

  if (!flight) {
    return null;
  }

  const bookedSeats = (bookings[id] || []).flatMap((entry) => entry.seats);

  return {
    flightId: id,
    bookedSeats,
    availableSeats: getAvailableSeatCount(flight.seatConfig, bookedSeats),
    seatMap: buildSeatMap(flight.seatConfig, bookedSeats)
  };
}

export async function createBooking({ flightId, passengerName, email, phone, specialAssistance, seats }) {
  const [flight, bookings] = await Promise.all([getFlightById(flightId), readJsonFile('bookings.json')]);

  if (!flight) {
    throw new Error('Flight not found.');
  }

  const currentBookings = bookings[flightId] || [];
  const bookedSeats = new Set(currentBookings.flatMap((entry) => entry.seats));
  const invalidSeat = seats.find((seat) => !flight.seatConfig.letters.includes(seat.slice(-1)) || Number.parseInt(seat, 10) < 1 || Number.parseInt(seat, 10) > flight.seatConfig.rows);

  if (invalidSeat) {
    throw new Error(`Seat ${invalidSeat} is not part of this aircraft layout.`);
  }

  const takenSeat = seats.find((seat) => bookedSeats.has(seat));

  if (takenSeat) {
    throw new Error(`Seat ${takenSeat} has already been booked.`);
  }

  const booking = {
    bookingId: `BK${Date.now()}`,
    passengerName,
    email,
    phone,
    specialAssistance: specialAssistance || '',
    seats,
    createdAt: new Date().toISOString()
  };

  const nextBookings = {
    ...bookings,
    [flightId]: [...currentBookings, booking]
  };

  await writeJsonFile('bookings.json', nextBookings);

  return {
    booking,
    flightId,
    availableSeats: getAvailableSeatCount(flight.seatConfig, [...bookedSeats, ...seats])
  };
}
