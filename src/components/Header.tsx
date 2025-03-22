
import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <motion.header 
      className="w-full py-4 sm:py-6 attractive-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div
              className="bg-primary/10 p-2 rounded-lg shadow-subtle"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </motion.div>
            <div className="flex flex-col">
              <motion.h1 
                className="text-xl sm:text-2xl font-display font-semibold text-gradient"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {isMobile ? "Invoice Designer" : "Sleek Invoice Designer"}
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-xs sm:text-sm"
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
