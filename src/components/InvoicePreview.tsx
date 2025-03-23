
import React from 'react';
import { InvoiceData } from '@/lib/invoiceTypes';
import { motion } from 'framer-motion';
import { Download, Mail, Printer } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { generatePDF, emailInvoice } from '@/lib/pdfGenerator';
import { useIsMobile } from '@/hooks/use-mobile';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  templateType?: 'standard' | 'professional' | 'minimal';
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoiceData, templateType = 'standard' }) => {
  const isMobile = useIsMobile();

  const handlePrint = () => {
    window.print();
  };

  const formatAddress = (address: string) => {
    return address.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < address.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Use different template classes based on templateType
  const getTemplateClasses = () => {
    switch (templateType) {
      case 'professional':
        return 'bg-slate-50';
      case 'minimal':
        return 'bg-stone-50';
      case 'standard':
      default:
        return 'bg-white';
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
    >
      <div className="flex flex-wrap justify-end gap-2 mb-4 no-print">
        <AnimatedButton
          variant="outline"
          onClick={handlePrint}
          icon={<Printer className="w-4 h-4" />}
          className="text-xs sm:text-sm"
        >
          {isMobile ? "" : "Print"}
        </AnimatedButton>
        <AnimatedButton
          variant="outline"
          onClick={() => emailInvoice(invoiceData)}
          icon={<Mail className="w-4 h-4" />}
          className="text-xs sm:text-sm"
        >
          {isMobile ? "" : "Email"}
        </AnimatedButton>
        <AnimatedButton
          variant="primary"
          onClick={() => generatePDF(invoiceData)}
          icon={<Download className="w-4 h-4" />}
          className="text-xs sm:text-sm"
        >
          {isMobile ? "" : "Download PDF"}
        </AnimatedButton>
      </div>

      <div className={`${getTemplateClasses()} rounded-lg shadow-elevation border border-border/20 overflow-hidden transform transition-all hover:shadow-lg`}>
        <div id="invoice-preview" className={`invoice-paper ${getTemplateClasses()}`}>
          <div className="invoice-paper-inner p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
            {/* Header - Issuer Info */}
            <div className="mb-6 md:mb-10">
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-semibold ${templateType === 'professional' ? 'text-blue-700' : 'text-primary'} mb-1`}>{invoiceData.issuerName || "Your Business Name"}</h1>
              <p className="text-muted-foreground whitespace-pre-line text-sm sm:text-base">
                {formatAddress(invoiceData.issuerAddress || "Your Business Address")}
              </p>
            </div>

            {/* Invoice Details and Number */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 md:mb-12">
              <div className="mb-4 sm:mb-0">
                <p className="mb-2 text-sm sm:text-base">
                  <span className="font-medium">Date: </span>
                  {formatDate(invoiceData.date)}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <h2 className="text-xl sm:text-2xl font-semibold mb-1">Tax Invoice</h2>
                <p className="mb-1 text-sm sm:text-base">
                  <span className="font-medium">Invoice Number: </span>
                  {invoiceData.invoiceNumber}
                </p>
                <p className="text-muted-foreground text-sm sm:text-base">ABN: {invoiceData.abn || "XX XXX XXX XXX"}</p>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-md sm:text-lg font-medium mb-2">ISSUED TO:</h3>
              <div className={`border-l-2 ${templateType === 'professional' ? 'border-blue-600/30' : templateType === 'minimal' ? 'border-stone-400/30' : 'border-primary/30'} pl-4 py-2 ${templateType === 'professional' ? 'bg-blue-50/20' : templateType === 'minimal' ? 'bg-stone-100/20' : 'bg-secondary/20'} rounded-r-md`}>
                <p className="font-medium text-sm sm:text-base">{invoiceData.recipientName || "Client Name"}</p>
                <p className="text-muted-foreground whitespace-pre-line text-sm sm:text-base">
                  {formatAddress(invoiceData.recipientAddress || "Client Address")}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-md sm:text-lg font-medium mb-2">Description</h3>
              <div className="border-t border-b border-gray-200 py-4 bg-gray-50/50 px-4 rounded-md">
                <p className="whitespace-pre-line text-sm sm:text-base">{invoiceData.description}</p>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-10 sm:mb-16">
              <div className="flex justify-end">
                <div className="w-full sm:w-64">
                  <div className={`flex justify-between py-3 px-4 font-medium text-sm sm:text-base ${templateType === 'professional' ? 'bg-blue-50/30 border-blue-100/50' : templateType === 'minimal' ? 'bg-stone-50/50 border-stone-200/50' : 'bg-primary/5 border-primary/10'} rounded-md border`}>
                    <span>Total:</span>
                    <span className={templateType === 'professional' ? 'text-blue-700 font-semibold' : 'text-primary font-semibold'}>AUD ${invoiceData.amount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 sm:pt-6">
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-md sm:text-lg font-medium mb-3">Payment Details</h3>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 ${templateType === 'professional' ? 'bg-blue-50/20' : 'bg-gray-50/50'} p-4 rounded-md`}>
                  <div>
                    <p className="mb-1 text-sm sm:text-base"><span className="font-medium">Bank: </span>{invoiceData.bankName || "Your Bank"}</p>
                    <p className="mb-1 text-sm sm:text-base"><span className="font-medium">Account Name: </span>{invoiceData.accountName || "Your Name"}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm sm:text-base"><span className="font-medium">BSB: </span>{invoiceData.bsb || "XXX-XXX"}</p>
                    <p className="mb-1 text-sm sm:text-base"><span className="font-medium">Account Number: </span>{invoiceData.accountNumber || "XXXXXXXX"}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 text-muted-foreground text-xs sm:text-sm">
                <p className="mb-1">
                  <span className="font-medium">Contact: </span>
                  <a href={`mailto:${invoiceData.email || "your.email@example.com"}`} className={`${templateType === 'professional' ? 'text-blue-600' : 'text-primary'} hover:underline`}>{invoiceData.email || "your.email@example.com"}</a> | {invoiceData.phone || "+61 X XXXX XXXX"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvoicePreview;
