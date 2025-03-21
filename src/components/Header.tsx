
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <motion.header 
      className="w-full py-6 border-b border-border/30 bg-gradient-to-r from-background to-secondary/20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div
              className="bg-primary/10 p-2 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <FileText className="h-6 w-6 text-primary" />
            </motion.div>
            <div className="flex flex-col">
              <motion.h1 
                className="text-2xl font-display font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {isMobile ? "Invoice Designer" : "Sleek Invoice Designer"}
              </motion.h1>
              <motion.p 
                className="text-muted-foreground mt-1 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                Create professional invoices in seconds
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
