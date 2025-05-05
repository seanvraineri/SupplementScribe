import { supabase } from './supabase';
import { generateSupplementRecommendations } from './openai-service';

// Types for our recommendation engine
export type WellnessProfile = {
  id: string;
  user_id: string;
  age: number;
  gender: string;
  wellness_sensitivities: string;
  wellness_considerations: string;
  monthly_budget: number;
};

export type SupplementRecommendation = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  description: string;
  benefits: string[];
  price: number;
  priority: 'high' | 'medium' | 'low';
  evidence_level: 'strong' | 'moderate' | 'preliminary';
  wellness_goals: string[];
  contraindications: string[];
  purchase_link?: string;
};

// Base supplement database with evidence-based information
const supplementDatabase: SupplementRecommendation[] = [
  {
    id: 'vitamin-d',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    frequency: 'Daily',
    description: 'Supports bone health, immune function, and mood regulation',
    benefits: ['Bone health', 'Immune support', 'Mood regulation'],
    price: 15,
    priority: 'high',
    evidence_level: 'strong',
    wellness_goals: ['general wellness', 'immune support', 'bone health'],
    contraindications: ['hypercalcemia']
  },
  {
    id: 'magnesium',
    name: 'Magnesium Glycinate',
    dosage: '400mg',
    frequency: 'Daily',
    description: 'Supports relaxation, sleep quality, and muscle recovery',
    benefits: ['Sleep quality', 'Muscle recovery', 'Stress management'],
    price: 18,
    priority: 'high',
    evidence_level: 'strong',
    wellness_goals: ['sleep', 'stress management', 'muscle recovery'],
    contraindications: ['severe kidney disease']
  },
  {
    id: 'omega3',
    name: 'Omega-3 Fish Oil',
    dosage: '1000mg',
    frequency: 'Daily',
    description: 'Supports heart health, brain function, and reduces inflammation',
    benefits: ['Heart health', 'Brain function', 'Joint comfort'],
    price: 25,
    priority: 'high',
    evidence_level: 'strong',
    wellness_goals: ['heart health', 'brain function', 'joint health'],
    contraindications: ['fish allergy', 'bleeding disorders']
  },
  {
    id: 'probiotics',
    name: 'Probiotic Complex',
    dosage: '10 Billion CFU',
    frequency: 'Daily',
    description: 'Supports gut health, digestion, and immune function',
    benefits: ['Gut health', 'Immune support', 'Digestive comfort'],
    price: 28,
    priority: 'medium',
    evidence_level: 'moderate',
    wellness_goals: ['digestive health', 'immune support'],
    contraindications: ['severe immunocompromise']
  },
  {
    id: 'zinc',
    name: 'Zinc Picolinate',
    dosage: '15mg',
    frequency: 'Daily',
    description: 'Supports immune function, skin health, and wound healing',
    benefits: ['Immune support', 'Skin health', 'Wound healing'],
    price: 12,
    priority: 'medium',
    evidence_level: 'moderate',
    wellness_goals: ['immune support', 'skin health'],
    contraindications: ['copper deficiency']
  },
  {
    id: 'vitamin-c',
    name: 'Vitamin C',
    dosage: '500mg',
    frequency: 'Daily',
    description: 'Supports immune function, collagen production, and antioxidant protection',
    benefits: ['Immune support', 'Skin health', 'Antioxidant protection'],
    price: 14,
    priority: 'medium',
    evidence_level: 'strong',
    wellness_goals: ['immune support', 'skin health', 'general wellness'],
    contraindications: ['history of kidney stones']
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    dosage: '600mg',
    frequency: 'Daily',
    description: 'Supports stress management, energy levels, and overall vitality',
    benefits: ['Stress management', 'Energy', 'Sleep quality'],
    price: 22,
    priority: 'medium',
    evidence_level: 'moderate',
    wellness_goals: ['stress management', 'energy', 'sleep'],
    contraindications: ['autoimmune conditions', 'pregnancy']
  },
  {
    id: 'coq10',
    name: 'CoQ10',
    dosage: '100mg',
    frequency: 'Daily',
    description: 'Supports heart health, energy production, and cellular protection',
    benefits: ['Heart health', 'Energy production', 'Antioxidant protection'],
    price: 30,
    priority: 'low',
    evidence_level: 'moderate',
    wellness_goals: ['heart health', 'energy', 'general wellness'],
    contraindications: ['blood thinning medications']
  }
];

/**
 * Generate personalized supplement recommendations based on wellness profile
 * 
 * This uses OpenAI when available, with a fallback to a rule-based approach
 * to match supplements to user needs while respecting budget constraints
 * and wellness considerations
 */
