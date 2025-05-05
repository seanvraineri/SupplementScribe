/**
 * TypeScript type definitions for SupplementScribe database schema
 * These types reflect the enhanced database schema with wellness-focused terminology
 */

// User profile with wellness terminology (existing table with renamed fields)
export interface HealthProfile {
  id: string;
  user_id: string;
  age: number;
  gender: string;
  wellness_sensitivities: string; // Renamed from allergies
  wellness_considerations: string; // Renamed from medical_conditions
  monthly_budget: number;
  onboarding_completed: boolean;
  wellness_disclaimer_accepted: boolean;
  disclaimer_accepted_at: string | null;
  created_at: string;
  updated_at: string;
}

// Genetic data for personalized recommendations
export interface GeneticData {
  id: string;
  user_id: string;
  snp_id: string;
  genotype: string;
  gene: string;
  impact_summary: string | null;
  created_at: string;
}

// Research studies with PubMed integration
export interface ResearchStudy {
  id: string;
  title: string;
  authors: string | null;
  publication_date: string | null;
  journal: string | null;
  abstract: string | null;
  url: string | null;
  pmid: string | null; // PubMed ID for API integration
  created_at: string;
  updated_at: string;
}

// Supplement vendors
export interface Vendor {
  id: string;
  name: string;
  website: string | null;
  rating: number | null;
  certification: string | null;
  created_at: string;
  updated_at: string;
}

// Supplement-vendor relationships
export interface SupplementVendor {
  id: string;
  supplement_id: string;
  vendor_id: string;
  sku: string | null;
  vendor_price: number | null;
  direct_purchase_link: string | null;
  created_at: string;
  updated_at: string;
}

// Supplement recommendations
export interface SupplementPlan {
  id: string;
  health_profile_id: string;
  total_cost: number;
  ai_analysis_summary: string | null;
  is_current: boolean;
  created_at: string;
}

export interface SupplementRecommendation {
  id: string;
  supplement_plan_id: string;
  name: string;
  description: string;
  dosage: string;
  frequency: string;
  price: number;
  priority: 'high' | 'medium' | 'low';
  evidence_level: 'strong' | 'moderate' | 'limited';
  benefits: string;
  created_at: string;
}

// Recommendation tracking
export interface RecommendationLog {
  id: string;
  user_id: string;
  recommendation_date: string;
  supplement_plan_id: string | null;
  viewed: boolean;
  purchased: boolean;
  feedback_score: number | null;
  feedback_notes: string | null;
}

// Biomarker results
export interface BiomarkerResult {
  id: string;
  user_id: string;
  biomarker_name: string;
  biomarker_value: number;
  measurement_units: string | null;
  measurement_date: string;
  normal_range_low: number | null;
  normal_range_high: number | null;
  created_at: string;
}

// Supplement interaction checks
export interface InteractionCheck {
  id: string;
  supplement_id: string;
  medication_or_condition: string;
  interaction_description: string;
  severity_level: 'Low' | 'Medium' | 'High';
  source: string | null;
  created_at: string;
  updated_at: string;
}

// LLM prompt logs
export interface LlmPromptLog {
  id: string;
  user_id: string;
  prompt: string;
  response: string | null;
  prompt_date: string;
  model_used: string | null;
  response_quality_score: number | null;
}

// Database schema namespace
export namespace Database {
  export interface Schema {
    health_profiles: HealthProfile;
    genetic_data: GeneticData;
    research_studies: ResearchStudy;
    vendors: Vendor;
    supplement_vendors: SupplementVendor;
    supplement_plans: SupplementPlan;
    supplement_recommendations: SupplementRecommendation;
    recommendation_logs: RecommendationLog;
    biomarker_results: BiomarkerResult;
    interaction_checks: InteractionCheck;
    llm_prompt_logs: LlmPromptLog;
  }
}
