import React from 'react';
import { 
  SidebarHeader as UISidebarHeader,
} from "@/components/ui/sidebar";

export const SidebarHeader: React.FC = () => {
  return (
    <UISidebarHeader className="flex flex-col p-4">
      {/* Content removed as the toggle button is now in navbar */}
    </UISidebarHeader>
  );
};
