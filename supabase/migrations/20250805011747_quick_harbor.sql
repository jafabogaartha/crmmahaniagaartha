/*
  # CRM Database Schema Setup

  1. New Tables
    - `users` - User management with role-based access (superadmin, admin, hc)
    - `products` - Product catalog management
    - `packages` - Product packages with pricing
    - `leads` - Lead management with stages and tracking
    - `notes` - Lead communication history
    - `targets` - Performance targets for admins
    - `handle_customer_data` - Customer follow-up management

  2. Security
    - Enable RLS on all tables
    - Role-based policies for data access control
    - Secure authentication flow

  3. Sample Data
    - Initial users with different roles
    - Sample products and packages
    - Demo leads and notes for testing
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username text UNIQUE NOT NULL,
  nama_lengkap text NOT NULL,
  role text NOT NULL CHECK (role IN ('superadmin', 'admin', 'hc')),
  nomor_wa text NOT NULL,
  aktif boolean DEFAULT true,
  avatar text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_produk text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  nama_paket text NOT NULL,
  harga_default integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  waktu timestamptz DEFAULT now(),
  nama text NOT NULL,
  nomor_wa text NOT NULL,
  sumber_lead text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  paket_id uuid REFERENCES packages(id) ON DELETE SET NULL,
  harga integer DEFAULT 0,
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  stage text DEFAULT 'On Progress' CHECK (stage IN ('On Progress', 'Loss', 'Closing')),
  tanggal_closing date,
  metode_bayar text CHECK (metode_bayar IN ('Full Transfer', 'COD', 'DP')),
  nominal_dp integer DEFAULT 0,
  status text DEFAULT 'Belum Selesai' CHECK (status IN ('Belum Selesai', 'Selesai')),
  next_follow_up timestamptz,
  inquiry_text text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  text text NOT NULL,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Targets table
CREATE TABLE IF NOT EXISTS targets (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  target_harian integer DEFAULT 0,
  target_bulanan integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Handle customer data table
CREATE TABLE IF NOT EXISTS handle_customer_data (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  status_fu text DEFAULT 'Belum' CHECK (status_fu IN ('Sudah', 'Belum')),
  tanggal_fu_terakhir date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE handle_customer_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
DROP POLICY IF EXISTS "Users can read all users" ON users;
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Superadmin can manage users" ON users;
CREATE POLICY "Superadmin can manage users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'superadmin')
);

-- RLS Policies for products table
DROP POLICY IF EXISTS "All authenticated users can read products" ON products;
CREATE POLICY "All authenticated users can read products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Superadmin can manage products" ON products;
CREATE POLICY "Superadmin can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'superadmin')
);

-- RLS Policies for packages table
DROP POLICY IF EXISTS "All authenticated users can read packages" ON packages;
CREATE POLICY "All authenticated users can read packages" ON packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Superadmin can manage packages" ON packages;
CREATE POLICY "Superadmin can manage packages" ON packages FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'superadmin')
);

-- RLS Policies for leads table
DROP POLICY IF EXISTS "Users can read leads based on role" ON leads;
CREATE POLICY "Users can read leads based on role" ON leads FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND (
      role = 'superadmin' OR 
      (role = 'admin' AND id = leads.assigned_to) OR
      role = 'hc'
    )
  )
);

DROP POLICY IF EXISTS "Admins can update their leads" ON leads;
CREATE POLICY "Admins can update their leads" ON leads FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND (
      role = 'superadmin' OR 
      (role = 'admin' AND id = leads.assigned_to)
    )
  )
);

DROP POLICY IF EXISTS "System can insert leads" ON leads;
CREATE POLICY "System can insert leads" ON leads FOR INSERT WITH CHECK (true);

-- RLS Policies for notes table
DROP POLICY IF EXISTS "Users can read notes for accessible leads" ON notes;
CREATE POLICY "Users can read notes for accessible leads" ON notes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM leads l
    JOIN users u ON u.id = auth.uid()
    WHERE l.id = notes.lead_id
    AND (
      u.role = 'superadmin' OR 
      (u.role = 'admin' AND u.id = l.assigned_to) OR
      u.role = 'hc'
    )
  )
);

DROP POLICY IF EXISTS "Users can insert notes for accessible leads" ON notes;
CREATE POLICY "Users can insert notes for accessible leads" ON notes FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM leads l
    JOIN users u ON u.id = auth.uid()
    WHERE l.id = notes.lead_id
    AND (
      u.role = 'superadmin' OR 
      (u.role = 'admin' AND u.id = l.assigned_to)
    )
  )
);

-- RLS Policies for targets table
DROP POLICY IF EXISTS "All authenticated users can read targets" ON targets;
CREATE POLICY "All authenticated users can read targets" ON targets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Superadmin can manage targets" ON targets;
CREATE POLICY "Superadmin can manage targets" ON targets FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'superadmin')
);

-- RLS Policies for handle_customer_data table
DROP POLICY IF EXISTS "HC and superadmin can access handle customer data" ON handle_customer_data;
CREATE POLICY "HC and superadmin can access handle customer data" ON handle_customer_data FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('superadmin', 'hc')
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_lead_id ON notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_packages_product_id ON packages(product_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_aktif ON users(aktif);

-- Insert initial data
INSERT INTO users (id, username, nama_lengkap, role, nomor_wa, aktif, avatar) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'angger', 'Angger', 'superadmin', '6281234567890', true, 'https://i.pravatar.cc/150?u=angger'),
  ('550e8400-e29b-41d4-a716-446655440002', 'berliana', 'Berliana', 'admin', '6285155145788', true, 'https://i.pravatar.cc/150?u=berliana'),
  ('550e8400-e29b-41d4-a716-446655440003', 'livia', 'Livia', 'admin', '6285117505788', true, 'https://i.pravatar.cc/150?u=livia'),
  ('550e8400-e29b-41d4-a716-446655440004', 'reka', 'Reka', 'admin', '6282324159922', false, 'https://i.pravatar.cc/150?u=reka'),
  ('550e8400-e29b-41d4-a716-446655440005', 'selly', 'Selly', 'hc', '6289876543210', true, 'https://i.pravatar.cc/150?u=selly')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, nama_produk) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', 'youneedmie'),
  ('550e8400-e29b-41d4-a716-446655440102', 'kopiibukota')
ON CONFLICT (id) DO NOTHING;

INSERT INTO packages (id, product_id, nama_paket, harga_default) VALUES
  ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', 'Paket Super Hemat', 50000),
  ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440101', 'Paket Hemat', 75000),
  ('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440101', 'Paket Portable', 125000),
  ('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440101', 'Paket Koper', 250000),
  ('550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440102', 'Kopi Susu Literan', 80000),
  ('550e8400-e29b-41d4-a716-446655440206', '550e8400-e29b-41d4-a716-446655440102', 'Paket Meeting', 200000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO targets (user_id, target_harian, target_bulanan) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', 2, 20),
  ('550e8400-e29b-41d4-a716-446655440003', 2, 25),
  ('550e8400-e29b-41d4-a716-446655440004', 1, 15)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample leads
INSERT INTO leads (id, waktu, nama, nomor_wa, sumber_lead, product_id, paket_id, harga, assigned_to, stage, tanggal_closing, metode_bayar, status, inquiry_text) VALUES
  ('550e8400-e29b-41d4-a716-446655440301', '2024-07-28T10:00:00Z', 'Budi Santoso', '62811111111', 'Instagram', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440201', 50000, '550e8400-e29b-41d4-a716-446655440002', 'Closing', '2024-07-29', 'Full Transfer', 'Selesai', 'Saya mau tanya-tanya dulu soal paket ini.'),
  ('550e8400-e29b-41d4-a716-446655440302', '2024-07-28T11:00:00Z', 'Citra Lestari', '62822222222', 'TikTok', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440203', 125000, '550e8400-e29b-41d4-a716-446655440003', 'On Progress', null, null, 'Belum Selesai', 'Apakah bisa custom isinya?'),
  ('550e8400-e29b-41d4-a716-446655440303', '2024-07-28T12:30:00Z', 'Doni Firmansyah', '62833333333', 'Facebook', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440205', 80000, '550e8400-e29b-41d4-a716-446655440002', 'Loss', null, null, 'Belum Selesai', 'Ada promo apa untuk kopi literan?')
ON CONFLICT (id) DO NOTHING;

-- Insert sample notes
INSERT INTO notes (id, lead_id, text, author_id, author_name) VALUES
  ('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440302', 'Minta dihubungi lagi besok jam 2 siang.', '550e8400-e29b-41d4-a716-446655440003', 'Livia')
ON CONFLICT (id) DO NOTHING;

-- Create function to automatically create handle_customer_data when lead is closed
CREATE OR REPLACE FUNCTION create_handle_customer_data()
RETURNS TRIGGER AS $$
BEGIN
  -- If lead stage changed to 'Closing' and status is 'Selesai'
  IF NEW.stage = 'Closing' AND NEW.status = 'Selesai' THEN
    -- Check if handle_customer_data already exists
    IF NOT EXISTS (SELECT 1 FROM handle_customer_data WHERE lead_id = NEW.id) THEN
      INSERT INTO handle_customer_data (lead_id, status_fu)
      VALUES (NEW.id, 'Belum');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_create_handle_customer_data ON leads;
CREATE TRIGGER trigger_create_handle_customer_data
  AFTER UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION create_handle_customer_data();