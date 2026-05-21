'use client';

export function PrintTicketButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex-1 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold
                 text-gray-700 shadow-sm transition-all hover:bg-gray-50
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      Print Ticket
    </button>
  );
}
