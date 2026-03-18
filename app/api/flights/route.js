import { NextResponse } from 'next/server';
import { getFlights } from '@/lib/flights';

export async function GET() {
  const flights = await getFlights();
  return NextResponse.json({ flights });
}
