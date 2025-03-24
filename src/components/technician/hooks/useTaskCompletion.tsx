
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MapNote } from '../TechnicianLocationMap';
import { 
  notesToGeoJSON, 
  notesToKMZ, 
  downloadFile 
} from '@/utils/mapExportUtils';
import { useApp } from '@/context/AppContext';
import { useSchedule, Task, TaskStatus } from '@/context/ScheduleContext';

interface UseTaskCompletionOptions {
  mapNotes?: MapNote[];
  taskData?: Task;
}

export const useTaskCompletion = (options: UseTaskCompletionOptions = {}) => {
  const { mapNotes = [], taskData } = options;
  const { toast } = useToast();
  const { addWorkEntry } = useApp();
  const { updateTask } = useSchedule();
  const [workEntryDialogOpen, setWorkEntryDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [shouldExportMap, setShouldExportMap] = useState(true);
  
  const handleCompleteReview = () => {
    if (mapNotes.length > 0 && shouldExportMap) {
      setExportDialogOpen(true);
    } else {
      setConfirmDialogOpen(true);
    }
  };
  
  const completeTask = () => {
    // Update task status if we have task data
    if (taskData) {
      // Use the proper TaskStatus type for completed
      const updatedTask = { ...taskData, status: 'completed' as TaskStatus };
      try {
        updateTask(updatedTask);
        
        // Save to technician's dashboard (using localStorage for persistence in this demo)
        saveToTechnicianDashboard(updatedTask);
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
    
    toast({
      title: "Task closed",
      description: "Please log your work entry for this task.",
    });
    setWorkEntryDialogOpen(true);
  };

  const exportAsGeoJSON = () => {
    try {
      const geoJSON = notesToGeoJSON(mapNotes);
      downloadFile(geoJSON, 'fieldvision-notes.geojson');
      
      toast({
        title: "Export successful",
        description: "Map notes exported as GeoJSON",
      });
    } catch (error) {
      console.error('Error exporting GeoJSON:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your notes",
        variant: "destructive"
      });
    }
  };
  
  const exportAsKMZ = async () => {
    try {
      const kmzBlob = await notesToKMZ(mapNotes);
      downloadFile(kmzBlob, 'fieldvision-notes.kmz');
      
      toast({
        title: "Export successful",
        description: "Map notes exported as KMZ file",
      });
    } catch (error) {
      console.error('Error exporting KMZ:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your notes",
        variant: "destructive"
      });
    }
  };

  // Save task data to technician's dashboard/history
  const saveToTechnicianDashboard = (taskData: Task) => {
    try {
      // For this demo, we'll use localStorage to persist completed tasks
      const existingTasksJSON = localStorage.getItem('technician_completed_tasks');
      const existingTasks = existingTasksJSON ? JSON.parse(existingTasksJSON) : [];
      
      // Check if this task is already in the completed tasks
      const taskExists = existingTasks.some((task: Task) => task.id === taskData.id);
      
      if (!taskExists) {
        const updatedTasks = [...existingTasks, taskData];
        localStorage.setItem('technician_completed_tasks', JSON.stringify(updatedTasks));
        console.log('Task saved to technician dashboard:', taskData);
      }
    } catch (error) {
      console.error('Error saving task to technician dashboard:', error);
    }
  };
  
  return {
    workEntryDialogOpen,
    setWorkEntryDialogOpen,
    confirmDialogOpen,
    setConfirmDialogOpen,
    exportDialogOpen,
    setExportDialogOpen,
    handleCompleteReview,
    completeTask,
    exportAsGeoJSON,
    exportAsKMZ,
    shouldExportMap,
    setShouldExportMap,
    saveToTechnicianDashboard
  };
};
