
import React from 'react';
import { Calculator, Sparkles } from 'lucide-react';

interface RevenuePreviewProps {
  previewAmount: number;
  contractorCost?: number;
}

export const RevenuePreview: React.FC<RevenuePreviewProps> = ({ 
  previewAmount, 
  contractorCost = 0 
}) => {
  const profit = previewAmount - contractorCost;
  
  // Generate a simple AI-powered tip
  const getAITip = (revenue: number, profit: number) => {
    if (profit < revenue * 0.5) {
      return "AI suggests: Consider negotiating better contractor rates to improve margins.";
    } else if (profit > revenue * 0.8) {
      return "AI suggests: Great profit margin! This work type should be prioritized.";
    } else {
      return "AI suggests: This work entry has a healthy profit margin.";
    }
  };
  
  const aiTip = getAITip(previewAmount, profit);
  
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
      
      {/* AI Suggestion */}
      <div className="flex items-center mt-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded border border-blue-100 dark:border-blue-800">
        <Sparkles size={14} className="text-blue-500 mr-2" />
        <span className="text-xs text-blue-700 dark:text-blue-300">{aiTip}</span>
      </div>
    </div>
  );
};
