
import React from 'react';
import { InvoiceData } from '@/lib/invoiceTypes';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        <CardContent>
          <Tabs defaultValue="essential" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="essential">Essential Info</TabsTrigger>
              <TabsTrigger value="business">Business Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="essential" className="mt-0 space-y-4">
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
            </TabsContent>
            
            <TabsContent value="business" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issuerName">Your Name</Label>
                  <Input 
                    id="issuerName" 
                    name="issuerName" 
                    value={invoiceData.issuerName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abn">ABN</Label>
                  <Input 
                    id="abn" 
                    name="abn" 
                    value={invoiceData.abn}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="issuerAddress">Address</Label>
                <Textarea 
                  id="issuerAddress" 
                  name="issuerAddress" 
                  rows={3}
                  value={invoiceData.issuerAddress}
                  onChange={handleChange}
                  className="resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={invoiceData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={invoiceData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input 
                    id="bankName" 
                    name="bankName" 
                    value={invoiceData.bankName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input 
                    id="accountName" 
                    name="accountName" 
                    value={invoiceData.accountName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bsb">BSB</Label>
                  <Input 
                    id="bsb" 
                    name="bsb" 
                    value={invoiceData.bsb}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input 
                    id="accountNumber" 
                    name="accountNumber" 
                    value={invoiceData.accountNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoiceForm;
