import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PassengerPageClient } from './passenger-client';

export const metadata: Metadata = {
  title: 'Passenger Details',
  description: 'Enter passenger information to complete your booking.',
};

interface PassengerPageProps {
  params: { id: string };
  searchParams: { seat?: string; passengers?: string };
}

export default function PassengerPage({
  params,
  searchParams,
}: PassengerPageProps) {
  const seatId = searchParams.seat || '';
  const passengers = Number(searchParams.passengers) || 1;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Passenger Details"
        description="Enter the traveler's information to complete booking"
      />

      <PassengerPageClient
        flightId={params.id}
        seatId={seatId}
        passengers={passengers}
      />
    </div>
  );
}
