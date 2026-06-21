'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { PlaneTakeoff, PlaneLanding, Calendar, Users, Search, Loader2, ChevronDown, AlertCircle } from 'lucide-react';
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
      className="group relative w-full overflow-hidden rounded-xl bg-primary px-6 py-3.5
                 text-sm font-semibold text-white shadow-lg transition-all
                 hover:bg-primary-600 hover:shadow-xl hover:scale-[1.02]
                 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100
                 sm:w-auto sm:min-w-[180px]"
    >
      {/* Shine effect on hover */}
      <span
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent
                   via-white/20 to-transparent transition-transform duration-700
                   group-hover:translate-x-full"
      />
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching…
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
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
          compact
            ? 'text-xs text-muted uppercase tracking-wider'
            : 'text-sm'
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
  const [cabinClass, setCabinClass] = useState<'economy' | 'business' | 'first'>('economy');
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
    `w-full rounded-xl border bg-surface pl-10 pr-4 text-sm text-text
     shadow-sm transition-all placeholder:text-muted/50
     focus:outline-none focus:ring-2 focus:ring-offset-0 group
     ${compact ? 'py-2.5' : 'py-3.5'}
     ${
       hasError
         ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900'
         : 'border-border/60 focus:border-primary focus:ring-primary/20 hover:border-border'
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
        <div className="flex items-center gap-3 pb-4 border-b border-border/40">
          {/* Trip Type Select Dropdown */}
          <div className="relative text-xs font-bold text-muted">
            <button
              type="button"
              onClick={() => {
                setTripTypeDropdownOpen(!tripTypeDropdownOpen);
                setCabinClassDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 cursor-pointer hover:text-text transition-colors bg-surface/50 px-3 py-2 rounded-lg border border-border/40 hover:bg-surface/80 shadow-sm"
            >
              <span>{tripType === 'one-way' ? 'One way' : 'Round trip'}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${tripTypeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {tripTypeDropdownOpen && (
              <div className="absolute left-0 mt-2 w-32 bg-card border border-border/60 rounded-xl py-1 shadow-xl z-50 text-text font-bold overflow-hidden animate-in fade-in slide-in-from-top-2">
                <button
                  type="button"
                  onClick={() => {
                    setTripType('one-way');
                    setTripTypeDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-surface transition-colors"
                >
                  One way
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTripType('round-trip');
                    setTripTypeDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-surface transition-colors"
                >
                  Round trip
                </button>
              </div>
            )}
          </div>

          {/* Cabin Class Select Dropdown */}
          <div className="relative text-xs font-bold text-muted">
            <button
              type="button"
              onClick={() => {
                setCabinClassDropdownOpen(!cabinClassDropdownOpen);
                setTripTypeDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 cursor-pointer hover:text-text transition-colors bg-surface/50 px-3 py-2 rounded-lg border border-border/40 hover:bg-surface/80 shadow-sm"
            >
              <span className="capitalize">{cabinClass}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${cabinClassDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {cabinClassDropdownOpen && (
              <div className="absolute left-0 mt-2 w-36 bg-card border border-border/60 rounded-xl py-1 shadow-xl z-50 text-text font-bold overflow-hidden animate-in fade-in slide-in-from-top-2">
                <button
                  type="button"
                  onClick={() => {
                    setCabinClass('economy');
                    setCabinClassDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-surface transition-colors capitalize"
                >
                  Economy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCabinClass('business');
                    setCabinClassDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-surface transition-colors capitalize"
                >
                  Business
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCabinClass('first');
                    setCabinClassDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-surface transition-colors capitalize"
                >
                  First Class
                </button>
              </div>
            )}
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
              <span className="capitalize font-semibold text-text">{cabinClass}</span>)
            </p>
            <SearchButton />
          </div>
        </form>
    </div>
  );
}
