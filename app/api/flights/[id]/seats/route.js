import { NextResponse } from 'next/server';
import { createBooking, getFlightSeatData } from '@/lib/flights';

export async function GET(_request, { params }) {
  const { id } = await params;
  const seatData = await getFlightSeatData(id);

  if (!seatData) {
    return NextResponse.json({ error: 'Flight not found.' }, { status: 404 });
  }

  return NextResponse.json(seatData);
}

export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  try {
    const booking = await createBooking({
      flightId: id,
      passengerName: body.passengerName,
      email: body.email,
      phone: body.phone,
      specialAssistance: body.specialAssistance,
      seats: body.seats || []
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
