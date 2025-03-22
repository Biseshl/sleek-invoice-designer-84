
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              placeholder="Briefly describe the services provided"
            />
          </div>
          
          {/* Removed amount field as it's now calculated from the work calendar */}
          
          {/* Client info is now managed in ClientInfoPanel */}
          <div className="p-3 bg-secondary/50 rounded-md text-sm text-muted-foreground">
            <p>💡 Client details and payment amounts are now managed in their respective tabs:</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Update client information in the "Business/Client" tab</li>
              <li>Track work hours and rates in the "Work Calendar" tab</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoiceForm;
