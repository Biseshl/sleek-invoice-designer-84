
import React, { useState } from 'react';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import Header from '@/components/Header';
import { defaultInvoiceData } from '@/lib/invoiceTypes';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [invoiceData, setInvoiceData] = useState(defaultInvoiceData);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Invoice Form */}
          <div className={`lg:col-span-5 ${isMobile ? 'order-2' : 'order-1'}`}>
            <InvoiceForm 
              invoiceData={invoiceData} 
              setInvoiceData={setInvoiceData} 
            />
          </div>
          
          {/* Invoice Preview */}
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
