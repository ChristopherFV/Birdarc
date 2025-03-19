
import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddInvoiceDialog } from '@/hooks/useAddInvoiceDialog';

export const InvoicesButton = () => {
  const { openAddInvoiceDialog } = useAddInvoiceDialog();

  return (
    <Button 
      onClick={openAddInvoiceDialog}
      variant="outline" 
      className="flex items-center gap-2"
    >
      <FileText className="h-4 w-4" />
      <span>Invoices</span>
      <Plus className="h-3 w-3 ml-1" />
    </Button>
  );
};
