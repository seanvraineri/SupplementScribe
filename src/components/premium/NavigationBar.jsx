'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const NavigationBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-4 bg-[#090c14]/80 backdrop-blur-md' : 'py-6 bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white tracking-tight">
              SupplementScribe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-white/90 hover:text-white text-sm tracking-wide hover:underline underline-offset-4 transition-all">
              Features
            </Link>
            <Link href="/genetic-testing" className="text-white/90 hover:text-white text-sm tracking-wide hover:underline underline-offset-4 transition-all">
              Genetic Testing
            </Link>
            <Link href="/pricing" className="text-white/90 hover:text-white text-sm tracking-wide hover:underline underline-offset-4 transition-all">
              Pricing
            </Link>
            <Link href="/science" className="text-white/90 hover:text-white text-sm tracking-wide hover:underline underline-offset-4 transition-all">
              Our Science
            </Link>
          </nav>

          {/* CTA & Mobile Menu Button */}
          <div className="flex items-center">
            <Link href="/login" className="hidden md:inline-block text-white/90 hover:text-white text-sm tracking-wide mr-6">
              Log In
            </Link>
            <Link href="/signup" className="hidden md:inline-block px-5 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-all duration-300">
              Get Started
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {menuOpen ? (
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[72px] left-0 right-0 bg-[#090c14] z-40 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              <Link
                href="/features"
                className="text-white/90 hover:text-white py-2 text-sm transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/genetic-testing"
                className="text-white/90 hover:text-white py-2 text-sm transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Genetic Testing
              </Link>
              <Link
                href="/pricing"
                className="text-white/90 hover:text-white py-2 text-sm transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/science"
                className="text-white/90 hover:text-white py-2 text-sm transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Our Science
              </Link>
              <div className="border-t border-white/10 my-2 pt-4 flex flex-col space-y-4">
                <Link
                  href="/login"
                  className="text-white/90 hover:text-white py-2 text-sm transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white py-3 text-center text-sm font-medium hover:bg-blue-500 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationBar;
