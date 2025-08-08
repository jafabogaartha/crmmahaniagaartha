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
  SUDAH_FOLLOW_UP = 'Sudah Follow Up',
  BELUM_FOLLOW_UP = 'Belum Follow Up',
}

export enum ShippingStatus {
  PENDING = 'Pending',
  SELESAI = 'Selesai',
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
}

export interface Obstacle {
  id: string;
  nama_hambatan: string;
}

export interface Promo {
  id: string;
  nama_promo: string;
  deskripsi: string;
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
  follow_up_status: FollowUpStatus;
  next_contact_date?: string;
  obstacle_id?: string;
  promo_id?: string;
  shipping_status: ShippingStatus;
}

export interface HandleCustomerData extends Lead {
  lead_id: string;
  status_fu: FollowUpStatus;
  tanggal_fu_terakhir?: string;
}

export interface RevenueTarget {
  user_id: string;
  target_omzet_harian: number;
  target_omzet_bulanan: number;
}

export interface AdminPerformance {
  adminId: string;
  adminName: string;
  totalLeads: number;
  totalClosing: number;
  closingRate: number;
  targetOmzetHarian: number;
  pencapaianOmzetHarian: number;
  targetOmzetBulanan: number;
  pencapaianOmzetBulanan: number;
}