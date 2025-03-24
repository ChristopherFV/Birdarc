
import React from 'react';
import { TechnicianWorkEntryDialog } from '../TechnicianWorkEntryDialog';
import { TaskConfirmationDialog } from '@/components/schedule/map/TaskConfirmationDialog';
import { TechnicianExportDialog } from '../TechnicianExportDialog';

interface TechnicianDialogsProps {
  workEntryDialogOpen: boolean;
  setWorkEntryDialogOpen: (open: boolean) => void;
  confirmDialogOpen: boolean;
  setConfirmDialogOpen: (open: boolean) => void;
  exportDialogOpen: boolean;
  setExportDialogOpen: (open: boolean) => void;
  completeTask: () => void;
  exportAsGeoJSON: () => void;
  exportAsKMZ: () => void;
  taskData: any;
  shouldExportMap: boolean;
  setShouldExportMap: (shouldExport: boolean) => void;
}

export const TechnicianDialogs: React.FC<TechnicianDialogsProps> = ({
  workEntryDialogOpen,
  setWorkEntryDialogOpen,
  confirmDialogOpen,
  setConfirmDialogOpen,
  exportDialogOpen,
  setExportDialogOpen,
  completeTask,
  exportAsGeoJSON,
  exportAsKMZ,
  taskData,
  shouldExportMap,
  setShouldExportMap
}) => {
  return (
    <>
      <TechnicianWorkEntryDialog 
        open={workEntryDialogOpen} 
        onOpenChange={setWorkEntryDialogOpen} 
        projectId={taskData.projectId || "project-1"}
      />
      
      <TaskConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={completeTask}
        actionType="complete"
        taskTitle={taskData.title}
        shouldExportMap={shouldExportMap}
        setShouldExportMap={setShouldExportMap}
      />
      
      <TechnicianExportDialog 
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExportGeoJSON={exportAsGeoJSON}
        onExportKMZ={exportAsKMZ}
        onSkip={() => setConfirmDialogOpen(true)}
        hasNotes={taskData && taskData.notes && taskData.notes.length > 0}
      />
    </>
  );
};
