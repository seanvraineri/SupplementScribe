import axios from 'axios';
import { supabase } from './supabase';
import { SupplementRecommendation } from '@/types/database';
import {
  profileBuilderPrompt,
  geneticParserPrompt,
  biomarkerParserPrompt,
  recommenderPrompt,
  contraCheckerPrompt,
  wellnessAnalyzerPrompt
} from './prompt-templates';

// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

// Default model to use (can be overridden in function calls)
const DEFAULT_MODEL = 'openai/gpt-4-turbo';

// Site information for proper attribution
const SITE_URL = 'https://supplementscribe.com';
const SITE_NAME = 'SupplementScribe';

/**
 * Interface for the wellness profile used to generate recommendations
 */
export interface WellnessProfile {
  id: string;
  user_id: string;
  age: number;
  gender: string;
  wellness_sensitivities: string[] | string;
  wellness_considerations: string[] | string;
  monthly_budget: number;
}

/**
 * Interface for the OpenRouter API response
 */
interface OpenRouterResponse {
  id: string;
  model: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    index: number;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Generate supplement recommendations using OpenRouter LLM
 * 
 * @param userId The user ID for logging purposes
 * @param profile The wellness profile to generate recommendations for
 * @param model Optional model override
 * @returns Array of supplement recommendations
 */
export async function generateRecommendations(
  userId: string,
  profile: WellnessProfile,
  model: string = DEFAULT_MODEL
): Promise<SupplementRecommendation[]> {
  // Format wellness considerations and sensitivities for the prompt
  const considerations = Array.isArray(profile.wellness_considerations)
    ? profile.wellness_considerations.join(', ')
    : profile.wellness_considerations;
    
  const sensitivities = Array.isArray(profile.wellness_sensitivities)
    ? profile.wellness_sensitivities.join(', ')
    : profile.wellness_sensitivities;

  // Construct the prompt for the LLM using the recommender template
  const prompt = `${recommenderPrompt}
  
  USER PROFILE:
  Age: ${profile.age}
  Gender: ${profile.gender}
  Wellness Considerations: ${considerations}
  Wellness Sensitivities: ${sensitivities}
  Monthly Budget: $${profile.monthly_budget}
  
  Based on this profile, provide a personalized supplement plan with up to 5 supplements, staying within the monthly budget of $${profile.monthly_budget}.`;

  // Variable to store the log ID for later updates
  let logId: string | null = null;

  try {
    // Log the prompt to the database
    const { data: logData, error: logError } = await supabase
      .from('llm_prompt_logs')
      .insert({
        user_id: userId,
        prompt: prompt,
        model_used: model,
      })
      .select('id')
      .single();

    if (logError) {
      console.error('Error logging prompt:', logError);
    } else if (logData) {
      logId = logData.id;
    }

    // Make the API request to OpenRouter
    const response = await axios.post<OpenRouterResponse>(
      OPENROUTER_API_URL,
      {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': SITE_URL,
          'X-Title': SITE_NAME,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the response content
    const responseContent = response.data.choices[0].message.content;
    
    // Update the log with the response
    if (logId) {
      await supabase
        .from('llm_prompt_logs')
        .update({
          response: responseContent,
          response_quality_score: 5, // Default score
        })
        .eq('id', logId);
    }

    // Parse the JSON response
    let recommendations: SupplementRecommendation[] = [];
    
    try {
      const parsedResponse = JSON.parse(responseContent);
      
      if (Array.isArray(parsedResponse)) {
        // Map the response to our SupplementRecommendation interface
        recommendations = parsedResponse.map((item, index) => ({
          id: item.id || `rec-${Date.now()}-${index}`,
          supplement_plan_id: '', // Will be set when saving to the database
          name: item.name,
          description: item.description,
          dosage: item.dosage,
          frequency: item.frequency,
          price: item.price,
          priority: item.priority,
          evidence_level: item.evidence_level,
          benefits: Array.isArray(item.benefits) ? item.benefits.join(', ') : item.benefits,
          created_at: new Date().toISOString(),
        }));
      }
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);
      throw new Error('Failed to parse recommendations from LLM response');
    }

    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    
    // Update the log with the error if possible
    if (logId) {
      await supabase
        .from('llm_prompt_logs')
        .update({
          response: `Error: ${error instanceof Error ? error.message : String(error)}`,
          response_quality_score: 1, // Low score for errors
        })
        .eq('id', logId);
    }
    
    throw error;
  }
}

/**
 * Save generated recommendations to the database
 * 
 * @param userId The user ID
 * @param recommendations Array of supplement recommendations
 * @returns The ID of the created supplement plan
 */
export async function saveRecommendations(
  userId: string,
  recommendations: SupplementRecommendation[]
): Promise<string> {
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
          ...rec,
          supplement_plan_id: planData.id
        }))
      );
    
    if (supplementsError) throw supplementsError;
    
    // Log the recommendation
    await supabase
      .from('recommendation_logs')
      .insert({
        user_id: userId,
        supplement_plan_id: planData.id,
        viewed: true
      });
    
    return planData.id;
  } catch (error) {
    console.error('Error saving recommendations:', error);
    throw error;
  }
}

