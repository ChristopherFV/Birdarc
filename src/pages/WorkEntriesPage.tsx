
import React, { useState } from 'react';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { EditWorkEntryDialog } from '@/components/forms/EditWorkEntryDialog';
import { AddInvoiceDialog } from '@/components/forms/AddInvoiceDialog';
import { WorkEntriesHeader } from '@/components/work-entries/WorkEntriesHeader';
import { WorkEntriesTable } from '@/components/work-entries/WorkEntriesTable';
import { useWorkEntries } from '@/hooks/useWorkEntries';
import { useIsMobile } from '@/hooks/use-mobile';
import { InvoicingStatusChart } from '@/components/invoicing/InvoicingStatusChart';
import { FilterBar } from '@/components/ui/FilterBar';
import { AIInsightsPanel } from '@/components/ai/AIInsightsPanel';
import { useApp } from '@/context/AppContext';
import { useSchedule } from '@/context/ScheduleContext';
import { PaymentModal } from '@/components/invoicing/PaymentModal';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle } from 'lucide-react';

const WorkEntriesPage: React.FC = () => {
  const {
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    isFiltersOpen,
    setIsFiltersOpen,
    editingEntry,
    setEditingEntry,
    sortColumn,
    sortDirection,
    selectMode,
    selectedEntries,
    sortedEntries,
    selectedCount,
    handleSort,
    handleEditEntry,
    handleSelectEntry,
    handleSelectAll,
    handleCreateInvoice,
    handleCancelInvoice
  } = useWorkEntries();
  
  // Get context data for AI insights
  const { billingCodes, projects, teamMembers } = useApp();
  const { tasks } = useSchedule();
  
  const isMobile = useIsMobile();
  
  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<{
    id: string;
    client: string;
    email: string;
    amount: number;
  } | null>(null);
  
  const handlePayInvoice = (invoiceId: string, client: string, amount: number) => {
    setSelectedInvoice({
      id: invoiceId,
      client,
      email: 'client@example.com', // In a real app, you'd get this from your database
      amount
    });
    setPaymentModalOpen(true);
  };
  
  return (
    <SimplePageLayout 
      title="Invoicing" 
      subtitle="Manage invoices and create them for completed work"
      showFooter={true}
      footerProps={{
        backLink: "/",
        backLabel: "Home"
      }}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Filter Bar - Always visible at the top */}
        <FilterBar />
        
        {/* AI Insights Panel */}
        <AIInsightsPanel 
          workEntries={sortedEntries}
          billingCodes={billingCodes}
          projects={projects}
          teamMembers={teamMembers}
          tasks={tasks}
        />
        
        {/* Invoicing Status Chart */}
        <InvoicingStatusChart />
        
        <div className="space-y-4">
          <WorkEntriesHeader 
            search={search}
            setSearch={setSearch}
            isFiltersOpen={isFiltersOpen}
            setIsFiltersOpen={setIsFiltersOpen}
            selectMode={selectMode}
            selectedCount={selectedCount}
            handleCreateInvoice={handleCreateInvoice}
            handleCancelInvoice={handleCancelInvoice}
          />
          
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-0 overflow-x-auto">
              <WorkEntriesTable 
                entries={sortedEntries}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                handleSort={handleSort}
                onEditEntry={handleEditEntry}
                selectMode={selectMode}
                selectedEntries={selectedEntries}
                handleSelectEntry={handleSelectEntry}
                handleSelectAll={handleSelectAll}
                // In a real app, you would add these props and implement them in WorkEntriesTable
                // renderActions={(entry) => (
                //   entry.invoiceStatus === 'invoiced' && (
                //     <Button 
                //       size="sm" 
                //       variant="ghost" 
                //       onClick={() => handlePayInvoice(
                //         `INV-${entry.id.substring(0, 4)}`, 
                //         getProjectName(entry.projectId),
                //         calculateRevenue(entry, billingCodes)
                //       )}
                //     >
                //       <CreditCard className="h-4 w-4 mr-1" />
                //       Pay
                //     </Button>
                //   )
                // )}
              />
            </CardContent>
          </Card>
        </div>

        {editingEntry && (
          <EditWorkEntryDialog
            entry={editingEntry}
            open={!!editingEntry}
            onOpenChange={(open) => {
              if (!open) setEditingEntry(null);
            }}
          />
        )}
        
        <AddInvoiceDialog />
        
        {selectedInvoice && (
          <PaymentModal
            open={paymentModalOpen}
            onOpenChange={setPaymentModalOpen}
            invoiceNumber={selectedInvoice.id}
            clientName={selectedInvoice.client}
            clientEmail={selectedInvoice.email}
            amount={selectedInvoice.amount}
            onPaymentComplete={(success) => {
              console.log(`Payment ${success ? 'succeeded' : 'failed'} for invoice ${selectedInvoice.id}`);
            }}
          />
        )}
      </div>
    </SimplePageLayout>
  );
};

export default WorkEntriesPage;
