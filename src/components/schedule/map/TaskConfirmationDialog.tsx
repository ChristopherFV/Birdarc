
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onWorkEntry?: () => void; // Prop for work entry form
  actionType: 'complete' | 'cancel';
  taskTitle: string;
  projectId?: string; // ProjectId prop
  shouldExportMap?: boolean;
  setShouldExportMap?: (value: boolean) => void;
}

export const TaskConfirmationDialog: React.FC<TaskConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onWorkEntry,
  actionType,
  taskTitle,
  projectId,
  shouldExportMap = true,
  setShouldExportMap
}) => {
  const handleConfirm = () => {
    onConfirm();
    
    // If completing a task and we have a work entry handler and project ID, open the work entry form
    if (actionType === 'complete' && onWorkEntry && projectId) {
      onWorkEntry();
    }
    
    onOpenChange(false);
  };

  const title = actionType === 'complete' 
    ? 'Complete Task' 
    : 'Cancel Task';
  
  const description = actionType === 'complete'
    ? `Are you sure you want to mark "${taskTitle}" as completed? This action will update the task status and cannot be undone.`
    : `Are you sure you want to cancel "${taskTitle}"? This action will update the task status and cannot be undone.`;

  const confirmButtonColor = actionType === 'complete' 
    ? 'bg-green-600 hover:bg-green-700' 
    : 'bg-red-600 hover:bg-red-700';

  const confirmIcon = actionType === 'complete' ? <Check className="mr-2 h-4 w-4" /> : <X className="mr-2 h-4 w-4" />;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {actionType === 'complete' && setShouldExportMap && (
          <div className="flex items-center space-x-2 py-4">
            <Checkbox 
              id="export-map" 
              checked={shouldExportMap}
              onCheckedChange={(checked) => setShouldExportMap(checked === true)}
            />
            <label 
              htmlFor="export-map" 
              className="text-sm font-medium cursor-pointer"
            >
              Export map notes before closing
            </label>
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={confirmButtonColor}
          >
            {confirmIcon}
            {actionType === 'complete' ? 'Complete' : 'Cancel Task'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
