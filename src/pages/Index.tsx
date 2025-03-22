
import React, { useState } from 'react';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import Header from '@/components/Header';
import ClientInfoPanel from '@/components/ClientInfoPanel';
import BusinessInfoPanel from '@/components/BusinessInfoPanel';
import WorkCalendarPanel from '@/components/WorkCalendarPanel';
import { defaultInvoiceData, ClientInfo, BusinessInfo } from '@/lib/invoiceTypes';
import { useIsMobile, useBreakpoint } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const Index = () => {
  const [invoiceData, setInvoiceData] = useState(defaultInvoiceData);
  const isMobile = useIsMobile();
  const isTabletOrAbove = useBreakpoint('md');
  const isLargeScreen = useBreakpoint('lg');

  const handleClientSelect = (client: ClientInfo) => {
    setInvoiceData(prev => ({
      ...prev,
      recipientName: client.name,
      recipientAddress: client.address
    }));
  };

  const handleBusinessInfoSave = (info: BusinessInfo) => {
    setInvoiceData(prev => ({
      ...prev,
      issuerName: info.name,
      issuerAddress: info.address,
      abn: info.abn,
      email: info.email,
      phone: info.phone,
      bankName: info.bankName,
      accountName: info.accountName,
      bsb: info.bsb,
      accountNumber: info.accountNumber
    }));
  };

  const handleGenerateInvoiceAmount = (amount: string) => {
    setInvoiceData(prev => ({
      ...prev,
      amount: amount
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-1 container mx-auto px-4 py-6 pb-20 max-w-7xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Section - Forms */}
          <motion.div 
            variants={itemVariants}
            className={`${isLargeScreen ? 'lg:col-span-5' : 'w-full'} ${isMobile ? 'order-2' : 'order-1'}`}
          >
            <Tabs defaultValue="invoice" className="w-full mb-6">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="invoice" className="text-sm">Invoice</TabsTrigger>
                <TabsTrigger value="clients" className="text-sm">Business/Client</TabsTrigger>
                <TabsTrigger value="work" className="text-sm">Work Calendar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="invoice" className="mt-2">
                <div className="attractive-card p-4 sm:p-6 shadow-elevation">
                  <InvoiceForm 
                    invoiceData={invoiceData} 
                    setInvoiceData={setInvoiceData} 
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="clients" className="mt-2 space-y-6">
                <div className="attractive-card p-4 sm:p-6 shadow-elevation">
                  <BusinessInfoPanel onSaveBusinessInfo={handleBusinessInfoSave} />
                </div>
                <div className="attractive-card p-4 sm:p-6 shadow-elevation">
                  <ClientInfoPanel onSelectClient={handleClientSelect} />
                </div>
              </TabsContent>
              
              <TabsContent value="work" className="mt-2">
                <div className="attractive-card p-4 sm:p-6 shadow-elevation overflow-hidden">
                  <WorkCalendarPanel onGenerateInvoiceAmount={handleGenerateInvoiceAmount} />
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
          
          {/* Right Section - Preview */}
          <motion.div 
            variants={itemVariants}
            className={`${isLargeScreen ? 'lg:col-span-7' : 'w-full'} ${isMobile ? 'order-1 mb-4' : 'order-2'}`}
          >
            <div className={`${!isMobile ? 'sticky top-4' : ''}`}>
              <InvoicePreview invoiceData={invoiceData} />
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default Index;
