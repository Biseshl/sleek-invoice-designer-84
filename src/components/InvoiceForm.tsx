
import React from 'react';
import { InvoiceData } from '@/lib/invoiceTypes';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoiceData, setInvoiceData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      className="w-full no-print"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
    >
      <Card className="shadow-subtle border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input 
                id="invoiceNumber" 
                name="invoiceNumber" 
                value={invoiceData.invoiceNumber}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date"
                value={invoiceData.date}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              rows={3}
              value={invoiceData.description}
              onChange={handleChange}
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (AUD)</Label>
            <Input 
              id="amount" 
              name="amount" 
              value={invoiceData.amount}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipientName">Client Name</Label>
            <Input 
              id="recipientName" 
              name="recipientName" 
              value={invoiceData.recipientName}
              onChange={handleChange}
              placeholder="Select a client from the Clients tab"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipientAddress">Client Address</Label>
            <Textarea 
              id="recipientAddress" 
              name="recipientAddress" 
              rows={3}
              value={invoiceData.recipientAddress}
              onChange={handleChange}
              placeholder="Client address will appear here when you select a client"
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoiceForm;
