
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { BillingCode } from '@/context/AppContext';

export interface BillingCodeEntry {
  billingCodeId: string;
  percentage: number;
  ratePerUnit: number;
  hideRateFromTeamMember: boolean;
}

interface BillingCodeItemProps {
  item: BillingCodeEntry;
  index: number;
  isContractor: boolean;
  billingCodes: BillingCode[];
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof BillingCodeEntry, value: string | number | boolean) => void;
}

export const BillingCodeItem: React.FC<BillingCodeItemProps> = ({
  item,
  index,
  isContractor,
  billingCodes,
  onRemove,
  onChange
}) => {
  return (
    <div className="space-y-2 p-3 border rounded-md">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">Billing Code {index + 1}</Label>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <Select
          value={item.billingCodeId}
          onValueChange={(value) => onChange(index, 'billingCodeId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select billing code" />
          </SelectTrigger>
          <SelectContent>
            {billingCodes.map((code) => (
              <SelectItem key={code.id} value={code.id}>
                {code.code} (${code.ratePerFoot}/unit)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Percentage</Label>
          <div className="flex items-center">
            <Input
              type="number"
              min="1"
              max="100"
              value={item.percentage.toString()}
              onChange={(e) => onChange(index, 'percentage', Number(e.target.value))}
              className="text-right pr-0"
            />
            <span className="ml-2">%</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <Label className="text-xs">Rate per Unit</Label>
          <div className="flex items-center">
            <span className="mr-1">$</span>
            <Input
              type="number"
              value={item.ratePerUnit.toFixed(2)}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
      </div>
      
      {!isContractor && (
        <div className="flex items-center space-x-2 mt-2">
          <Switch
            id={`hideRate-${index}`}
            checked={item.hideRateFromTeamMember}
            onCheckedChange={(checked) => onChange(index, 'hideRateFromTeamMember', checked)}
          />
          <Label htmlFor={`hideRate-${index}`} className="text-xs cursor-pointer flex items-center">
            {item.hideRateFromTeamMember ? (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Hide rate from team member
              </>
            ) : (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Show rate to team member
              </>
            )}
          </Label>
        </div>
      )}
    </div>
  );
};
