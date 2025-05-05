-- Create tables for SupplementScribe

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  full_name TEXT,
  avatar_url TEXT
);

-- Health profiles table
CREATE TABLE IF NOT EXISTS public.health_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  age INTEGER,
  gender TEXT,
  height NUMERIC,
  weight NUMERIC,
  allergies TEXT,
  medical_conditions TEXT,
  monthly_budget NUMERIC
);

-- Uploaded files table
CREATE TABLE IF NOT EXISTS public.health_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  health_profile_id UUID REFERENCES public.health_profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL
);

-- Supplement recommendations table
CREATE TABLE IF NOT EXISTS public.supplement_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  health_profile_id UUID REFERENCES public.health_profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  total_cost NUMERIC NOT NULL,
  ai_analysis_summary TEXT,
  is_current BOOLEAN DEFAULT true
);

-- Individual supplements in a plan
CREATE TABLE IF NOT EXISTS public.supplements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES public.supplement_plans(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  description TEXT,
  benefits_text TEXT,
  price NUMERIC NOT NULL,
  purchase_link TEXT
);

-- Research studies supporting supplement recommendations
CREATE TABLE IF NOT EXISTS public.research_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplement_id UUID REFERENCES public.supplements(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  authors TEXT,
  journal TEXT,
  publication_date DATE,
  link TEXT NOT NULL,
  summary TEXT
);

-- Chat history
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL
);

-- RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplement_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- User can only access their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Health profiles policies
CREATE POLICY "Users can view own health profiles" ON public.health_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health profiles" ON public.health_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health profiles" ON public.health_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Similar policies would be created for all other tables 