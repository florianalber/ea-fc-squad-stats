export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      matches: {
        Row: {
          away_ball_recovery_time: number | null
          away_corners: number | null
          away_dribble_success: number | null
          away_fouls: number | null
          away_free_kicks: number | null
          away_interceptions: number | null
          away_offsides: number | null
          away_pass_accuracy: number | null
          away_passes: number | null
          away_penalties: number | null
          away_possession: number | null
          away_saves: number | null
          away_score: number
          away_shot_accuracy: number | null
          away_shots: number | null
          away_tackles: number | null
          away_tackles_won: number | null
          away_team_name: string
          away_xg: number | null
          away_yellow_cards: number | null
          created_at: string
          entry_mode: string
          home_ball_recovery_time: number | null
          home_corners: number | null
          home_dribble_success: number | null
          home_fouls: number | null
          home_free_kicks: number | null
          home_interceptions: number | null
          home_offsides: number | null
          home_pass_accuracy: number | null
          home_passes: number | null
          home_penalties: number | null
          home_possession: number | null
          home_saves: number | null
          home_score: number
          home_shot_accuracy: number | null
          home_shots: number | null
          home_tackles: number | null
          home_tackles_won: number | null
          home_team_name: string
          home_xg: number | null
          home_yellow_cards: number | null
          id: string
          match_date: string
          match_mode: string
          photo_url: string | null
        }
        Insert: {
          away_ball_recovery_time?: number | null
          away_corners?: number | null
          away_dribble_success?: number | null
          away_fouls?: number | null
          away_free_kicks?: number | null
          away_interceptions?: number | null
          away_offsides?: number | null
          away_pass_accuracy?: number | null
          away_passes?: number | null
          away_penalties?: number | null
          away_possession?: number | null
          away_saves?: number | null
          away_score: number
          away_shot_accuracy?: number | null
          away_shots?: number | null
          away_tackles?: number | null
          away_tackles_won?: number | null
          away_team_name: string
          away_xg?: number | null
          away_yellow_cards?: number | null
          created_at?: string
          entry_mode?: string
          home_ball_recovery_time?: number | null
          home_corners?: number | null
          home_dribble_success?: number | null
          home_fouls?: number | null
          home_free_kicks?: number | null
          home_interceptions?: number | null
          home_offsides?: number | null
          home_pass_accuracy?: number | null
          home_passes?: number | null
          home_penalties?: number | null
          home_possession?: number | null
          home_saves?: number | null
          home_score: number
          home_shot_accuracy?: number | null
          home_shots?: number | null
          home_tackles?: number | null
          home_tackles_won?: number | null
          home_team_name: string
          home_xg?: number | null
          home_yellow_cards?: number | null
          id?: string
          match_date?: string
          match_mode?: string
          photo_url?: string | null
        }
        Update: {
          away_ball_recovery_time?: number | null
          away_corners?: number | null
          away_dribble_success?: number | null
          away_fouls?: number | null
          away_free_kicks?: number | null
          away_interceptions?: number | null
          away_offsides?: number | null
          away_pass_accuracy?: number | null
          away_passes?: number | null
          away_penalties?: number | null
          away_possession?: number | null
          away_saves?: number | null
          away_score?: number
          away_shot_accuracy?: number | null
          away_shots?: number | null
          away_tackles?: number | null
          away_tackles_won?: number | null
          away_team_name?: string
          away_xg?: number | null
          away_yellow_cards?: number | null
          created_at?: string
          entry_mode?: string
          home_ball_recovery_time?: number | null
          home_corners?: number | null
          home_dribble_success?: number | null
          home_fouls?: number | null
          home_free_kicks?: number | null
          home_interceptions?: number | null
          home_offsides?: number | null
          home_pass_accuracy?: number | null
          home_passes?: number | null
          home_penalties?: number | null
          home_possession?: number | null
          home_saves?: number | null
          home_score?: number
          home_shot_accuracy?: number | null
          home_shots?: number | null
          home_tackles?: number | null
          home_tackles_won?: number | null
          home_team_name?: string
          home_xg?: number | null
          home_yellow_cards?: number | null
          id?: string
          match_date?: string
          match_mode?: string
          photo_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
