
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TooltipProvider>
      <>
        {children}
        <Toaster />
        <Sonner />
      </>
    </TooltipProvider>
  );
};

export default NotificationProvider;
