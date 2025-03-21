
import React from 'react';
import { InvoiceData } from '@/lib/invoiceTypes';
import { motion } from 'framer-motion';
import { Download, Mail, Printer, FileText } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { generatePDF, emailInvoice } from '@/lib/pdfGenerator';
import { useIsMobile } from '@/hooks/use-mobile';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoiceData }) => {
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

      <div className="bg-white rounded-lg shadow-elevation border border-border/40 overflow-hidden transform transition-all hover:shadow-lg">
        <div id="invoice-preview" className="invoice-paper bg-white">
          <div className="invoice-paper-inner p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
            {/* Header - Issuer Info */}
            <div className="mb-6 md:mb-10">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary mb-1">{invoiceData.issuerName}</h1>
              <p className="text-muted-foreground whitespace-pre-line text-sm sm:text-base">
                {formatAddress(invoiceData.issuerAddress)}
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
                <p className="text-muted-foreground text-sm sm:text-base">ABN: {invoiceData.abn}</p>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-md sm:text-lg font-medium mb-2">ISSUED TO:</h3>
              <div className="border-l-2 border-primary/20 pl-4">
                <p className="font-medium text-sm sm:text-base">{invoiceData.recipientName}</p>
                <p className="text-muted-foreground whitespace-pre-line text-sm sm:text-base">
                  {formatAddress(invoiceData.recipientAddress)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-md sm:text-lg font-medium mb-2">Description</h3>
              <div className="border-t border-b border-gray-200 py-4">
                <p className="whitespace-pre-line text-sm sm:text-base">{invoiceData.description}</p>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-10 sm:mb-16">
              <div className="flex justify-end">
                <div className="w-full sm:w-64">
                  <div className="flex justify-between py-2 font-medium text-sm sm:text-base">
                    <span>Total:</span>
                    <span>AUD ${invoiceData.amount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 sm:pt-6">
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-md sm:text-lg font-medium mb-3">Payment Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2">
                  <div>
                    <p className="mb-1 text-sm sm:text-base"><span className="font-medium">Bank: </span>{invoiceData.bankName}</p>
                    <p className="mb-1 text-sm sm:text-base"><span className="font-medium">Account Name: </span>{invoiceData.accountName}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm sm:text-base"><span className="font-medium">BSB: </span>{invoiceData.bsb}</p>
                    <p className="mb-1 text-sm sm:text-base"><span className="font-medium">Account Number: </span>{invoiceData.accountNumber}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 text-muted-foreground text-xs sm:text-sm">
                <p className="mb-1">
                  <span className="font-medium">Contact: </span>
                  <a href={`mailto:${invoiceData.email}`} className="text-primary hover:underline">{invoiceData.email}</a> | {invoiceData.phone}
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
