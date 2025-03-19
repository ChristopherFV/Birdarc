
import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddInvoiceDialog } from '@/hooks/useAddInvoiceDialog';

interface InvoicesButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  fullWidth?: boolean;
}

export const InvoicesButton: React.FC<InvoicesButtonProps> = ({ 
  variant = "outline",
  fullWidth = false 
}) => {
  const { openAddInvoiceDialog } = useAddInvoiceDialog();

  return (
    <Button 
      onClick={openAddInvoiceDialog}
      variant={variant} 
      className={`flex items-center gap-2 ${fullWidth ? 'w-full' : ''}`}
    >
      <FileText className="h-4 w-4" />
      <span>Add Invoice</span>
      <Plus className="h-3 w-3 ml-1" />
    </Button>
  );
};
