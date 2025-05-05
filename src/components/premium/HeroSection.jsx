'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import Link from 'next/link';

const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-title-char", {
        opacity: 0,
        y: 20,
      }, {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        delay: 0.2,
        ease: "power3.out",
        duration: 0.8
      });

      gsap.fromTo(".hero-subtitle", {
        opacity: 0,
        y: 20,
      }, {
        opacity: 1,
        y: 0,
        delay: 1,
        ease: "power3.out",
        duration: 1
      });

      gsap.fromTo(".cta-button", {
        opacity: 0,
        y: 20,
      }, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        delay: 1.2,
        ease: "power3.out",
        duration: 0.8
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const title = "Your intelligent supplement advisor"; 
  const chars = title.split("");

  return (
    <section ref={containerRef} className="relative w-full min-h-screen overflow-hidden bg-[#020617]">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div 
          className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-blue-900/20 to-indigo-900/30 blur-[120px]" 
          style={{ y, opacity }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-violet-900/20 to-purple-900/30 blur-[100px]" 
          style={{ y }}
        />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-20 mix-blend-luminosity"></div>
      </div>

      {/* Hero Content */}
      <div className="container relative mx-auto px-4 pt-40 pb-24 md:pt-48 text-center z-10">
        <h1 className="hero-title inline-block text-4xl md:text-5xl lg:text-7xl text-white font-bold tracking-tight mb-8">
          {chars.map((char, index) => (
            <span key={index} className="hero-title-char inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        
        <p className="hero-subtitle text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto mb-12">
          AI-powered recommendations tailored to your unique biology and health goals.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link 
            href="/signup" 
            className="cta-button px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-sm font-medium transition-all duration-300 shadow-lg shadow-blue-900/30 hover:shadow-blue-700/40"
          >
            Get Started
          </Link>
          <Link 
            href="/demo" 
            className="cta-button px-8 py-4 bg-transparent border border-white/20 text-white rounded-sm font-medium hover:bg-white/10 transition-all duration-300"
          >
            Watch Demo
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-24">
          <div className="stat-item">
            <h3 className="text-5xl font-bold text-blue-400 mb-2">4.2M+</h3>
            <p className="text-gray-400 font-light">Genetic markers analyzed</p>
          </div>
          <div className="stat-item">
            <h3 className="text-5xl font-bold text-blue-400 mb-2">98.7%</h3>
            <p className="text-gray-400 font-light">Recommendation accuracy</p>
          </div>
          <div className="stat-item">
            <h3 className="text-5xl font-bold text-blue-400 mb-2">22K+</h3>
            <p className="text-gray-400 font-light">Scientific studies referenced</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
