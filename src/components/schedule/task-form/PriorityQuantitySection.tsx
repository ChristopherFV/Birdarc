
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskPriority } from '@/context/ScheduleContext';

interface PriorityQuantitySectionProps {
  priority: TaskPriority;
  quantityEstimate: number;
  onPriorityChange: (priority: TaskPriority) => void;
  onQuantityChange: (quantity: number) => void;
}

export const PriorityQuantitySection: React.FC<PriorityQuantitySectionProps> = ({
  priority,
  quantityEstimate,
  onPriorityChange,
  onQuantityChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={(value) => onPriorityChange(value as TaskPriority)}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
    </div>
  );
};
