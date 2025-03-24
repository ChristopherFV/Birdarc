
import React from 'react';
import { 
  SidebarHeader as UISidebarHeader
} from "@/components/ui/sidebar";

export const SidebarHeader: React.FC = () => {
  return (
    <UISidebarHeader className="flex flex-col p-4">
      {/* Header content without toggle button */}
      <div className="flex items-center">
        <span className="text-sm font-medium">Menu</span>
      </div>
    </UISidebarHeader>
  );
};