export async function generateRecommendations(
  profile: WellnessProfile
): Promise<SupplementRecommendation[]> {
  try {
    // First try to use OpenAI for personalized recommendations
    if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      console.log('Using OpenAI for supplement recommendations');
      const openAiRecommendations = await generateSupplementRecommendations(profile);
      
      // Validate and format the OpenAI response
      if (Array.isArray(openAiRecommendations) && openAiRecommendations.length > 0) {
        // Ensure each recommendation has all required fields
        const validRecommendations = openAiRecommendations.map(rec => {
          return {
            id: rec.id || `openai-${Math.random().toString(36).substring(2, 9)}`,
            name: rec.name,
            description: rec.description,
            dosage: rec.dosage,
            frequency: rec.frequency,
            price: rec.price || 0,
            priority: rec.priority || 'medium',
            evidence_level: rec.evidence_level || 'moderate',
            benefits: Array.isArray(rec.benefits) ? rec.benefits : [rec.benefits || 'General wellness'],
            contraindications: Array.isArray(rec.contraindications) ? rec.contraindications : [],
            wellness_goals: Array.isArray(rec.wellness_goals) ? rec.wellness_goals : [],
            purchase_link: rec.purchase_link || '',
            score: 0 // Will be calculated below
          } as SupplementRecommendation;
        });
        
        return validRecommendations;
      }
    }
  } catch (error) {
    console.error('Error using OpenAI for recommendations, falling back to rule-based approach:', error);
    // Continue to rule-based approach
  }
  
  console.log('Using rule-based approach for supplement recommendations');
  
  // Parse wellness considerations and sensitivities
  const considerations = profile.wellness_considerations
    ? (Array.isArray(profile.wellness_considerations) 
        ? profile.wellness_considerations 
        : profile.wellness_considerations.toString().split(',').map(s => s.trim()))
    : [];
    
  const sensitivities = profile.wellness_sensitivities
    ? (Array.isArray(profile.wellness_sensitivities) 
        ? profile.wellness_sensitivities 
        : profile.wellness_sensitivities.toString().split(',').map(s => s.trim()))
    : [];
  
  // Filter out supplements with contraindications
  let eligibleSupplements = supplementDatabase.filter(supplement => {
    // Check for contraindications based on sensitivities
    for (const sensitivity of sensitivities) {
      const sensitivityStr = sensitivity.toString().toLowerCase();
      if (supplement.contraindications.some(c => 
        sensitivityStr.includes(c.toLowerCase()) || c.toLowerCase().includes(sensitivityStr)
      )) {
        return false;
      }
    }
    return true;
  });
  
  // Score supplements based on relevance to wellness considerations
  const scoredSupplements = eligibleSupplements.map(supplement => {
    let score = 0;
    
    // Base score from evidence level
    if (supplement.evidence_level === 'strong') score += 3;
    else if (supplement.evidence_level === 'moderate') score += 2;
    else score += 1;
    
    // Score based on priority
    if (supplement.priority === 'high') score += 3;
    else if (supplement.priority === 'medium') score += 2;
    else score += 1;
    
    // Score based on matching wellness considerations
    for (const consideration of considerations) {
      const considerationStr = consideration.toString().toLowerCase();
      if (supplement.wellness_goals.some(goal => 
        considerationStr.includes(goal.toLowerCase()) || goal.toLowerCase().includes(considerationStr)
      )) {
        score += 2;
      }
    }
    
    // Age-based adjustments
    if (profile.age > 50 && ['vitamin-d', 'magnesium', 'omega3'].includes(supplement.id)) {
      score += 1;
    }
    
    // Gender-based adjustments (simplified)
    if (profile.gender.toLowerCase() === 'female' && supplement.id === 'iron') {
      score += 1;
    }
    
    return {
      ...supplement,
      score
    };
  });
  
  // Sort by score (descending)
  scoredSupplements.sort((a, b) => b.score - a.score);
  
  // Fit within budget constraints
  const recommendations: SupplementRecommendation[] = [];
  let totalCost = 0;
  const monthlyBudget = profile.monthly_budget || 100;
  
  for (const supplement of scoredSupplements) {
    if (totalCost + supplement.price <= monthlyBudget) {
      recommendations.push(supplement);
      totalCost += supplement.price;
    }
    
    // Stop once we have enough recommendations
    if (recommendations.length >= 5) break;
  }
  
  return recommendations;
}

/**
 * Save recommendations to the database
 */
export async function saveRecommendations(
  userId: string,
  recommendations: SupplementRecommendation[]
): Promise<void> {
  try {
    // First, create a supplement plan
    const { data: planData, error: planError } = await supabase
      .from('supplement_plans')
      .insert({
        health_profile_id: userId,
        total_cost: recommendations.reduce((sum, rec) => sum + rec.price, 0),
        ai_analysis_summary: `Personalized wellness plan with ${recommendations.length} supplements`,
        is_current: true
      })
      .select('id')
      .single();
    
    if (planError) throw planError;
    
    // Then, insert each supplement recommendation
    const { error: supplementsError } = await supabase
      .from('supplement_recommendations')
      .insert(
        recommendations.map(rec => ({
          supplement_plan_id: planData.id,
          name: rec.name,
          description: rec.description,
          dosage: rec.dosage,
          frequency: rec.frequency,
          price: rec.price,
          priority: rec.priority,
          evidence_level: rec.evidence_level,
          benefits: rec.benefits.join(', '),
          created_at: new Date().toISOString()
        }))
      );
    
    if (supplementsError) throw supplementsError;
    
    // Just return without a value since we're using Promise<void>
    return;
  } catch (error) {
    console.error('Error saving recommendations:', error);
    // Don't return anything for void functions
    return;
  }
}
