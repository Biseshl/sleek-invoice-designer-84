
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format, parse, isValid, isSameDay } from 'date-fns';
import { CalendarIcon, Clock, DollarSign, Trash2 } from 'lucide-react';
import { WorkDay } from '@/lib/invoiceTypes';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import AnimatedButton from './AnimatedButton';

interface WorkCalendarPanelProps {
  onGenerateInvoiceAmount: (amount: string) => void;
}

const WorkCalendarPanel: React.FC<WorkCalendarPanelProps> = ({ onGenerateInvoiceAmount }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hours, setHours] = useState<string>('8');
  const [hourlyRate, setHourlyRate] = useState<string>('25');
  const [workDays, setWorkDays] = useState<WorkDay[]>([]);
  const [defaultHourlyRate, setDefaultHourlyRate] = useState<string>('25');
  const { toast } = useToast();

  // Load work days from localStorage on component mount
  useEffect(() => {
    const savedWorkDays = localStorage.getItem('workDays');
    if (savedWorkDays) {
      // Convert date strings back to Date objects
      const parsedWorkDays: WorkDay[] = JSON.parse(savedWorkDays).map((day: any) => ({
        ...day,
        date: new Date(day.date)
      }));
      setWorkDays(parsedWorkDays);
    }

    const savedRate = localStorage.getItem('defaultHourlyRate');
    if (savedRate) {
      setDefaultHourlyRate(savedRate);
      setHourlyRate(savedRate);
    }
  }, []);

  // Save work days to localStorage whenever the workDays array changes
  useEffect(() => {
    localStorage.setItem('workDays', JSON.stringify(workDays));
  }, [workDays]);

  // Save default hourly rate to localStorage
  useEffect(() => {
    localStorage.setItem('defaultHourlyRate', defaultHourlyRate);
  }, [defaultHourlyRate]);

  const handleDateSelect = (selected: Date | undefined) => {
    if (selected) {
      setDate(selected);
      setSelectedDate(selected);
      
      // Check if there's already a work day for this date
      const existingWorkDay = workDays.find(day => 
        isSameDay(day.date, selected)
      );
      
      if (existingWorkDay) {
        setHours(existingWorkDay.hours.toString());
        setHourlyRate(existingWorkDay.hourlyRate.toString());
      } else {
        setHours('8');
        setHourlyRate(defaultHourlyRate);
      }
    }
  };

  const handleAddWorkDay = () => {
    if (!selectedDate) {
      toast({
        title: "No Date Selected",
        description: "Please select a date first",
        variant: "destructive"
      });
      return;
    }

    const parsedHours = parseFloat(hours);
    const parsedRate = parseFloat(hourlyRate);

    if (isNaN(parsedHours) || parsedHours <= 0) {
      toast({
        title: "Invalid Hours",
        description: "Hours must be a positive number",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(parsedRate) || parsedRate <= 0) {
      toast({
        title: "Invalid Rate",
        description: "Hourly rate must be a positive number",
        variant: "destructive"
      });
      return;
    }

    // Check if we're updating an existing work day
    const existingIndex = workDays.findIndex(day => 
      isSameDay(day.date, selectedDate)
    );

    if (existingIndex !== -1) {
      // Update existing work day
      const updatedWorkDays = [...workDays];
      updatedWorkDays[existingIndex] = {
        date: selectedDate,
        hours: parsedHours,
        hourlyRate: parsedRate
      };
      setWorkDays(updatedWorkDays);
      
      toast({
        title: "Work Day Updated",
        description: `Updated work hours for ${format(selectedDate, 'dd MMM yyyy')}`
      });
    } else {
      // Add new work day
      setWorkDays([...workDays, {
        date: selectedDate,
        hours: parsedHours,
        hourlyRate: parsedRate
      }]);
      
      toast({
        title: "Work Day Added",
        description: `Added ${parsedHours} hours for ${format(selectedDate, 'dd MMM yyyy')}`
      });
    }

    // Save current hourly rate as default if it's different
    if (defaultHourlyRate !== hourlyRate) {
      setDefaultHourlyRate(hourlyRate);
    }
  };

  const handleRemoveWorkDay = (dateToRemove: Date) => {
    setWorkDays(workDays.filter(day => !isSameDay(day.date, dateToRemove)));
    
    toast({
      title: "Work Day Removed",
      description: `Removed work day for ${format(dateToRemove, 'dd MMM yyyy')}`
    });

    // If the removed day was selected, clear selection
    if (selectedDate && isSameDay(selectedDate, dateToRemove)) {
      setSelectedDate(null);
    }
  };

  const calculateTotalAmount = () => {
    return workDays.reduce((total, day) => {
      return total + (day.hours * day.hourlyRate);
    }, 0);
  };

  const generateInvoiceAmount = () => {
    const total = calculateTotalAmount();
    if (total <= 0) {
      toast({
        title: "No Work Days",
        description: "Add some work days first to calculate an invoice amount",
        variant: "destructive"
      });
      return;
    }
    
    const formattedAmount = total.toLocaleString('en-AU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    onGenerateInvoiceAmount(formattedAmount);
    
    toast({
      title: "Invoice Amount Generated",
      description: `Total amount of $${formattedAmount} added to invoice`
    });
  };

  // Function to highlight days on the calendar
  const isDayHighlighted = (day: Date) => {
    return workDays.some(workDay => isSameDay(workDay.date, day));
  };

  return (
    <Card className="shadow-subtle border-border/40 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Work Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="flex flex-col space-y-4">
            <div className="border rounded-md p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className={cn("p-3 pointer-events-auto")}
                modifiersClassNames={{
                  selected: 'bg-primary text-primary-foreground',
                }}
                modifiers={{
                  highlighted: (day) => isDayHighlighted(day)
                }}
                modifiersStyles={{
                  highlighted: {
                    border: '2px solid #2563eb',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  }
                }}
              />
            </div>

            <div className="border rounded-md p-4 space-y-4">
              <div className="text-sm font-medium">Add Work Day</div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate || undefined}
                        onSelect={(date) => {
                          if (date) setSelectedDate(date);
                          handleDateSelect(date);
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours Worked</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="hours" 
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="pl-9"
                      type="number"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="hourlyRate" 
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="pl-9"
                      type="number" 
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <AnimatedButton 
                    onClick={handleAddWorkDay}
                    className="w-full"
                    variant="primary"
                  >
                    {workDays.some(day => selectedDate && isSameDay(day.date, selectedDate)) ? 'Update Day' : 'Add Day'}
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </div>
          
          {/* Work Days List and Summary */}
          <div className="flex flex-col space-y-4">
            <div className="border rounded-md p-4 flex-1 max-h-[400px] overflow-y-auto">
              <div className="font-medium mb-3 text-sm">Work Days</div>
              
              {workDays.length === 0 ? (
                <div className="text-center text-muted-foreground p-6">
                  <CalendarIcon className="mx-auto h-8 w-8 opacity-50 mb-2" />
                  <p className="text-sm">No work days added yet</p>
                  <p className="text-xs">Select a date and add hours to begin</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {workDays
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((workDay, index) => (
                      <div 
                        key={index}
                        className="border rounded-md p-3 flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">{format(workDay.date, 'EEE, MMM d, yyyy')}</div>
                          <div className="text-sm text-muted-foreground">
                            {workDay.hours} hours @ ${workDay.hourlyRate.toFixed(2)}/hr
                          </div>
                          <div className="text-sm font-medium mt-1">
                            ${(workDay.hours * workDay.hourlyRate).toFixed(2)}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveWorkDay(workDay.date)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            <div className="border rounded-md p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Total Days:</div>
                  <div>{workDays.length}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Total Hours:</div>
                  <div>{workDays.reduce((total, day) => total + day.hours, 0).toFixed(1)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Total Amount:</div>
                  <div className="text-lg font-bold">${calculateTotalAmount().toFixed(2)}</div>
                </div>
                
                <div className="pt-3">
                  <AnimatedButton 
                    variant="primary" 
                    className="w-full"
                    onClick={generateInvoiceAmount}
                    disabled={workDays.length === 0}
                    icon={<DollarSign className="w-4 h-4" />}
                  >
                    Use Amount in Invoice
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkCalendarPanel;
