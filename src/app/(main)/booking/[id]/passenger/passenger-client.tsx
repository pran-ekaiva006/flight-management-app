'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PassengerForm } from '@/features/booking/components/passenger-form';
import { createBookingAction } from '@/features/booking/actions/create-booking-action';
import type { PassengerInput } from '@/features/booking/schemas/passenger-schema';
import { useFlightStore } from '@/store/flight-store';
import { toast } from 'sonner';

interface PassengerPageClientProps {
  flightId: string;
  seatId: string;
  passengers: number;
}

export function PassengerPageClient({
  flightId,
  seatId,
  passengers,
}: PassengerPageClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { selectedFlight, selectedSeat, setPassengerData } = useFlightStore();

  const handleSubmit = useCallback(
    async (data: PassengerInput) => {
      setIsSubmitting(true);
      setError(null);

      // Save to Zustand (excluding passport from persistence)
      setPassengerData({
        fullName: data.fullName,
        passportNo: data.passportNo,
        nationality: data.nationality,
        dob: data.dob,
      });

      const totalPrice = selectedSeat?.totalPrice ?? 0;

      try {
        const result = await createBookingAction({
          flightId,
          seatId,
          totalPrice,
          fullName: data.fullName,
          passportNo: data.passportNo,
          nationality: data.nationality,
          dob: data.dob,
        });

        if (!result.success) {
          setError(result.error || 'Something went wrong');
          toast.error(result.error || 'Something went wrong');
          setIsSubmitting(false);
        }
        // On success, the action redirects to /booking/confirmation/[id]
      } catch {
        // redirect() throws a special Next.js error — this is normal
        // Only handle real errors
      }
    },
    [flightId, seatId, selectedSeat, setPassengerData],
  );

  return (
    <div className="space-y-6">
      {/* Flight + Seat Summary */}
      {selectedFlight && selectedSeat && (
        <div className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            Booking Summary
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Flight</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedFlight.flightNo}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Route</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedFlight.origin} → {selectedFlight.destination}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Seat</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedSeat.seatNumber} ({selectedSeat.class})
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Total</p>
              <p className="font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(selectedSeat.totalPrice)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error message fallback for screen readers */}
      <div aria-live="polite" className="sr-only">
        {error}
      </div>

      {/* Passenger Form */}
      <div className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Passenger Details
        </h3>
        <PassengerForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
