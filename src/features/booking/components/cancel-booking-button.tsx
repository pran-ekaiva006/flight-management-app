'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cancelBookingAction } from '../actions/cancel-booking-action';

interface CancelBookingButtonProps {
  bookingId: string;
}

export function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleCancel() {
    setIsCancelling(true);
    setError(null);

    const result = await cancelBookingAction(bookingId);

    if (result.success) {
      setIsOpen(false);
      router.refresh();
    } else {
      setError(result.error || 'Cancellation failed');
      setIsCancelling(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors
                   hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
      >
        Cancel
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        disabled={isCancelling}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors
                   hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        Keep
      </button>
      <button
        type="button"
        onClick={handleCancel}
        disabled={isCancelling}
        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors
                   hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
      >
        {isCancelling ? 'Cancelling…' : 'Confirm Cancel'}
      </button>
    </div>
  );
}
