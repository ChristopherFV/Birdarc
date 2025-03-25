
import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DrawingTool } from '@/components/technician/pdf-viewer/types';
import { PdfContent } from '@/components/technician/pdf-viewer/PdfContent';
import { MobileDrawingTools } from '@/components/technician/pdf-viewer/MobileDrawingTools';
import { useFullscreenControl } from '@/components/technician/pdf-viewer/useFullscreenControl';

const TechnicianDrawingPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pen');
  const [showTools, setShowTools] = useState(true);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreenControl(pdfContainerRef);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageId = searchParams.get('pageId') || '1';

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-full w-full bg-background flex flex-col">
      <div className="flex items-center justify-between p-2 border-b">
        <Button variant="ghost" size="sm" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div 
        ref={pdfContainerRef}
        className="flex-1 overflow-hidden relative bg-white"
      >
        <div className="h-full w-full flex flex-col items-center justify-center">
          <PdfContent currentPage={currentPage} />
        </div>
        
        {showTools && (
          <div className="absolute bottom-4 right-4 bg-background/95 p-2 rounded-md shadow-md border border-border">
            <MobileDrawingTools 
              currentTool={currentTool}
              setCurrentTool={setCurrentTool}
            />
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-background/95 p-2 rounded-md shadow-md border border-border">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <span className="text-sm mx-2">
            {currentPage} / {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 h-8 w-8 p-0 flex items-center justify-center bg-background/95 border border-border"
          onClick={() => setShowTools(!showTools)}
        >
          {currentTool === 'pen' ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg> :
            currentTool === 'text' ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1"/><path d="M7 22h1a4 4 0 0 0 4-4v-1"/><path d="M7 2h1a4 4 0 0 1 4 4v1"/></svg> :
            currentTool === 'circle' ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg> :
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
          }
        </Button>
      </div>
    </div>
  );
};

export default TechnicianDrawingPage;
