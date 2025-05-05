-- Add onboarding_completed column to health_profiles table
ALTER TABLE public.health_profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Add wellness terminology columns
ALTER TABLE public.health_profiles ADD COLUMN IF NOT EXISTS wellness_sensitivities TEXT;
ALTER TABLE public.health_profiles ADD COLUMN IF NOT EXISTS wellness_considerations TEXT;

-- Migrate data from medical terminology to wellness terminology
UPDATE public.health_profiles SET wellness_sensitivities = allergies WHERE wellness_sensitivities IS NULL;
UPDATE public.health_profiles SET wellness_considerations = medical_conditions WHERE wellness_considerations IS NULL;

-- Update existing records to have onboarding_completed = false
UPDATE public.health_profiles SET onboarding_completed = false WHERE onboarding_completed IS NULL;

-- Add disclaimer acceptance tracking
ALTER TABLE public.health_profiles ADD COLUMN IF NOT EXISTS wellness_disclaimer_accepted BOOLEAN DEFAULT false;
ALTER TABLE public.health_profiles ADD COLUMN IF NOT EXISTS disclaimer_accepted_at TIMESTAMP WITH TIME ZONE;
