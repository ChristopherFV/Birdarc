
import React, { useState, useMemo } from 'react';
import { useAddInvoiceDialog } from '@/hooks/useAddInvoiceDialog';
import { useApp } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus, Trash2, FileText, Send } from 'lucide-react';
import { format, isWithinInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InvoiceUploader } from './InvoiceUploader';
import { useToast } from '@/hooks/use-toast';
import { WorkEntry } from '@/types/app-types';
import { useInvoiceFilters } from '@/hooks/useInvoiceFilters';
import { InvoiceWorkEntryFilters } from './invoice/InvoiceWorkEntryFilters';

type InvoiceData = {
  invoiceNumber: string;
  date: string;
  client: string;
  amount: number;
  entries: Array<Partial<WorkEntry>>;
};

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export const AddInvoiceDialog = () => {
  const { isOpen, closeAddInvoiceDialog } = useAddInvoiceDialog();
  const { updateWorkEntry, workEntries, projects, billingCodes, calculateRevenue } = useApp();
  const { toast } = useToast();
  const invoiceFilters = useInvoiceFilters();
  
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days from now
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedEntryIds, setSelectedEntryIds] = useState<string[]>([]);
  const [additionalItems, setAdditionalItems] = useState<InvoiceItem[]>([]);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  // Filter work entries based on selected project and date range
  const filteredEntries = useMemo(() => {
    return workEntries.filter(entry => {
      const { projectId, startDate, endDate } = invoiceFilters.filters;
      const entryDate = new Date(entry.date);
      
      // Filter by invoice status first
      if (entry.invoiceStatus !== 'not_invoiced') {
        return false;
      }

      // Filter by project if a project is selected
      if (projectId && entry.projectId !== projectId) {
        return false;
      }

      // Filter by date range
      try {
        return isWithinInterval(entryDate, { start: startDate, end: endDate });
      } catch (error) {
        console.error('Error checking date interval:', error);
        return false;
      }
    });
  }, [workEntries, invoiceFilters.filters]);

  const handleInvoiceDataImported = (data: InvoiceData) => {
    setInvoiceData(data);
    setInvoiceNumber(data.invoiceNumber);
    setInvoiceDate(new Date(data.date));
    setClientName(data.client);
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 0,
      unitPrice: 0
    };
    setAdditionalItems([...additionalItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setAdditionalItems(additionalItems.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setAdditionalItems(
      additionalItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateWorkEntriesTotal = () => {
    return selectedEntryIds.reduce((total, id) => {
      const entry = workEntries.find(e => e.id === id);
      if (entry) {
        const revenue = calculateRevenue(entry, billingCodes);
        return total + (typeof revenue === 'number' ? revenue : 0);
      }
      return total;
    }, 0);
  };

  const calculateAdditionalItemsTotal = () => {
    return additionalItems.reduce((total, item) => 
      total + (item.quantity * item.unitPrice), 0);
  };

  const getInvoiceTotal = () => {
    return calculateWorkEntriesTotal() + calculateAdditionalItemsTotal();
  };

  const toggleEntrySelection = (id: string) => {
    setSelectedEntryIds(prev => 
      prev.includes(id) 
        ? prev.filter(entryId => entryId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEntryIds(filteredEntries.map(entry => entry.id));
    } else {
      setSelectedEntryIds([]);
    }
  };

  const handleSubmitInvoice = () => {
    if (selectedEntryIds.length === 0 && additionalItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the invoice",
        variant: "destructive"
      });
      return;
    }

    if (!invoiceNumber || !clientName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Update the invoice status for each selected entry
    selectedEntryIds.forEach(id => {
      const entry = workEntries.find(e => e.id === id);
      if (entry) {
        updateWorkEntry({
          ...entry,
          invoiceStatus: 'invoiced'
        });
      }
    });

    toast({
      title: "Success",
      description: `Invoice #${invoiceNumber} created and ready to send to ${clientName}`,
    });
    
    handleClose();
  };

  const handleClose = () => {
    setInvoiceNumber('');
    setInvoiceDate(new Date());
    setDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    setClientName('');
    setClientEmail('');
    setClientAddress('');
    setNotes('');
    setSelectedEntryIds([]);
    setAdditionalItems([]);
    setInvoiceData(null);
    closeAddInvoiceDialog();
  };

  // Get project names for entries
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create New Invoice
          </DialogTitle>
          <DialogDescription>
            Create an invoice to send to your customer.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber" className="required">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                    placeholder="e.g. INV-2023-001"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate" className="required">Invoice Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !invoiceDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {invoiceDate ? format(invoiceDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={invoiceDate}
                        onSelect={(date) => setInvoiceDate(date || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="required">Client Name</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="Client name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => setDueDate(date || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    placeholder="client@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientAddress">Client Address</Label>
                  <Input
                    id="clientAddress"
                    value={clientAddress}
                    onChange={e => setClientAddress(e.target.value)}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Work Entries to Invoice</Label>
                  <span className="text-sm text-muted-foreground">
                    Total: ${calculateWorkEntriesTotal().toFixed(2)}
                  </span>
                </div>
                
                <InvoiceWorkEntryFilters 
                  projects={projects} 
                  filters={invoiceFilters} 
                />
                
                <div className="border rounded-md">
                  {filteredEntries.length > 0 ? (
                    <div>
                      <div className="p-2 border-b bg-muted/40">
                        <label className="flex items-center cursor-pointer p-1">
                          <input
                            type="checkbox"
                            checked={selectedEntryIds.length === filteredEntries.length && filteredEntries.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="rounded mr-2"
                          />
                          <span className="font-medium text-sm">Select All</span>
                        </label>
                      </div>
                      <ScrollArea className="max-h-[150px]">
                        <ul className="divide-y">
                          {filteredEntries.map(entry => (
                            <li key={entry.id} className="p-2 hover:bg-accent">
                              <label className="flex items-center justify-between cursor-pointer p-1">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedEntryIds.includes(entry.id)}
                                    onChange={() => toggleEntrySelection(entry.id)}
                                    className="rounded"
                                  />
                                  <span>
                                    {getProjectName(entry.projectId)} - {format(new Date(entry.date), 'MMM d, yyyy')}
                                  </span>
                                </div>
                                <span className="text-sm font-medium">
                                  {entry.feetCompleted} units - ${calculateRevenue(entry, billingCodes).toFixed(2)}
                                </span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </div>
                  ) : (
                    <p className="p-4 text-center text-muted-foreground text-sm">
                      No non-invoiced work entries available for the selected filters
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Additional Items</Label>
                  <span className="text-sm text-muted-foreground">
                    Total: ${calculateAdditionalItemsTotal().toFixed(2)}
                  </span>
                </div>
                <div className="border rounded-md p-3">
                  {additionalItems.length > 0 ? (
                    <div className="space-y-3">
                      {additionalItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5">
                            <Input
                              value={item.description}
                              onChange={e => updateItem(item.id, 'description', e.target.value)}
                              placeholder="Description"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                              placeholder="Qty"
                            />
                          </div>
                          <div className="col-span-3">
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                              placeholder="Price"
                              step="0.01"
                              min="0"
                            />
                          </div>
                          <div className="col-span-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="col-span-1 text-right font-medium">
                            ${(item.quantity * item.unitPrice).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground text-sm py-2">
                      No additional items added
                    </p>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full mt-3" 
                    onClick={handleAddItem}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Additional notes or payment instructions..."
                  rows={3}
                />
              </div>

              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between items-center font-medium">
                  <span>Total Invoice Amount:</span>
                  <span className="text-lg">${getInvoiceTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={handleClose} className="mr-2">
            Cancel
          </Button>
          <Button 
            variant="default" 
            onClick={handleSubmitInvoice} 
            disabled={!invoiceNumber || !clientName || (selectedEntryIds.length === 0 && additionalItems.length === 0)}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Create & Send Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
