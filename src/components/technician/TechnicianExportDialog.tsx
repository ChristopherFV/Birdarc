
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileType, X } from 'lucide-react';

interface TechnicianExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExportGeoJSON: () => void;
  onExportKMZ: () => void;
  onSkip: () => void;
  hasNotes: boolean;
}

export const TechnicianExportDialog: React.FC<TechnicianExportDialogProps> = ({
  open,
  onOpenChange,
  onExportGeoJSON,
  onExportKMZ,
  onSkip,
  hasNotes
}) => {
  const handleExportGeoJSON = () => {
    onExportGeoJSON();
    onOpenChange(false);
    onSkip();
  };

  const handleExportKMZ = () => {
    onExportKMZ();
    onOpenChange(false);
    onSkip();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Map Notes</DialogTitle>
          <DialogDescription>
            Would you like to export your map notes before closing this task?
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {hasNotes ? (
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleExportGeoJSON} 
                className="flex items-center justify-start gap-2"
                variant="outline"
              >
                <FileType className="h-4 w-4" />
                Export as GeoJSON
              </Button>
              
              <Button 
                onClick={handleExportKMZ} 
                className="flex items-center justify-start gap-2"
                variant="outline"
              >
                <FileType className="h-4 w-4" />
                Export as KMZ
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You don't have any map notes to export.
            </p>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={() => {
            onOpenChange(false);
            onSkip();
          }}>
            Skip Export
          </Button>
          <Button 
            variant="orange" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
