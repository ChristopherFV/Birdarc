
import React, { useState } from 'react';
import { useAddInvoiceDialog } from '@/hooks/useAddInvoiceDialog';
import { useApp } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { InvoiceUploader } from './InvoiceUploader';
import { useToast } from '@/hooks/use-toast';
import { WorkEntry } from '@/types/app-types';

type InvoiceData = {
  invoiceNumber: string;
  date: string;
  client: string;
  amount: number;
  entries: Array<Partial<WorkEntry>>;
};

export const AddInvoiceDialog = () => {
  const { isOpen, closeAddInvoiceDialog } = useAddInvoiceDialog();
  const { updateWorkEntry, workEntries } = useApp();
  const { toast } = useToast();
  
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [selectedEntryIds, setSelectedEntryIds] = useState<string[]>([]);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const handleInvoiceDataImported = (data: InvoiceData) => {
    setInvoiceData(data);
    setInvoiceNumber(data.invoiceNumber);
    setInvoiceDate(data.date);
  };

  const handleMarkAsInvoiced = () => {
    if (selectedEntryIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select work entries to mark as invoiced",
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
      description: `${selectedEntryIds.length} entries marked as invoiced with invoice #${invoiceNumber}`,
    });
    
    handleClose();
  };

  const handleClose = () => {
    setInvoiceNumber('');
    setInvoiceDate('');
    setSelectedEntryIds([]);
    setInvoiceData(null);
    closeAddInvoiceDialog();
  };

  const toggleEntrySelection = (id: string) => {
    setSelectedEntryIds(prev => 
      prev.includes(id) 
        ? prev.filter(entryId => entryId !== id)
        : [...prev, id]
    );
  };

  // Get non-invoiced entries
  const nonInvoicedEntries = workEntries.filter(entry => entry.invoiceStatus === 'not_invoiced');

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Invoice</DialogTitle>
          <DialogDescription>
            Upload an invoice file or manually mark work entries as invoiced.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <InvoiceUploader onDataImported={handleInvoiceDataImported} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                placeholder="e.g. INV-2023-001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                onChange={e => setInvoiceDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Select work entries to mark as invoiced</Label>
            <div className="border rounded-md max-h-[200px] overflow-y-auto">
              {nonInvoicedEntries.length > 0 ? (
                <ul className="divide-y">
                  {nonInvoicedEntries.map(entry => (
                    <li key={entry.id} className="p-2 hover:bg-accent">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedEntryIds.includes(entry.id)}
                          onChange={() => toggleEntrySelection(entry.id)}
                          className="rounded"
                        />
                        <span>
                          {entry.date} - {entry.feetCompleted} units
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-4 text-center text-muted-foreground text-sm">
                  No non-invoiced work entries available
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleMarkAsInvoiced} disabled={selectedEntryIds.length === 0 || !invoiceNumber}>
            Mark as Invoiced
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
