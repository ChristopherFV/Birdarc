
import React from 'react';
import { formatUnits } from '@/utils/charts';
import { BillingUnitType } from '@/types/app-types';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  billingUnit: BillingUnitType;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  label, 
  billingUnit 
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-white p-3 shadow-md border border-gray-100">
        <p className="font-medium text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`tooltip-${index}`} className="flex items-center text-sm mb-1">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="mr-2 text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-800">
              {formatUnits(entry.value, billingUnit)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
