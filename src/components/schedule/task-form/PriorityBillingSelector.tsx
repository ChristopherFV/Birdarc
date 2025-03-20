
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BillingCode } from '@/types/app-types';
import { TaskPriority } from '@/context/ScheduleContext';
import { TaskFormErrors } from './validation';

interface PriorityBillingSelectorProps {
  priority: TaskPriority;
  billingCodeId: string;
  billingCodes: BillingCode[];
  errors: TaskFormErrors;
  onPriorityChange: (value: TaskPriority) => void;
  onBillingCodeChange: (value: string) => void;
}

export const PriorityBillingSelector: React.FC<PriorityBillingSelectorProps> = ({
  priority,
  billingCodeId,
  billingCodes,
  errors,
  onPriorityChange,
  onBillingCodeChange
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
        <Label htmlFor="billingCode">Billing Code *</Label>
        <Select value={billingCodeId} onValueChange={onBillingCodeChange}>
          <SelectTrigger className={errors.billingCodeId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select code" />
          </SelectTrigger>
          <SelectContent>
            {billingCodes.map((code) => (
              <SelectItem key={code.id} value={code.id}>
                {code.code} (${code.ratePerFoot}/unit)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.billingCodeId && <p className="text-destructive text-sm">{errors.billingCodeId}</p>}
      </div>
    </div>
  );
};
