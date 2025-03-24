
import React from 'react';
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
              />
            </CardContent>
          </Card>
        </div>
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
