
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

interface TaskConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  actionType: 'complete' | 'cancel';
  taskTitle: string;
}

export const TaskConfirmationDialog: React.FC<TaskConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  actionType,
  taskTitle,
}) => {
  const handleConfirm = () => {
    onConfirm();
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
