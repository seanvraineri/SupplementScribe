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
CREATE POLICY "Users can view their own interaction checks"
ON public.interaction_checks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only authenticated users can insert interaction checks"
ON public.interaction_checks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- supplement_vendors policies
-- This is a reference table, so we'll allow all authenticated users to view
CREATE POLICY "Anyone can view supplement vendors"
ON public.supplement_vendors
FOR SELECT
USING (true);

-- Only allow admins to modify supplement vendors (assuming admin role exists)
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

-- Only allow admins to modify vendors (assuming admin role exists)
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

-- Note: If the admin role doesn't exist yet, you may need to add an is_admin column to your profiles table
-- ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
