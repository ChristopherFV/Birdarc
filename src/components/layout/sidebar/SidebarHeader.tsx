import React from 'react';
import { 
  SidebarHeader as UISidebarHeader,
} from "@/components/ui/sidebar";

export const SidebarHeader: React.FC = () => {
  return (
    <UISidebarHeader className="flex flex-col">
      <div className="px-2 py-4">
        {/* Company selector removed */}
      </div>
    </UISidebarHeader>
  );
};
