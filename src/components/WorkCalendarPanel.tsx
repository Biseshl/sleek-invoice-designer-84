
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format, parse, isValid, isSameDay, getDay } from 'date-fns';
import { CalendarIcon, Clock, DollarSign, Trash2, Settings, Save } from 'lucide-react';
import { WorkDay, RateSettings, defaultRateSettings } from '@/lib/invoiceTypes';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import AnimatedButton from './AnimatedButton';
import { useBreakpoint, useIsBelowBreakpoint } from '@/hooks/use-mobile';

interface WorkCalendarPanelProps {
  onGenerateInvoiceAmount: (amount: string) => void;
}

const WorkCalendarPanel: React.FC<WorkCalendarPanelProps> = ({ onGenerateInvoiceAmount }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hours, setHours] = useState<string>('5');
  const [hourlyRate, setHourlyRate] = useState<string>('25');
  const [workDays, setWorkDays] = useState<WorkDay[]>([]);
  const [rateSettings, setRateSettings] = useState<RateSettings>(defaultRateSettings);
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
  const { toast } = useToast();
  const isTabletOrLarger = useBreakpoint('md');
  const isLargeScreen = useBreakpoint('lg');
  const isXLScreen = useBreakpoint('xl');
  const isBelowLG = useIsBelowBreakpoint('lg');

  // Load work days and rate settings from localStorage on component mount
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

    const savedRateSettings = localStorage.getItem('rateSettings');
    if (savedRateSettings) {
      setRateSettings(JSON.parse(savedRateSettings));
    }
  }, []);

  // Save work days to localStorage whenever the workDays array changes
  useEffect(() => {
    localStorage.setItem('workDays', JSON.stringify(workDays));
  }, [workDays]);

  // Save rate settings to localStorage
  useEffect(() => {
    localStorage.setItem('rateSettings', JSON.stringify(rateSettings));
  }, [rateSettings]);

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
        setHours('5');
        // Set hourly rate based on day of the week
        const dayOfWeek = getDay(selected);
        if (dayOfWeek === 0) { // Sunday
          setHourlyRate(rateSettings.sundayRate.toString());
        } else if (dayOfWeek === 6) { // Saturday
          setHourlyRate(rateSettings.saturdayRate.toString());
        } else { // Weekday
          setHourlyRate(rateSettings.weekdayRate.toString());
        }
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

  const handleRateSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue) && numValue >= 0) {
      setRateSettings(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };

  const saveRateSettings = () => {
    localStorage.setItem('rateSettings', JSON.stringify(rateSettings));
    setIsRateDialogOpen(false);
    
    toast({
      title: "Rate Settings Saved",
      description: "Your hourly rate settings have been updated"
    });
  };

  // Function to highlight days on the calendar
  const isDayHighlighted = (day: Date) => {
    return workDays.some(workDay => isSameDay(workDay.date, day));
  };

  // Function to get day type label
  const getDayTypeLabel = (date: Date) => {
    const dayOfWeek = getDay(date);
    if (dayOfWeek === 0) return "Sunday";
    if (dayOfWeek === 6) return "Saturday";
    return "Weekday";
  };

  // Function to determine the rate class based on the day
  const getDayRateClass = (date: Date) => {
    const dayOfWeek = getDay(date);
    if (dayOfWeek === 0) return "text-red-500"; // Sunday
    if (dayOfWeek === 6) return "text-orange-500"; // Saturday
    return "text-green-500"; // Weekday
  };

  return (
    <Card className="shadow-subtle border-border/40 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Work Calendar</span>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setIsRateDialogOpen(true)}
            className="flex items-center gap-1 text-primary"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Rate Settings</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-1 ${isLargeScreen ? 'xl:grid-cols-12' : 'lg:grid-cols-12'} gap-4 xl:gap-6`}>
          {/* Calendar Section */}
          <div className={`flex flex-col space-y-4 ${isLargeScreen ? 'xl:col-span-5' : 'lg:col-span-5'}`}>
            <div className="border rounded-md p-2 md:p-3 bg-white">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md w-full pointer-events-auto"
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

            <div className="border rounded-md p-3 md:p-4 space-y-3 bg-white">
              <div className="text-sm font-medium">Add Work Day</div>
              
              <div className="grid grid-cols-1 gap-3">
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
                        {selectedDate ? (
                          <div className="flex flex-col items-start">
                            <span>{format(selectedDate, 'PPP')}</span>
                            <span className={`text-xs ${getDayRateClass(selectedDate)}`}>
                              {getDayTypeLabel(selectedDate)} Rate: ${getDay(selectedDate) === 0 
                                ? rateSettings.sundayRate 
                                : getDay(selectedDate) === 6 
                                  ? rateSettings.saturdayRate 
                                  : rateSettings.weekdayRate}/hr
                            </span>
                          </div>
                        ) : (
                          <span>Pick a date</span>
                        )}
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
                        className="p-2 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className={`grid ${isXLScreen ? 'grid-cols-2' : isBelowLG ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
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
                </div>
                
                <div>
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
          <div className={`flex flex-col space-y-4 ${isLargeScreen ? 'xl:col-span-7' : 'lg:col-span-7'}`}>
            <div className="border rounded-md p-3 md:p-4 flex-1 overflow-hidden bg-white">
              <div className="font-medium mb-3 text-sm">Work Days</div>
              
              <div className={`max-h-[250px] ${isLargeScreen ? 'lg:max-h-[325px] xl:max-h-[275px] 2xl:max-h-[325px]' : 'sm:max-h-[300px]'} overflow-y-auto pr-1`}>
                {workDays.length === 0 ? (
                  <div className="text-center text-muted-foreground p-4 md:p-6">
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
                          className="border rounded-md p-2 md:p-3 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium text-xs md:text-sm">
                              {format(workDay.date, 'EEE, MMM d, yyyy')}
                              <span className={`text-xs ml-1 ${getDayRateClass(workDay.date)}`}>
                                ({getDayTypeLabel(workDay.date)})
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {workDay.hours} hours @ ${workDay.hourlyRate.toFixed(2)}/hr
                            </div>
                            <div className="text-xs md:text-sm font-medium mt-1">
                              ${(workDay.hours * workDay.hourlyRate).toFixed(2)}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveWorkDay(workDay.date)}
                            className="h-7 w-7 md:h-8 md:w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="border rounded-md p-3 md:p-4 bg-white">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-sm">Total Days:</div>
                  <div className="text-sm">{workDays.length}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium text-sm">Total Hours:</div>
                  <div className="text-sm">{workDays.reduce((total, day) => total + day.hours, 0).toFixed(1)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium text-sm">Total Amount:</div>
                  <div className="text-base md:text-lg font-bold">${calculateTotalAmount().toFixed(2)}</div>
                </div>
                
                <div className="pt-2 md:pt-3">
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

        {/* Rate Settings Dialog */}
        <Dialog open={isRateDialogOpen} onOpenChange={setIsRateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Hourly Rate Settings</DialogTitle>
              <DialogDescription>
                Set different hourly rates based on the day of the week.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weekdayRate" className="flex items-center">
                  Weekday Rate ($)
                  <span className="ml-2 text-xs text-muted-foreground">(Monday to Friday)</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="weekdayRate" 
                    name="weekdayRate"
                    value={rateSettings.weekdayRate}
                    onChange={handleRateSettingsChange}
                    className="pl-9"
                    type="number" 
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="saturdayRate" className="flex items-center text-orange-500">
                  Saturday Rate ($)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="saturdayRate" 
                    name="saturdayRate"
                    value={rateSettings.saturdayRate}
                    onChange={handleRateSettingsChange}
                    className="pl-9 border-orange-200"
                    type="number" 
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sundayRate" className="flex items-center text-red-500">
                  Sunday Rate ($)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="sundayRate" 
                    name="sundayRate"
                    value={rateSettings.sundayRate}
                    onChange={handleRateSettingsChange}
                    className="pl-9 border-red-200"
                    type="number" 
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="holidayRate" className="flex items-center text-primary">
                  Holiday Rate ($)
                  <span className="ml-2 text-xs text-muted-foreground">(Optional)</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="holidayRate" 
                    name="holidayRate"
                    value={rateSettings.holidayRate || ''}
                    onChange={handleRateSettingsChange}
                    className="pl-9 border-primary/20"
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="Enter holiday rate"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsRateDialogOpen(false)}
              >
                Cancel
              </Button>
              <AnimatedButton 
                variant="primary"
                onClick={saveRateSettings}
                icon={<Save className="h-4 w-4" />}
              >
                Save Rate Settings
              </AnimatedButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default WorkCalendarPanel;
