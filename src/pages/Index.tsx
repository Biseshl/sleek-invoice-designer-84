
import React, { useState } from 'react';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import Header from '@/components/Header';
import { defaultInvoiceData } from '@/lib/invoiceTypes';

const Index = () => {
  const [invoiceData, setInvoiceData] = useState(defaultInvoiceData);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Invoice Form */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <InvoiceForm 
              invoiceData={invoiceData} 
              setInvoiceData={setInvoiceData} 
            />
          </div>
          
          {/* Invoice Preview */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <InvoicePreview invoiceData={invoiceData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
