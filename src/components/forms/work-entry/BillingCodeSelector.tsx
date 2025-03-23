
import React from 'react';
import { BillingCode } from '@/context/AppContext';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BillingCodeSelectorProps {
  billingCodeId: string;
  billingCodes: BillingCode[];
  onChange: (value: string) => void;
  error?: string;
}

export const BillingCodeSelector: React.FC<BillingCodeSelectorProps> = ({
  billingCodeId,
  billingCodes,
  onChange,
  error
}) => {
  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <div>
      <label htmlFor="billingCodeId" className="block text-sm font-medium mb-1">
        Billing Code
      </label>
      <Select value={billingCodeId} onValueChange={handleChange}>
        <SelectTrigger 
          id="billingCodeId"
          className={`w-full text-sm ${error ? 'border-destructive' : 'border-input'}`}
          aria-invalid={!!error}
        >
          <SelectValue placeholder="Select Billing Code" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="">Select Billing Code</SelectItem>
            {billingCodes.map(code => (
              <SelectItem key={code.id} value={code.id}>
                {code.code} - {code.description} (${code.ratePerFoot.toFixed(2)}/ft)
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
};
