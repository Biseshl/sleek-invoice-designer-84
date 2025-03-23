
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="w-full py-4 border-t border-border/30 mt-auto bg-gradient-to-r from-background to-secondary/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Designed with <Heart className="h-3 w-3 text-red-500 animate-pulse" /> by
            <span className="font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Bisesh Lamichhane
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">© {new Date().getFullYear()} Sleek Invoice Designer</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
