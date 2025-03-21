
import html2pdf from 'html2pdf.js';
import { InvoiceData } from './invoiceTypes';
import { toast } from 'sonner';

export const generatePDF = (invoiceData: InvoiceData): void => {
  // Hide elements that shouldn't be in the PDF
  const printElements = document.querySelectorAll('.no-print');
  printElements.forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });

  const invoiceElement = document.getElementById('invoice-preview');
  
  if (!invoiceElement) {
    toast.error('Could not find invoice element');
    return;
  }

  const opt = {
    margin: [0, 0, 0, 0],
    filename: `Invoice_${invoiceData.invoiceNumber}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  toast.promise(
    html2pdf().set(opt).from(invoiceElement).save(),
    {
      loading: 'Generating PDF...',
      success: 'PDF downloaded successfully',
      error: 'Failed to generate PDF',
    }
  );

  // Restore hidden elements
  setTimeout(() => {
    printElements.forEach(el => {
      (el as HTMLElement).style.display = '';
    });
  }, 500);
};

export const emailInvoice = (invoiceData: InvoiceData): void => {
  // In a real app, you would send the PDF to the server for emailing
  // For this demo, we'll just open the email client
  const subject = encodeURIComponent(`Invoice ${invoiceData.invoiceNumber}`);
  const body = encodeURIComponent(`Please find attached invoice ${invoiceData.invoiceNumber} for ${invoiceData.amount} AUD.\n\nRegards,\n${invoiceData.issuerName}`);
  
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
  
  toast.success('Email client opened');
};
