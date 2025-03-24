
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, Maximize2, Minimize2 } from 'lucide-react';
import { PdfPageControls } from './PdfPageControls';
import { PdfZoomControls } from './PdfZoomControls';

interface PdfToolbarProps {
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  isFullscreen: boolean;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  toggleFullscreen: () => void;
}

export const PdfToolbar: React.FC<PdfToolbarProps> = ({
  currentPage,
  totalPages,
  zoomLevel,
  isFullscreen,
  handlePrevPage,
  handleNextPage,
  handleZoomIn,
  handleZoomOut,
  toggleFullscreen
}) => {
  return (
    <div className={`${isFullscreen ? 'absolute bottom-8' : 'absolute bottom-4'} left-1/2 transform -translate-x-1/2 flex items-center gap-1 sm:gap-2 bg-background/90 p-1 sm:p-2 rounded-md shadow-sm border border-border`}>
      <PdfPageControls 
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />
      
      <div className="h-5 border-l border-border mx-1 sm:mx-2"></div>
      
      <PdfZoomControls 
        zoomLevel={zoomLevel}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
      />
      
      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hidden sm:flex">
        <RotateCw className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 sm:h-8 sm:w-8" 
        onClick={toggleFullscreen}
      >
        {isFullscreen ? <Minimize2 className="h-3 sm:h-4 w-3 sm:w-4" /> : <Maximize2 className="h-3 sm:h-4 w-3 sm:w-4" />}
      </Button>
    </div>
  );
};
