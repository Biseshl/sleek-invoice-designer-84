
import React from 'react';
import { Toaster } from "@/components/ui/toaster";

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default NotificationProvider;
