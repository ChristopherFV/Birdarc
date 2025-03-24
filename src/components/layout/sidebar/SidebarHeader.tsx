
import React from 'react';
import { 
  SidebarHeader as UISidebarHeader,
} from "@/components/ui/sidebar";

export const SidebarHeader: React.FC = () => {
  return (
    <UISidebarHeader className="flex flex-col p-4">
      {/* No toggle button needed here as we use SidebarRail */}
    </UISidebarHeader>
  );
};
