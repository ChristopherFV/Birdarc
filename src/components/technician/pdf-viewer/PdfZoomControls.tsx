
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface PdfZoomControlsProps {
  zoomLevel: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

export const PdfZoomControls: React.FC<PdfZoomControlsProps> = ({
  zoomLevel,
  handleZoomIn,
  handleZoomOut
}) => {
  return (
    <>
      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={handleZoomOut}>
        <ZoomOut className="h-3 sm:h-4 w-3 sm:w-4" />
      </Button>
      <span className="text-xs sm:text-sm w-10 sm:w-16 text-center">{zoomLevel}%</span>
      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={handleZoomIn}>
        <ZoomIn className="h-3 sm:h-4 w-3 sm:w-4" />
      </Button>
    </>
  );
};
