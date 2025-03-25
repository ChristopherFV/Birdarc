
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BillingCode } from '@/context/AppContext';
import { BillingCodeItem, BillingCodeEntry } from './BillingCodeItem';

interface BillingCodesSectionProps {
  selectedBillingCodes: BillingCodeEntry[];
  isContractor: boolean;
  billingCodes: BillingCode[];
  error?: string;
  onAddCode: () => void;
  onRemoveCode: (index: number) => void;
  onBillingCodeChange: (index: number, field: keyof BillingCodeEntry, value: string | number | boolean) => void;
}

export const BillingCodesSection: React.FC<BillingCodesSectionProps> = ({
  selectedBillingCodes,
  isContractor,
  billingCodes,
  error,
  onAddCode,
  onRemoveCode,
  onBillingCodeChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label>Billing Codes *</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onAddCode}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Code
        </Button>
      </div>
      
      {selectedBillingCodes.length === 0 && (
        <div className={`p-4 border ${error ? "border-destructive" : "border-border"} rounded-md text-sm text-muted-foreground text-center`}>
          No billing codes added. Click "Add Code" to add a billing code.
          {error && <p className="text-destructive text-sm mt-1">{error}</p>}
        </div>
      )}
      
      {selectedBillingCodes.map((item, index) => (
        <BillingCodeItem 
          key={index}
          item={item}
          index={index}
          isContractor={isContractor}
          billingCodes={billingCodes}
          onRemove={onRemoveCode}
          onChange={onBillingCodeChange}
        />
      ))}
    </div>
  );
};
