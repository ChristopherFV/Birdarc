
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const InvoicesButton = () => {
  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2"
      asChild
    >
      <Link to="/invoices">
        <FileText className="h-4 w-4" />
        <span>Invoices</span>
      </Link>
    </Button>
  );
};
