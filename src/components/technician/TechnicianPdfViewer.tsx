
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Pencil, Type, Circle, Square, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TechnicianPdfViewerProps {
  currentTool: 'pen' | 'text' | 'circle' | 'square';
  setCurrentTool: (tool: 'pen' | 'text' | 'circle' | 'square') => void;
}

export const TechnicianPdfViewer: React.FC<TechnicianPdfViewerProps> = ({
  currentTool,
  setCurrentTool
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showMobileTools, setShowMobileTools] = useState(false);
  const isMobile = useIsMobile();

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div 
      className="mx-auto bg-white shadow-lg border border-border rounded-md"
      style={{ 
        width: `${zoomLevel}%`, 
        height: isMobile ? 'calc(100vh - 370px)' : 'calc(100vh - 440px)', 
        position: 'relative'
      }}
    >
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-muted-foreground p-8">
            <p className="text-lg font-semibold mb-2">Construction Drawing - Page {currentPage}</p>
            <p>This would display the actual PDF content in a real implementation.</p>
            <p className="mt-4 text-sm">Use the tools on the right to add redlines and annotations.</p>
          </div>
        </div>
      </div>
      
      {isMobile && showMobileTools && (
        <div className="absolute top-2 right-2 bg-background/95 p-2 rounded-md shadow-md border border-border">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={currentTool === 'pen' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentTool('pen')}
              className={`h-8 px-2 ${currentTool === 'pen' ? 'bg-fieldvision-orange hover:bg-fieldvision-orange/90' : ''}`}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Pen
            </Button>
            <Button 
              variant={currentTool === 'text' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentTool('text')}
              className={`h-8 px-2 ${currentTool === 'text' ? 'bg-fieldvision-orange hover:bg-fieldvision-orange/90' : ''}`}
            >
              <Type className="h-3 w-3 mr-1" />
              Text
            </Button>
            <Button 
              variant={currentTool === 'circle' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentTool('circle')}
              className={`h-8 px-2 ${currentTool === 'circle' ? 'bg-fieldvision-orange hover:bg-fieldvision-orange/90' : ''}`}
            >
              <Circle className="h-3 w-3 mr-1" />
              Circle
            </Button>
            <Button 
              variant={currentTool === 'square' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentTool('square')}
              className={`h-8 px-2 ${currentTool === 'square' ? 'bg-fieldvision-orange hover:bg-fieldvision-orange/90' : ''}`}
            >
              <Square className="h-3 w-3 mr-1" />
              Square
            </Button>
          </div>
          <div className="mt-2">
            <label className="text-xs font-medium">Color</label>
            <div className="flex gap-1 mt-1">
              {['red', 'blue', 'green', 'yellow', 'black'].map(color => (
                <button
                  key={color}
                  className="w-5 h-5 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-ring"
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1 sm:gap-2 bg-background/90 p-1 sm:p-2 rounded-md shadow-sm border border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="h-7 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm"
        >
          Prev
        </Button>
        <span className="text-xs sm:text-sm">
          {currentPage}/{totalPages}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="h-7 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm"
        >
          Next
        </Button>
        <div className="h-5 border-l border-border mx-1 sm:mx-2"></div>
        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={handleZoomOut}>
          <ZoomOut className="h-3 sm:h-4 w-3 sm:w-4" />
        </Button>
        <span className="text-xs sm:text-sm w-10 sm:w-16 text-center">{zoomLevel}%</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={handleZoomIn}>
          <ZoomIn className="h-3 sm:h-4 w-3 sm:w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hidden sm:flex">
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hidden sm:flex">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {isMobile && (
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute top-2 right-2 h-8 w-8 p-0 flex items-center justify-center"
          onClick={() => setShowMobileTools(!showMobileTools)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