/**
 * Generate a wellness analysis based on the user's profile
 * 
 * @param userId The user ID for logging purposes
 * @param profile The wellness profile to analyze
 * @param model Optional model override
 * @returns Wellness analysis object
 */
/**
 * Extract structured profile data from user-provided text
 * 
 * @param userId The user ID for logging purposes
 * @param rawText The raw text describing the user's profile
 * @param model Optional model override
 * @returns Structured profile data
 */
export async function extractProfileData(
  userId: string,
  rawText: string,
  model: string = DEFAULT_MODEL
) {
  // Construct the prompt using the profile builder template
  const prompt = `${profileBuilderPrompt}
  
  Raw text to process:
  ${rawText}
  
  Extract and validate the profile data from this text.`;

  // Variable to store the log ID for later updates
  let logId: string | null = null;

  try {
    // Log the prompt to the database
    const { data: logData, error: logError } = await supabase
      .from('llm_prompt_logs')
      .insert({
        user_id: userId,
        prompt: prompt,
        model_used: model,
        prompt_type: 'profile_builder'
      })
      .select('id')
      .single();

    if (logError) {
      console.error('Error logging prompt:', logError);
    } else if (logData) {
      logId = logData.id;
    }

    // Make the API request to OpenRouter
    const response = await axios.post<OpenRouterResponse>(
      OPENROUTER_API_URL,
      {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': SITE_URL,
          'X-Title': SITE_NAME,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the response content
    const responseContent = response.data.choices[0].message.content;
    
    // Update the log with the response
    if (logId) {
      await supabase
        .from('llm_prompt_logs')
        .update({
          response: responseContent,
          response_quality_score: 5, // Default score
        })
        .eq('id', logId);
    }

    // Parse the JSON response
    try {
      return JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);
      throw new Error('Failed to parse profile data from LLM response');
    }
  } catch (error) {
    console.error('Error extracting profile data:', error);
    
    // Update the log with the error if possible
    if (logId) {
      await supabase
        .from('llm_prompt_logs')
        .update({
          response: `Error: ${error instanceof Error ? error.message : String(error)}`,
          response_quality_score: 1, // Low score for errors
        })
        .eq('id', logId);
    }
    
    throw error;
  }
}

/**
 * Process genetic data and provide personalized supplement recommendations
 * 
 * @param userId The user ID for logging purposes
 * @param userProfile User profile with age, gender, and health goals
 * @param geneticVariants Array of genetic variants
 * @param model Optional model override
 * @returns Personalized supplement recommendations based on genetic variants
 */
export async function processGeneticData(
  userId: string,
  userProfile: {
    age: number | null,
    gender: string | null,
    health_goals: string[]
  },
  geneticVariants: Array<{gene: string, variant: string}>,
  model: string = DEFAULT_MODEL
) {
  // Construct the prompt using the genetic parser template
  const prompt = `${geneticParserPrompt}
  
  INPUT:
  ${JSON.stringify({
    user_profile: userProfile,
    genetic_variants: geneticVariants
  })}
  
  Analyze these genetic variants and provide personalized supplement recommendations.`;

  // Variable to store the log ID for later updates
  let logId: string | null = null;

  try {
    // Log the prompt
    const { data: logData, error: logError } = await supabase
      .from('llm_prompt_logs')
      .insert({
        user_id: userId,
        prompt: prompt,
        model: model,
        service: 'genetic_parser',
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (logError) {
      console.error('Error logging prompt:', logError);
    } else {
      logId = logData.id;
    }

    // Make the API call to OpenRouter
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`
        }
      }
    );

    // Extract the response content
    const responseContent = response.data.choices[0].message.content;

    // Update the log with the response
    if (logId) {
      await supabase
        .from('llm_prompt_logs')
        .update({
          response: responseContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', logId);
    }

    // Parse the response as JSON
    // The response should be a JSON array of supplement recommendations
    try {
      // Find JSON in the response - using a more compatible regex approach
      const jsonMatch = responseContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const recommendations = JSON.parse(jsonStr) as Array<{
          gene: string;
          variant: string;
          supplement: string | null;
          dosage: string | null;
          frequency: string | null;
          rationale: string;
        }>;
        
        // Save the recommendations to the database
        for (const rec of recommendations) {
          if (rec.supplement) {
            await supabase
              .from('recommendation_logs')
              .insert({
                user_id: userId,
                source: 'genetic',
                supplement_name: rec.supplement,
                dosage: rec.dosage,
                frequency: rec.frequency,
                rationale: rec.rationale,
                created_at: new Date().toISOString()
              });
          }
        }
        
        return recommendations;
      } else {
        // If no JSON array is found, try to parse the entire response
        return JSON.parse(responseContent);
      }
    } catch (parseError) {
      console.error('Error parsing genetic data response:', parseError);
      throw new Error('Failed to parse genetic data response');
    }
  } catch (error) {
    console.error('Error processing genetic data:', error);

    // Update the log with the error
    if (logId) {
      await supabase
        .from('llm_prompt_logs')
        .update({
          error: error instanceof Error ? error.message : String(error),
          updated_at: new Date().toISOString()
        })
        .eq('id', logId);
    }

    throw error;
  }
}

/**
 * Process biomarker test results to flag values as low, normal, or high
 * 
 * @param userId The user ID for logging purposes
 * @param testResults Array of biomarker test results
 * @param model Optional model override
 * @returns Flagged biomarker test results
 */
export async function processBiomarkerResults(
  userId: string,
  testResults: Array<{test_name: string, test_value: number, units: string, reference_range: string}>,
  model: string = DEFAULT_MODEL
) {
  // Construct the prompt using the biomarker parser template
  const prompt = `${biomarkerParserPrompt}
  
  Test results to process:
  ${JSON.stringify({results: testResults})}
  
  Flag these test results as low, normal, or high.`;

  // Variable to store the log ID for later updates
  let logId: string | null = null;

  try {
    // Log the prompt to the database
    const { data: logData, error: logError } = await supabase
      .from('llm_prompt_logs')
      .insert({
        user_id: userId,
        prompt: prompt,
        model_used: model,
        prompt_type: 'biomarker_parser'
      })
      .select('id')
      .single();

    if (logError) {
      console.error('Error logging prompt:', logError);
    } else if (logData) {
      logId = logData.id;
    }

    // Make the API request to OpenRouter
    const response = await axios.post<OpenRouterResponse>(
      OPENROUTER_API_URL,
      {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': SITE_URL,
          'X-Title': SITE_NAME,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the response content
    const responseContent = response.data.choices[0].message.content;
    
    // Update the log with the response
    if (logId) {
      await supabase
        .from('llm_prompt_logs')
        .update({
          response: responseContent,
          response_quality_score: 5, // Default score
        })
        .eq('id', logId);
    }

    // Parse the JSON response
    try {
      return JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);
      throw new Error('Failed to parse biomarker results from LLM response');
    }
  } catch (error) {
    console.error('Error processing biomarker results:', error);
    
    // Update the log with the error if possible
    if (logId) {
      await supabase
        .from('llm_prompt_logs')
        .update({
          response: `Error: ${error instanceof Error ? error.message : String(error)}`,
          response_quality_score: 1, // Low score for errors
        })
        .eq('id', logId);
    }
    
    throw error;
  }
}

/**
 * Check for supplement contraindications based on medications and conditions
 * 
 * @param userId The user ID for logging purposes
 * @param supplements Array of supplement IDs
 * @param medications User's medications
 * @param conditions User's medical conditions
 * @param model Optional model override
 * @returns Safe supplements and warnings
 */
export async function checkContraindications(
  userId: string,
  supplements: string[],
  medications: string,
  conditions: string,
  model: string = DEFAULT_MODEL
) {
  // Construct the prompt using the contra checker template
  const prompt = `${contraCheckerPrompt}
  
  Supplements to check: ${JSON.stringify(supplements)}
  Medications: ${medications}
  Medical conditions: ${conditions}
  
  Check for any harmful interactions between these supplements and the user's medications or conditions.`;

  // Variable to store the log ID for later updates
  let logId: string | null = null;

  try {
    // Log the prompt to the database
    const { data: logData, error: logError } = await supabase
      .from('llm_prompt_logs')
      .insert({
        user_id: userId,
        prompt: prompt,
        model_used: model,
        prompt_type: 'contra_checker'
      })
      .select('id')
      .single();

    if (logError) {
      console.error('Error logging prompt:', logError);
    } else if (logData) {
      logId = logData.id;
    }

    // Make the API request to OpenRouter
    const response = await axios.post<OpenRouterResponse>(
      OPENROUTER_API_URL,
      {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': SITE_URL,
          'X-Title': SITE_NAME,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the response content
    const responseContent = response.data.choices[0].message.content;
    
    // Update the log with the response
    if (logId) {
      await supabase
        .from('llm_prompt_logs')
        .update({
          response: responseContent,
          response_quality_score: 5, // Default score
        })
        .eq('id', logId);
    }

    // Parse the JSON response
    try {
      return JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);
      throw new Error('Failed to parse contraindication results from LLM response');
    }
  } catch (error) {
    console.error('Error checking contraindications:', error);
    
    // Update the log with the error if possible
    if (logId) {
      await supabase
        .from('llm_prompt_logs')
        .update({
          response: `Error: ${error instanceof Error ? error.message : String(error)}`,
          response_quality_score: 1, // Low score for errors
        })
        .eq('id', logId);
    }
    
    throw error;
  }
}

export async function generateWellnessAnalysis(
  userId: string,
  profile: WellnessProfile,
  model: string = DEFAULT_MODEL
) {
  // Format wellness considerations and sensitivities for the prompt
  const considerations = Array.isArray(profile.wellness_considerations)
    ? profile.wellness_considerations.join(', ')
    : profile.wellness_considerations;
    
  const sensitivities = Array.isArray(profile.wellness_sensitivities)
    ? profile.wellness_sensitivities.join(', ')
    : profile.wellness_sensitivities;

  // Construct the prompt for the LLM using the wellness analyzer template
  const prompt = `${wellnessAnalyzerPrompt}
  
  USER PROFILE:
  Age: ${profile.age}
  Gender: ${profile.gender}
  Wellness Considerations: ${considerations}
  Wellness Sensitivities: ${sensitivities}
  
  Based on this profile, provide a personalized wellness analysis.`;

  // Variable to store the log ID for later updates
  let logId: string | null = null;

  try {
    // Log the prompt to the database
    const { data: logData, error: logError } = await supabase
      .from('llm_prompt_logs')
      .insert({
        user_id: userId,
        prompt: prompt,
        model_used: model,
      })
      .select('id')
      .single();

    if (logError) {
      console.error('Error logging prompt:', logError);
    } else if (logData) {
      logId = logData.id;
    }

    // Make the API request to OpenRouter
    const response = await axios.post<OpenRouterResponse>(
      OPENROUTER_API_URL,
      {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': SITE_URL,
          'X-Title': SITE_NAME,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the response content
    const responseContent = response.data.choices[0].message.content;
    
    // Update the log with the response
    if (logId) {
      await supabase
        .from('llm_prompt_logs')
        .update({
          response: responseContent,
          response_quality_score: 5, // Default score
        })
        .eq('id', logId);
    }

    // Parse the JSON response
    try {
      return JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);
      throw new Error('Failed to parse wellness analysis from LLM response');
    }
  } catch (error) {
    console.error('Error generating wellness analysis:', error);
    
    // Update the log with the error if possible
    if (logId) {
      await supabase
        .from('llm_prompt_logs')
        .update({
          response: `Error: ${error instanceof Error ? error.message : String(error)}`,
          response_quality_score: 1, // Low score for errors
        })
        .eq('id', logId);
    }
    
    throw error;
  }
}
