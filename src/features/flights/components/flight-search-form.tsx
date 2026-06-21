'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import {
  searchFlightsAction,
  type SearchActionResult,
} from '../actions/search-flights-action';

const initialState: SearchActionResult = {};

// ─── Animated Search Button ────────────────────────────
function SearchButton() {
  const { pending } = useFormStatus();

  return (
    <button
      id="flight-search-submit"
      type="submit"
      disabled={pending}
      className="group relative w-full overflow-hidden rounded-xl bg-gray-900 px-6 py-3.5
                 text-sm font-semibold text-white shadow-lg transition-all
                 hover:bg-gray-800 hover:shadow-xl
                 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                 disabled:cursor-not-allowed disabled:opacity-60
                 sm:w-auto sm:min-w-[180px]"
    >
      {/* Shine effect on hover */}
      <span
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent
                   via-white/10 to-transparent transition-transform duration-700
                   group-hover:translate-x-full"
      />
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
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
          Searching…
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 transition-transform group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          Search Flights
        </span>
      )}
    </button>
  );
}

// ─── Field Error Display ───────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
      <svg
        className="h-3.5 w-3.5 flex-shrink-0"
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
      {message}
    </p>
  );
}

// ─── Input Wrapper ─────────────────────────────────────
function InputGroup({
  label,
  htmlFor,
  icon,
  error,
  children,
  compact,
}: {
  label: string;
  htmlFor: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
      <label
        htmlFor={htmlFor}
        className={`block font-medium text-gray-700 dark:text-gray-300 ${
          compact
            ? 'text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider'
            : 'text-sm'
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
          {icon}
        </div>
        {children}
      </div>
      <FieldError message={error} />
    </div>
  );
}

// ─── Main Search Form ──────────────────────────────────
interface FlightSearchFormProps {
  defaultValues?: {
    origin?: string;
    destination?: string;
    departureDate?: string;
    passengers?: string;
  };
  compact?: boolean;
}

export function FlightSearchForm({
  defaultValues,
  compact,
}: FlightSearchFormProps) {
  const [state, formAction] = useFormState(searchFlightsAction, initialState);
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [cabinClass, setCabinClass] = useState<
    'economy' | 'business' | 'first'
  >('economy');
  const [tripTypeDropdownOpen, setTripTypeDropdownOpen] = useState(false);
  const [cabinClassDropdownOpen, setCabinClassDropdownOpen] = useState(false);

  useEffect(() => {
    if (state?.error && !state.fieldErrors) {
      toast.error(state.error);
    }
  }, [state?.error, state?.fieldErrors]);

  // Today's date in YYYY-MM-DD for the min attribute
  const today = new Date().toISOString().split('T')[0];

  const inputClasses = (hasError: boolean) =>
    `w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-gray-900
     shadow-sm transition-all placeholder:text-gray-400
     focus:outline-none focus:ring-2 focus:ring-offset-0
     dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
     ${compact ? 'py-2.5' : 'py-3'}
     ${
       hasError
         ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900'
         : 'border-gray-300 focus:border-gray-500 focus:ring-gray-200 dark:border-gray-700 dark:focus:ring-gray-700'
     }`;

  const handleFormSubmit = () => {
    if (tripType === 'round-trip') {
      toast.info(
        'ℹ️ Round-trip search simulation active! Filtering outbound flights in results.',
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Form controls/filters row */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
        {/* Trip Type Select Dropdown */}
        <div className="relative text-xs font-bold text-gray-500 dark:text-gray-400">
          <button
            type="button"
            onClick={() => {
              setTripTypeDropdownOpen(!tripTypeDropdownOpen);
              setCabinClassDropdownOpen(false);
            }}
            className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-white transition-colors bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <span>{tripType === 'one-way' ? 'One way' : 'Round trip'}</span>
            <span className="text-[9px]">▼</span>
          </button>
          {tripTypeDropdownOpen && (
            <div className="absolute left-0 mt-1 w-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-1 shadow-2xl z-50 text-gray-900 dark:text-white font-bold">
              <button
                type="button"
                onClick={() => {
                  setTripType('one-way');
                  setTripTypeDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                One way
              </button>
              <button
                type="button"
                onClick={() => {
                  setTripType('round-trip');
                  setTripTypeDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Round trip
              </button>
            </div>
          )}
        </div>

        {/* Cabin Class Select Dropdown */}
        <div className="relative text-xs font-bold text-gray-500 dark:text-gray-400">
          <button
            type="button"
            onClick={() => {
              setCabinClassDropdownOpen(!cabinClassDropdownOpen);
              setTripTypeDropdownOpen(false);
            }}
            className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-white transition-colors bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <span className="capitalize">{cabinClass}</span>
            <span className="text-[9px]">▼</span>
          </button>
          {cabinClassDropdownOpen && (
            <div className="absolute left-0 mt-1 w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-1 shadow-2xl z-50 text-gray-900 dark:text-white font-bold">
              <button
                type="button"
                onClick={() => {
                  setCabinClass('economy');
                  setCabinClassDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors capitalize"
              >
                Economy
              </button>
              <button
                type="button"
                onClick={() => {
                  setCabinClass('business');
                  setCabinClassDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors capitalize"
              >
                Business
              </button>
              <button
                type="button"
                onClick={() => {
                  setCabinClass('first');
                  setCabinClassDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors capitalize"
              >
                First Class
              </button>
            </div>
          )}
        </div>
      </div>

      <form
          action={formAction}
          onSubmit={handleFormSubmit}
          className={compact ? 'space-y-4' : 'space-y-6'}
          noValidate
        >
          {/* Global error fallback for screen readers */}
          <div aria-live="polite" className="sr-only">
            {state?.error && !state.fieldErrors ? state.error : ''}
          </div>

          {/* Dynamic tabs inputs grid */}
          <div
            className={`grid sm:grid-cols-2 ${
              tripType === 'round-trip' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
            } ${compact ? 'gap-4' : 'gap-5'}`}
          >
            {/* Origin */}
            <InputGroup
              label="From"
              htmlFor="search-origin"
              error={state?.fieldErrors?.origin}
              compact={compact}
              icon={
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              }
            >
              <input
                id="search-origin"
                name="origin"
                type="text"
                placeholder="e.g. Delhi"
                autoComplete="off"
                defaultValue={defaultValues?.origin || ''}
                className={inputClasses(!!state?.fieldErrors?.origin)}
              />
            </InputGroup>

            {/* Destination */}
            <InputGroup
              label="To"
              htmlFor="search-destination"
              error={state?.fieldErrors?.destination}
              compact={compact}
              icon={
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              }
            >
              <input
                id="search-destination"
                name="destination"
                type="text"
                placeholder="e.g. Bangkok"
                autoComplete="off"
                defaultValue={defaultValues?.destination || ''}
                className={inputClasses(!!state?.fieldErrors?.destination)}
              />
            </InputGroup>

            {/* Departure Date */}
            <InputGroup
              label="Departure"
              htmlFor="search-departure-date"
              error={state?.fieldErrors?.departureDate}
              compact={compact}
              icon={
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
              }
            >
              <input
                id="search-departure-date"
                name="departureDate"
                type="date"
                min={today}
                defaultValue={defaultValues?.departureDate || ''}
                className={inputClasses(!!state?.fieldErrors?.departureDate)}
              />
            </InputGroup>

            {/* Return Date (only visible on Round Trip) */}
            {tripType === 'round-trip' && (
              <InputGroup
                label="Return"
                htmlFor="search-return-date"
                compact={compact}
                icon={
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                }
              >
                <input
                  id="search-return-date"
                  name="returnDate"
                  type="date"
                  min={today}
                  className={inputClasses(false)}
                />
              </InputGroup>
            )}

            {/* Passengers */}
            <InputGroup
              label="Passengers"
              htmlFor="search-passengers"
              error={state?.fieldErrors?.passengers}
              compact={compact}
              icon={
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              }
            >
              <input
                id="search-passengers"
                name="passengers"
                type="number"
                min={1}
                max={9}
                placeholder="1"
                defaultValue={defaultValues?.passengers || '1'}
                className={inputClasses(!!state?.fieldErrors?.passengers)}
              />
            </InputGroup>
          </div>

          {/* Divider + Submit */}
          <div
            className={`flex flex-col items-stretch gap-4 border-t border-gray-200 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between ${
              compact ? 'pt-4' : 'pt-5'
            }`}
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Search across all available routes and dates (Cabin:{' '}
              <span className="capitalize">{cabinClass}</span>)
            </p>
            <SearchButton />
          </div>
        </form>
    </div>
  );
}
