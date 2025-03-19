
import { create } from 'zustand';

type AddInvoiceDialogStore = {
  isOpen: boolean;
  openAddInvoiceDialog: () => void;
  closeAddInvoiceDialog: () => void;
};

export const useAddInvoiceDialog = create<AddInvoiceDialogStore>((set) => ({
  isOpen: false,
  openAddInvoiceDialog: () => set({ isOpen: true }),
  closeAddInvoiceDialog: () => set({ isOpen: false }),
}));
