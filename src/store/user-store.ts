import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Tables } from '@/types/database.types';

// ─── Types ──────────────────────────────────────────────

/** Minimal session info — only the token is persisted */
export interface SessionInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // unix timestamp
}

/** Lightweight user profile from Supabase auth */
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

/** Cached booking row from the database */
export type CachedBooking = Tables<'bookings'>;

// ─── Store Shape ────────────────────────────────────────

interface UserStoreState {
  // Auth
  session: SessionInfo | null;
  user: UserProfile | null;

  // Cached data
  bookings: CachedBooking[];
  bookingsLoadedAt: number | null; // unix timestamp for cache invalidation
}

interface UserStoreActions {
  // Auth
  setSession: (session: SessionInfo, user: UserProfile) => void;
  clearSession: () => void;

  // Bookings cache
  setBookings: (bookings: CachedBooking[]) => void;
  addBooking: (booking: CachedBooking) => void;
  removeBooking: (bookingId: string) => void;
  invalidateBookings: () => void;

  // Reset
  logout: () => void;
}

type UserStore = UserStoreState & UserStoreActions;

// ─── Initial State ──────────────────────────────────────

const initialState: UserStoreState = {
  session: null,
  user: null,
  bookings: [],
  bookingsLoadedAt: null,
};

// ─── Store ──────────────────────────────────────────────

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      // ── Auth ────────────────────────────────────────
      setSession: (session, user) => set({ session, user }),

      clearSession: () => set({ session: null, user: null }),

      // ── Bookings Cache ─────────────────────────────
      setBookings: (bookings) =>
        set({
          bookings,
          bookingsLoadedAt: Date.now(),
        }),

      addBooking: (booking) =>
        set((state) => ({
          bookings: [booking, ...state.bookings],
        })),

      removeBooking: (bookingId) =>
        set((state) => ({
          bookings: state.bookings.filter((b) => b.id !== bookingId),
        })),

      invalidateBookings: () => set({ bookings: [], bookingsLoadedAt: null }),

      // ── Logout (full reset) ─────────────────────────
      logout: () => set(initialState),
    }),
    {
      name: 'user-session-store',
      storage: createJSONStorage(() => localStorage),

      /**
       * Partialize — persist ONLY the session token.
       * User profile and cached bookings are transient;
       * they are re-fetched on each app load from Supabase.
       */
      partialize: (state) => ({
        session: state.session,
        // user, bookings, bookingsLoadedAt intentionally excluded
      }),

      version: 1,
    },
  ),
);
