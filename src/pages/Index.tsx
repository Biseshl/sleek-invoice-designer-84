
import React, { useState } from 'react';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import Header from '@/components/Header';
import ClientInfoPanel from '@/components/ClientInfoPanel';
import BusinessInfoPanel from '@/components/BusinessInfoPanel';
import WorkCalendarPanel from '@/components/WorkCalendarPanel';
import { defaultInvoiceData, ClientInfo, BusinessInfo } from '@/lib/invoiceTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [invoiceData, setInvoiceData] = useState(defaultInvoiceData);
  const isMobile = useIsMobile();

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Section - Forms */}
          <div className={`lg:col-span-5 ${isMobile ? 'order-2' : 'order-1'}`}>
            <Tabs defaultValue="invoice" className="w-full mb-6">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="invoice">Invoice</TabsTrigger>
                <TabsTrigger value="clients">Business/Client</TabsTrigger>
                <TabsTrigger value="work">Work Calendar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="invoice" className="mt-4">
                <InvoiceForm 
                  invoiceData={invoiceData} 
                  setInvoiceData={setInvoiceData} 
                />
              </TabsContent>
              
              <TabsContent value="clients" className="mt-4">
                <BusinessInfoPanel onSaveBusinessInfo={handleBusinessInfoSave} />
                <ClientInfoPanel onSelectClient={handleClientSelect} />
              </TabsContent>
              
              <TabsContent value="work" className="mt-4">
                <WorkCalendarPanel onGenerateInvoiceAmount={handleGenerateInvoiceAmount} />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Section - Preview */}
          <div className={`lg:col-span-7 ${isMobile ? 'order-1' : 'order-2'} overflow-auto`}>
            <div className={`${!isMobile ? 'sticky top-8' : ''}`}>
              <InvoicePreview invoiceData={invoiceData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
