
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TooltipProvider>
      <>
        {children}
        <Toaster />
      </>
    </TooltipProvider>
  );
};

export default NotificationProvider;
