// Hand-written to match supabase/migrations/0001_init.sql.
// Regenerate with `supabase gen types typescript` if the schema changes.

export type Database = {
  public: {
    Tables: {
      entries: {
        Row: {
          id: string;
          user_id: string;
          text: string;
          target_language: string;
          level: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          text: string;
          target_language: string;
          level: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          text?: string;
          target_language?: string;
          level?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_language_levels: {
        Row: {
          user_id: string;
          language: string;
          level: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          language: string;
          level: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          language?: string;
          level?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
