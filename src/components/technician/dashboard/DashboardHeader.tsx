
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  handleOpenWorkEntry: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  handleOpenWorkEntry 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">Technician Dashboard</h1>
      <div className="flex space-x-2">
        <Button 
          onClick={() => handleOpenWorkEntry()} 
          variant="default" 
          size="sm"
          className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" /> Log Work
        </Button>
      </div>
    </div>
  );
};
