/**
 * SupplementScribe Health Score Calculator
 * 
 * Calculates a unified 0-100 health score based on biomarkers, genetics, and lifestyle factors.
 * The score is weighted as follows:
 * - Biomarker Health: 50%
 * - Genetic Resilience: 20%
 * - Lifestyle Alignment: 30%
 */

import { supabase } from './supabase';

// Types for health score calculation
export interface HealthScoreResult {
  totalScore: number;
  biomarkerScore: number;
  geneticScore: number;
  lifestyleScore: number;
  biomarkerDetails: {
    normalCount: number;
    totalCount: number;
    markers: Array<{
      name: string;
      value: number;
      status: 'low' | 'normal' | 'high';
      optimalRange: { min: number | null; max: number | null };
    }>;
  };
  geneticDetails: {
    actionableVariants: number;
    protectiveVariants: number;
    totalVariants: number;
    variants: Array<{
      gene: string;
      variant: string;
      impact: number; // -1 to +1 scale
    }>;
  };
  lifestyleDetails: {
    sleepScore: number;
    dietScore: number;
    exerciseScore: number;
    stressScore: number;
    otherFactors: Record<string, number>;
  };
  improvementTips: string[];
}

/**
 * Calculate a user's health score based on their biomarkers, genetics, and lifestyle
 * 
 * @param userId The user ID to calculate the health score for
 * @returns A promise that resolves to the health score result
 */
export async function calculateHealthScore(userId: string): Promise<HealthScoreResult> {
  // Initialize the result object
  const result: HealthScoreResult = {
    totalScore: 0,
    biomarkerScore: 0,
    geneticScore: 0,
    lifestyleScore: 0,
    biomarkerDetails: {
      normalCount: 0,
      totalCount: 0,
      markers: []
    },
    geneticDetails: {
      actionableVariants: 0,
      protectiveVariants: 0,
      totalVariants: 0,
      variants: []
    },
    lifestyleDetails: {
      sleepScore: 0,
      dietScore: 0,
      exerciseScore: 0,
      stressScore: 0,
      otherFactors: {}
    },
    improvementTips: []
  };

  try {
    // 1. Calculate Biomarker Score (50% of total)
    await calculateBiomarkerScore(userId, result);
    
    // 2. Calculate Genetic Score (20% of total)
    await calculateGeneticScore(userId, result);
    
    // 3. Calculate Lifestyle Score (30% of total)
    await calculateLifestyleScore(userId, result);
    
    // 4. Calculate Total Score (weighted sum)
    result.totalScore = Math.round(
      (0.5 * result.biomarkerScore) + 
      (0.2 * result.geneticScore) + 
      (0.3 * result.lifestyleScore)
    );
    
    // 5. Generate Improvement Tips
    generateImprovementTips(result);
    
    // 6. Save the health score to the database
    await saveHealthScore(userId, result);
    
    return result;
  } catch (error) {
    console.error('Error calculating health score:', error);
    throw error;
  }
}

/**
 * Calculate the biomarker score based on lab results
 * 
 * @param userId The user ID to calculate for
 * @param result The health score result object to update
 */
async function calculateBiomarkerScore(userId: string, result: HealthScoreResult): Promise<void> {
  // Fetch biomarker results from the database
  const { data: biomarkers, error } = await supabase
    .from('biomarker_results')
    .select('*')
    .eq('user_id', userId)
    .order('measurement_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching biomarker results:', error);
    throw error;
  }
  
  // Define biomarker type
  interface Biomarker {
    biomarker_name: string;
    biomarker_value: number;
    measurement_date: string;
    normal_range_low: number | null;
    normal_range_high: number | null;
  }
  
  // Group by biomarker name and take the most recent measurement
  const latestBiomarkers = (biomarkers as Biomarker[]).reduce((acc: Record<string, Biomarker>, curr: Biomarker) => {
    if (!acc[curr.biomarker_name] || 
        new Date(curr.measurement_date) > new Date(acc[curr.biomarker_name].measurement_date)) {
      acc[curr.biomarker_name] = curr;
    }
    return acc;
  }, {});
  
  // Convert to array
  const biomarkerArray = Object.values(latestBiomarkers);
  
  // Count normal biomarkers
  let normalCount = 0;
  
  // Process each biomarker
  result.biomarkerDetails.markers = biomarkerArray.map((biomarker: Biomarker) => {
    const isNormal = (
      (biomarker.normal_range_low === null || biomarker.biomarker_value >= biomarker.normal_range_low) &&
      (biomarker.normal_range_high === null || biomarker.biomarker_value <= biomarker.normal_range_high)
    );
    
    if (isNormal) normalCount++;
    
    let status: 'low' | 'normal' | 'high' = 'normal';
    if (biomarker.normal_range_low !== null && biomarker.biomarker_value < biomarker.normal_range_low) {
      status = 'low';
    } else if (biomarker.normal_range_high !== null && biomarker.biomarker_value > biomarker.normal_range_high) {
      status = 'high';
    }
    
    return {
      name: biomarker.biomarker_name,
      value: biomarker.biomarker_value,
      status,
      optimalRange: {
        min: biomarker.normal_range_low,
        max: biomarker.normal_range_high
      }
    };
  });
  
  // Update biomarker details
  result.biomarkerDetails.normalCount = normalCount;
  result.biomarkerDetails.totalCount = biomarkerArray.length;
  
  // Calculate biomarker score (0-100)
  if (biomarkerArray.length > 0) {
    result.biomarkerScore = Math.round((normalCount / biomarkerArray.length) * 100);
  } else {
    // If no biomarkers, default to 50
    result.biomarkerScore = 50;
  }
}

