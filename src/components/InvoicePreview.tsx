
import React, { useRef } from 'react';
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
        <div id="invoice-preview" className="invoice-paper bg-white p-8">
          <div className="invoice-paper-inner max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-semibold mb-1">{invoiceData.issuerName}</h1>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {formatAddress(invoiceData.issuerAddress)}
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-semibold mb-1">Tax Invoice</h2>
                  <p className="text-muted-foreground">ABN: {invoiceData.abn}</p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="mb-1">
                    <span className="font-medium">Date: </span>
                    {new Date(invoiceData.date).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="mb-1">
                    <span className="font-medium">Invoice Number: </span>
                    {invoiceData.invoiceNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">ISSUED TO:</h3>
              <div className="pl-4 border-l-2 border-gray-200">
                <p className="font-medium">{invoiceData.recipientName}</p>
                <p className="text-muted-foreground whitespace-pre-line">
                  {formatAddress(invoiceData.recipientAddress)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="text-lg font-medium mb-3">Description</h3>
              <div className="border-t border-b border-border py-4">
                <p className="whitespace-pre-line">{invoiceData.description}</p>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-10">
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
              <div className="border-t border-border pt-4">
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
                <p className="mb-1"><span className="font-medium">Contact: </span>{invoiceData.email} | {invoiceData.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvoicePreview;
