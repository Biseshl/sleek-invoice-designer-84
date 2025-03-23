
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useInvoices } from '@/contexts/InvoiceContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleDollarSign, Clock, TrendingUp, Info } from 'lucide-react';

const AnalyticsSummary: React.FC = () => {
  const { savedInvoices } = useInvoices();
  
  const stats = useMemo(() => {
    const total = savedInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
    const pending = savedInvoices.filter(inv => inv.status === 'pending').length;
    const paid = savedInvoices.filter(inv => inv.status === 'paid').length;
    const overdue = savedInvoices.filter(inv => inv.status === 'overdue').length;
    
    return { total, pending, paid, overdue };
  }, [savedInvoices]);

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-4 p-4 bg-primary/10 rounded-lg">
            <div className="p-2 bg-primary rounded-full text-primary-foreground">
              <CircleDollarSign size={24} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-medium text-muted-foreground">Total Earnings</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Sum of all invoice amounts</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-2xl font-bold">${stats.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-yellow-500/10 rounded-lg">
            <div className="p-2 bg-yellow-500 rounded-full text-primary-foreground">
              <Clock size={24} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-medium text-muted-foreground">Pending Invoices</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Invoices awaiting payment</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-green-500/10 rounded-lg">
            <div className="p-2 bg-green-500 rounded-full text-primary-foreground">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-medium text-muted-foreground">Completion Rate</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Percentage of paid invoices</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-2xl font-bold">
                {savedInvoices.length > 0 
                  ? `${Math.round((stats.paid / savedInvoices.length) * 100)}%` 
                  : '0%'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSummary;