/**
 * Calculate the genetic score based on genetic variants
 * 
 * @param userId The user ID to calculate for
 * @param result The health score result object to update
 */
async function calculateGeneticScore(userId: string, result: HealthScoreResult): Promise<void> {
  // Define genetic data type
  interface GeneticVariant {
    gene: string;
    genotype: string;
    user_id: string;
  }

  // Fetch genetic data from the database
  const { data: geneticData, error } = await supabase
    .from('genetic_data')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching genetic data:', error);
    throw error;
  }
  
  if (geneticData.length === 0) {
    // No genetic data available, default to 50
    result.geneticScore = 50;
    return;
  }
  
  // Define impact weights for common variants
  // This is a simplified model - in a real app, you'd have a more comprehensive database
  const variantImpacts: Record<string, Record<string, number>> = {
    'MTHFR': { 'C677T': -0.5, 'A1298C': -0.3 },
    'APOE': { 'ε4': -0.8, 'ε2': 0.3 },
    'COMT': { 'V158M': -0.2 },
    'VDR': { 'FokI': -0.3, 'BsmI': -0.2 },
    // Add more variants as needed
  };
  
  let totalImpact = 0;
  let maxPossibleImpact = 0;
  let actionableVariants = 0;
  let protectiveVariants = 0;
  
  // Process each genetic variant
  result.geneticDetails.variants = (geneticData as GeneticVariant[]).map(gene => {
    // Get the impact value for this variant, default to 0 if not found
    const impact = variantImpacts[gene.gene]?.[gene.genotype] || 0;
    
    // Count actionable and protective variants
    if (impact < 0) actionableVariants++;
    if (impact > 0) protectiveVariants++;
    
    // Add to total impact
    totalImpact += impact;
    
    // Add to max possible impact (absolute value)
    maxPossibleImpact += Math.abs(impact);
    
    return {
      gene: gene.gene,
      variant: gene.genotype,
      impact
    };
  });
  
  // Update genetic details
  result.geneticDetails.actionableVariants = actionableVariants;
  result.geneticDetails.protectiveVariants = protectiveVariants;
  result.geneticDetails.totalVariants = geneticData.length;
  
  // Calculate genetic score (0-100)
  // Normalize the score: (actual + max) / (2 * max) to get 0-1 range, then multiply by 100
  if (maxPossibleImpact > 0) {
    const normalizedScore = (totalImpact + maxPossibleImpact) / (2 * maxPossibleImpact);
    result.geneticScore = Math.round(normalizedScore * 100);
  } else {
    // If no impact data, default to 50
    result.geneticScore = 50;
  }
}

/**
 * Calculate the lifestyle score based on user profile and questionnaire
 * 
 * @param userId The user ID to calculate for
 * @param result The health score result object to update
 */
