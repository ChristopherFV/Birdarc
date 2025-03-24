
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { PdfToolbar } from './pdf-viewer/PdfToolbar';
import { PdfContent } from './pdf-viewer/PdfContent';
import { MobileDrawingTools } from './pdf-viewer/MobileDrawingTools';
import { useFullscreenControl } from './pdf-viewer/useFullscreenControl';
import { PdfViewerProps } from './pdf-viewer/types';

export const TechnicianPdfViewer: React.FC<PdfViewerProps> = ({
  currentTool,
  setCurrentTool
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showMobileTools, setShowMobileTools] = useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { isFullscreen, toggleFullscreen } = useFullscreenControl(pdfContainerRef);

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
      ref={pdfContainerRef}
      className={`mx-auto bg-white shadow-lg border border-border rounded-md ${isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none border-none' : ''}`}
      style={{ 
        width: isFullscreen ? '100%' : `${zoomLevel}%`, 
        height: isFullscreen ? '100%' : (isMobile ? 'calc(100vh - 370px)' : 'calc(100vh - 440px)'), 
        position: isFullscreen ? 'fixed' : 'relative'
      }}
    >
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
        <PdfContent currentPage={currentPage} />
      </div>
      
      {isMobile && showMobileTools && (
        <div className={`${isFullscreen ? 'absolute top-4 right-4' : 'absolute top-2 right-2'} bg-background/95 p-2 rounded-md shadow-md border border-border`}>
          <MobileDrawingTools 
            currentTool={currentTool}
            setCurrentTool={setCurrentTool}
          />
        </div>
      )}
      
      <PdfToolbar 
        currentPage={currentPage}
        totalPages={totalPages}
        zoomLevel={zoomLevel}
        isFullscreen={isFullscreen}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        toggleFullscreen={toggleFullscreen}
      />

      {isMobile && (
        <Button 
          variant="outline" 
          size="sm" 
          className={`absolute top-2 right-2 h-8 w-8 p-0 flex items-center justify-center ${isFullscreen ? 'z-10' : ''}`}
          onClick={() => setShowMobileTools(!showMobileTools)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
