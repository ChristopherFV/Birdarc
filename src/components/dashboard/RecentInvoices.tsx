
import React, { useState } from 'react';
import { format } from 'date-fns';
import { FileText, Check, AlertCircle, Plus, List, RefreshCw, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAddInvoiceDialog } from '@/hooks/useAddInvoiceDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PaymentModal } from '@/components/invoicing/PaymentModal';

// Mock data for invoices
const mockInvoices = [
  {
    id: 'INV-001',
    projectName: 'Downtown Fiber Project',
    date: new Date(2023, 6, 15),
    amount: 2450.00,
    status: 'paid',
    client: 'City Telecom',
    email: 'billing@citytelecom.com'
  },
  {
    id: 'INV-002',
    projectName: 'Westside Network Expansion',
    date: new Date(2023, 6, 28),
    amount: 3200.00,
    status: 'unpaid',
    client: 'Metro Connect',
    email: 'accounts@metroconnect.net'
  },
  {
    id: 'INV-003',
    projectName: 'Rural Broadband Initiative',
    date: new Date(2023, 7, 5),
    amount: 1875.50,
    status: 'paid',
    client: 'County ISP',
    email: 'finance@countyisp.org'
  }
];

export const RecentInvoices: React.FC = () => {
  const { openAddInvoiceDialog } = useAddInvoiceDialog();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<(typeof mockInvoices)[0] | null>(null);
  
  const handleCreateInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    openAddInvoiceDialog();
  };
  
  const handlePayInvoice = (invoice: (typeof mockInvoices)[0]) => {
    setSelectedInvoice(invoice);
    setPaymentModalOpen(true);
  };
  
  const handlePaymentComplete = (success: boolean) => {
    if (success && selectedInvoice) {
      // In a real app, you'd update the invoice status in your database
      console.log(`Payment completed for invoice ${selectedInvoice.id}`);
      // For this demo, we'll leave the mock data as is
    }
  };
  
  // QuickBooks sync indicator component embedded in the card header
  const QuickBooksSyncIndicator = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 cursor-pointer">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <RefreshCw size={14} className="text-green-600" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">QuickBooks sync'd</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  
  if (mockInvoices.length === 0) {
    return (
      <Card className="bg-card border-border shadow-sm mb-4">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">Recent Invoices</CardTitle>
          <QuickBooksSyncIndicator />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <FileText size={24} className="mb-2 opacity-70" />
            <p>No invoices found</p>
            <p className="text-sm">Create your first invoice below</p>
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-4">
          <Button 
            variant="default" 
            className="w-full" 
            onClick={handleCreateInvoice}
          >
            <Plus className="mr-2" size={16} />
            Create Invoice
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="bg-card border-border shadow-sm mb-4">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Recent Invoices</CardTitle>
        <QuickBooksSyncIndicator />
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="max-h-[200px]">
          <Table>
            <TableBody>
              {mockInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-muted/40">
                  <TableCell className="p-2">
                    <div className="flex items-start gap-2">
                      <FileText size={16} className="mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{invoice.projectName}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{format(invoice.date, 'MMM d, yyyy')}</span>
                          <span className="mx-1">•</span>
                          <span>{invoice.client}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-2 text-right whitespace-nowrap">
                    <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                    <div className="mt-1 flex justify-end gap-2">
                      {invoice.status === 'paid' ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                          <Check size={12} className="mr-1" />
                          Paid
                        </Badge>
                      ) : (
                        <>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            <AlertCircle size={12} className="mr-1" />
                            Unpaid
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 px-2 text-xs"
                            onClick={() => handlePayInvoice(invoice)}
                          >
                            <CreditCard size={12} className="mr-1" />
                            Pay
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-2 pb-4 flex flex-col gap-2">
        <Button 
          variant="default" 
          className="w-full" 
          onClick={handleCreateInvoice}
        >
          <Plus className="mr-2" size={16} />
          Create Invoice
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link to="/invoicing">
            <List className="mr-2" size={16} />
            See All Invoices
          </Link>
        </Button>
      </CardFooter>
      
      {selectedInvoice && (
        <PaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          invoiceNumber={selectedInvoice.id}
          clientName={selectedInvoice.client}
          clientEmail={selectedInvoice.email}
          amount={selectedInvoice.amount}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </Card>
  );
};
