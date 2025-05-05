'use client';

import { useState } from 'react';
import Link from 'next/link';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI supplement expert. I can answer questions about your personalized supplement plan, recommend studies relevant to your health profile, or discuss general nutrition and supplement information. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      // In a real app, this would be an API call to your AI backend
      const aiResponses = [
        "Based on your health profile, I recommend taking Vitamin D3 in the morning with food for optimal absorption. Studies show this can improve immune function.",
        "According to recent research on PubMed, omega-3 supplementation at your recommended dosage has been linked to reduced inflammation markers in individuals with similar genetic markers.",
        "Your blood test shows slightly low magnesium levels, which explains why we included Magnesium Glycinate in your plan. This specific form is well-absorbed and may help with your reported sleep issues.",
        "When considering your budget constraints, prioritizing Vitamin D and Omega-3s would give you the most benefit based on your specific health markers.",
      ];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen flex flex-col bg-apple-gray-50">
      <header className="bg-white border-b border-apple-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link 
          href="/results" 
          className="inline-flex items-center text-apple-gray-600 hover:text-apple-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Results
        </Link>
        <h1 className="text-lg font-semibold text-apple-gray-900">AI Supplement Expert</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`max-w-3xl mx-auto flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                rounded-apple px-4 py-3 inline-block max-w-md 
                ${message.role === 'user' 
                  ? 'bg-apple-blue text-white rounded-tr-none' 
                  : 'bg-white border border-apple-gray-200 shadow-sm rounded-tl-none'
                }
              `}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-apple-gray-400'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="max-w-3xl mx-auto flex justify-start">
            <div className="bg-white border border-apple-gray-200 shadow-sm rounded-apple rounded-tl-none px-4 py-3 inline-block">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 bg-apple-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-apple-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-apple-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white border-t border-apple-gray-200 p-4 sticky bottom-0 z-10">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your supplements or health profile..."
            className="flex-1 px-4 py-2 border border-apple-gray-300 rounded-l-apple focus:ring-apple-blue focus:border-apple-blue"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-apple-blue px-4 py-2 text-white rounded-r-apple disabled:bg-apple-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </form>
      </div>
    </main>
  );
} 