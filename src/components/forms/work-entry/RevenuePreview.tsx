
import React from 'react';
import { Calculator } from 'lucide-react';

interface RevenuePreviewProps {
  previewAmount: number;
}

export const RevenuePreview: React.FC<RevenuePreviewProps> = ({ previewAmount }) => {
  return (
    <div className="flex items-center bg-fieldvision-navy/10 p-3 rounded-md">
      <Calculator size={18} className="text-fieldvision-navy mr-2" />
      <span className="text-sm">
        <span className="text-muted-foreground">Estimated Revenue:</span>{' '}
        <span className="font-medium">${previewAmount.toFixed(2)}</span>
      </span>
    </div>
  );
};
