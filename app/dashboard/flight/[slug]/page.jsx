import { notFound } from 'next/navigation';
import FlightDetailClient from '@/components/flight-detail-client';
import { getFlightBySlug } from '@/lib/flights';

export default async function FlightDetailPage({ params }) {
  const resolvedParams = await params;
  const flight = await getFlightBySlug(resolvedParams.slug);

  if (!flight) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 lg:px-10">
      <FlightDetailClient flight={flight} />
    </main>
  );
}
