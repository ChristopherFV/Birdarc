
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface QuantityEstimateProps {
  quantityEstimate: number;
  onQuantityChange: (value: number) => void;
}

export const QuantityEstimate: React.FC<QuantityEstimateProps> = ({
  quantityEstimate,
  onQuantityChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="quantity">Quantity Estimate (units)</Label>
      <Input
        id="quantity"
        type="number"
        min="0"
        value={quantityEstimate.toString()}
        onChange={(e) => onQuantityChange(Number(e.target.value))}
      />
    </div>
  );
};
