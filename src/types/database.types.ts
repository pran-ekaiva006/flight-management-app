export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
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
          status: Database['public']['Enums']['flight_status'];
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
          status?: Database['public']['Enums']['flight_status'];
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
          status?: Database['public']['Enums']['flight_status'];
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
          class: Database['public']['Enums']['seat_class'];
          is_available: boolean;
          extra_fee: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          flight_id: string;
          seat_number: string;
          class?: Database['public']['Enums']['seat_class'];
          is_available?: boolean;
          extra_fee?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          flight_id?: string;
          seat_number?: string;
          class?: Database['public']['Enums']['seat_class'];
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
          status: Database['public']['Enums']['booking_status'];
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
          status?: Database['public']['Enums']['booking_status'];
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
          status?: Database['public']['Enums']['booking_status'];
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
      reschedule_booking: {
        Args: {
          p_booking_id: string;
          p_user_id: string;
          p_new_flight_id: string;
          p_new_seat_id: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      flight_status:
        | 'scheduled'
        | 'boarding'
        | 'departed'
        | 'arrived'
        | 'cancelled'
        | 'delayed';
      seat_class: 'economy' | 'business' | 'first';
      booking_status: 'confirmed' | 'rescheduled' | 'cancelled';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// ─── Convenience Helpers ────────────────────────────────
type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
