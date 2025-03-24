
import React from 'react';
import { Button } from '@/components/ui/button';

interface PdfPageControlsProps {
  currentPage: number;
  totalPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}

export const PdfPageControls: React.FC<PdfPageControlsProps> = ({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage
}) => {
  return (
    <>
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
    </>
  );
};
