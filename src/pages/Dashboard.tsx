import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useInvoices, InvoiceFilters, SavedInvoice } from '@/contexts/InvoiceContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Search, Filter, FileText, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AnalyticsSummary from '@/components/AnalyticsSummary';
import BulkInvoiceActions from '@/components/BulkInvoiceActions';
import RecentActivities from '@/components/RecentActivities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const { savedInvoices, filterInvoices } = useInvoices();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 6;

  const [filters, setFilters] = useState<InvoiceFilters>({
    clientName: '',
    dateFrom: '',
    dateTo: '',
    status: 'all'
  });
  
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [filteredInvoices, setFilteredInvoices] = useState<SavedInvoice[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (savedInvoices) {
      const filtered = filterInvoices({
        clientName: filters.clientName,
        dateFrom: fromDate ? format(fromDate, 'yyyy-MM-dd') : '',
        dateTo: toDate ? format(toDate, 'yyyy-MM-dd') : '',
        status: filters.status
      });
      setFilteredInvoices(filtered);
      setCurrentPage(1);
    }
  }, [filters, fromDate, toDate, savedInvoices, filterInvoices]);

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleResetFilters = () => {
    setFilters({
      clientName: '',
      dateFrom: '',
      dateTo: '',
      status: 'all'
    });
    setFromDate(undefined);
    setToDate(undefined);
  };

  const handleFilterChange = (name: keyof InvoiceFilters, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/invoice/${invoiceId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const statusColors = {
    draft: 'bg-gray-200 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-[1800px]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <motion.div variants={itemVariants}>
              <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name || 'User'}</h1>
              <p className="text-muted-foreground">Manage your invoices and create new ones</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Create Invoice</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Create a new invoice</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          </div>
          
          <motion.div variants={itemVariants}>
            <AnalyticsSummary />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="invoices" className="space-y-4">
              <TabsList>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
                <TabsTrigger value="activities">Recent Activities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="invoices">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle>Your Invoices</CardTitle>
                        <CardDescription>
                          You have {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
                        </CardDescription>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search by client name..."
                            className="pl-8 w-full"
                            value={filters.clientName}
                            onChange={(e) => handleFilterChange('clientName', e.target.value)}
                          />
                        </div>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="flex items-center gap-2"
                              onClick={() => setShowFilters(!showFilters)}
                            >
                              <Filter size={16} />
                              <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Toggle filter options</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {showFilters && (
                    <CardContent>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <span className="text-sm font-medium">Date From</span>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !fromDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={fromDate}
                                  onSelect={setFromDate}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div className="space-y-2">
                            <span className="text-sm font-medium">Date To</span>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !toDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {toDate ? format(toDate, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={toDate}
                                  onSelect={setToDate}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div className="space-y-2">
                            <span className="text-sm font-medium">Status</span>
                            <Select
                              value={filters.status}
                              onValueChange={(value) => handleFilterChange('status', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <Button 
                            variant="outline" 
                            className="mr-2"
                            onClick={handleResetFilters}
                          >
                            Reset Filters
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                  
                  <CardContent>
                    {currentInvoices.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentInvoices.map((invoice) => (
                          <motion.div 
                            key={invoice.id}
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          >
                            <Card className="h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                                  onClick={() => handleViewInvoice(invoice.id)}>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-base">{invoice.recipientName}</CardTitle>
                                    <CardDescription className="text-sm">
                                      {invoice.invoiceNumber}
                                    </CardDescription>
                                  </div>
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
                                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-2 pt-0">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Date:</span>
                                    <span>{format(new Date(invoice.date), 'dd MMM yyyy')}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Amount:</span>
                                    <span className="font-medium">${parseFloat(invoice.amount).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Template:</span>
                                    <span>{invoice.templateType.charAt(0).toUpperCase() + invoice.templateType.slice(1)}</span>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="pt-2 mt-auto">
                                <Button variant="ghost" size="sm" className="ml-auto flex items-center gap-1">
                                  <FileText size={14} />
                                  <span>View</span>
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="flex justify-center mb-4">
                          <FileText size={48} className="text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-medium">No invoices found</h3>
                        <p className="text-muted-foreground">
                          {filters.clientName || fromDate || toDate || filters.status !== 'all' 
                            ? 'Try adjusting your filters' 
                            : 'Create your first invoice to get started'}
                        </p>
                        {filters.clientName || fromDate || toDate || filters.status !== 'all' ? (
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={handleResetFilters}
                          >
                            Reset Filters
                          </Button>
                        ) : (
                          <Button 
                            className="mt-4"
                            onClick={() => navigate('/')}
                          >
                            Create Invoice
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                  
                  {filteredInvoices.length > invoicesPerPage && (
                    <CardFooter>
                      <Pagination className="w-full">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={currentPage === page}
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="bulk">
                <Card>
                  <CardHeader>
                    <CardTitle>Bulk Invoice Management</CardTitle>
                    <CardDescription>
                      Select multiple invoices to perform actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BulkInvoiceActions />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activities">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <RecentActivities />
                  </div>
                  <div>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Invoice Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {['draft', 'pending', 'paid', 'overdue'].map((status) => {
                            const count = savedInvoices.filter(inv => inv.status === status).length;
                            const percentage = savedInvoices.length > 0 
                              ? Math.round((count / savedInvoices.length) * 100) 
                              : 0;
                            
                            return (
                              <div key={status} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="capitalize">{status}</span>
                                  <span>{count} ({percentage}%)</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className={cn(
                                      "h-full rounded-full",
                                      status === 'paid' && "bg-green-500",
                                      status === 'pending' && "bg-yellow-500",
                                      status === 'draft' && "bg-gray-500",
                                      status === 'overdue' && "bg-red-500"
                                    )}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
