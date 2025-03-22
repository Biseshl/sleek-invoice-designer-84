
export interface InvoiceData {
  // Editable Fields
  invoiceNumber: string;
  date: string;
  description: string;
  amount: string;
  
  // Recipient Fields
  recipientName: string;
  recipientAddress: string;
  
  // Fixed Fields (Pre-Filled but Editable)
  issuerName: string;
  issuerAddress: string;
  abn: string;
  email: string;
  phone: string;
  bankName: string;
  accountName: string;
  bsb: string;
  accountNumber: string;
}

export interface ClientInfo {
  id: string;
  name: string;
  address: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface BusinessInfo {
  name: string;
  address: string;
  abn: string;
  email: string;
  phone: string;
  bankName: string;
  accountName: string;
  bsb: string;
  accountNumber: string;
}

export interface WorkDay {
  date: Date;
  hours: number;
  hourlyRate: number;
}

export const defaultInvoiceData: InvoiceData = {
  invoiceNumber: "INV-001",
  date: new Date().toISOString().split('T')[0],
  description: "Consulting Services",
  amount: "1,000.00",
  
  recipientName: "Prime Cleaning & Maintenance",
  recipientAddress: "Level 2/143 Wells St, South\nMelbourne VIC 3205",
  
  issuerName: "John Smith",
  issuerAddress: "123 Business Street\nSydney NSW 2000\nAustralia",
  abn: "12 345 678 901",
  email: "john.smith@example.com",
  phone: "+61 2 1234 5678",
  bankName: "Commonwealth Bank",
  accountName: "John Smith",
  bsb: "062-000",
  accountNumber: "12345678"
};

export const defaultBusinessInfo: BusinessInfo = {
  name: "John Smith",
  address: "123 Business Street\nSydney NSW 2000\nAustralia",
  abn: "12 345 678 901",
  email: "john.smith@example.com",
  phone: "+61 2 1234 5678",
  bankName: "Commonwealth Bank",
  accountName: "John Smith",
  bsb: "062-000",
  accountNumber: "12345678"
};
