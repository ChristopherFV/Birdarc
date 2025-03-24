
import React from 'react';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { EditWorkEntryDialog } from '@/components/forms/EditWorkEntryDialog';
import { AddInvoiceDialog } from '@/components/forms/AddInvoiceDialog';
import { WorkEntriesHeader } from '@/components/work-entries/WorkEntriesHeader';
import { WorkEntriesTable } from '@/components/work-entries/WorkEntriesTable';
import { useWorkEntries } from '@/hooks/useWorkEntries';
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  return (
    <SimplePageLayout 
      title="Work Entries" 
      subtitle="View and manage all work entries"
    >
      <div className="space-y-4 sm:space-y-6">
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
