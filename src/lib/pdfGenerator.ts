
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

  // Better PDF generation options
  const opt = {
    margin: [5, 0, 5, 0], // Top, right, bottom, left margins in mm
    filename: `Invoice_${invoiceData.invoiceNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      letterRendering: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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
  // Create a more professional email template
  const subject = encodeURIComponent(`Invoice ${invoiceData.invoiceNumber} from ${invoiceData.issuerName}`);
  const body = encodeURIComponent(
    `Dear ${invoiceData.recipientName},\n\n` +
    `Please find attached Invoice ${invoiceData.invoiceNumber} for ${invoiceData.amount} AUD.\n\n` +
    `Payment Details:\n` +
    `Bank: ${invoiceData.bankName}\n` +
    `BSB: ${invoiceData.bsb}\n` +
    `Account: ${invoiceData.accountNumber}\n` +
    `Account Name: ${invoiceData.accountName}\n\n` +
    `If you have any questions regarding this invoice, please don't hesitate to contact me.\n\n` +
    `Regards,\n${invoiceData.issuerName}\n` +
    `${invoiceData.email}\n${invoiceData.phone}`
  );
  
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
  
  toast.success('Email client opened with invoice details');
};
