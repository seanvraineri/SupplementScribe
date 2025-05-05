'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const GeneticAnalysisVisual = () => {
  const [hovered, setHovered] = useState(null);
  const [activeMarker, setActiveMarker] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const codeContainerRef = useRef(null);

  // Auto-rotate through the markers (much slower now)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMarker(prev => (prev + 1) % geneticMarkers.length);
    }, 6000); // Slowed down from 3000ms to 6000ms
    return () => clearInterval(interval);
  }, []);

  // Simulate code scrolling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => (prev + 1) % 500);
      
      if (codeContainerRef.current) {
        codeContainerRef.current.scrollTop = scrollPosition;
      }
    }, 100); // Slow scroll
    return () => clearInterval(interval);
  }, [scrollPosition]);

  // Generate code-like gene sequences
  const generateGeneSequence = (length = 40) => {
    const bases = ['A', 'T', 'G', 'C'];
    let sequence = '';
    for (let i = 0; i < length; i++) {
      sequence += bases[Math.floor(Math.random() * bases.length)];
    }
    return sequence;
  };

  // Create an array of gene sequences for display
  const geneSequences = Array.from({ length: 50 }, (_, i) => {
    const isImportant = Math.random() < 0.2;
    const functionName = isImportant ? 
      ['MTHFR', 'APOE', 'DRD4', 'COMT', 'CYP1A2', 'VDR', 'BDNF'][Math.floor(Math.random() * 7)] : '';
    
    return {
      id: i,
      line: i + 1,
      sequence: generateGeneSequence(),
      isImportant,
      functionName
    };
  });

  const geneticMarkers = [
    {
      id: 'rs1801133',
      name: 'MTHFR',
      description: 'Affects folate metabolism and methylation',
      recommendation: 'Consider methylated B vitamins',
      position: { x: 25, y: 30 }
    },
    {
      id: 'rs429358',
      name: 'APOE',
      description: 'Influences lipid metabolism and cardiovascular health',
      recommendation: 'Omega-3 fatty acids may be beneficial',
      position: { x: 65, y: 45 }
    },
    {
      id: 'rs1800955',
      name: 'DRD4',
      description: 'Dopamine receptor gene affecting cognition',
      recommendation: 'Consider tyrosine and B6 for dopamine support',
      position: { x: 40, y: 70 }
    },
    {
      id: 'rs4680',
      name: 'COMT',
      description: 'Affects dopamine and catecholamine breakdown',
      recommendation: 'Magnesium and B vitamins may help balance',
      position: { x: 80, y: 25 }
    }
  ];

  return (
    <div className="relative w-full h-full bg-[#070b17] bg-opacity-70 rounded-lg overflow-hidden p-4 border border-blue-900/20">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30"></div>
      
      {/* Code-like gene sequence display */}
      <div 
        ref={codeContainerRef}
        className="absolute inset-0 p-4 overflow-hidden font-mono text-xs leading-relaxed scrollbar-hide"
      >
        {geneSequences.map((gene) => (
          <div 
            key={gene.id} 
            className={`flex items-start mb-1 ${gene.isImportant ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <span className="w-8 mr-4 text-gray-500">{gene.line}</span>
            {gene.isImportant && (
              <span className="mr-2 text-purple-400">{gene.functionName}:</span>
            )}
            <motion.span 
              initial={{ opacity: 0.3 }}
              animate={{ opacity: gene.isImportant ? 1 : 0.5 }}
              transition={{ duration: 2, repeat: gene.isImportant ? Infinity : 0, repeatType: 'reverse' }}
            >
              {gene.sequence}
            </motion.span>
          </div>
        ))}
      </div>
      
      {/* Gene markers */}
      {geneticMarkers.map((marker, index) => (
        <motion.div
          key={marker.id}
          className={`absolute cursor-pointer ${activeMarker === index ? 'z-20' : 'z-10'}`}
          style={{
            left: `${marker.position.x}%`,
            top: `${marker.position.y}%`,
          }}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          animate={{
            scale: activeMarker === index ? 1.2 : 1,
            boxShadow: activeMarker === index ? '0 0 15px rgba(59, 130, 246, 0.7)' : '0 0 0px rgba(59, 130, 246, 0)'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            {/* Marker */}
            <div className={`w-5 h-5 rounded-full ${activeMarker === index ? 'bg-blue-500' : 'bg-blue-600/60'} flex items-center justify-center text-xs font-bold text-white`}>
              {marker.name.charAt(0)}
            </div>
            
            {/* Connection line */}
            <motion.div
              className="absolute left-1/2 top-full w-[1px] bg-blue-500"
              initial={{ height: 0 }}
              animate={{ height: activeMarker === index || hovered === index ? 40 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ transform: 'translateX(-50%)' }}
            />
            
            {/* Info tooltip */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 mt-10 bg-[#0a192f] border border-blue-900/30 p-3 rounded-md shadow-xl w-56 z-30"
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ 
                opacity: activeMarker === index || hovered === index ? 1 : 0,
                y: activeMarker === index || hovered === index ? 0 : -5,
                scale: activeMarker === index || hovered === index ? 1 : 0.95
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-blue-400 font-medium mb-1">{marker.name} ({marker.id})</div>
              <div className="text-gray-300 text-xs mb-2">{marker.description}</div>
              <div className="text-xs font-medium bg-blue-900/30 p-1.5 rounded text-blue-200">
                Recommendation: {marker.recommendation}
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
      
      {/* Data visualization elements - much more subtle */}
      <div className="absolute bottom-4 left-4 right-4 h-16 bg-[#0a101f]/80 rounded-md border border-blue-900/20 p-2 backdrop-blur-sm">
        <div className="text-blue-400 text-xs mb-1 font-medium">Gene Sequence Analysis</div>
        <div className="flex gap-1 h-6 items-end">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-blue-500"
              style={{ 
                height: `${Math.sin(i * 0.5) * 40 + 60}%`,
                opacity: 0.2 + Math.random() * 0.4, // Reduced opacity for subtlety
                backgroundColor: i % 4 === 0 ? '#3B82F6' : 
                                i % 4 === 1 ? '#8B5CF6' : 
                                i % 4 === 2 ? '#10B981' : '#EC4899' 
              }}
              animate={{
                height: `${Math.sin((i * 0.5) + Date.now() / 5000) * 40 + 60}%` // Slowed down animation
              }}
              transition={{
                duration: 4, // Longer duration
                repeat: Infinity,
                repeatType: 'mirror'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Interactive tooltip */}
      <motion.div
        className="absolute top-3 right-3 bg-[#0a101f]/90 backdrop-blur-sm border border-blue-900/30 rounded-md px-3 py-2 text-xs text-blue-400 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="font-medium">AI Analysis:</span> Scanning gene sequences
      </motion.div>
      
      {/* Add an overlay highlight for specific sequences */}
      <div className="absolute inset-0 pointer-events-none">
        {geneSequences
          .filter(gene => gene.isImportant)
          .map((gene, index) => (
            <motion.div 
              key={`highlight-${gene.id}`}
              className="absolute left-0 right-0 h-5 bg-blue-500/10"
              style={{ top: `${(gene.line - 1) * 20 + 16}px` }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: activeMarker === index % geneticMarkers.length ? 0.2 : 0,
                x: activeMarker === index % geneticMarkers.length ? 0 : -20
              }}
              transition={{ duration: 0.5 }}
            />
          ))}
      </div>
    </div>
  );
};

export default GeneticAnalysisVisual;
