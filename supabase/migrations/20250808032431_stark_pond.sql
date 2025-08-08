/*
  # Comprehensive CRM Updates

  1. New Tables
    - `obstacles` - Hambatan/obstacles for loss stage
    - `promos` - Promo codes for closing stage
    - `revenue_targets` - Target omzet for admins (replaces targets table)
    
  2. Modified Tables
    - `leads` - Added follow_up_status, next_contact_date, obstacle_id, promo_id, shipping_status
    - `packages` - Removed harga_default (prices will be manual)
    
  3. Updated Constraints
    - New stage-specific validations
    - Shipping status constraints
    
  4. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Create obstacles table
CREATE TABLE IF NOT EXISTS obstacles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_hambatan text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create promos table
CREATE TABLE IF NOT EXISTS promos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_promo text NOT NULL,
  deskripsi text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create revenue_targets table (replaces targets)
CREATE TABLE IF NOT EXISTS revenue_targets (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  target_omzet_harian bigint DEFAULT 0,
  target_omzet_bulanan bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add new columns to leads table
DO $$
BEGIN
  -- Add follow_up_status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'follow_up_status'
  ) THEN
    ALTER TABLE leads ADD COLUMN follow_up_status text DEFAULT 'Belum Follow Up';
  END IF;

  -- Add next_contact_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'next_contact_date'
  ) THEN
    ALTER TABLE leads ADD COLUMN next_contact_date timestamptz;
  END IF;

  -- Add obstacle_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'obstacle_id'
  ) THEN
    ALTER TABLE leads ADD COLUMN obstacle_id uuid REFERENCES obstacles(id) ON DELETE SET NULL;
  END IF;

  -- Add promo_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'promo_id'
  ) THEN
    ALTER TABLE leads ADD COLUMN promo_id uuid REFERENCES promos(id) ON DELETE SET NULL;
  END IF;

  -- Add shipping_status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'shipping_status'
  ) THEN
    ALTER TABLE leads ADD COLUMN shipping_status text DEFAULT 'Pending';
  END IF;
END $$;

-- Remove harga_default from packages table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'harga_default'
  ) THEN
    ALTER TABLE packages DROP COLUMN harga_default;
  END IF;
END $$;

-- Add constraints for new columns
DO $$
BEGIN
  -- Follow up status constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'leads_follow_up_status_check'
  ) THEN
    ALTER TABLE leads ADD CONSTRAINT leads_follow_up_status_check 
    CHECK (follow_up_status = ANY (ARRAY['Sudah Follow Up'::text, 'Belum Follow Up'::text]));
  END IF;

  -- Shipping status constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'leads_shipping_status_check'
  ) THEN
    ALTER TABLE leads ADD CONSTRAINT leads_shipping_status_check 
    CHECK (shipping_status = ANY (ARRAY['Pending'::text, 'Selesai'::text]));
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE obstacles ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_targets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for obstacles
CREATE POLICY "Everyone can read obstacles"
  ON obstacles
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Superadmin can manage obstacles"
  ON obstacles
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'superadmin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'superadmin'
  ));

-- RLS Policies for promos
CREATE POLICY "Everyone can read promos"
  ON promos
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Superadmin can manage promos"
  ON promos
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'superadmin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'superadmin'
  ));

-- RLS Policies for revenue_targets
CREATE POLICY "Users can read own revenue targets"
  ON revenue_targets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'superadmin'
  ));

CREATE POLICY "Superadmin can manage revenue targets"
  ON revenue_targets
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'superadmin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'superadmin'
  ));

-- Insert sample data
INSERT INTO obstacles (nama_hambatan) VALUES 
  ('Harga terlalu mahal'),
  ('Tidak ada budget'),
  ('Perlu diskusi dengan atasan'),
  ('Tidak cocok dengan kebutuhan'),
  ('Sudah ada vendor lain')
ON CONFLICT DO NOTHING;

INSERT INTO promos (nama_promo, deskripsi) VALUES 
  ('Diskon 10%', 'Diskon 10% untuk pembelian pertama'),
  ('Cashback 50rb', 'Cashback Rp 50.000 untuk transaksi minimal 500rb'),
  ('Gratis Ongkir', 'Gratis ongkos kirim seluruh Indonesia'),
  ('Bundle Deal', 'Paket bundling dengan harga spesial'),
  ('Early Bird', 'Promo khusus untuk pendaftar awal')
ON CONFLICT DO NOTHING;

-- Migrate existing targets to revenue_targets
INSERT INTO revenue_targets (user_id, target_omzet_harian, target_omzet_bulanan)
SELECT 
  user_id,
  target_harian * 100000 as target_omzet_harian, -- Assuming average deal size 100k
  target_bulanan * 100000 as target_omzet_bulanan
FROM targets
ON CONFLICT (user_id) DO UPDATE SET
  target_omzet_harian = EXCLUDED.target_omzet_harian,
  target_omzet_bulanan = EXCLUDED.target_omzet_bulanan;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_follow_up_status ON leads(follow_up_status);
CREATE INDEX IF NOT EXISTS idx_leads_next_contact_date ON leads(next_contact_date);
CREATE INDEX IF NOT EXISTS idx_leads_obstacle_id ON leads(obstacle_id);
CREATE INDEX IF NOT EXISTS idx_leads_promo_id ON leads(promo_id);
CREATE INDEX IF NOT EXISTS idx_leads_shipping_status ON leads(shipping_status);