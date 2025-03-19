
import React from 'react';
import { format } from 'date-fns';
import { FileText, Check, AlertCircle, Plus, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAddInvoiceDialog } from '@/hooks/useAddInvoiceDialog';

// Mock data for invoices
const mockInvoices = [
  {
    id: 'INV-001',
    projectName: 'Downtown Fiber Project',
    date: new Date(2023, 6, 15),
    amount: 2450.00,
    status: 'paid',
    client: 'City Telecom'
  },
  {
    id: 'INV-002',
    projectName: 'Westside Network Expansion',
    date: new Date(2023, 6, 28),
    amount: 3200.00,
    status: 'unpaid',
    client: 'Metro Connect'
  },
  {
    id: 'INV-003',
    projectName: 'Rural Broadband Initiative',
    date: new Date(2023, 7, 5),
    amount: 1875.50,
    status: 'paid',
    client: 'County ISP'
  }
];

export const RecentInvoices: React.FC = () => {
  const { openAddInvoiceDialog } = useAddInvoiceDialog();
  
  if (mockInvoices.length === 0) {
    return (
      <Card className="bg-card border-border shadow-sm mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <FileText size={24} className="mb-2 opacity-70" />
            <p>No invoices found</p>
            <p className="text-sm">Create your first invoice below</p>
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-4">
          <Button asChild variant="default" className="w-full">
            <Link to="/invoices/create">
              <Plus className="mr-2" size={16} />
              Create Invoice
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="bg-card border-border shadow-sm mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Recent Invoices</CardTitle>
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
                    <div className="mt-1 flex justify-end">
                      {invoice.status === 'paid' ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                          <Check size={12} className="mr-1" />
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          <AlertCircle size={12} className="mr-1" />
                          Unpaid
                        </Badge>
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
          onClick={openAddInvoiceDialog}
          variant="default" 
          className="w-full flex items-center justify-center gap-2"
        >
          <FileText className="h-4 w-4" />
          <span>New Invoice</span>
          <Plus className="h-3 w-3" />
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link to="/invoices">
            <List className="mr-2" size={16} />
            See All Invoices
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
