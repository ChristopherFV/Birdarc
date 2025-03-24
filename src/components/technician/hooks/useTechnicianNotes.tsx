
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useTechnicianNotes = () => {
  const { toast } = useToast();
  const [generalNotes, setGeneralNotes] = useState<string>('');
  
  const saveGeneralNotes = (notes: string) => {
    setGeneralNotes(notes);
    toast({
      title: "Notes saved",
      description: "Your notes have been saved successfully",
    });
  };
  
  return {
    generalNotes,
    saveGeneralNotes
  };
};
