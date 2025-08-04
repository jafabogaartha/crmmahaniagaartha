export enum Role {
  SUPER_ADMIN = 'superadmin',
  ADMIN = 'admin',
  HANDLE_CUSTOMER = 'hc',
}

export enum LeadStage {
  ON_PROGRESS = 'On Progress',
  LOSS = 'Loss',
  CLOSING = 'Closing',
}

export enum PaymentMethod {
  FULL_TRANSFER = 'Full Transfer',
  COD = 'COD',
  DP = 'DP',
}

export enum FinalStatus {
  BELUM_SELESAI = 'Belum Selesai',
  SELESAI = 'Selesai',
}

export enum FollowUpStatus {
  SUDAH = 'Sudah',
  BELUM = 'Belum',
}

export interface User {
  id: string;
  username: string;
  nama_lengkap: string;
  role: Role;
  nomor_wa: string;
  aktif: boolean;
  avatar: string;
}

export interface Product {
  id: string;
  nama_produk: string;
}

export interface Package {
  id: string;
  product_id: string;
  nama_paket: string;
  harga_default: number;
}

export interface Note {
    id: string;
    text: string;
    authorId: string;
    authorName: string;
    timestamp: string;
}

export interface Lead {
  id: string;
  waktu: string;
  nama: string;
  nomor_wa: string;
  sumber_lead: string;
  product_id: string;
  paket_id?: string;
  harga?: number;
  assigned_to: string; // user_id
  stage: LeadStage;
  tanggal_closing?: string;
  metode_bayar?: PaymentMethod;
  nominal_dp?: number;
  status: FinalStatus;
  notes: Note[];
  next_follow_up?: string;
  inquiry_text?: string;
}

export interface HandleCustomerData extends Lead {
  lead_id: string;
  status_fu: FollowUpStatus;
  tanggal_fu_terakhir?: string;
}

export interface Target {
  user_id: string;
  target_harian: number;
  target_bulanan: number;
}

export interface AdminPerformance {
  adminId: string;
  adminName: string;
  totalLeads: number;
  totalClosing: number;
  closingRate: number;
  targetHarian: number;
  pencapaianHarian: number;
  targetBulanan: number;
  pencapaianBulanan: number;
}