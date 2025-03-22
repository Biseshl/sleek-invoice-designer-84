
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, User, Save, Trash } from 'lucide-react';
import { ClientInfo } from '@/lib/invoiceTypes';
import { useToast } from '@/hooks/use-toast';
import AnimatedButton from './AnimatedButton';

interface ClientInfoPanelProps {
  onSelectClient: (client: ClientInfo) => void;
}

const ClientInfoPanel: React.FC<ClientInfoPanelProps> = ({ onSelectClient }) => {
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<ClientInfo>({
    id: '',
    name: '',
    address: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Load saved clients from localStorage on component mount
  useEffect(() => {
    const savedClients = localStorage.getItem('savedClients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
  }, []);

  // Save clients to localStorage whenever the clients array changes
  useEffect(() => {
    localStorage.setItem('savedClients', JSON.stringify(clients));
  }, [clients]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingClient(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateNew = () => {
    setIsEditing(true);
    setSelectedClientId(null);
    setEditingClient({
      id: Date.now().toString(),
      name: '',
      address: '',
      email: '',
      phone: '',
      notes: ''
    });
  };

  const handleSelectClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    if (client) {
      setSelectedClientId(id);
      setEditingClient(client);
      setIsEditing(false);
      onSelectClient(client);
    }
  };

  const handleEditClient = () => {
    setIsEditing(true);
  };

  const handleSaveClient = () => {
    if (!editingClient.name || !editingClient.address) {
      toast({
        title: "Missing Information",
        description: "Client name and address are required",
        variant: "destructive"
      });
      return;
    }

    // Check if we're updating an existing client or adding a new one
    if (clients.some(c => c.id === editingClient.id)) {
      setClients(clients.map(c => c.id === editingClient.id ? editingClient : c));
      toast({
        title: "Client Updated",
        description: `${editingClient.name} has been updated successfully`
      });
    } else {
      setClients([...clients, editingClient]);
      toast({
        title: "Client Saved",
        description: `${editingClient.name} has been saved successfully`
      });
    }
    
    setIsEditing(false);
    setSelectedClientId(editingClient.id);
    onSelectClient(editingClient);
  };

  const handleDeleteClient = () => {
    if (selectedClientId) {
      const clientName = clients.find(c => c.id === selectedClientId)?.name;
      setClients(clients.filter(c => c.id !== selectedClientId));
      setSelectedClientId(null);
      setEditingClient({
        id: '',
        name: '',
        address: '',
        email: '',
        phone: '',
        notes: ''
      });
      toast({
        title: "Client Deleted",
        description: `${clientName} has been removed successfully`
      });
    }
  };

  return (
    <Card className="shadow-subtle border-border/40 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Client Information</span>
          <AnimatedButton 
            variant="outline" 
            size="sm" 
            onClick={handleCreateNew}
            icon={<Plus className="w-4 h-4" />}
          >
            New Client
          </AnimatedButton>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Client List */}
        <div className="border rounded-md p-2 h-[300px] overflow-y-auto">
          <div className="font-medium mb-2 text-sm text-muted-foreground">Your Clients</div>
          {clients.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              <User className="mx-auto h-8 w-8 opacity-50 mb-2" />
              <p className="text-sm">No clients yet</p>
              <p className="text-xs">Click "New Client" to add one</p>
            </div>
          ) : (
            <div className="space-y-1">
              {clients.map(client => (
                <div 
                  key={client.id}
                  className={`p-2 rounded-md cursor-pointer flex items-center ${selectedClientId === client.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                  onClick={() => handleSelectClient(client.id)}
                >
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">{client.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{client.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Client Details */}
        <div className="md:col-span-2 border rounded-md p-4">
          {isEditing ? (
            <div className="space-y-4">
              <div className="font-medium mb-2 text-sm">
                {editingClient.id && clients.some(c => c.id === editingClient.id) ? 'Edit Client' : 'New Client'}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Client Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={editingClient.name}
                  onChange={handleInputChange}
                  placeholder="Company or Individual Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  name="address"
                  value={editingClient.address}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Full Address"
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
                    value={editingClient.email || ''}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={editingClient.phone || ''}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  name="notes"
                  value={editingClient.notes || ''}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Additional information about this client"
                  className="resize-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    if (selectedClientId) {
                      const originalClient = clients.find(c => c.id === selectedClientId);
                      if (originalClient) setEditingClient(originalClient);
                    } else {
                      setEditingClient({
                        id: '',
                        name: '',
                        address: '',
                        email: '',
                        phone: '',
                        notes: ''
                      });
                    }
                  }}
                >
                  Cancel
                </Button>
                <AnimatedButton 
                  variant="primary" 
                  size="sm"
                  onClick={handleSaveClient}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Client
                </AnimatedButton>
              </div>
            </div>
          ) : selectedClientId ? (
            // Display selected client
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium text-lg">{editingClient.name}</h3>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">{editingClient.address}</div>
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleEditClient}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDeleteClient}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {editingClient.email && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="text-sm font-medium">{editingClient.email}</div>
                  </div>
                )}
                {editingClient.phone && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Phone</div>
                    <div className="text-sm font-medium">{editingClient.phone}</div>
                  </div>
                )}
              </div>
              
              {editingClient.notes && (
                <div className="space-y-1 pt-2">
                  <div className="text-xs text-muted-foreground">Notes</div>
                  <div className="text-sm border rounded-md p-2 bg-muted/30">{editingClient.notes}</div>
                </div>
              )}

              <div className="pt-4">
                <AnimatedButton 
                  variant="primary" 
                  size="sm"
                  onClick={() => onSelectClient(editingClient)}
                  className="w-full"
                >
                  Use for Invoice
                </AnimatedButton>
              </div>
            </div>
          ) : (
            // No client selected
            <div className="h-full flex items-center justify-center flex-col space-y-2 text-center p-6">
              <User className="h-10 w-10 opacity-30 mb-2" />
              <h3 className="font-medium">No Client Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a client from the list or create a new one to view and edit details.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfoPanel;
