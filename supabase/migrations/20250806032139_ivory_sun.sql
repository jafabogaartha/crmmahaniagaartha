/*
  # Fix RLS policies for products table

  1. Security Updates
    - Drop existing problematic policies
    - Create new policies that properly check user roles
    - Use EXISTS clause to verify user role from users table
    - Allow superadmin to manage products

  2. Policy Structure
    - SELECT: All authenticated users can read products
    - INSERT/UPDATE/DELETE: Only superadmin can manage products
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "All authenticated users can read products" ON products;
DROP POLICY IF EXISTS "Superadmin can manage products" ON products;

-- Create new working policies
CREATE POLICY "All authenticated users can read products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Superadmin can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'superadmin'
    )
  );

CREATE POLICY "Superadmin can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'superadmin'
    )
  );

CREATE POLICY "Superadmin can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'superadmin'
    )
  );