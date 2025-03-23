import React, { useState } from 'react';
import { useInvoices } from '@/contexts/InvoiceContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCheck, Download, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import InvoiceStatusBadge from './InvoiceStatusBadge';

const BulkInvoiceActions: React.FC = () => {
  const { savedInvoices, updateInvoice, deleteInvoice } = useInvoices();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  
  const handleSelectAll = () => {
    if (selectedInvoices.length === savedInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(savedInvoices.map(invoice => invoice.id));
    }
  };
  
  const handleSelectInvoice = (id: string) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter(invId => invId !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };
  
  const isIndeterminate = selectedInvoices.length > 0 && selectedInvoices.length < savedInvoices.length;
  const isAllSelected = savedInvoices.length > 0 && selectedInvoices.length === savedInvoices.length;
  
  const handleMarkAsPaid = () => {
    if (selectedInvoices.length === 0) {
      toast.error('No invoices selected');
      return;
    }
    
    selectedInvoices.forEach(id => {
      updateInvoice(id, { status: 'paid' });
    });
    
    toast.success(`${selectedInvoices.length} invoice(s) marked as paid`);
    setSelectedInvoices([]);
  };
  
  const handleBulkDelete = () => {
    if (selectedInvoices.length === 0) {
      toast.error('No invoices selected');
      return;
    }
    
    selectedInvoices.forEach(id => {
      deleteInvoice(id);
    });
    
    toast.success(`${selectedInvoices.length} invoice(s) deleted`);
    setSelectedInvoices([]);
  };
  
  const handleExportCSV = () => {
    if (selectedInvoices.length === 0) {
      toast.error('No invoices selected');
      return;
    }
    
    const invoicesToExport = savedInvoices.filter(invoice => 
      selectedInvoices.includes(invoice.id)
    );
    
    const headers = ['Invoice Number', 'Client Name', 'Amount', 'Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...invoicesToExport.map(invoice => [
        invoice.invoiceNumber,
        invoice.recipientName,
        invoice.amount,
        invoice.date,
        invoice.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${selectedInvoices.length} invoice(s) exported`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMarkAsPaid}
                disabled={selectedInvoices.length === 0}
                className="flex items-center gap-2"
              >
                <CheckCheck size={16} />
                <span>Mark as Paid</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Mark selected invoices as paid</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportCSV}
                disabled={selectedInvoices.length === 0}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                <span>Export CSV</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Export selected invoices as CSV</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleBulkDelete}
                disabled={selectedInvoices.length === 0}
                className="flex items-center gap-2"
              >
                <Trash size={16} />
                <span>Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Delete selected invoices</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all invoices"
                />
              </TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {savedInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              savedInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedInvoices.includes(invoice.id)}
                      onCheckedChange={() => handleSelectInvoice(invoice.id)}
                      aria-label={`Select invoice ${invoice.invoiceNumber}`}
                    />
                  </TableCell>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.recipientName}</TableCell>
                  <TableCell>${parseFloat(invoice.amount).toFixed(2)}</TableCell>
                  <TableCell>{format(new Date(invoice.date), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BulkInvoiceActions;
