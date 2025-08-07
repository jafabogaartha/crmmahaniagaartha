/*
  # Fix public form RLS policy

  1. Security Changes
    - Add policy to allow anonymous users to insert leads via public form
    - Keep existing policies for authenticated users intact

  2. Notes
    - This allows the public form to work while maintaining security for other operations
    - Only INSERT operations are allowed for anonymous users
*/

-- Add policy to allow anonymous users to insert leads
CREATE POLICY "Anonymous users can insert leads via public form"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);