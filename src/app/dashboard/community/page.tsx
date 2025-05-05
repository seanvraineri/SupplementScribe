'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Protocol = {
  id: number;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  description: string;
  supplements: string[];
  category: string;
  likes: number;
  comments: number;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
};

type Category = {
  id: string;
  name: string;
};

export default function CommunityPage() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'recent', 'trending'
  const [savedProtocols, setSavedProtocols] = useState<number[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  
  // Load data on client-side
  useEffect(() => {
    setMounted(true);
    
    // Load saved protocols from localStorage
    const saved = localStorage.getItem('savedProtocols');
    if (saved) {
      setSavedProtocols(JSON.parse(saved));
    }
    
    // Load protocols (this would be an API call in a real app)
    setProtocols(getMockProtocols());
  }, []);
  
  // Categories for filtering
  const categories: Category[] = [
    { id: 'all', name: 'All Protocols' },
    { id: 'energy', name: 'Energy & Focus' },
    { id: 'sleep', name: 'Sleep & Recovery' },
    { id: 'immune', name: 'Immune Support' },
    { id: 'stress', name: 'Stress Management' },
    { id: 'fitness', name: 'Fitness & Performance' },
    { id: 'cognitive', name: 'Cognitive Health' },
  ];
  
  // Apply filters to protocols
  const filteredProtocols = protocols.filter(protocol => {
    // Category filter
    if (activeCategory !== 'all' && protocol.category !== activeCategory) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        protocol.title.toLowerCase().includes(query) ||
        protocol.author.name.toLowerCase().includes(query) ||
        protocol.description.toLowerCase().includes(query) ||
        protocol.supplements.some(supp => supp.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Sort protocols
  const sortedProtocols = [...filteredProtocols].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    } else if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'trending') {
      // Simple trending algorithm: likes + comments / days since posted
      const aDays = Math.max(1, Math.floor((Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
      const bDays = Math.max(1, Math.floor((Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
      
      const aScore = (a.likes + a.comments) / aDays;
      const bScore = (b.likes + b.comments) / bDays;
      
      return bScore - aScore;
    }
    return 0;
  });
  
  // Handle liking a protocol
  const handleLikeProtocol = (protocolId: number) => {
    setProtocols(protocols.map(protocol => {
      if (protocol.id === protocolId) {
        return {
          ...protocol,
          likes: protocol.isLiked ? protocol.likes - 1 : protocol.likes + 1,
          isLiked: !protocol.isLiked
        };
      }
      return protocol;
    }));
  };
  
  // Handle saving a protocol
  const handleSaveProtocol = (protocolId: number) => {
    const updatedProtocols = protocols.map(protocol => {
      if (protocol.id === protocolId) {
        return {
          ...protocol,
          isSaved: !protocol.isSaved
        };
      }
      return protocol;
    });
    
    setProtocols(updatedProtocols);
    
    // Update saved protocols
    const newSavedProtocols = updatedProtocols
      .filter(p => p.isSaved)
      .map(p => p.id);
    
    setSavedProtocols(newSavedProtocols);
    localStorage.setItem('savedProtocols', JSON.stringify(newSavedProtocols));
  };
  
  // Mock data generator
  const getMockProtocols = (): Protocol[] => {
    return [
      {
        id: 1,
        title: "Energy Boost Protocol",
        author: {
          name: "Sarah Johnson",
          avatar: "SJ"
        },
        description: "My daily stack for sustained energy without crashes. Great for long workdays!",
        supplements: ["Vitamin B Complex", "CoQ10", "L-Tyrosine", "Rhodiola Rosea"],
        category: "energy",
        likes: 142,
        comments: 28,
        createdAt: "2023-09-15T12:00:00Z",
        isLiked: false,
        isSaved: false
      },
      {
        id: 2,
        title: "Sleep Enhancement Stack",
        author: {
          name: "Michael Chen",
          avatar: "MC"
        },
        description: "This combination has transformed my sleep quality. I fall asleep faster and wake up refreshed.",
        supplements: ["Magnesium Glycinate", "L-Theanine", "Tart Cherry Extract", "Low-dose Melatonin"],
        category: "sleep",
        likes: 217,
        comments: 42,
        createdAt: "2023-10-22T15:30:00Z",
        isLiked: false,
        isSaved: false
      },
      {
        id: 3,
        title: "Immune Defense Protocol",
        author: {
          name: "Rachel Wilson",
          avatar: "RW"
        },
        description: "I've used this stack during cold and flu season with great results. Haven't been sick in over a year!",
        supplements: ["Vitamin D3", "Zinc", "Vitamin C", "Quercetin", "Elderberry"],
        category: "immune",
        likes: 189,
        comments: 37,
        createdAt: "2023-11-05T09:45:00Z",
        isLiked: false,
        isSaved: false
      },
      {
        id: 4,
        title: "Stress Management Toolkit",
        author: {
          name: "James Parker",
          avatar: "JP"
        },
        description: "As someone with a high-stress job, this protocol helps me stay balanced and focused throughout the day.",
        supplements: ["Ashwagandha", "Magnesium Threonate", "L-Theanine", "Lemon Balm"],
        category: "stress",
        likes: 156,
        comments: 24,
        createdAt: "2023-12-18T14:20:00Z",
        isLiked: false,
        isSaved: false
      },
      {
        id: 5,
        title: "Athletic Performance Stack",
        author: {
          name: "Alex Rodriguez",
          avatar: "AR"
        },
        description: "I've seen significant improvements in my recovery and endurance since starting this protocol.",
        supplements: ["Creatine Monohydrate", "Beta-Alanine", "Citrulline Malate", "Omega-3 Fish Oil", "Vitamin D3"],
        category: "fitness",
        likes: 231,
        comments: 53,
        createdAt: "2024-01-07T08:15:00Z",
        isLiked: false,
        isSaved: false
      },
      {
        id: 6,
        title: "Brain Fog Eliminator",
        author: {
          name: "Emily Zhang",
          avatar: "EZ"
        },
        description: "After struggling with cognitive issues, this stack has noticeably improved my focus and mental clarity.",
        supplements: ["Alpha-GPC", "Bacopa Monnieri", "Lion's Mane Mushroom", "Omega-3 DHA"],
        category: "cognitive",
        likes: 175,
        comments: 31,
        createdAt: "2024-02-14T11:30:00Z",
        isLiked: false,
        isSaved: false
      },
      {
        id: 7,
        title: "Women's Hormone Balance",
        author: {
          name: "Sophia Martinez",
          avatar: "SM"
        },
        description: "This protocol has helped me manage PMS symptoms and maintain better energy levels throughout my cycle.",
        supplements: ["Magnesium", "Vitamin B6", "Evening Primrose Oil", "Vitex (Chasteberry)"],
        category: "stress",
        likes: 204,
        comments: 47,
        createdAt: "2024-03-02T16:45:00Z",
        isLiked: false,
        isSaved: false
      },
      {
        id: 8,
        title: "Focus & Productivity Stack",
        author: {
          name: "David Kim",
          avatar: "DK"
        },
        description: "As a programmer, this stack helps me maintain deep focus during long coding sessions without stimulants.",
        supplements: ["Citicoline", "Rhodiola Rosea", "L-Tyrosine", "Bacopa Monnieri"],
        category: "cognitive",
        likes: 163,
        comments: 29,
        createdAt: "2024-03-20T10:00:00Z",
        isLiked: false,
        isSaved: false
      }
    ].map(protocol => ({
      ...protocol,
      isSaved: savedProtocols.includes(protocol.id)
    }));
  };

  // Skeleton loader for initial server render
  if (!mounted) {
    return (
      <div className="p-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-12"></div>
          
          <div className="flex items-center w-full overflow-x-auto py-6 space-x-4 mb-8">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg w-32 flex-shrink-0 animate-pulse"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Community Protocols</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover and share supplement protocols with the SupplementScribe community
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search protocols, users, or supplements..."
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="popular">Most Popular</option>
            <option value="recent">Most Recent</option>
            <option value="trending">Trending</option>
          </select>
          
          <Link href="/dashboard/supplements?share=true" className="hidden md:flex bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-colors items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share My Protocol
          </Link>
        </div>
      </div>
      
      {/* Categories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Mobile Share Button */}
      <div className="md:hidden mb-6">
        <Link href="/dashboard/supplements?share=true" className="flex justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-colors items-center">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share My Protocol
        </Link>
      </div>
      
      {/* Protocol Cards */}
      {sortedProtocols.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProtocols.map((protocol) => (
            <motion.div
              key={protocol.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {protocol.author.avatar}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{protocol.author.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(protocol.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded text-xs font-medium">
                    {categories.find(c => c.id === protocol.category)?.name || protocol.category}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{protocol.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{protocol.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Supplements</h4>
                  <div className="flex flex-wrap gap-2">
                    {protocol.supplements.map((supplement, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                      >
                        {supplement}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleLikeProtocol(protocol.id)}
                      className={`flex items-center text-sm ${
                        protocol.isLiked 
                          ? 'text-red-500 dark:text-red-400' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-1" fill={protocol.isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {protocol.likes}
                    </button>
                    
                    <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
                      <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {protocol.comments}
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleSaveProtocol(protocol.id)}
                    className={`flex items-center text-sm ${
                      protocol.isSaved 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-1" fill={protocol.isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    {protocol.isSaved ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-10 border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No protocols found</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            No protocols match your current filters. Try adjusting your search or categories.
          </p>
          <button 
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
} 