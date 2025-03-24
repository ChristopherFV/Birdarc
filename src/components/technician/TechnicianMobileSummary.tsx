
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Menu } from 'lucide-react';

interface TechnicianMobileSummaryProps {
  taskData: {
    startDate: Date;
    location: {
      address: string;
    }
  };
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  setShowMobileTools: (show: boolean) => void;
  showMobileTools: boolean;
}

export const TechnicianMobileSummary: React.FC<TechnicianMobileSummaryProps> = ({
  taskData,
  formatDate,
  formatTime,
  setShowMobileTools,
  showMobileTools
}) => {
  return (
    <div className="p-2 bg-background border-b border-border">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">Task Summary</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0"
          onClick={() => setShowMobileTools(!showMobileTools)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1 text-gray-500 flex-shrink-0" />
          <span className="truncate">{formatDate(taskData.startDate)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1 text-gray-500 flex-shrink-0" />
          <span className="truncate">{formatTime(taskData.startDate)}</span>
        </div>
        <div className="flex items-center col-span-2">
          <MapPin className="h-3 w-3 mr-1 text-gray-500 flex-shrink-0" />
          <span className="truncate">{taskData.location.address}</span>
        </div>
      </div>
    </div>
  );
};
