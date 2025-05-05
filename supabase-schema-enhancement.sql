-- SupplementScribe Schema Enhancement Migration
-- This script adds new tables and fields to support advanced wellness recommendations
-- while maintaining HIPAA-free status by focusing on wellness terminology

-- 1. Create genetic_data table
CREATE TABLE IF NOT EXISTS genetic_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  snp_id VARCHAR NOT NULL,
  genotype VARCHAR NOT NULL,
  gene VARCHAR NOT NULL,
  impact_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for genetic_data
ALTER TABLE genetic_data ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'genetic_data' AND policyname = 'Users can view their own genetic data'
  ) THEN
    CREATE POLICY "Users can view their own genetic data"
      ON genetic_data FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'genetic_data' AND policyname = 'Users can insert their own genetic data'
  ) THEN
    CREATE POLICY "Users can insert their own genetic data"
      ON genetic_data FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'genetic_data' AND policyname = 'Users can update their own genetic data'
  ) THEN
    CREATE POLICY "Users can update their own genetic data"
      ON genetic_data FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'genetic_data' AND policyname = 'Users can delete their own genetic data'
  ) THEN
    CREATE POLICY "Users can delete their own genetic data"
      ON genetic_data FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- 2. Create research_studies table if it doesn't exist, or alter if it does
CREATE TABLE IF NOT EXISTS research_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  authors TEXT,
  publication_date DATE,
  journal TEXT,
  abstract TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add pmid field to research_studies if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'research_studies' AND column_name = 'pmid'
  ) THEN
    ALTER TABLE research_studies ADD COLUMN pmid VARCHAR;
  END IF;
END $$;

-- 3. Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  website TEXT,
  rating NUMERIC,
  certification TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create supplement_vendors linking table
CREATE TABLE IF NOT EXISTS supplement_vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplement_id UUID REFERENCES supplements(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  sku VARCHAR,
  vendor_price NUMERIC,
  direct_purchase_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create recommendation_logs table
CREATE TABLE IF NOT EXISTS recommendation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  supplement_plan_id UUID REFERENCES supplement_plans(id) ON DELETE SET NULL,
  viewed BOOLEAN DEFAULT FALSE,
  purchased BOOLEAN DEFAULT FALSE,
  feedback_score INTEGER,
  feedback_notes TEXT
);

-- Add RLS policies for recommendation_logs
ALTER TABLE recommendation_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'recommendation_logs' AND policyname = 'Users can view their own recommendation logs'
  ) THEN
    CREATE POLICY "Users can view their own recommendation logs"
      ON recommendation_logs FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'recommendation_logs' AND policyname = 'Users can insert their own recommendation logs'
  ) THEN
    CREATE POLICY "Users can insert their own recommendation logs"
      ON recommendation_logs FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'recommendation_logs' AND policyname = 'Users can update their own recommendation logs'
  ) THEN
    CREATE POLICY "Users can update their own recommendation logs"
      ON recommendation_logs FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'recommendation_logs' AND policyname = 'Users can delete their own recommendation logs'
  ) THEN
    CREATE POLICY "Users can delete their own recommendation logs"
      ON recommendation_logs FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- 6. Create biomarker_results table
CREATE TABLE IF NOT EXISTS biomarker_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  biomarker_name TEXT NOT NULL,
  biomarker_value NUMERIC NOT NULL,
  measurement_units TEXT,
  measurement_date DATE NOT NULL,
  normal_range_low NUMERIC,
  normal_range_high NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for biomarker_results
ALTER TABLE biomarker_results ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'biomarker_results' AND policyname = 'Users can view their own biomarker results'
  ) THEN
    CREATE POLICY "Users can view their own biomarker results"
      ON biomarker_results FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'biomarker_results' AND policyname = 'Users can insert their own biomarker results'
  ) THEN
    CREATE POLICY "Users can insert their own biomarker results"
      ON biomarker_results FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'biomarker_results' AND policyname = 'Users can update their own biomarker results'
  ) THEN
    CREATE POLICY "Users can update their own biomarker results"
      ON biomarker_results FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'biomarker_results' AND policyname = 'Users can delete their own biomarker results'
  ) THEN
    CREATE POLICY "Users can delete their own biomarker results"
      ON biomarker_results FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- 7. Create interaction_checks table
CREATE TABLE IF NOT EXISTS interaction_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplement_id UUID REFERENCES supplements(id) ON DELETE CASCADE,
  medication_or_condition TEXT NOT NULL,
  interaction_description TEXT NOT NULL,
  severity_level TEXT CHECK (severity_level IN ('Low', 'Medium', 'High')),
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create llm_prompt_logs table
CREATE TABLE IF NOT EXISTS llm_prompt_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT,
  prompt_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  model_used TEXT,
  response_quality_score INTEGER
);

-- Add RLS policies for llm_prompt_logs
ALTER TABLE llm_prompt_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'llm_prompt_logs' AND policyname = 'Users can view their own LLM prompt logs'
  ) THEN
    CREATE POLICY "Users can view their own LLM prompt logs"
      ON llm_prompt_logs FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'llm_prompt_logs' AND policyname = 'Users can insert their own LLM prompt logs'
  ) THEN
    CREATE POLICY "Users can insert their own LLM prompt logs"
      ON llm_prompt_logs FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'llm_prompt_logs' AND policyname = 'Users can update their own LLM prompt logs'
  ) THEN
    CREATE POLICY "Users can update their own LLM prompt logs"
      ON llm_prompt_logs FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'llm_prompt_logs' AND policyname = 'Users can delete their own LLM prompt logs'
  ) THEN
    CREATE POLICY "Users can delete their own LLM prompt logs"
      ON llm_prompt_logs FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_genetic_data_user_id ON genetic_data(user_id);
CREATE INDEX IF NOT EXISTS idx_genetic_data_snp_id ON genetic_data(snp_id);
CREATE INDEX IF NOT EXISTS idx_research_studies_pmid ON research_studies(pmid);
CREATE INDEX IF NOT EXISTS idx_supplement_vendors_supplement_id ON supplement_vendors(supplement_id);
CREATE INDEX IF NOT EXISTS idx_supplement_vendors_vendor_id ON supplement_vendors(vendor_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_user_id ON recommendation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_supplement_plan_id ON recommendation_logs(supplement_plan_id);
CREATE INDEX IF NOT EXISTS idx_biomarker_results_user_id ON biomarker_results(user_id);
CREATE INDEX IF NOT EXISTS idx_biomarker_results_biomarker_name ON biomarker_results(biomarker_name);
CREATE INDEX IF NOT EXISTS idx_interaction_checks_supplement_id ON interaction_checks(supplement_id);
CREATE INDEX IF NOT EXISTS idx_llm_prompt_logs_user_id ON llm_prompt_logs(user_id);

-- Add comments to tables for documentation
COMMENT ON TABLE genetic_data IS 'Stores users genetic SNP variants for personalized wellness recommendations';
COMMENT ON TABLE research_studies IS 'Scientific research studies supporting supplement recommendations';
COMMENT ON TABLE vendors IS 'Supplement vendors with quality and certification information';
COMMENT ON TABLE supplement_vendors IS 'Links supplements to vendors with pricing and purchase information';
COMMENT ON TABLE recommendation_logs IS 'Tracks user interaction with supplement recommendations';
COMMENT ON TABLE biomarker_results IS 'Stores user biomarker test results for personalized recommendations';
COMMENT ON TABLE interaction_checks IS 'Identifies potential interactions between supplements and other factors';
COMMENT ON TABLE llm_prompt_logs IS 'Logs LLM prompts and responses for recommendation improvement';
