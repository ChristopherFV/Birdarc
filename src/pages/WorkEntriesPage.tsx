
import React from 'react';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { EditWorkEntryDialog } from '@/components/forms/EditWorkEntryDialog';
import { AddInvoiceDialog } from '@/components/forms/AddInvoiceDialog';
import { WorkEntriesHeader } from '@/components/work-entries/WorkEntriesHeader';
import { WorkEntriesTable } from '@/components/work-entries/WorkEntriesTable';
import { useWorkEntries } from '@/hooks/useWorkEntries';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { InvoicingStatusChart } from '@/components/invoicing/InvoicingStatusChart';

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
  
  const isMobile = useIsMobile();
  
  const actionButton = (
    <Button 
      className="bg-fieldvision-orange hover:bg-fieldvision-orange/90 text-white"
      size="sm"
    >
      <Plus className="h-4 w-4 mr-1" />
      New Entry
    </Button>
  );
  
  return (
    <SimplePageLayout 
      title="Invoicing" 
      subtitle="Manage work entries and create invoices for completed work"
      showFooter={true}
      footerProps={{
        backLink: "/",
        backLabel: "Dashboard",
        actionButton: actionButton
      }}
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Add the Invoicing Status Chart at the top */}
        <InvoicingStatusChart />
        
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
    </SimplePageLayout>
  );
};

export default WorkEntriesPage;
