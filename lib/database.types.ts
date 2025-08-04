export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          nama_lengkap: string
          role: string
          nomor_wa: string
          aktif: boolean
          avatar: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          nama_lengkap: string
          role: string
          nomor_wa: string
          aktif?: boolean
          avatar?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          nama_lengkap?: string
          role?: string
          nomor_wa?: string
          aktif?: boolean
          avatar?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          nama_produk: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nama_produk: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nama_produk?: string
          created_at?: string
          updated_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          product_id: string
          nama_paket: string
          harga_default: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          nama_paket: string
          harga_default?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          nama_paket?: string
          harga_default?: number
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          waktu: string
          nama: string
          nomor_wa: string
          sumber_lead: string
          product_id: string | null
          paket_id: string | null
          harga: number
          assigned_to: string | null
          stage: string
          tanggal_closing: string | null
          metode_bayar: string | null
          nominal_dp: number
          status: string
          next_follow_up: string | null
          inquiry_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          waktu?: string
          nama: string
          nomor_wa: string
          sumber_lead: string
          product_id?: string | null
          paket_id?: string | null
          harga?: number
          assigned_to?: string | null
          stage?: string
          tanggal_closing?: string | null
          metode_bayar?: string | null
          nominal_dp?: number
          status?: string
          next_follow_up?: string | null
          inquiry_text?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          waktu?: string
          nama?: string
          nomor_wa?: string
          sumber_lead?: string
          product_id?: string | null
          paket_id?: string | null
          harga?: number
          assigned_to?: string | null
          stage?: string
          tanggal_closing?: string | null
          metode_bayar?: string | null
          nominal_dp?: number
          status?: string
          next_follow_up?: string | null
          inquiry_text?: string
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          lead_id: string
          text: string
          author_id: string | null
          author_name: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          text: string
          author_id?: string | null
          author_name: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          text?: string
          author_id?: string | null
          author_name?: string
          created_at?: string
        }
      }
      targets: {
        Row: {
          user_id: string
          target_harian: number
          target_bulanan: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          target_harian?: number
          target_bulanan?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          target_harian?: number
          target_bulanan?: number
          created_at?: string
          updated_at?: string
        }
      }
      handle_customer_data: {
        Row: {
          id: string
          lead_id: string
          status_fu: string
          tanggal_fu_terakhir: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          status_fu?: string
          tanggal_fu_terakhir?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          status_fu?: string
          tanggal_fu_terakhir?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}