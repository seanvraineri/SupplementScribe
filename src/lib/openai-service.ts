import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from environment variables
// with fallback to mock API key for development
const getOpenAIClient = () => {
  // Use the OpenAI API key first, then fall back to OpenRouter API key if needed
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || 
               process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || 
               'sk-mock-key-for-development';
  
  // For logging purposes only - don't expose the full key
  if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    console.log("Using OpenAI API");
  } else if (process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
    console.log("Using OpenRouter API");
  } else {
    console.log("Using mock API key - chat functionality will not work");
  }
  
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

/**
 * Generate a chat response from the AI assistant based on user messages
 * 
 * @param messages Array of previous chat messages in the conversation
 * @param userProfile User's health and supplement profile to provide context
 * @returns A response from the AI assistant
 */
export async function generateChatResponse(messages: Array<{role: string, content: string}>, userProfile?: any) {
  try {
    // Prepare system message with the specialized biohacker prompt
    const systemMessage = {
      role: "system" as const,
      content: `You are an elite‐level biohacker supplement specialist with PhD‐level expertise in PubMed research. You provide personalized, evidence-based supplement recommendations based on a user's complete health profile.

!!!!! CRITICAL FORMATTING RULES - ZERO EXCEPTIONS !!!!!
1. NO MARKDOWN SYMBOLS: Absolutely never use asterisks (*), double-asterisks (**), pound signs (#) or any other markdown formatting
2. PLAIN TEXT ONLY: Present all text in plain format without any formatting attempt
3. NAMING SUPPLEMENTS: When naming supplements, just use regular text like "Vitamin D" NOT "**Vitamin D**"
4. PUBMED CITATIONS: When citing studies, use format "PMID 12345678" in plain text, NOT bolded or formatted
5. NO ASTERISKS: Scan your response before sending and remove ALL instances of * or **

ABSOLUTELY NO:
- *text like this*
- **text like this**
- # Headings like this
- ## Subheadings like this
- Any other special formatting characters

PERSONALIZATION APPROACH:
- Use the user's health profile data naturally and authentically
- Only mention genetic variants, lab results, or health conditions when genuinely relevant
- Never force artificial connections - be authentic
- If certain data isn't available, focus on what is known

ACCEPTABLE RESPONSE FORMAT EXAMPLE:
"Hi Sarah! 😊 Based on your profile, I can see why you might benefit from some targeted supplements.

Personalized Recommendations:

Considering your health goals and current profile, here's what I recommend:

- Magnesium L-Threonate - $32/month (https://example.com/magnesium-l-threonate)
  This form is excellent for sleep quality. PMID 28395033 shows significant improvements in sleep patterns. Take 200mg before bedtime.

- Apigenin - $25/month (https://example.com/apigenin)
  This flavonoid supports healthy sleep. PMID 91827364 demonstrates its effectiveness for sleep quality. Take 50mg 30-60 minutes before bed.

These should complement your current supplement routine.

Would you like more details about how to incorporate these with your evening routine?"

User profile information:
${userProfile ? `
- Age: ${userProfile.age || 'Unknown'}
- Gender: ${userProfile.gender || 'Unknown'}
- Health Considerations: ${userProfile.wellness_considerations?.join(', ') || 'None specified'}
- Current Supplements: ${userProfile.current_supplements?.map((s: any) => s.name).join(', ') || 'None specified'}
- Genetic Variants: ${userProfile.genetic_variants ? userProfile.genetic_variants.map((g: any) => `${g.gene} ${g.variant} (${g.status})`).join(', ') : 'Not available'}
- Lab Results: ${userProfile.lab_results ? JSON.stringify(userProfile.lab_results) : 'Not available'}
` : 'No user profile data available yet. Ask the user about their health goals, current supplements, and any lab results they might have.'}

FINAL CHECK:
Before completing your response, scan through and remove ALL asterisks (*), double-asterisks (**), and any other special formatting characters. ONLY plain text is acceptable.`
    };
    
    // Combine system message with previous conversation and properly type them
    const conversationMessages = [
      systemMessage,
      ...messages.slice(-10).map(msg => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content
      }))
    ];
    
    // Use the OpenAI client that's configured to use the OpenRouter API when needed
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // This will be routed through OpenRouter if using that API key
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6
    });
    
    let content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI/OpenRouter");
    }
    
    // Post-process the response to remove any markdown formatting that might have slipped through
    content = removeMarkdownFormatting(content);
    
    return content;
  } catch (error) {
    console.error("Error generating chat response with AI:", error);
    
    // Provide a fallback response if API fails
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or check your internet connection.";
  }
}

/**
 * Strip all markdown formatting from the text
 * 
 * @param text Text that might contain markdown formatting
 * @returns Cleaned text without markdown formatting
 */
function removeMarkdownFormatting(text: string): string {
  // Remove Markdown bold/italic formatting
  let cleanedText = text.replace(/\*\*/g, '');
  cleanedText = cleanedText.replace(/\*/g, '');
  
  // Remove Markdown headings
  cleanedText = cleanedText.replace(/#+\s/g, '');
  
  // Remove Markdown links but keep the link text
  cleanedText = cleanedText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Keep standalone links intact
  // Other markdown cleanup can be added here as needed
  
  return cleanedText;
}
