'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const DNAVisualization = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // DNA strand parameters
    const strandWidth = canvas.width * 0.6;
    const strandHeight = canvas.height * 0.8;
    const nucleotides = 20; // Number of base pairs
    const basePairSpacing = strandHeight / nucleotides;
    
    // Colors
    const colors = {
      backbone1: '#3B82F6', // Blue
      backbone2: '#8B5CF6', // Purple
      baseA: '#10B981', // Green
      baseT: '#F59E0B', // Amber
      baseG: '#EC4899', // Pink
      baseC: '#06B6D4', // Cyan
      highlight: '#FFFFFF' // White
    };
    
    // Animation parameters
    let rotation = 0;
    let highlightPosition = 0;
    
    // Draw DNA
    const drawDNA = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Center the DNA strand
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation);
      
      // Draw the DNA strands
      const drawStrand = () => {
        const centerX = 0;
        const centerY = 0;
        const radius = strandWidth / 4;
        
        // Draw the two backbones
        ctx.lineWidth = 3;
        
        // First backbone (left)
        ctx.strokeStyle = colors.backbone1;
        ctx.beginPath();
        for (let i = -nucleotides / 2; i <= nucleotides / 2; i++) {
          const y = i * basePairSpacing;
          const x = Math.sin(i * 0.5) * radius;
          
          if (i === -nucleotides / 2) {
            ctx.moveTo(centerX + x - radius, centerY + y);
          } else {
            ctx.lineTo(centerX + x - radius, centerY + y);
          }
        }
        ctx.stroke();
        
        // Second backbone (right)
        ctx.strokeStyle = colors.backbone2;
        ctx.beginPath();
        for (let i = -nucleotides / 2; i <= nucleotides / 2; i++) {
          const y = i * basePairSpacing;
          const x = Math.sin(i * 0.5) * radius;
          
          if (i === -nucleotides / 2) {
            ctx.moveTo(centerX + x + radius, centerY + y);
          } else {
            ctx.lineTo(centerX + x + radius, centerY + y);
          }
        }
        ctx.stroke();
        
        // Draw base pairs
        for (let i = -nucleotides / 2; i <= nucleotides / 2; i++) {
          const y = i * basePairSpacing;
          const x = Math.sin(i * 0.5) * radius;
          
          // Determine base pair color based on position
          const baseIndex = Math.abs(i) % 4;
          let baseColor;
          
          switch (baseIndex) {
            case 0: baseColor = colors.baseA; break;
            case 1: baseColor = colors.baseT; break;
            case 2: baseColor = colors.baseG; break;
            case 3: baseColor = colors.baseC; break;
          }
          
          // Calculate distance from highlight
          const distFromHighlight = Math.abs(i - highlightPosition);
          const isHighlighted = distFromHighlight < 2;
          
          // Base pair connect line
          ctx.strokeStyle = isHighlighted ? colors.highlight : baseColor;
          ctx.lineWidth = isHighlighted ? 3 : 2;
          ctx.globalAlpha = isHighlighted ? 1 : 0.8;
          
          ctx.beginPath();
          ctx.moveTo(centerX + x - radius, centerY + y);
          ctx.lineTo(centerX + x + radius, centerY + y);
          ctx.stroke();
          
          // Draw the nucleotide bases
          const baseSize = isHighlighted ? 8 : 6;
          
          // Left base
          ctx.fillStyle = isHighlighted ? colors.highlight : baseColor;
          ctx.beginPath();
          ctx.arc(centerX + x - radius, centerY + y, baseSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Right base
          ctx.beginPath();
          ctx.arc(centerX + x + radius, centerY + y, baseSize, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.globalAlpha = 1.0;
        }
      };
      
      drawStrand();
      ctx.restore();
      
      // Add data streaming effect
      const dataPointCount = 40;
      const dataPointSize = 1.5;
      
      for (let i = 0; i < dataPointCount; i++) {
        // Calculate position based on time
        const angle = (Date.now() / 3000 + i / dataPointCount * Math.PI * 2) % (Math.PI * 2);
        const distance = (50 + Math.sin(Date.now() / 1000 + i) * 30) * (canvas.width / 800);
        
        const x = canvas.width / 2 + Math.cos(angle) * distance;
        const y = canvas.height / 2 + Math.sin(angle) * distance;
        
        // Determine color
        const colorIndex = i % 4;
        let dataColor;
        switch (colorIndex) {
          case 0: dataColor = colors.baseA; break;
          case 1: dataColor = colors.baseT; break;
          case 2: dataColor = colors.baseG; break;
          case 3: dataColor = colors.baseC; break;
        }
        
        // Draw data point
        ctx.fillStyle = dataColor;
        ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 500 + i) * 0.4;
        ctx.beginPath();
        ctx.arc(x, y, dataPointSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    };
    
    // Animation loop
    const animate = () => {
      rotation += 0.005;
      highlightPosition = (Math.sin(Date.now() / 1000) + 1) * nucleotides / 2 - nucleotides / 4;
      
      drawDNA();
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#0a101f] to-[#101935] overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
        style={{ display: 'block' }}
      />
      
      {/* Information overlays */}
      <div className="absolute top-6 left-6 max-w-[140px] bg-[#0a101f]/80 backdrop-blur-sm p-3 border border-blue-900/30 rounded-sm">
        <div className="text-blue-400 text-xs font-medium mb-1">ATCG Base Pairs</div>
        <div className="text-gray-400 text-xs">Core genetic components analyzed by our algorithm</div>
      </div>
      
      <div className="absolute bottom-6 right-6 max-w-[140px] bg-[#0a101f]/80 backdrop-blur-sm p-3 border border-blue-900/30 rounded-sm">
        <div className="text-blue-400 text-xs font-medium mb-1">SNP Detection</div>
        <div className="text-gray-400 text-xs">Identifying genetic variations that affect supplement needs</div>
      </div>
      
      <motion.div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600/80 backdrop-blur-sm px-4 py-2 rounded-sm text-center"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-white text-sm font-medium">Interactive Genetic Analysis</div>
      </motion.div>
    </div>
  );
};

export default DNAVisualization;
