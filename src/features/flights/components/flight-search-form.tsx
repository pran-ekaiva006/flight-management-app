'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import {
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  Users,
  Search,
  Loader2,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
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
      className="group relative w-full overflow-hidden rounded-2xl accent-gradient px-8 py-4
                 text-base font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-300
                 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-[2px]
                 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-surface
                 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0
                 sm:w-auto sm:min-w-[200px]"
    >
      {/* Shine effect on hover */}
      <span
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent
                   via-white/20 to-transparent transition-transform duration-700
                   group-hover:translate-x-full"
      />
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Searching…
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
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
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
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
        className={`block font-medium text-text ${
          compact ? 'text-xs text-muted uppercase tracking-wider' : 'text-sm'
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted group-focus-within:text-primary transition-colors">
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
  hideFilters?: boolean;
}

export function FlightSearchForm({
  defaultValues,
  compact,
  hideFilters = false,
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
    `w-full rounded-2xl border bg-surface/80 backdrop-blur-sm pl-11 pr-4 text-sm text-text font-semibold
     shadow-inner transition-all placeholder:text-muted/50
     focus:outline-none focus:ring-2 focus:ring-offset-0 focus:bg-surface group
     ${compact ? 'py-3' : 'py-4'}
     ${
       hasError
         ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900'
         : 'border-border/60 focus:border-violet-500/50 focus:ring-violet-500/20 hover:border-border'
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
      {!hideFilters && (
        <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-border/40">
          {/* Trip Type Segmented Control */}
          <div className="flex bg-surface/40 border border-border/40 rounded-xl p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setTripType('one-way')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                tripType === 'one-way'
                  ? 'bg-surface text-text shadow-sm ring-1 ring-border/50'
                  : 'text-muted hover:text-text hover:bg-surface/50'
              }`}
            >
              One way
            </button>
            <button
              type="button"
              onClick={() => setTripType('round-trip')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                tripType === 'round-trip'
                  ? 'bg-surface text-text shadow-sm ring-1 ring-border/50'
                  : 'text-muted hover:text-text hover:bg-surface/50'
              }`}
            >
              Round trip
            </button>
          </div>

          {/* Cabin Class Segmented Control */}
          <div className="flex bg-surface/40 border border-border/40 rounded-xl p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setCabinClass('economy')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                cabinClass === 'economy'
                  ? 'bg-surface text-text shadow-sm ring-1 ring-border/50'
                  : 'text-muted hover:text-text hover:bg-surface/50'
              }`}
            >
              Economy
            </button>
            <button
              type="button"
              onClick={() => setCabinClass('business')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                cabinClass === 'business'
                  ? 'bg-surface text-text shadow-sm ring-1 ring-border/50'
                  : 'text-muted hover:text-text hover:bg-surface/50'
              }`}
            >
              Business
            </button>
            <button
              type="button"
              onClick={() => setCabinClass('first')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                cabinClass === 'first'
                  ? 'bg-surface text-text shadow-sm ring-1 ring-border/50'
                  : 'text-muted hover:text-text hover:bg-surface/50'
              }`}
            >
              First
            </button>
          </div>
        </div>
      )}

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
            icon={<PlaneTakeoff className="h-4 w-4" />}
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
            icon={<PlaneLanding className="h-4 w-4" />}
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
            icon={<Calendar className="h-4 w-4" />}
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
              icon={<Calendar className="h-4 w-4" />}
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
            icon={<Users className="h-4 w-4" />}
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
          className={`flex flex-col items-stretch gap-4 border-t border-border/40 sm:flex-row sm:items-center sm:justify-between ${
            compact ? 'pt-4' : 'pt-5'
          }`}
        >
          <p className="text-xs text-muted">
            Search across all available routes and dates (Cabin:{' '}
            <span className="capitalize font-semibold text-text">
              {cabinClass}
            </span>
            )
          </p>
          <SearchButton />
        </div>
      </form>
    </div>
  );
}