async function calculateLifestyleScore(userId: string, result: HealthScoreResult): Promise<void> {
  // Fetch user profile from the database
  const { data: profile, error } = await supabase
    .from('health_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching health profile:', error);
    throw error;
  }
  
  // Calculate sleep score (0-100)
  let sleepScore = 50; // Default
  if (profile.sleep_hours) {
    // Optimal sleep is 7-9 hours
    const sleepHours = parseFloat(profile.sleep_hours);
    if (sleepHours >= 7 && sleepHours <= 9) {
      sleepScore = 100;
    } else if (sleepHours >= 6 && sleepHours < 7) {
      sleepScore = 75;
    } else if (sleepHours > 9 && sleepHours <= 10) {
      sleepScore = 75;
    } else if (sleepHours >= 5 && sleepHours < 6) {
      sleepScore = 50;
    } else if (sleepHours > 10) {
      sleepScore = 50;
    } else {
      sleepScore = 25;
    }
  }
  
  // Calculate diet score (0-100)
  let dietScore = 50; // Default
  if (profile.dietary_pattern) {
    // Score based on dietary pattern
    const dietScores: Record<string, number> = {
      'mediterranean': 90,
      'vegetarian': 80,
      'vegan': 75,
      'paleo': 70,
      'keto': 65,
      'balanced': 75,
      'standard american': 40,
      'fast food': 20
    };
    
    dietScore = dietScores[profile.dietary_pattern.toLowerCase()] || 50;
  }
  
  // Calculate exercise score (0-100)
  let exerciseScore = 50; // Default
  if (profile.activity_level) {
    // Score based on activity level
    const exerciseScores: Record<string, number> = {
      'sedentary': 20,
      'lightly active': 40,
      'moderately active': 70,
      'very active': 90,
      'athlete': 100
    };
    
    exerciseScore = exerciseScores[profile.activity_level.toLowerCase()] || 50;
  }
  
  // Calculate stress score (0-100)
  let stressScore = 50; // Default
  if (profile.stress_level) {
    // Score based on stress level (inverse relationship)
    const stressScores: Record<string, number> = {
      'very high': 10,
      'high': 30,
      'moderate': 50,
      'low': 80,
      'very low': 100
    };
    
    stressScore = stressScores[profile.stress_level.toLowerCase()] || 50;
  }
  
  // Additional factors
  const otherFactors: Record<string, number> = {};
  
  // Smoking status (inverse relationship)
  if (profile.smoking_status) {
    const smokingScores: Record<string, number> = {
      'current smoker': 0,
      'former smoker': 50,
      'never smoked': 100
    };
    
    otherFactors.smoking = smokingScores[profile.smoking_status.toLowerCase()] || 50;
  }
  
  // Alcohol consumption (inverse relationship)
  if (profile.alcohol_frequency) {
    const alcoholScores: Record<string, number> = {
      'daily': 20,
      'several times a week': 40,
      'once a week': 60,
      'occasionally': 80,
      'never': 100
    };
    
    otherFactors.alcohol = alcoholScores[profile.alcohol_frequency.toLowerCase()] || 50;
  }
  
  // Update lifestyle details
  result.lifestyleDetails.sleepScore = sleepScore;
  result.lifestyleDetails.dietScore = dietScore;
  result.lifestyleDetails.exerciseScore = exerciseScore;
  result.lifestyleDetails.stressScore = stressScore;
  result.lifestyleDetails.otherFactors = otherFactors;
  
  // Calculate overall lifestyle score (average of all factors)
  const scores = [
    sleepScore,
    dietScore,
    exerciseScore,
    stressScore,
    ...Object.values(otherFactors)
  ];
  
  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  result.lifestyleScore = Math.round(sum / scores.length);
}

/**
 * Generate improvement tips based on the health score results
 * 
 * @param result The health score result object to update
 */
