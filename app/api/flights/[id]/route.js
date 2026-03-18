import { NextResponse } from 'next/server';
import { getFlightById } from '@/lib/flights';

export async function GET(_request, { params }) {
  const { id } = await params;
  const flight = await getFlightById(id);

  if (!flight) {
    return NextResponse.json({ error: 'Flight not found.' }, { status: 404 });
  }

  return NextResponse.json({ flight });
}
