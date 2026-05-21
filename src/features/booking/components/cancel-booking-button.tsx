'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cancelBookingAction } from '../actions/cancel-booking-action';

interface CancelBookingButtonProps {
  bookingId: string;
  pnrCode?: string;
}

export function CancelBookingButton({
  bookingId,
  pnrCode,
}: CancelBookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimisticCancelled, setOptimisticCancelled] = useState(false);
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open/close modal
  const openModal = useCallback(() => {
    setIsOpen(true);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    if (isCancelling) return;
    setIsOpen(false);
    setError(null);
  }, [isCancelling]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isCancelling) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isCancelling]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  async function handleCancel() {
    setIsCancelling(true);
    setError(null);

    // Optimistic update
    setOptimisticCancelled(true);

    const result = await cancelBookingAction(bookingId);

    if (result.success) {
      setIsOpen(false);
      setIsCancelling(false);
      router.refresh();
    } else {
      // Rollback optimistic state
      setOptimisticCancelled(false);
      setError(result.error || 'Cancellation failed');
      setIsCancelling(false);
    }
  }

  // If optimistically cancelled, show cancelled badge
  if (optimisticCancelled && !isOpen) {
    return (
      <span className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 dark:border-red-900 dark:text-red-400">
        Cancelled
      </span>
    );
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={openModal}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors
                   hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
      >
        Cancel
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            {/* Header with warning icon */}
            <div className="flex items-start gap-4 border-b border-gray-100 p-6 dark:border-gray-800">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  id="cancel-title"
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                >
                  Cancel Booking?
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone. Your seat will be released and
                  made available to other passengers.
                </p>
                {pnrCode && (
                  <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    PNR: <span className="font-mono font-bold">{pnrCode}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 p-6">
              <button
                type="button"
                onClick={closeModal}
                disabled={isCancelling}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700
                           transition-colors hover:bg-gray-50 disabled:opacity-50
                           dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCancelling}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white
                           transition-colors hover:bg-red-700 disabled:opacity-50
                           dark:bg-red-700 dark:hover:bg-red-600"
              >
                {isCancelling ? (
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
                    Cancelling…
                  </span>
                ) : (
                  'Yes, Cancel Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
