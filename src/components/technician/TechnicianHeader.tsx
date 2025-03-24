
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface TechnicianHeaderProps {
  taskTitle: string;
  handleCompleteReview: () => void;
}

export const TechnicianHeader: React.FC<TechnicianHeaderProps> = ({
  taskTitle,
  handleCompleteReview
}) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="border-b border-border p-3 sm:p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button asChild variant="ghost" size="sm" className="p-1 sm:p-2">
            <Link to="/" className="flex items-center gap-1 sm:gap-2">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-base sm:text-xl font-semibold">{taskTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            style={{ backgroundColor: "#F18E1D", color: "white" }}
            onClick={handleCompleteReview}
          >
            {isMobile ? 'Close' : 'Close Task'}
          </Button>
        </div>
      </div>
    </header>
  );
};
