'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchAlternativeFlights,
  fetchAvailableSeats,
  rescheduleBookingAction,
} from '../actions/reschedule-booking-action';

interface RescheduleButtonProps {
  bookingId: string;
}

type AltFlight = {
  id: string;
  flight_no: string;
  departs_at: string;
  arrives_at: string;
  base_price: number;
  aircraft_type: string;
  availableSeats: number;
};

type AvailSeat = {
  id: string;
  seat_number: string;
  class: string;
  extra_fee: number;
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

export function RescheduleButton({ bookingId }: RescheduleButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'flight' | 'seat' | 'confirm'>('flight');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Data
  const [flights, setFlights] = useState<AltFlight[]>([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [currentBasePrice, setCurrentBasePrice] = useState(0);
  const [selectedFlight, setSelectedFlight] = useState<AltFlight | null>(null);
  const [seats, setSeats] = useState<AvailSeat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<AvailSeat | null>(null);

  // Open modal & fetch flights
  const openModal = useCallback(async () => {
    setIsOpen(true);
    setStep('flight');
    setLoading(true);
    setError(null);
    setSelectedFlight(null);
    setSelectedSeat(null);

    const data = await fetchAlternativeFlights(bookingId);
    if (data) {
      setFlights(data.flights);
      setOrigin(data.origin);
      setDestination(data.destination);
      setCurrentBasePrice(data.currentBasePrice);
    } else {
      setError('Could not load alternative flights');
    }
    setLoading(false);
  }, [bookingId]);

  // Select flight → load seats
  const handleFlightSelect = useCallback(async (flight: AltFlight) => {
    setSelectedFlight(flight);
    setStep('seat');
    setLoading(true);
    const seatData = await fetchAvailableSeats(flight.id);
    setSeats(seatData);
    setLoading(false);
  }, []);

  // Select seat → show confirmation
  const handleSeatSelect = useCallback((seat: AvailSeat) => {
    setSelectedSeat(seat);
    setStep('confirm');
  }, []);

  // Confirm reschedule
  const handleConfirm = useCallback(async () => {
    if (!selectedFlight || !selectedSeat) return;
    setSubmitting(true);
    setError(null);

    const result = await rescheduleBookingAction(
      bookingId,
      selectedFlight.id,
      selectedSeat.id,
    );

    if (result.success) {
      setIsOpen(false);
      router.refresh();
    } else {
      setError(result.error || 'Reschedule failed');
      setSubmitting(false);
    }
  }, [bookingId, selectedFlight, selectedSeat, router]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const feeCharged = selectedFlight
    ? Math.max(0, selectedFlight.base_price - currentBasePrice)
    : 0;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors
                   hover:bg-amber-50 dark:border-amber-900 dark:text-amber-400 dark:hover:bg-amber-950"
      >
        Reschedule
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !submitting && setIsOpen(false)}
          />

          <div className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reschedule Booking
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {origin} → {destination}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !submitting && setIsOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex border-b border-gray-100 px-5 py-2 dark:border-gray-800">
              {(['flight', 'seat', 'confirm'] as const).map((s, i) => (
                <div
                  key={s}
                  className={`flex items-center gap-1.5 text-xs ${step === s ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-400'}`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step === s ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800'}`}
                  >
                    {i + 1}
                  </span>
                  <span className="hidden sm:inline">
                    {s === 'flight'
                      ? 'Select Flight'
                      : s === 'seat'
                        ? 'Select Seat'
                        : 'Confirm'}
                  </span>
                  {i < 2 && (
                    <span className="mx-2 text-gray-300 dark:text-gray-700">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mx-5 mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <svg
                    className="h-6 w-6 animate-spin text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </div>
              ) : step === 'flight' ? (
                <div className="space-y-3">
                  {flights.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500">
                      No alternative flights available on this route.
                    </p>
                  ) : (
                    flights.map((f) => {
                      const fee = Math.max(0, f.base_price - currentBasePrice);
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => handleFlightSelect(f)}
                          className="w-full rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-gray-400 hover:shadow-sm dark:border-gray-700 dark:hover:border-gray-500"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {f.flight_no}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {f.aircraft_type}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900 dark:text-white">
                                {formatPrice(f.base_price)}
                              </p>
                              {fee > 0 && (
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                  +{formatPrice(fee)} fee
                                </p>
                              )}
                              {fee === 0 && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                  No extra fee
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {formatTime(f.departs_at)}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {formatTime(f.arrives_at)}
                            </span>
                            <span className="text-xs text-gray-400">
                              · {formatDate(f.departs_at)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-400">
                            {f.availableSeats} seats available
                          </p>
                        </button>
                      );
                    })
                  )}
                </div>
              ) : step === 'seat' ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setStep('flight')}
                    className="mb-3 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  >
                    ← Back to flights
                  </button>
                  <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select a seat on {selectedFlight?.flight_no}
                  </p>
                  {seats.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500">
                      No available seats.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {seats.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleSeatSelect(s)}
                          className={`rounded-lg border p-3 text-center transition-all ${
                            selectedSeat?.id === s.id
                              ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                              : 'border-gray-200 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500'
                          }`}
                        >
                          <p className="text-sm font-bold">{s.seat_number}</p>
                          <p className="text-[10px] capitalize text-gray-500">
                            {s.class}
                          </p>
                          {s.extra_fee > 0 && (
                            <p className="text-[10px] text-gray-400">
                              +{formatPrice(s.extra_fee)}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setStep('seat')}
                    className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  >
                    ← Back to seats
                  </button>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <h4 className="mb-2 text-xs font-semibold text-gray-400">
                      NEW FLIGHT
                    </h4>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedFlight?.flight_no}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTime(selectedFlight?.departs_at || '')} →{' '}
                      {formatTime(selectedFlight?.arrives_at || '')} ·{' '}
                      {formatDate(selectedFlight?.departs_at || '')}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <h4 className="mb-2 text-xs font-semibold text-gray-400">
                      NEW SEAT
                    </h4>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedSeat?.seat_number}{' '}
                      <span className="text-xs capitalize text-gray-500">
                        ({selectedSeat?.class})
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                    <h4 className="mb-2 text-xs font-semibold text-gray-400">
                      FEE SUMMARY
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          New base fare
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {formatPrice(selectedFlight?.base_price || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Seat surcharge
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {formatPrice(selectedSeat?.extra_fee || 0)}
                        </span>
                      </div>
                      {feeCharged > 0 && (
                        <div className="flex justify-between text-amber-600 dark:text-amber-400">
                          <span>Reschedule fee</span>
                          <span>{formatPrice(feeCharged)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-1 dark:border-gray-700">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-900 dark:text-white">
                            New total
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {formatPrice(
                              (selectedFlight?.base_price || 0) +
                                (selectedSeat?.extra_fee || 0),
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {step === 'confirm' && (
              <div className="border-t border-gray-100 p-5 dark:border-gray-800">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="w-full rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white
                             transition-colors hover:bg-gray-800 disabled:opacity-50
                             dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Rescheduling…
                    </span>
                  ) : (
                    'Confirm Reschedule'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
