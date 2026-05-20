'use client';

import { useState, useCallback } from 'react';
import { SeatMap } from '@/features/seats/components/seat-map';
import type { SeatData } from '@/features/seats/services/fetch-seats';
import { useFlightStore } from '@/store/flight-store';

interface BookingClientProps {
  flightId: string;
  initialSeats: SeatData[];
  basePrice: number;
  passengers: number;
}

export function BookingClient({
  flightId,
  initialSeats,
  basePrice,
  passengers,
}: BookingClientProps) {
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const { selectSeat } = useFlightStore();

  const handleSeatSelect = useCallback(
    (seat: SeatData) => {
      const newId = selectedSeatId === seat.id ? null : seat.id;
      setSelectedSeatId(newId);

      if (newId) {
        selectSeat({
          id: seat.id,
          seatNumber: seat.seat_number,
          class: seat.class,
          extraFee: seat.extra_fee,
          totalPrice: basePrice + seat.extra_fee,
        });
      }
    },
    [selectedSeatId, selectSeat, basePrice],
  );

  return (
    <div className="space-y-6">
      <SeatMap
        flightId={flightId}
        initialSeats={initialSeats}
        basePrice={basePrice}
        selectedSeatId={selectedSeatId}
        onSeatSelect={handleSeatSelect}
      />

      {/* Continue button */}
      {selectedSeatId && (
        <div className="flex justify-end">
          <a
            href={`/booking/${flightId}/passenger?seat=${selectedSeatId}&passengers=${passengers}`}
            className="rounded-xl bg-gray-900 px-8 py-3 text-sm font-semibold text-white
                       shadow-sm transition-all hover:bg-gray-800 hover:shadow-md
                       focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                       dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            Continue to Passenger Details →
          </a>
        </div>
      )}
    </div>
  );
}
