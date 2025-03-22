
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
        className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-6 pb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Section - Forms */}
          <motion.div 
            variants={itemVariants}
            className={`lg:col-span-5 ${isMobile ? 'order-2' : 'order-1'}`}
          >
            <Tabs defaultValue="invoice" className="w-full mb-6">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="invoice" className="text-xs sm:text-sm">Invoice</TabsTrigger>
                <TabsTrigger value="clients" className="text-xs sm:text-sm">Business/Client</TabsTrigger>
                <TabsTrigger value="work" className="text-xs sm:text-sm">Work Calendar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="invoice" className="mt-2">
                <div className="attractive-card p-3 sm:p-6">
                  <InvoiceForm 
                    invoiceData={invoiceData} 
                    setInvoiceData={setInvoiceData} 
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="clients" className="mt-2 space-y-6">
                <div className="attractive-card p-3 sm:p-6">
                  <BusinessInfoPanel onSaveBusinessInfo={handleBusinessInfoSave} />
                </div>
                <div className="attractive-card p-3 sm:p-6">
                  <ClientInfoPanel onSelectClient={handleClientSelect} />
                </div>
              </TabsContent>
              
              <TabsContent value="work" className="mt-2">
                <WorkCalendarPanel onGenerateInvoiceAmount={handleGenerateInvoiceAmount} />
              </TabsContent>
            </Tabs>
          </motion.div>
          
          {/* Right Section - Preview */}
          <motion.div 
            variants={itemVariants}
            className={`lg:col-span-7 ${isMobile ? 'order-1 mb-4' : 'order-2'} overflow-auto`}
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
