
import React from 'react';

interface PdfContentProps {
  currentPage: number;
}

export const PdfContent: React.FC<PdfContentProps> = ({ currentPage }) => {
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-muted-foreground p-8">
        <p className="text-lg font-semibold mb-2">Construction Drawing - Page {currentPage}</p>
        <p>This would display the actual PDF content in a real implementation.</p>
        <p className="mt-4 text-sm">Use the tools on the right to add redlines and annotations.</p>
      </div>
    </div>
  );
};
