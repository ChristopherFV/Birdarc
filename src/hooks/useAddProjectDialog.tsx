
import { create } from 'zustand';

type AddProjectDialogStore = {
  isOpen: boolean;
  openAddProjectDialog: () => void;
  closeAddProjectDialog: () => void;
};

export const useAddProjectDialog = create<AddProjectDialogStore>((set) => ({
  isOpen: false,
  openAddProjectDialog: () => set({ isOpen: true }),
  closeAddProjectDialog: () => set({ isOpen: false }),
}));
