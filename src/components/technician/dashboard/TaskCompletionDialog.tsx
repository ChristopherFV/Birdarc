
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
import { CheckCheck } from 'lucide-react';

interface TaskCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  taskTitle: string;
}

export const TaskCompletionDialog: React.FC<TaskCompletionDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  taskTitle
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCheck className="h-5 w-5 text-fieldvision-orange" />
            Complete Task
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark "{taskTitle}" as completed? 
            This will update the task status and move it to your completed tasks.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-fieldvision-orange hover:bg-fieldvision-orange/90"
          >
            Complete Task
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
