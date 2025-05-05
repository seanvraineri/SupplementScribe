import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from environment variables
// with fallback to mock API key for development
const getOpenAIClient = () => {
  // Try to use the OpenAI API key first, then fall back to OpenRouter API key
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || 
               process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || 
               'sk-mock-key-for-development';
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Allow client-side usage
  });
};

// Create a client instance
const openai = getOpenAIClient();

/**
 * Generate supplement recommendations using OpenAI
 * 
 * @param wellnessProfile The user's wellness profile
 * @returns An array of supplement recommendations
 */
export async function generateSupplementRecommendations(wellnessProfile: any) {
  try {
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
          
          Age: ${wellnessProfile.age}
          Gender: ${wellnessProfile.gender}
          Wellness Considerations: ${wellnessProfile.wellness_considerations.join(', ')}
          Wellness Sensitivities: ${wellnessProfile.wellness_sensitivities.join(', ')}
          Monthly Budget: $${wellnessProfile.monthly_budget}
          
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
    throw error;
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
          
          Age: ${wellnessProfile.age}
          Gender: ${wellnessProfile.gender}
          Wellness Considerations: ${wellnessProfile.wellness_considerations.join(', ')}
          Wellness Sensitivities: ${wellnessProfile.wellness_sensitivities.join(', ')}
          
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
    throw error;
  }
}
