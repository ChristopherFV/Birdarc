
import { useState } from 'react';
import { useApp, WorkEntry } from '@/context/AppContext';

export const useWorkEntries = () => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<WorkEntry | null>(null);

  return {
    showEditDialog,
    setShowEditDialog,
    selectedEntry,
    setSelectedEntry
  };
};
