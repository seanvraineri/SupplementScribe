-- Enable Row Level Security (RLS) on tables flagged by security advisor
-- This script addresses the security errors for tables without RLS enabled

-- 1. Enable RLS on interaction_checks table
ALTER TABLE public.interaction_checks ENABLE ROW LEVEL SECURITY;

-- 2. Enable RLS on supplement_vendors table
ALTER TABLE public.supplement_vendors ENABLE ROW LEVEL SECURITY;

-- 3. Enable RLS on vendors table
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for each table
-- These policies define who can perform which operations on each table

-- interaction_checks policies
-- Note: This table doesn't have a user_id column, so we'll use a different approach
-- Allow all authenticated users to view interaction checks
CREATE POLICY "Authenticated users can view interaction checks"
ON public.interaction_checks
FOR SELECT
USING (auth.role() = 'authenticated');

-- Only allow admins to insert/update interaction checks
CREATE POLICY "Only admins can insert interaction checks"
ON public.interaction_checks
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE is_admin = true
));

CREATE POLICY "Only admins can update interaction checks"
ON public.interaction_checks
FOR UPDATE
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE is_admin = true
));

-- supplement_vendors policies
-- This is a reference table, so we'll allow all authenticated users to view
CREATE POLICY "Anyone can view supplement vendors"
ON public.supplement_vendors
FOR SELECT
USING (true);

-- Only allow admins to modify supplement vendors
CREATE POLICY "Only admins can insert supplement vendors"
ON public.supplement_vendors
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE is_admin = true
));

CREATE POLICY "Only admins can update supplement vendors"
ON public.supplement_vendors
FOR UPDATE
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE is_admin = true
));

-- vendors policies
-- This is a reference table, so we'll allow all authenticated users to view
CREATE POLICY "Anyone can view vendors"
ON public.vendors
FOR SELECT
USING (true);

-- Only allow admins to modify vendors
CREATE POLICY "Only admins can insert vendors"
ON public.vendors
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE is_admin = true
));

CREATE POLICY "Only admins can update vendors"
ON public.vendors
FOR UPDATE
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE is_admin = true
));

-- Add is_admin column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
    
    -- Set the first user as admin (optional)
    UPDATE public.profiles 
    SET is_admin = true 
    WHERE id = (SELECT id FROM public.profiles ORDER BY created_at LIMIT 1);
  END IF;
END $$;
