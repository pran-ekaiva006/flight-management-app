/**
 * ─── Supabase Database Types ────────────────────────────
 * Auto-generate this file using:
 *   npx supabase gen types typescript --project-id ofwdzjctqgqeitdmxxjr > src/types/database.types.ts
 *
 * This placeholder allows the project to compile before
 * database tables are created.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