function generateImprovementTips(result: HealthScoreResult): void {
  const tips: string[] = [];
  
  // Biomarker tips
  if (result.biomarkerScore < 70) {
    // Find the abnormal biomarkers
    const abnormalMarkers = result.biomarkerDetails.markers.filter(m => m.status !== 'normal');
    
    // Generate tips for each abnormal biomarker
    abnormalMarkers.forEach(marker => {
      if (marker.status === 'low') {
        switch (marker.name.toLowerCase()) {
          case 'vitamin d':
            tips.push('Your vitamin D levels are low. Consider spending more time outdoors and taking a vitamin D3 supplement.');
            break;
          case 'iron':
            tips.push('Your iron levels are low. Include more iron-rich foods like spinach, lentils, and grass-fed beef in your diet.');
            break;
          case 'b12':
            tips.push('Your vitamin B12 levels are low. Consider a methylcobalamin supplement or consuming more B12-rich foods.');
            break;
          default:
            tips.push(`Your ${marker.name} levels are low. Consult with a healthcare provider for personalized guidance.`);
        }
      } else if (marker.status === 'high') {
        switch (marker.name.toLowerCase()) {
          case 'glucose':
            tips.push('Your glucose levels are elevated. Consider reducing refined carbohydrates and increasing physical activity.');
            break;
          case 'cholesterol':
          case 'ldl':
            tips.push('Your cholesterol levels are elevated. Focus on consuming more fiber, omega-3 fatty acids, and plant sterols.');
            break;
          case 'homocysteine':
            tips.push('Your homocysteine levels are elevated. Consider B-complex vitamins, particularly folate, B6, and B12.');
            break;
          default:
            tips.push(`Your ${marker.name} levels are elevated. Consult with a healthcare provider for personalized guidance.`);
        }
      }
    });
  }
  
  // Genetic tips
  if (result.geneticScore < 70) {
    // Find variants with negative impact
    const negativeVariants = result.geneticDetails.variants.filter(v => v.impact < 0);
    
    // Generate tips for common genetic variants
    negativeVariants.forEach(variant => {
      switch (variant.gene) {
        case 'MTHFR':
          tips.push('Your MTHFR variant may affect folate metabolism. Consider methylfolate and methylcobalamin supplements.');
          break;
        case 'APOE':
          if (variant.variant === 'ε4') {
            tips.push('Your APOE variant may benefit from a Mediterranean diet rich in omega-3 fatty acids and antioxidants.');
          }
          break;
        case 'COMT':
          tips.push('Your COMT variant may affect stress response. Consider stress management techniques and magnesium supplements.');
          break;
        case 'VDR':
          tips.push('Your VDR variant may affect vitamin D metabolism. Consider higher vitamin D3 supplementation and regular testing.');
          break;
      }
    });
  }
  
  // Lifestyle tips
  if (result.lifestyleDetails.sleepScore < 70) {
    tips.push('Improve your sleep quality by maintaining a consistent sleep schedule and creating a relaxing bedtime routine.');
  }
  
  if (result.lifestyleDetails.dietScore < 70) {
    tips.push('Enhance your diet by increasing plant-based foods, healthy fats, and reducing processed foods and added sugars.');
  }
  
  if (result.lifestyleDetails.exerciseScore < 70) {
    tips.push('Boost your physical activity with a mix of cardio, strength training, and flexibility exercises throughout the week.');
  }
  
  if (result.lifestyleDetails.stressScore < 70) {
    tips.push('Manage stress through mindfulness practices, deep breathing exercises, and regular relaxation activities.');
  }
  
  if (result.lifestyleDetails.otherFactors.smoking < 100) {
    tips.push('Consider a smoking cessation program to improve your overall health and longevity.');
  }
  
  if (result.lifestyleDetails.otherFactors.alcohol < 70) {
    tips.push('Reduce alcohol consumption to improve sleep quality, liver health, and overall wellness.');
  }
  
  // Limit to top 5 tips if there are too many
  result.improvementTips = tips.slice(0, 5);
}

/**
 * Save the health score to the database
 * 
 * @param userId The user ID to save for
 * @param result The health score result to save
 */
async function saveHealthScore(userId: string, result: HealthScoreResult): Promise<void> {
  // Save the health score to the health_profiles table
  const { error } = await supabase
    .from('health_profiles')
    .update({
      health_score: result.totalScore,
      biomarker_score: result.biomarkerScore,
      genetic_score: result.geneticScore,
      lifestyle_score: result.lifestyleScore,
      health_score_details: {
        biomarkerDetails: result.biomarkerDetails,
        geneticDetails: result.geneticDetails,
        lifestyleDetails: result.lifestyleDetails,
        improvementTips: result.improvementTips
      },
      health_score_updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error saving health score:', error);
    throw error;
  }
}

/**
 * Get the latest health score for a user
 * 
 * @param userId The user ID to get the health score for
 * @returns A promise that resolves to the health score result or null if not found
 */
export async function getHealthScore(userId: string): Promise<HealthScoreResult | null> {
  // Fetch the health score from the database
  const { data, error } = await supabase
    .from('health_profiles')
    .select('health_score, biomarker_score, genetic_score, lifestyle_score, health_score_details, health_score_updated_at')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching health score:', error);
    return null;
  }
  
  if (!data || !data.health_score) {
    return null;
  }
  
  // Convert database record to HealthScoreResult
  return {
    totalScore: data.health_score,
    biomarkerScore: data.biomarker_score || 0,
    geneticScore: data.genetic_score || 0,
    lifestyleScore: data.lifestyle_score || 0,
    biomarkerDetails: data.health_score_details?.biomarkerDetails || {
      normalCount: 0,
      totalCount: 0,
      markers: []
    },
    geneticDetails: data.health_score_details?.geneticDetails || {
      actionableVariants: 0,
      protectiveVariants: 0,
      totalVariants: 0,
      variants: []
    },
    lifestyleDetails: data.health_score_details?.lifestyleDetails || {
      sleepScore: 0,
      dietScore: 0,
      exerciseScore: 0,
      stressScore: 0,
      otherFactors: {}
    },
    improvementTips: data.health_score_details?.improvementTips || []
  };
}
