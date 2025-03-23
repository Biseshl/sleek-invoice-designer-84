
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientInfoPanel from '@/components/ClientInfoPanel';
import BusinessInfoPanel from '@/components/BusinessInfoPanel';
import WorkCalendarPanel from '@/components/WorkCalendarPanel';
import InvoiceTemplateSelector from '@/components/InvoiceTemplateSelector';
import { defaultInvoiceData, ClientInfo, BusinessInfo } from '@/lib/invoiceTypes';
import { useIsMobile, useBreakpoint } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Save, Download } from 'lucide-react';
import { useInvoices } from '@/contexts/InvoiceContext';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';

const Index = () => {
  const [invoiceData, setInvoiceData] = useState(defaultInvoiceData);
  const isMobile = useIsMobile();
  const isTabletOrAbove = useBreakpoint('md');
  const isLargeScreen = useBreakpoint('lg');
  const isXLScreen = useBreakpoint('xl');
  const { saveInvoice, selectedTemplate } = useInvoices();
  const { user } = useUser();
  const navigate = useNavigate();

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

  const handleSaveInvoice = (status: 'draft' | 'pending' | 'paid' = 'pending') => {
    if (!invoiceData.recipientName) {
      toast.error('Please select a client before saving');
      return;
    }

    if (!invoiceData.amount || parseFloat(invoiceData.amount) <= 0) {
      toast.error('Please add a valid amount before saving');
      return;
    }

    saveInvoice(invoiceData, selectedTemplate, status);
    toast.success(`Invoice ${status === 'draft' ? 'saved as draft' : 'created successfully'}`);
    
    if (user) {
      navigate('/dashboard');
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-preview');
    if (!element) return;

    const options = {
      margin: 10,
      filename: `Invoice-${invoiceData.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Add a temporary class to improve PDF rendering
    element.classList.add('pdf-export');
    
    html2pdf().set(options).from(element).save().then(() => {
      element.classList.remove('pdf-export');
      toast.success('Invoice downloaded successfully');
    });
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
        className="flex-1 container mx-auto px-4 py-6 pb-12 max-w-[1800px]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Section - Forms */}
          <motion.div 
            variants={itemVariants}
            className={`${isLargeScreen ? 'lg:col-span-5 xl:col-span-5' : 'w-full'} ${isMobile ? 'order-2' : 'order-1'}`}
          >
            <Tabs defaultValue="invoice" className="w-full mb-6">
              <TabsList className="w-full grid grid-cols-4 mb-4">
                <TabsTrigger value="invoice" className="text-sm">Invoice</TabsTrigger>
                <TabsTrigger value="templates" className="text-sm">Templates</TabsTrigger>
                <TabsTrigger value="clients" className="text-sm">Business/Client</TabsTrigger>
                <TabsTrigger value="work" className="text-sm">Work Calendar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="invoice" className="mt-2">
                <div className="attractive-card p-6 shadow-elevation">
                  <InvoiceForm 
                    invoiceData={invoiceData} 
                    setInvoiceData={setInvoiceData} 
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
                    <Button
                      onClick={() => handleSaveInvoice('draft')}
                      variant="outline"
                      className="flex-1"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save as Draft
                    </Button>
                    
                    <Button
                      onClick={() => handleSaveInvoice('pending')}
                      className="flex-1"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Invoice
                    </Button>
                    
                    <Button
                      onClick={handleDownloadPDF}
                      variant="secondary"
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="templates" className="mt-2">
                <div className="attractive-card p-6 shadow-elevation">
                  <InvoiceTemplateSelector />
                </div>
              </TabsContent>
              
              <TabsContent value="clients" className="mt-2 space-y-6">
                <div className="attractive-card p-6 shadow-elevation">
                  <BusinessInfoPanel onSaveBusinessInfo={handleBusinessInfoSave} />
                </div>
                <div className="attractive-card p-6 shadow-elevation">
                  <ClientInfoPanel onSelectClient={handleClientSelect} />
                </div>
              </TabsContent>
              
              <TabsContent value="work" className="mt-2">
                <div className="attractive-card p-6 shadow-elevation overflow-hidden">
                  <WorkCalendarPanel onGenerateInvoiceAmount={handleGenerateInvoiceAmount} />
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
          
          {/* Right Section - Preview */}
          <motion.div 
            variants={itemVariants}
            className={`${isLargeScreen ? 'lg:col-span-7 xl:col-span-7' : 'w-full'} ${isMobile ? 'order-1 mb-4' : 'order-2'}`}
          >
            <div className={`${!isMobile ? 'sticky top-4' : ''}`}>
              <InvoicePreview invoiceData={invoiceData} templateType={selectedTemplate} />
            </div>
          </motion.div>
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Index;
