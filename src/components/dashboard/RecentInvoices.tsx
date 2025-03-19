
import React from 'react';
import { FileText, Plus, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

type Invoice = {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  status: 'paid' | 'unpaid';
  date: string;
};

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    client: 'Metro City Council',
    amount: 5250.00,
    status: 'paid',
    date: '2023-10-15'
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    client: 'Westside Development Corp',
    amount: 3480.00,
    status: 'unpaid',
    date: '2023-10-28'
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    client: 'North County ISP',
    amount: 7890.50,
    status: 'paid',
    date: '2023-11-05'
  }
];

export const RecentInvoices: React.FC = () => {
  return (
    <>
      <Card className="bg-card border-border shadow-sm mb-3">
        <CardHeader className="py-3">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2" size={16} />
            <p className="text-sm font-medium">QuickBooks Sync'd</p>
          </div>
        </CardHeader>
      </Card>
      
      <Card className="bg-card border-border shadow-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {mockInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
              <FileText size={24} className="mb-2 opacity-70" />
              <p>No invoices found</p>
              <p className="text-sm">Create your first invoice</p>
            </div>
          ) : (
            <Table>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/40">
                    <TableCell className="p-2">
                      <div>
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground">{invoice.client}</p>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 text-right">
                      <div className="space-y-1">
                        <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                        <Badge variant={invoice.status === 'paid' ? 'success' : 'destructive'} className="text-xs">
                          {invoice.status === 'paid' ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="gap-2 pt-2 pb-4 flex flex-col">
          <Button asChild variant="default" className="w-full">
            <Link to="/invoices/new">
              <Plus className="mr-2" size={16} />
              Create Invoice
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/invoices">
              <FileText className="mr-2" size={16} />
              View All Invoices
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
