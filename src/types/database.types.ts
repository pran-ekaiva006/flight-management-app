/**
 * ─── Supabase Database Types ────────────────────────────
 * Generated to match the schema in supabase/migrations/00001_create_core_schema.sql
 *
 * To regenerate from live DB:
 *   npx supabase gen types typescript --project-id ofwdzjctqgqeitdmxxjr > src/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type FlightStatus = 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled' | 'delayed';
export type SeatClass = 'economy' | 'business' | 'first';
export type BookingStatus = 'confirmed' | 'rescheduled' | 'cancelled';

export interface Database {
  public: {
    Tables: {
      flights: {
        Row: {
          id: string;
          flight_no: string;
          origin: string;
          destination: string;
          departs_at: string;
          arrives_at: string;
          aircraft_type: string;
          status: FlightStatus;
          base_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          flight_no: string;
          origin: string;
          destination: string;
          departs_at: string;
          arrives_at: string;
          aircraft_type?: string;
          status?: FlightStatus;
          base_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          flight_no?: string;
          origin?: string;
          destination?: string;
          departs_at?: string;
          arrives_at?: string;
          aircraft_type?: string;
          status?: FlightStatus;
          base_price?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      seats: {
        Row: {
          id: string;
          flight_id: string;
          seat_number: string;
          class: SeatClass;
          is_available: boolean;
          extra_fee: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          flight_id: string;
          seat_number: string;
          class?: SeatClass;
          is_available?: boolean;
          extra_fee?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          flight_id?: string;
          seat_number?: string;
          class?: SeatClass;
          is_available?: boolean;
          extra_fee?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'seats_flight_id_fkey';
            columns: ['flight_id'];
            isOneToOne: false;
            referencedRelation: 'flights';
            referencedColumns: ['id'];
          },
        ];
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          flight_id: string;
          seat_id: string;
          status: BookingStatus;
          booked_at: string;
          total_price: number;
          pnr_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          flight_id: string;
          seat_id: string;
          status?: BookingStatus;
          booked_at?: string;
          total_price: number;
          pnr_code: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          flight_id?: string;
          seat_id?: string;
          status?: BookingStatus;
          booked_at?: string;
          total_price?: number;
          pnr_code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bookings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_flight_id_fkey';
            columns: ['flight_id'];
            isOneToOne: false;
            referencedRelation: 'flights';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_seat_id_fkey';
            columns: ['seat_id'];
            isOneToOne: false;
            referencedRelation: 'seats';
            referencedColumns: ['id'];
          },
        ];
      };
      passengers: {
        Row: {
          id: string;
          booking_id: string;
          full_name: string;
          passport_no: string;
          nationality: string;
          dob: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          full_name: string;
          passport_no: string;
          nationality: string;
          dob: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          full_name?: string;
          passport_no?: string;
          nationality?: string;
          dob?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'passengers_booking_id_fkey';
            columns: ['booking_id'];
            isOneToOne: false;
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          },
        ];
      };
      reschedules: {
        Row: {
          id: string;
          booking_id: string;
          old_flight_id: string;
          new_flight_id: string;
          requested_at: string;
          fee_charged: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          old_flight_id: string;
          new_flight_id: string;
          requested_at?: string;
          fee_charged?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          old_flight_id?: string;
          new_flight_id?: string;
          requested_at?: string;
          fee_charged?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reschedules_booking_id_fkey';
            columns: ['booking_id'];
            isOneToOne: false;
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reschedules_old_flight_id_fkey';
            columns: ['old_flight_id'];
            isOneToOne: false;
            referencedRelation: 'flights';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reschedules_new_flight_id_fkey';
            columns: ['new_flight_id'];
            isOneToOne: false;
            referencedRelation: 'flights';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      reserve_seat: {
        Args: {
          p_user_id: string;
          p_flight_id: string;
          p_seat_id: string;
          p_total_price: number;
          p_pnr_code: string;
          p_full_name: string;
          p_passport_no: string;
          p_nationality: string;
          p_dob: string;
        };
        Returns: string;
      };
      cancel_booking: {
        Args: {
          p_booking_id: string;
          p_user_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      flight_status: FlightStatus;
      seat_class: SeatClass;
      booking_status: BookingStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// ─── Convenience type helpers ───────────────────────────

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Flight = Tables<'flights'>;
export type Seat = Tables<'seats'>;
export type Booking = Tables<'bookings'>;
export type Passenger = Tables<'passengers'>;
export type Reschedule = Tables<'reschedules'>;
