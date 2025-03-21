
import React from 'react';
import { InvoiceData } from '@/lib/invoiceTypes';
import { motion } from 'framer-motion';
import { Download, Mail, Printer } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { generatePDF, emailInvoice } from '@/lib/pdfGenerator';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoiceData }) => {
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
      <div className="flex justify-end gap-2 mb-4 no-print">
        <AnimatedButton
          variant="outline"
          onClick={handlePrint}
          icon={<Printer className="w-4 h-4" />}
        >
          Print
        </AnimatedButton>
        <AnimatedButton
          variant="outline"
          onClick={() => emailInvoice(invoiceData)}
          icon={<Mail className="w-4 h-4" />}
        >
          Email
        </AnimatedButton>
        <AnimatedButton
          variant="primary"
          onClick={() => generatePDF(invoiceData)}
          icon={<Download className="w-4 h-4" />}
        >
          Download PDF
        </AnimatedButton>
      </div>

      <div className="bg-white rounded-lg shadow-elevation border border-border/40 overflow-hidden">
        <div id="invoice-preview" className="invoice-paper bg-white">
          <div className="invoice-paper-inner p-8 max-w-4xl mx-auto">
            {/* Header - Issuer Info */}
            <div className="mb-10">
              <h1 className="text-3xl font-semibold text-primary-foreground mb-1">{invoiceData.issuerName}</h1>
              <p className="text-muted-foreground whitespace-pre-line">
                {formatAddress(invoiceData.issuerAddress)}
              </p>
            </div>

            {/* Invoice Details and Number */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="mb-2">
                  <span className="font-medium">Date: </span>
                  {formatDate(invoiceData.date)}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-semibold mb-1">Tax Invoice</h2>
                <p className="mb-1">
                  <span className="font-medium">Invoice Number: </span>
                  {invoiceData.invoiceNumber}
                </p>
                <p className="text-muted-foreground">ABN: {invoiceData.abn}</p>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">ISSUED TO:</h3>
              <div className="border-l-2 border-gray-200 pl-4">
                <p className="font-medium">{invoiceData.recipientName}</p>
                <p className="text-muted-foreground whitespace-pre-line">
                  {formatAddress(invoiceData.recipientAddress)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <div className="border-t border-b border-gray-200 py-4">
                <p className="whitespace-pre-line">{invoiceData.description}</p>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-16">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2 font-medium">
                    <span>Total:</span>
                    <span>AUD ${invoiceData.amount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6">
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium mb-3">Payment Details</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <div>
                    <p className="mb-1"><span className="font-medium">Bank: </span>{invoiceData.bankName}</p>
                    <p className="mb-1"><span className="font-medium">Account Name: </span>{invoiceData.accountName}</p>
                  </div>
                  <div>
                    <p className="mb-1"><span className="font-medium">BSB: </span>{invoiceData.bsb}</p>
                    <p className="mb-1"><span className="font-medium">Account Number: </span>{invoiceData.accountNumber}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-muted-foreground text-sm">
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
