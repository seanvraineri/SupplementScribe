'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { navigationItems } from '@/data/mockDashboardData';
import * as Icons from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Sidebar = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: { 
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };
  
  const navItemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: { 
      opacity: 0,
      y: 20,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };
  
  return (
    <>
      {/* Mobile hamburger button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white shadow-md"
        >
          <Icons.Menu className="h-6 w-6 text-gray-700" />
        </button>
      </div>
      
      {/* Backdrop for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black z-40"
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className={cn(
          "fixed left-0 top-0 bottom-0 w-[280px] bg-white shadow-sidebar z-50 flex flex-col",
          "md:translate-x-0 md:static md:z-0",
          className
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center border-b border-gray-100">
          <div className="relative h-10 w-10 mr-3">
            <Image 
              src="/images/logo-colorful.svg" 
              alt="SupplementScribe" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="font-semibold text-primary-600 text-xl">
            SupplementScribe
          </div>
        </div>
        
        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = Icons[item.icon];
              return (
                <motion.li 
                  key={item.key}
                  variants={navItemVariants}
                  initial="closed"
                  animate="open"
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    href={`/dashboard/${item.key === 'dashboard' ? '' : item.key}`}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-lg transition-all",
                      "hover:bg-gray-50",
                      pathname === `/dashboard${item.key === 'dashboard' ? '' : `/${item.key}`}` 
                        ? "bg-primary-50 text-primary-700 font-medium" 
                        : "text-gray-600"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>
        
        {/* Help box */}
        <div className="p-6 m-4 mb-6 bg-primary-50 rounded-xl">
          <div className="flex items-center mb-4">
            <Icons.HelpCircle className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-gray-900 font-medium">Need Help?</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Our support team is ready to assist with any questions or issues.
          </p>
          <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white">
            Get Support
          </Button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar; 