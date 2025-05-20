'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SymptomChecker from '@/components/ai/SymptomChecker';
import { generateChatResponse } from '@/lib/openai-service';

type Message = {
  id: number;
  type: 'user' | 'assistant';
  content: string;
};

// Define supplement data with mock shopping links
type Supplement = {
  name: string;
  link: string;
  price: string;
  rating: number;
  brand: string;
};

const supplements: Record<string, Supplement> = {
  'vitamin d3': {
    name: 'Vitamin D3',
    link: 'https://example.com/vitamin-d3',
    price: '$15.99',
    rating: 4.7,
    brand: 'NutriPure'
  },
  'magnesium glycinate': {
    name: 'Magnesium Glycinate',
    link: 'https://example.com/magnesium-glycinate',
    price: '$19.99',
    rating: 4.5,
    brand: 'PureForm'
  },
  'omega-3': {
    name: 'Omega-3 Fish Oil',
    link: 'https://example.com/omega-3',
    price: '$24.99',
    rating: 4.8,
    brand: 'OceanHealth'
  },
  'zinc': {
    name: 'Zinc Picolinate',
    link: 'https://example.com/zinc',
    price: '$12.99',
    rating: 4.6,
    brand: 'NutriPure'
  },
  'probiotics': {
    name: 'Probiotics 10 Billion CFU',
    link: 'https://example.com/probiotics',
    price: '$28.99',
    rating: 4.4,
    brand: 'MicroBiome'
  },
  'melatonin': {
    name: 'Melatonin 1mg',
    link: 'https://example.com/melatonin',
    price: '$9.99',
    rating: 4.3,
    brand: 'SleepWell'
  }
};

