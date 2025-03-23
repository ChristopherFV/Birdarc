
import React from 'react';
import { Calculator } from 'lucide-react';

interface RevenuePreviewProps {
  previewAmount: number;
  contractorCost?: number;
}

export const RevenuePreview: React.FC<RevenuePreviewProps> = ({ 
  previewAmount, 
  contractorCost = 0 
}) => {
  const profit = previewAmount - contractorCost;
  
  return (
    <div className="flex flex-col bg-fieldvision-navy/10 p-3 rounded-md space-y-1">
      <div className="flex items-center">
        <Calculator size={18} className="text-fieldvision-navy mr-2" />
        <span className="text-sm">
          <span className="text-muted-foreground">Estimated Revenue:</span>{' '}
          <span className="font-medium">${previewAmount.toFixed(2)}</span>
        </span>
      </div>
      
      {contractorCost > 0 && (
        <>
          <div className="flex items-center ml-5">
            <span className="text-sm">
              <span className="text-muted-foreground">Contractor Cost:</span>{' '}
              <span className="font-medium text-red-500">-${contractorCost.toFixed(2)}</span>
            </span>
          </div>
          <div className="flex items-center ml-5 border-t border-gray-200 pt-1">
            <span className="text-sm">
              <span className="text-muted-foreground">Net Profit:</span>{' '}
              <span className="font-medium text-green-600">${profit.toFixed(2)}</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
};
