/**
 * API Service - A wrapper for API calls that handles errors and provides fallback mechanisms
 * 
 * This service is used to make API calls to OpenAI and other services.
 * It provides fallback mechanisms for when API calls fail.
 */

import OpenAI from 'openai';

// Mock data for when API calls fail
const mockSupplementRecommendations = [
  { 
    id: "vitamin-d3",
    name: "Vitamin D3", 
    description: "Supports bone health, immune function, and mood regulation",
    dosage: "2000-5000 IU daily",
    frequency: "Daily with a meal containing fat",
    price: 15.99,
    priority: "high",
    evidence_level: "strong",
    benefits: ["Bone health", "Immune support", "Mood regulation"],
    contraindications: ["Hypercalcemia", "Some medications"]
  },
  { 
    id: "magnesium-glycinate",
    name: "Magnesium Glycinate", 
    description: "Supports relaxation, sleep quality, and muscle recovery",
    dosage: "300-400mg daily",
    frequency: "Daily before bed",
    price: 18.99,
    priority: "medium",
    evidence_level: "moderate",
    benefits: ["Sleep quality", "Muscle recovery", "Stress reduction"],
    contraindications: ["Kidney disease", "Certain antibiotics"]
  },
  { 
    id: "omega-3",
    name: "Omega-3 Fish Oil", 
    description: "Supports heart and brain health, reduces inflammation",
    dosage: "1000-2000mg daily",
    frequency: "Daily with food",
    price: 25.99,
    priority: "high",
    evidence_level: "strong",
    benefits: ["Heart health", "Brain function", "Joint health"],
    contraindications: ["Blood thinning medications", "Fish allergies"]
  }
];

const mockWellnessAnalysis = {
  summary: "Your wellness profile indicates you're generally healthy but could benefit from targeted supplements to support your specific health goals.",
  key_insights: [
    "Your lifestyle factors indicate moderate stress levels that could impact sleep quality",
    "Your current diet may benefit from additional nutrient support",
    "Your health goals align well with a personalized supplement regimen"
  ],
  wellness_goals: [
    "Improve energy levels throughout the day",
    "Support immune system function",
    "Enhance sleep quality and recovery"
  ],
  lifestyle_suggestions: [
    "Consider incorporating stress management techniques like meditation",
    "Ensure adequate hydration throughout the day",
    "Maintain consistent sleep and wake times"
  ]
};

// Initialize the OpenAI client with the API key from environment variables
// with fallback mechanisms
const getOpenAIClient = () => {
  // Try to use the OpenAI API key first
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || 
                process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || 
                'sk-mock-key-for-development';
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Allow client-side usage
  });
};

/**
 * Generate supplement recommendations using OpenAI
 * 
 * @param wellnessProfile The user's wellness profile
 * @returns An array of supplement recommendations
 */
export async function generateSupplementRecommendations(wellnessProfile: any) {
  try {
    const openai = getOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Use the latest model
      messages: [
        {
          role: "system",
          content: `You are a wellness advisor specialized in supplement recommendations. 
          You provide personalized supplement suggestions based on wellness profiles.
          Your recommendations are for general wellness purposes only, not for treating medical conditions.
          Always consider potential sensitivities and stay within the user's budget.
          Format your response as a valid JSON array of supplement objects with the following structure:
          [
            {
              "id": "unique-id",
              "name": "Supplement Name",
              "description": "Brief description of benefits",
              "dosage": "Recommended dosage",
              "frequency": "How often to take",
              "price": 25.99,
              "priority": "high/medium/low",
              "evidence_level": "strong/moderate/limited",
              "benefits": ["benefit1", "benefit2"],
              "contraindications": ["contraindication1"]
            }
          ]
          Limit your response to 5 supplements maximum, staying within the monthly budget.`
        },
        {
          role: "user",
          content: `Please recommend supplements based on this wellness profile:
          
          Age: ${wellnessProfile.age || '35'}
          Gender: ${wellnessProfile.gender || 'Not specified'}
          Wellness Considerations: ${wellnessProfile.wellness_considerations?.join(', ') || 'General wellness'}
          Wellness Sensitivities: ${wellnessProfile.wellness_sensitivities?.join(', ') || 'None'}
          Monthly Budget: $${wellnessProfile.monthly_budget || '100'}
          
          Provide only JSON in your response, no explanations or other text.`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }
    
    const recommendations = JSON.parse(content);
    
    // Ensure we have an array of recommendations
    if (Array.isArray(recommendations)) {
      return recommendations;
    } else if (recommendations.recommendations && Array.isArray(recommendations.recommendations)) {
      return recommendations.recommendations;
    } else {
      console.error("Unexpected response format:", recommendations);
      throw new Error("Unexpected response format from OpenAI");
    }
  } catch (error) {
    console.error("Error generating recommendations with OpenAI:", error);
    // Return mock data as fallback
    console.log("Using mock supplement recommendations as fallback");
    return mockSupplementRecommendations;
  }
}

/**
 * Generate a personalized wellness analysis based on the user's profile
 * 
 * @param wellnessProfile The user's wellness profile
 * @returns A wellness analysis object
 */
export async function generateWellnessAnalysis(wellnessProfile: any) {
  try {
    const openai = getOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are a wellness advisor providing personalized wellness insights.
          Your analysis is for general wellness purposes only, not for diagnosing or treating medical conditions.
          Format your response as a valid JSON object with the following structure:
          {
            "summary": "Brief overview of wellness profile",
            "key_insights": ["insight1", "insight2", "insight3"],
            "wellness_goals": ["goal1", "goal2", "goal3"],
            "lifestyle_suggestions": ["suggestion1", "suggestion2", "suggestion3"]
          }`
        },
        {
          role: "user",
          content: `Please provide a wellness analysis based on this profile:
          
          Age: ${wellnessProfile.age || '35'}
          Gender: ${wellnessProfile.gender || 'Not specified'}
          Wellness Considerations: ${wellnessProfile.wellness_considerations?.join(', ') || 'General wellness'}
          Wellness Sensitivities: ${wellnessProfile.wellness_sensitivities?.join(', ') || 'None'}
          
          Provide only JSON in your response, no explanations or other text.`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating wellness analysis with OpenAI:", error);
    // Return mock data as fallback
    console.log("Using mock wellness analysis as fallback");
    return mockWellnessAnalysis;
  }
}
