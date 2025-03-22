
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

export interface RateSettings {
  weekdayRate: number;
  saturdayRate: number;
  sundayRate: number;
  holidayRate?: number;
}

export const defaultInvoiceData: InvoiceData = {
  invoiceNumber: "INV-001",
  date: new Date().toISOString().split('T')[0],
  description: "Consulting Services",
  amount: "0.00",
  
  recipientName: "",
  recipientAddress: "",
  
  issuerName: "",
  issuerAddress: "",
  abn: "",
  email: "",
  phone: "",
  bankName: "",
  accountName: "",
  bsb: "",
  accountNumber: ""
};

export const defaultBusinessInfo: BusinessInfo = {
  name: "Your Business Name",
  address: "Your Business Address\nCity, State, Postcode\nCountry",
  abn: "XX XXX XXX XXX",
  email: "your.email@example.com",
  phone: "+61 X XXXX XXXX",
  bankName: "Your Bank",
  accountName: "Your Name",
  bsb: "XXX-XXX",
  accountNumber: "XXXXXXXX"
};

export const defaultRateSettings: RateSettings = {
  weekdayRate: 25,
  saturdayRate: 35,
  sundayRate: 45,
  holidayRate: 50
};
