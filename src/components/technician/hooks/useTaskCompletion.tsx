
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useTaskCompletion = () => {
  const { toast } = useToast();
  const [workEntryDialogOpen, setWorkEntryDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const handleCompleteReview = () => {
    setConfirmDialogOpen(true);
  };
  
  const completeTask = () => {
    toast({
      title: "Task closed",
      description: "Please log your work entry for this task.",
    });
    setWorkEntryDialogOpen(true);
  };
  
  return {
    workEntryDialogOpen,
    setWorkEntryDialogOpen,
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleCompleteReview,
    completeTask
  };
};
