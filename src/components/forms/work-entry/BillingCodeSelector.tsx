
import React from 'react';
import { BillingCode } from '@/context/AppContext';

interface BillingCodeSelectorProps {
  billingCodeId: string;
  billingCodes: BillingCode[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

export const BillingCodeSelector: React.FC<BillingCodeSelectorProps> = ({
  billingCodeId,
  billingCodes,
  onChange,
  error
}) => {
  const getUnitLabel = (code: BillingCode) => {
    const unitType = code.unitType || 'foot';
    switch (unitType) {
      case 'foot': return 'ft';
      case 'meter': return 'm';
      case 'each': return 'ea';
      default: return 'unit';
    }
  };
  
  return (
    <div>
      <label htmlFor="billingCodeId" className="block text-sm font-medium mb-1">
        Billing Code
      </label>
      <select
        id="billingCodeId"
        name="billingCodeId"
        value={billingCodeId}
        onChange={onChange}
        className={`
          w-full px-3 py-2 bg-background border rounded-md text-sm 
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
          transition-colors
          ${error ? 'border-destructive' : 'border-input'}
        `}
      >
        <option value="">Select Billing Code</option>
        {billingCodes.map(code => (
          <option key={code.id} value={code.id}>
            {code.code} - {code.description} (${code.ratePerFoot.toFixed(2)}/{getUnitLabel(code)})
          </option>
        ))}
      </select>
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
};
