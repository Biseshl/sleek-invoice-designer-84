
import React, { createContext, useContext, useState, useEffect } from 'react';
import { InvoiceData, defaultInvoiceData } from '@/lib/invoiceTypes';

export interface SavedInvoice extends InvoiceData {
  id: string;
  createdAt: string;
  status: 'draft' | 'pending' | 'paid';
  templateType: 'standard' | 'professional' | 'minimal';
}

interface InvoiceContextType {
  savedInvoices: SavedInvoice[];
  currentInvoice: InvoiceData;
  selectedTemplate: string;
  setCurrentInvoice: React.Dispatch<React.SetStateAction<InvoiceData>>;
  saveInvoice: (invoice: InvoiceData, template: string, status?: 'draft' | 'pending' | 'paid') => void;
  updateInvoice: (id: string, updates: Partial<SavedInvoice>) => void;
  deleteInvoice: (id: string) => void;
  setSelectedTemplate: (template: string) => void;
  filterInvoices: (filters: Partial<InvoiceFilters>) => SavedInvoice[];
}

export interface InvoiceFilters {
  clientName: string;
  dateFrom: string;
  dateTo: string;
  status: 'all' | 'draft' | 'pending' | 'paid';
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData>(defaultInvoiceData);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard');

  useEffect(() => {
    // Load saved invoices from localStorage
    const storedInvoices = localStorage.getItem('savedInvoices');
    if (storedInvoices) {
      setSavedInvoices(JSON.parse(storedInvoices));
    }
  }, []);

  const saveInvoice = (invoice: InvoiceData, template: string, status: 'draft' | 'pending' | 'paid' = 'pending') => {
    const newInvoice: SavedInvoice = {
      ...invoice,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      status,
      templateType: template as any
    };

    const updatedInvoices = [...savedInvoices, newInvoice];
    setSavedInvoices(updatedInvoices);
    localStorage.setItem('savedInvoices', JSON.stringify(updatedInvoices));
  };

  const updateInvoice = (id: string, updates: Partial<SavedInvoice>) => {
    const updatedInvoices = savedInvoices.map(invoice => 
      invoice.id === id ? { ...invoice, ...updates } : invoice
    );
    setSavedInvoices(updatedInvoices);
    localStorage.setItem('savedInvoices', JSON.stringify(updatedInvoices));
  };

  const deleteInvoice = (id: string) => {
    const updatedInvoices = savedInvoices.filter(invoice => invoice.id !== id);
    setSavedInvoices(updatedInvoices);
    localStorage.setItem('savedInvoices', JSON.stringify(updatedInvoices));
  };

  const filterInvoices = (filters: Partial<InvoiceFilters>) => {
    return savedInvoices.filter(invoice => {
      // Filter by client name
      if (filters.clientName && !invoice.recipientName.toLowerCase().includes(filters.clientName.toLowerCase())) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        const invoiceDate = new Date(invoice.date);
        if (invoiceDate < fromDate) return false;
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        const invoiceDate = new Date(invoice.date);
        if (invoiceDate > toDate) return false;
      }
      
      // Filter by status
      if (filters.status && filters.status !== 'all' && invoice.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  };

  return (
    <InvoiceContext.Provider 
      value={{ 
        savedInvoices, 
        currentInvoice, 
        selectedTemplate, 
        setCurrentInvoice, 
        saveInvoice, 
        updateInvoice, 
        deleteInvoice, 
        setSelectedTemplate,
        filterInvoices
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
