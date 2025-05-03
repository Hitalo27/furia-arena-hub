export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      battles: {
        Row: {
          criado_em: string | null
          id: string
          modalidade: string | null
          user1_id: string
          user2_id: string | null
          vencedor_id: string | null
        }
        Insert: {
          criado_em?: string | null
          id?: string
          modalidade?: string | null
          user1_id?: string
          user2_id?: string | null
          vencedor_id?: string | null
        }
        Update: {
          criado_em?: string | null
          id?: string
          modalidade?: string | null
          user1_id?: string
          user2_id?: string | null
          vencedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "battles_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battles_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battles_vencedor_id_fkey"
            columns: ["vencedor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          descricao: string | null
          id: string
          imagem_url: string | null
          nome_jogador: string
          raridade: string | null
        }
        Insert: {
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          nome_jogador: string
          raridade?: string | null
        }
        Update: {
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          nome_jogador?: string
          raridade?: string | null
        }
        Relationships: []
      }
      ranking: {
        Row: {
          atualizado_em: string | null
          id: string
          pontos: number | null
          posicao: number | null
          user_id: string
        }
        Insert: {
          atualizado_em?: string | null
          id?: string
          pontos?: number | null
          posicao?: number | null
          user_id?: string
        }
        Update: {
          atualizado_em?: string | null
          id?: string
          pontos?: number | null
          posicao?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ranking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cards: {
        Row: {
          adquirido_em: string | null
          card_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          adquirido_em?: string | null
          card_id?: string | null
          id?: string
          user_id?: string
        }
        Update: {
          adquirido_em?: string | null
          card_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          criado_em: string | null
          email: string
          id: string
          modalidade: string | null
          nome: string | null
          pontos: number | null
          senha: string | null
        }
        Insert: {
          criado_em?: string | null
          email: string
          id?: string
          modalidade?: string | null
          nome?: string | null
          pontos?: number | null
          senha?: string | null
        }
        Update: {
          criado_em?: string | null
          email?: string
          id?: string
          modalidade?: string | null
          nome?: string | null
          pontos?: number | null
          senha?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
