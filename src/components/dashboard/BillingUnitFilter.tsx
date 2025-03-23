
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { BillingUnitType } from '@/types/app-types';
import { Check, ChevronDown, RulerIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';

export const BillingUnitFilter: React.FC = () => {
  const { billingUnit, setBillingUnit } = useApp();
  const [open, setOpen] = useState(false);

  const unitOptions: { value: BillingUnitType; label: string }[] = [
    { value: 'foot', label: 'Feet' },
    { value: 'meter', label: 'Meters' },
    { value: 'each', label: 'Each' }
  ];

  const handleSelectUnit = (unit: BillingUnitType) => {
    setBillingUnit(unit);
    setOpen(false);
  };

  const getDisplayLabel = () => {
    const option = unitOptions.find(opt => opt.value === billingUnit);
    return option ? option.label : 'Feet';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
          <RulerIcon className="h-3.5 w-3.5" />
          <span>{getDisplayLabel()}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 w-36" align="end">
        <div className="flex flex-col">
          {unitOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              className="justify-start font-normal h-9 px-2 text-xs"
              onClick={() => handleSelectUnit(option.value)}
            >
              <span className="flex-1 text-left">{option.label}</span>
              {billingUnit === option.value && (
                <Check className="h-3.5 w-3.5" />
              )}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
