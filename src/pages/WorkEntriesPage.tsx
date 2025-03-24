
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
import { CreditCard, CheckCircle, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { billingCodes, projects, teamMembers, calculateRevenue } = useApp();
  const { tasks } = useSchedule();
  
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("entries");
  
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
  
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };
  
  // Convert Record<string, boolean> to Set<string> for table component
  const selectedEntriesSet = new Set(
    Object.entries(selectedEntries)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id)
  );
  
  // Wrapper functions to adapt the handlers to the table component's expected signature
  const handleSelectEntryAdapter = (id: string) => {
    handleSelectEntry(id, !selectedEntries[id]);
  };
  
  const handleSelectAllAdapter = () => {
    const allSelected = sortedEntries.every(entry => selectedEntries[entry.id]);
    handleSelectAll(!allSelected);
  };
  
  if (isMobile) {
    return (
      <SimplePageLayout 
        title="Invoicing" 
        subtitle="Manage invoices and create them for completed work"
        showFooter={true}
        footerProps={{
          backLink: "/",
          backLabel: "Home",
          actionButton: (
            <Button 
              onClick={handleCreateInvoice} 
              variant="blue"
              size="sm"
              className="text-white"
            >
              Create Invoice {selectedCount > 0 && `(${selectedCount})`}
            </Button>
          )
        }}
      >
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 mb-4 bg-muted/70 p-1 rounded-lg sticky top-0 z-20 shadow-sm">
            <TabsTrigger value="entries" className="text-sm py-1.5">Work Entries</TabsTrigger>
            <TabsTrigger value="insights" className="text-sm py-1.5">Insights</TabsTrigger>
            <TabsTrigger value="charts" className="text-sm py-1.5">Charts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entries" className="space-y-4 pb-20 animate-fade-in">
            <FilterBar />
            
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
              <CardContent className="p-0 overflow-hidden">
                <WorkEntriesTable 
                  entries={sortedEntries}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  handleSort={handleSort}
                  onEditEntry={handleEditEntry}
                  selectMode={selectMode}
                  selectedEntries={selectedEntriesSet}
                  handleSelectEntry={handleSelectEntryAdapter}
                  handleSelectAll={handleSelectAllAdapter}
                  renderActions={(entry) => (
                    entry.invoiceStatus === 'invoiced' && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handlePayInvoice(
                          `INV-${entry.id.substring(0, 4)}`, 
                          getProjectName(entry.projectId),
                          calculateRevenue(entry, billingCodes)
                        )}
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Pay
                      </Button>
                    )
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4 pb-20 animate-fade-in">
            <AIInsightsPanel 
              workEntries={sortedEntries}
              billingCodes={billingCodes}
              projects={projects}
              teamMembers={teamMembers}
              tasks={tasks}
            />
          </TabsContent>
          
          <TabsContent value="charts" className="space-y-4 pb-20 animate-fade-in">
            <InvoicingStatusChart />
          </TabsContent>
        </Tabs>
        
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
      </SimplePageLayout>
    );
  }
  
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
                selectedEntries={selectedEntriesSet}
                handleSelectEntry={handleSelectEntryAdapter}
                handleSelectAll={handleSelectAllAdapter}
                renderActions={(entry) => (
                  entry.invoiceStatus === 'invoiced' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handlePayInvoice(
                        `INV-${entry.id.substring(0, 4)}`, 
                        getProjectName(entry.projectId),
                        calculateRevenue(entry, billingCodes)
                      )}
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      Pay
                    </Button>
                  )
                )}
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
