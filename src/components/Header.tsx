
import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="w-full py-6 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <motion.h1 
              className="text-2xl md:text-3xl font-display font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Sleek Invoice Designer
            </motion.h1>
            <motion.p 
              className="text-muted-foreground mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Create professional invoices in seconds
            </motion.p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
