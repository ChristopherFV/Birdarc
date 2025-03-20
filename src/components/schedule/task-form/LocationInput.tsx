
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { TaskFormErrors } from './validation';

interface LocationInputProps {
  address: string;
  errors: TaskFormErrors;
  onAddressChange: (value: string) => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  address,
  errors,
  onAddressChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="address">Location *</Label>
      <div className="flex">
        <Input
          id="address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Enter address"
          className={`flex-1 ${errors.address ? "border-destructive" : ""}`}
          required
        />
        <Button type="button" variant="outline" className="ml-2">
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
    </div>
  );
};
