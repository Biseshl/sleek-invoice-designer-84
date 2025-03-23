
import React from 'react';
import { motion } from 'framer-motion';
import { useInvoices } from '@/contexts/InvoiceContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const InvoiceTemplateSelector: React.FC = () => {
  const { selectedTemplate, setSelectedTemplate } = useInvoices();

  const templates: { id: 'standard' | 'professional' | 'minimal', name: string, description: string, color: string }[] = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Clean and simple design with all essential details',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Elegant design with company branding emphasis',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Streamlined layout focusing only on key information',
      color: 'bg-gray-50 border-gray-200'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Invoice Template</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer transition-all border-2 h-full flex flex-col ${
                selectedTemplate === template.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              } ${template.color}`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  {selectedTemplate === template.id && (
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="flex-1 flex items-end justify-center mt-2">
                  <div className={`w-full rounded border p-2 ${
                    template.id === 'standard' ? 'border-blue-300 bg-white' :
                    template.id === 'professional' ? 'border-purple-300 bg-white' :
                    'border-gray-300 bg-white'
                  }`}>
                    <div className="h-2 w-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 w-16 bg-gray-200 rounded mb-4"></div>
                    <div className="grid grid-cols-3 gap-1 mb-2">
                      <div className="h-1 bg-gray-200 rounded"></div>
                      <div className="h-1 bg-gray-200 rounded"></div>
                      <div className="h-1 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceTemplateSelector;
