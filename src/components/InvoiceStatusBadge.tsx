
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

type StatusType = 'draft' | 'pending' | 'paid' | 'overdue';

interface InvoiceStatusBadgeProps {
  status: StatusType;
  className?: string;
}

const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'paid':
        return {
          icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
          variant: 'default' as const,
          label: 'Paid',
          className: 'bg-green-500 hover:bg-green-600 text-white'
        };
      case 'pending':
        return {
          icon: <Clock className="h-3 w-3 mr-1" />,
          variant: 'secondary' as const,
          label: 'Pending',
          className: 'bg-amber-400 hover:bg-amber-500 text-amber-950'
        };
      case 'draft':
        return {
          icon: null,
          variant: 'outline' as const,
          label: 'Draft',
          className: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
        };
      case 'overdue':
        return {
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          variant: 'destructive' as const,
          label: 'Overdue',
          className: 'bg-red-500 hover:bg-red-600 text-white'
        };
      default:
        return {
          icon: null,
          variant: 'outline' as const,
          label: status,
          className: ''
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant} 
      className={`flex items-center justify-center capitalize px-2 py-1 ${config.className} ${className}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};

export default InvoiceStatusBadge;
