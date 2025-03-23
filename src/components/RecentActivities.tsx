
import React from 'react';
import { useInvoices } from '@/contexts/InvoiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const RecentActivities: React.FC = () => {
  const { savedInvoices } = useInvoices();
  
  // Sort invoices by creation date (newest first)
  const sortedInvoices = [...savedInvoices].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  // Take only the last 5 invoices
  const recentInvoices = sortedInvoices.slice(0, 5);
  
  const getIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'overdue':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <FileText size={16} className="text-blue-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {recentInvoices.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            No recent activities
          </div>
        ) : (
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                <div className="mt-0.5">{getIcon(invoice.status)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">Invoice #{invoice.invoiceNumber}</h4>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(invoice.createdAt), 'dd MMM yyyy')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {invoice.recipientName} - ${parseFloat(invoice.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
