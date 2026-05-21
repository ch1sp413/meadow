export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          id: string;
          sanctuary_id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["activity_logs"]["Row"]> & {
          sanctuary_id: string;
          action: string;
          entity_type: string;
        };
        Update: Partial<Database["public"]["Tables"]["activity_logs"]["Row"]>;
        Relationships: [];
      };
      animal_events: GenericTable;
      animals: GenericTable;
      care_tasks: GenericTable;
      documents: GenericTable;
      donations: GenericTable;
      donors: GenericTable;
      enclosures: GenericTable;
      inventory_items: GenericTable;
      invitations: GenericTable;
      medical_records: GenericTable;
      people: GenericTable;
      transports: GenericTable;
      sanctuary_members: {
        Row: {
          id: string;
          sanctuary_id: string;
          user_id: string;
          role: Role;
          display_name: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          sanctuary_id: string;
          user_id: string;
          role?: Role;
          display_name?: string | null;
          active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["sanctuary_members"]["Row"]>;
        Relationships: [];
      };
      sanctuaries: {
        Row: {
          id: string;
          name: string;
          slug: string;
          region: string;
          timezone: string;
          created_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          region?: string;
          timezone?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sanctuaries"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      member_role: Role;
    };
  };
};

export type Role =
  | "owner"
  | "admin"
  | "care_lead"
  | "vet"
  | "volunteer"
  | "fundraising"
  | "viewer";

type GenericRow = {
  id: string;
  sanctuary_id: string;
  created_at: string;
  updated_at: string;
  [key: string]: Json | undefined;
};

type GenericTable = {
  Row: GenericRow;
  Insert: Partial<GenericRow> & { sanctuary_id: string };
  Update: Partial<GenericRow>;
  Relationships: [];
};
