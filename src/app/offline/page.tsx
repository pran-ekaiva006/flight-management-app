import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline',
  description: 'You are currently offline.',
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200/60 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        {/* Offline Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg
            className="h-10 w-10 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          You&apos;re Offline
        </h1>

        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          It looks like you&apos;ve lost your internet connection. Don&apos;t
          worry — your previously viewed pages and bookings are still available.
        </p>

        {/* Visual separator */}
        <div className="mx-auto my-6 h-px w-16 bg-gray-200 dark:bg-gray-700" />

        {/* Tips */}
        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
              <svg
                className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Previously viewed flights and bookings are cached
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
              <svg
                className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your booking confirmations and PNR codes are saved
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950">
              <svg
                className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              New bookings require an active connection
            </p>
          </div>
        </div>

        {/* Retry */}
        <a
          href="/"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
            />
          </svg>
          Try Again
        </a>
      </div>
    </div>
  );
}
