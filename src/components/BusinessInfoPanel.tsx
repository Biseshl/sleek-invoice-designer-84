
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, IdCard } from 'lucide-react';
import { BusinessInfo, defaultBusinessInfo } from '@/lib/invoiceTypes';
import { useToast } from '@/hooks/use-toast';
import AnimatedButton from './AnimatedButton';

interface BusinessInfoPanelProps {
  onSaveBusinessInfo: (info: BusinessInfo) => void;
}

const BusinessInfoPanel: React.FC<BusinessInfoPanelProps> = ({ onSaveBusinessInfo }) => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(defaultBusinessInfo);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Load saved business info from localStorage on component mount
  useEffect(() => {
    const savedInfo = localStorage.getItem('businessInfo');
    if (savedInfo) {
      setBusinessInfo(JSON.parse(savedInfo));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!businessInfo.name || !businessInfo.address || !businessInfo.abn) {
      toast({
        title: "Missing Information",
        description: "Business name, address, and ABN are required",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('businessInfo', JSON.stringify(businessInfo));
    onSaveBusinessInfo(businessInfo);
    setIsEditing(false);
    
    toast({
      title: "Business Information Saved",
      description: "Your business details have been updated"
    });
  };

  return (
    <Card className="shadow-subtle border-border/40 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Your Business Information</span>
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business/Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={businessInfo.name}
                  onChange={handleInputChange}
                  placeholder="Business or Individual Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abn">ABN</Label>
                <Input 
                  id="abn" 
                  name="abn"
                  value={businessInfo.abn}
                  onChange={handleInputChange}
                  placeholder="12 345 678 901"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                name="address"
                value={businessInfo.address}
                onChange={handleInputChange}
                rows={3}
                placeholder="Full Business Address"
                className="resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  value={businessInfo.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={businessInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input 
                id="bankName" 
                name="bankName"
                value={businessInfo.bankName}
                onChange={handleInputChange}
                placeholder="Bank Name"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input 
                  id="accountName" 
                  name="accountName"
                  value={businessInfo.accountName}
                  onChange={handleInputChange}
                  placeholder="Account Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bsb">BSB</Label>
                <Input 
                  id="bsb" 
                  name="bsb"
                  value={businessInfo.bsb}
                  onChange={handleInputChange}
                  placeholder="000-000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input 
                  id="accountNumber" 
                  name="accountNumber"
                  value={businessInfo.accountNumber}
                  onChange={handleInputChange}
                  placeholder="12345678"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  const savedInfo = localStorage.getItem('businessInfo');
                  if (savedInfo) {
                    setBusinessInfo(JSON.parse(savedInfo));
                  } else {
                    setBusinessInfo(defaultBusinessInfo);
                  }
                }}
              >
                Cancel
              </Button>
              <AnimatedButton 
                variant="primary" 
                size="sm"
                onClick={handleSave}
                icon={<Save className="w-4 h-4" />}
              >
                Save Information
              </AnimatedButton>
            </div>
          </div>
        ) : (
          // Display business info
          <div className="space-y-4">
            <div className="flex items-start">
              <IdCard className="h-5 w-5 mr-3 mt-1 text-primary/70" />
              <div className="space-y-1">
                <h3 className="font-medium text-lg">{businessInfo.name}</h3>
                <div className="text-sm">ABN: {businessInfo.abn}</div>
                <div className="text-sm text-muted-foreground whitespace-pre-line">{businessInfo.address}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Contact</div>
                <div className="text-sm">{businessInfo.email}</div>
                <div className="text-sm">{businessInfo.phone}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Payment Details</div>
                <div className="text-sm">{businessInfo.bankName}</div>
                <div className="text-sm">BSB: {businessInfo.bsb}</div>
                <div className="text-sm">Acc: {businessInfo.accountNumber}</div>
                <div className="text-sm">Name: {businessInfo.accountName}</div>
              </div>
            </div>
            
            <div className="pt-4">
              <AnimatedButton 
                variant="outline" 
                size="sm"
                onClick={() => onSaveBusinessInfo(businessInfo)}
                className="w-full"
              >
                Use for Invoice
              </AnimatedButton>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessInfoPanel;
