
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MapNote } from '../TechnicianLocationMap';
import { 
  notesToGeoJSON, 
  notesToKMZ, 
  downloadFile 
} from '@/utils/mapExportUtils';

interface UseTaskCompletionOptions {
  mapNotes?: MapNote[];
}

export const useTaskCompletion = (options: UseTaskCompletionOptions = {}) => {
  const { mapNotes = [] } = options;
  const { toast } = useToast();
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
    setShouldExportMap
  };
};
