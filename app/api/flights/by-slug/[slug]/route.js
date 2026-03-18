import { NextResponse } from 'next/server';
import { getFlightBySlug } from '@/lib/flights';

export async function GET(_request, { params }) {
  const { slug } = await params;
  const flight = await getFlightBySlug(slug);

  if (!flight) {
    return NextResponse.json({ error: 'Flight not found.' }, { status: 404 });
  }

  return NextResponse.json({ flight });
}
