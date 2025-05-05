-- Enable Row Level Security (RLS) on tables flagged by security advisor
-- This script addresses the security errors for tables without RLS enabled
-- Simplified version that doesn't require a profiles table

-- 1. Enable RLS on interaction_checks table
ALTER TABLE public.interaction_checks ENABLE ROW LEVEL SECURITY;

-- 2. Enable RLS on supplement_vendors table
ALTER TABLE public.supplement_vendors ENABLE ROW LEVEL SECURITY;

-- 3. Enable RLS on vendors table
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for each table
-- These policies define who can perform which operations on each table

-- interaction_checks policies
-- Allow all authenticated users to view and modify interaction checks
CREATE POLICY "Authenticated users can view interaction checks"
ON public.interaction_checks
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert interaction checks"
ON public.interaction_checks
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update interaction checks"
ON public.interaction_checks
FOR UPDATE
USING (auth.role() = 'authenticated');

-- supplement_vendors policies
-- This is a reference table, so we'll allow all authenticated users to view
CREATE POLICY "Anyone can view supplement vendors"
ON public.supplement_vendors
FOR SELECT
USING (true);

-- Allow authenticated users to modify supplement vendors
CREATE POLICY "Authenticated users can insert supplement vendors"
ON public.supplement_vendors
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update supplement vendors"
ON public.supplement_vendors
FOR UPDATE
USING (auth.role() = 'authenticated');

-- vendors policies
-- This is a reference table, so we'll allow all authenticated users to view
CREATE POLICY "Anyone can view vendors"
ON public.vendors
FOR SELECT
USING (true);

-- Allow authenticated users to modify vendors
CREATE POLICY "Authenticated users can insert vendors"
ON public.vendors
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update vendors"
ON public.vendors
FOR UPDATE
USING (auth.role() = 'authenticated');
