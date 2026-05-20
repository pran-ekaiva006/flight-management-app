import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  FlightSearchResult,
  SeatClassSummary,
} from '@/features/flights/types/flight';

// ─── Types ──────────────────────────────────────────────

/** Search query persisted across navigation */
export interface SearchQuery {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
}

/** Minimal flight data stored in client state (avoids stale full objects) */
export interface SelectedFlight {
  id: string;
  flightNo: string;
  origin: string;
  destination: string;
  departsAt: string;
  arrivesAt: string;
  durationMinutes: number;
  basePrice: number;
  aircraftType: string;
  seatClasses: SeatClassSummary[];
}

/** Selected seat reference */
export interface SelectedSeat {
  id: string;
  seatNumber: string;
  class: 'economy' | 'business' | 'first';
  extraFee: number;
  totalPrice: number; // base_price + extra_fee
}

/** Passenger form data — passport_no is sensitive, excluded from persistence */
export interface PassengerFormData {
  fullName: string;
  passportNo: string; // ← NOT persisted
  nationality: string;
  dob: string;
}

/** Booking flow step tracker */
export type BookingStep =
  | 'search'
  | 'select-seat'
  | 'passenger-details'
  | 'review'
  | 'confirmed';

// ─── Store Shape ────────────────────────────────────────

interface FlightStoreState {
  // Search
  searchQuery: SearchQuery | null;

  // Selection
  selectedFlight: SelectedFlight | null;
  selectedSeat: SelectedSeat | null;

  // Booking flow
  bookingStep: BookingStep;
  passengerData: PassengerFormData | null;
}

interface FlightStoreActions {
  // Search
  setSearchQuery: (query: SearchQuery) => void;

  // Selection
  selectFlight: (flight: FlightSearchResult) => void;
  selectSeat: (seat: SelectedSeat) => void;

  // Booking flow
  setBookingStep: (step: BookingStep) => void;
  setPassengerData: (data: PassengerFormData) => void;

  // Resets
  resetSelection: () => void;
  resetBooking: () => void;
  resetAll: () => void;
}

type FlightStore = FlightStoreState & FlightStoreActions;

// ─── Initial State ──────────────────────────────────────

const initialState: FlightStoreState = {
  searchQuery: null,
  selectedFlight: null,
  selectedSeat: null,
  bookingStep: 'search',
  passengerData: null,
};

// ─── Store ──────────────────────────────────────────────

export const useFlightStore = create<FlightStore>()(
  persist(
    (set) => ({
      ...initialState,

      // ── Search ──────────────────────────────────────
      setSearchQuery: (query) => set({ searchQuery: query }),

      // ── Selection ───────────────────────────────────
      selectFlight: (flight) =>
        set({
          selectedFlight: {
            id: flight.id,
            flightNo: flight.flight_no,
            origin: flight.origin,
            destination: flight.destination,
            departsAt: flight.departs_at,
            arrivesAt: flight.arrives_at,
            durationMinutes: flight.durationMinutes,
            basePrice: flight.base_price,
            aircraftType: flight.aircraft_type,
            seatClasses: flight.seatClasses,
          },
          selectedSeat: null,
          bookingStep: 'select-seat',
          passengerData: null,
        }),

      selectSeat: (seat) =>
        set({
          selectedSeat: seat,
          bookingStep: 'passenger-details',
        }),

      // ── Booking Flow ────────────────────────────────
      setBookingStep: (step) => set({ bookingStep: step }),

      setPassengerData: (data) =>
        set({
          passengerData: data,
          bookingStep: 'review',
        }),

      // ── Resets ──────────────────────────────────────
      resetSelection: () =>
        set({
          selectedFlight: null,
          selectedSeat: null,
          bookingStep: 'search',
          passengerData: null,
        }),

      resetBooking: () =>
        set({
          selectedSeat: null,
          bookingStep: 'select-seat',
          passengerData: null,
        }),

      resetAll: () => set(initialState),
    }),
    {
      name: 'flight-booking-store',
      storage: createJSONStorage(() => localStorage),

      /**
       * Partialize — exclude sensitive data from persistence.
       * passport numbers and transient passenger form data are
       * never written to localStorage.
       */
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        selectedFlight: state.selectedFlight,
        selectedSeat: state.selectedSeat,
        bookingStep: state.bookingStep,
        // passengerData intentionally excluded — contains passportNo
      }),

      /**
       * Version for future migrations.
       */
      version: 1,
    },
  ),
);
