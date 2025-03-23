
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoices, SavedInvoice } from '@/contexts/InvoiceContext';
import { useUser } from '@/contexts/UserContext';
import Header from '@/components/Header';
import InvoicePreview from '@/components/InvoicePreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { savedInvoices, updateInvoice, deleteInvoice } = useInvoices();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [invoice, setInvoice] = useState<SavedInvoice | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [invoiceStatus, setInvoiceStatus] = useState<'draft' | 'pending' | 'paid'>('pending');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (id && savedInvoices) {
      const foundInvoice = savedInvoices.find(inv => inv.id === id);
      if (foundInvoice) {
        setInvoice(foundInvoice);
        setInvoiceStatus(foundInvoice.status);
      } else {
        toast.error('Invoice not found');
        navigate('/dashboard');
      }
    }
  }, [id, savedInvoices, navigate, user]);

  const handleDownloadPDF = () => {
    if (!invoice) return;
    
    const element = document.getElementById('invoice-preview');
    if (!element) return;

    const options = {
      margin: 10,
      filename: `Invoice-${invoice.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    element.classList.add('pdf-export');
    
    html2pdf().set(options).from(element).save().then(() => {
      element.classList.remove('pdf-export');
      toast.success('Invoice downloaded successfully');
    });
  };

  const handleEditInvoice = () => {
    // In a real app, you would navigate to an edit page
    // or populate the form with this invoice's data
    toast.info('Edit functionality would be implemented in a full application');
  };

  const handleDeleteInvoice = () => {
    if (!invoice) return;
    
    deleteInvoice(invoice.id);
    toast.success('Invoice deleted successfully');
    navigate('/dashboard');
  };

  const handleStatusChange = (status: string) => {
    if (!invoice) return;
    
    const newStatus = status as 'draft' | 'pending' | 'paid';
    setInvoiceStatus(newStatus);
    updateInvoice(invoice.id, { status: newStatus });
    toast.success(`Invoice status updated to ${status}`);
  };

  if (!invoice) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Invoice not found</h2>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
            <p className="text-muted-foreground">
              Created on {format(new Date(invoice.createdAt), 'PPP')}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="min-w-[150px]">
              <Select value={invoiceStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" onClick={handleEditInvoice}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <InvoicePreview 
            invoiceData={invoice} 
            templateType={invoice.templateType} 
          />
        </div>
      </main>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              invoice and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvoice}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceDetail;