// Custom Nutri SVG Avatar Component
const NutriAvatar = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" fill="url(#nutri-gradient-chat)" stroke="white" strokeWidth="1.5"/>
    
    {/* DNA Helix */}
    <path d="M15 10C17 12 23 12 25 10M15 15C17 17 23 17 25 15M15 20C17 22 23 22 25 20M15 25C17 27 23 27 25 25M15 30C17 32 23 32 25 30" 
          stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    
    {/* Connecting Lines */}
    <path d="M15 10L15 30M25 10L25 30" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 3"/>
    
    {/* Leaf/Supplement Icon */}
    <path d="M28 16C28 16 29.5 18 32 18C29.5 18 28 20 28 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 20C12 20 10.5 22 8 22C10.5 22 12 24 12 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Gradient Definition (ensure ID is unique if used elsewhere) */}
    <defs>
      <linearGradient id="nutri-gradient-chat" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#7E22CE" />
      </linearGradient>
    </defs>
  </svg>
);

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      type: 'assistant', 
      content: "Hello, I'm your elite-level biohacker supplement specialist. I have PhD-level expertise in analyzing genetic data, lab biomarkers, and PubMed research to create personalized supplement protocols.\n\nI'll help you optimize your supplement regimen based on your unique genetic variants, biomarkers, and health goals. How can I assist you today?" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Suggested questions with icons
  const suggestedQuestions = [
    { icon: "🧬", text: "What supplements are best for my MTHFR C677T mutation?" },
    { icon: "⚡", text: "How can I optimize my energy levels?" },
    { icon: "🧠", text: "What's best for cognitive enhancement?" },
    { icon: "💤", text: "How can I improve my sleep quality?" },
    { icon: "🔍", text: "Can you analyze my Vitamin D levels?" }
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enhanced user profile for biohacking context
  const mockUserProfile = {
    age: 35,
    gender: "Female",
    wellness_considerations: ["Energy optimization", "Cognitive performance", "Sleep quality", "Stress resilience"],
    current_supplements: [
      { name: "Vitamin D3", dosage: "5000 IU" },
      { name: "Magnesium Glycinate", dosage: "400mg" },
      { name: "Omega-3", dosage: "2000mg EPA/DHA" },
      { name: "CoQ10", dosage: "100mg" },
      { name: "NAC", dosage: "600mg" }
    ],
    genetic_variants: [
      { gene: "MTHFR", variant: "C677T", status: "heterozygous" },
      { gene: "COMT", variant: "Val158Met", status: "homozygous" },
      { gene: "VDR", variant: "Taq1", status: "heterozygous" }
    ],
    lab_results: {
      vitamin_d: 28,
      b12: 450,
      ferritin: 65,
      homocysteine: 9.2,
      hscrp: 0.8,
      hdl: 62,
      ldl: 110,
      testosterone: 55,
      tsh: 2.1
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Format messages for OpenAI API
      const formattedMessages = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Add the new user message
      formattedMessages.push({
        role: 'user',
        content: inputValue
      });
      
      // Get response from OpenAI
      const response = await generateChatResponse(formattedMessages, mockUserProfile);
      
      // Add AI response
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'assistant',
        content: response
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Add error message if API fails
      const errorResponse: Message = {
        id: messages.length + 2,
        type: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again in a moment."
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };
  
  // Function to find supplements in text
  const findSupplementsInText = (text: string): { text: string; supplement: Supplement | null }[] => {
    const parts: { text: string; supplement: Supplement | null }[] = [];
    let remainingText = text;
    let allProcessed = false;
    
    // Process each supplement key one at a time
    for (const [key, supp] of Object.entries(supplements)) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      
      // Use a simpler approach with string.search and indexOf
      let currentText = remainingText;
      let startSearchFrom = 0;
      
      while (!allProcessed) {
        // Find the next match position
        const lowerText = currentText.toLowerCase();
        const matchPos = lowerText.indexOf(key, startSearchFrom);
        
        // No more matches for this supplement
        if (matchPos === -1) {
          break;
        }
        
        // Verify it's a whole word by checking boundaries
        const prevChar = matchPos > 0 ? lowerText[matchPos - 1] : ' ';
        const nextChar = matchPos + key.length < lowerText.length ? lowerText[matchPos + key.length] : ' ';
        const isWordBoundaryBefore = /\W/.test(prevChar);
        const isWordBoundaryAfter = /\W/.test(nextChar);
        
        if (isWordBoundaryBefore && isWordBoundaryAfter) {
          // We have a real match
          // Add text before match
          if (matchPos > 0) {
            parts.push({
              text: currentText.substring(0, matchPos),
              supplement: null
            });
          }
          
          // Add the supplement
          parts.push({
            text: currentText.substring(matchPos, matchPos + key.length),
            supplement: supp
          });
          
          // Update the text to continue searching
          currentText = currentText.substring(matchPos + key.length);
          startSearchFrom = 0;
        } else {
          // Not a whole word match, continue searching
          startSearchFrom = matchPos + key.length;
        }
        
        // Break if we've reached the end
        if (startSearchFrom >= currentText.length) {
          break;
        }
      }
      
      // Replace matched supplements with whitespace to prevent double matches
      remainingText = remainingText.replace(regex, match => ' '.repeat(match.length));
    }
    
    // If no supplements were found, return the entire text
    if (parts.length === 0) {
      return [{ text, supplement: null }];
    }
    
    return parts;
  };
  
  // Function to handle clicking on a supplement
  const handleSupplementClick = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
  };
  
  // Handle symptom checker results
  const handleSymptomAnalysisComplete = (results: any) => {
    // Format the symptom analysis results as a message
    const formattedResults = formatSymptomResults(results);
    
    // Add the assistant message with the analysis
    const aiResponse: Message = {
      id: messages.length + 1,
      type: 'assistant',
      content: formattedResults
    };
    
    setMessages(prev => [...prev, aiResponse]);
    setShowSymptomChecker(false);
  };
  
  // Format symptom analysis into a readable message
  const formatSymptomResults = (results: any): string => {
    let message = "📋 **Symptom Analysis Results**\n\n";
    
    // Severity and doctor recommendation
    message += `🚨 **Assessment**: ${results.severity.charAt(0).toUpperCase() + results.severity.slice(1)} concern level\n`;
    if (results.consultDoctor) {
      message += "⚠️ **Recommendation**: Consider consulting a healthcare provider for these symptoms.\n\n";
    } else {
      message += "✅ **Recommendation**: These symptoms can likely be addressed with the suggestions below.\n\n";
    }
    
    // Possible causes
    message += "**Possible Causes**:\n";
    results.possibleCauses.forEach((cause: string) => {
      message += `• ${cause}\n`;
    });
    message += "\n";
    
    // Supplement recommendations
    message += "**Supplement Recommendations**:\n";
    results.supplementRecommendations.forEach((supp: any) => {
      message += `• ${supp.name} (${supp.dosage}): ${supp.reason}\n`;
    });
    message += "\n";
    
    // Lifestyle recommendations
    message += "**Lifestyle Adjustments**:\n";
    results.lifestyleRecommendations.forEach((rec: string) => {
      message += `• ${rec}\n`;
    });
    
    return message;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-200">
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Chat header */}
        <div className="bg-white px-4 sm:px-6 py-3 border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 relative rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                <NutriAvatar className="w-full h-full object-cover p-0.5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900">Nutri</h1>
                <p className="text-xs sm:text-sm text-indigo-600 font-medium">Your personal health companion</p>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button className="p-1.5 sm:p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="p-1.5 sm:p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100
                  }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 mt-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mr-2 flex-shrink-0 shadow-md overflow-hidden">
                      <NutriAvatar className="w-full h-full object-cover p-0.5" />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[85%] rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-4 shadow-sm ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-indigo-200/50' 
                        : 'bg-white shadow-gray-200/70 border border-gray-100'
                    }`}
                  >
                    <div className={`${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                      {message.content.split('\n').map((paragraph, i) => (
                        <p key={i} className={`${i > 0 ? 'mt-2 sm:mt-3' : ''} text-sm sm:text-[15px] leading-relaxed`}>
                          {message.type === 'assistant' ? (
                            findSupplementsInText(paragraph).map((part, j) => (
                              part.supplement ? (
                                <span 
                                  key={j} 
                                  className="font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer inline-flex items-center"
                                  onClick={() => handleSupplementClick(part.supplement!)}
                                >
                                  {part.text}
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                </span>
                              ) : (
                                <span key={j}>{part.text}</span>
                              )
                            ))
                          ) : (
                            paragraph
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 mt-1 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-2 flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-start"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 mt-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mr-2 flex-shrink-0 shadow-sm overflow-hidden">
                  <NutriAvatar className="w-full h-full object-cover p-0.5" />
                </div>
                <div className="bg-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-indigo-500 animate-bounce"></div>
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Supplement detail modal */}
        {selectedSupplement && (
          <div 
            className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSupplement(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
                <h3 className="text-lg font-bold">{selectedSupplement.name}</h3>
                <p className="text-indigo-100 text-sm">by {selectedSupplement.brand}</p>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-gray-900">{selectedSupplement.price}</span>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Best Value</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center mr-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(selectedSupplement.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{selectedSupplement.rating}/5</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Benefits</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        High-quality, tested ingredients
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Free from common allergens
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Lab tested for potency & purity
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Recommended For</h4>
                    <p className="text-sm text-gray-700">
                      Based on your health profile, this supplement is highly recommended for your specific needs.
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <a 
                    href={selectedSupplement.link} 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium text-center hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md"
                  >
                    Buy Now
                  </a>
                  <button 
                    onClick={() => setSelectedSupplement(null)}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Symptom Checker Modal */}
        {showSymptomChecker && (
          <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
            <SymptomChecker 
              onComplete={handleSymptomAnalysisComplete}
              onCancel={() => setShowSymptomChecker(false)}
            />
          </div>
        )}
        
        {/* Suggested questions */}
        {messages.length < 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white border-t border-gray-200 px-4 py-4 sm:py-5"
          >
            <div className="max-w-3xl mx-auto">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">Ask Nutri about...</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question.text)}
                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left bg-gradient-to-br from-white to-indigo-50/50 hover:from-indigo-50/30 hover:to-indigo-100/50 text-gray-700 rounded-lg sm:rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <span className="text-lg sm:text-xl group-hover:scale-125 transition-transform">{question.icon}</span>
                    <span className="text-sm sm:text-[15px]">{question.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Chat input */}
        <div className="bg-white border-t border-gray-200 p-4 sm:px-6 sm:py-4">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
            {/* Tools Row */}
            <div className="flex gap-2 order-2 sm:order-1 justify-center sm:justify-start mt-2 sm:mt-0">
              <button 
                onClick={() => setShowSymptomChecker(true)}
                className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition-colors"
                title="Symptom Checker"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </button>
              {/* Other tool buttons can be added here */}
            </div>
            
            <form 
              onSubmit={handleSendMessage}
              className="flex items-end gap-2 flex-1 order-1 sm:order-2"
            >
              <div className="relative flex-1">
                <input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me about your health, supplements, or nutrition..."
                  className="w-full p-3 sm:p-4 pr-12 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  disabled={!inputValue.trim() || isLoading}
                  className={`absolute right-2 bottom-2 p-2 text-white rounded-lg ${
                    inputValue.trim() && !isLoading 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 