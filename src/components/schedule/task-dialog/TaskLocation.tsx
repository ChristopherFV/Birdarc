
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { AddTaskFormErrors } from './validation';

interface TaskLocationProps {
  address: string;
  errors?: AddTaskFormErrors;
  onAddressChange: (value: string) => void;
}

export const TaskLocation: React.FC<TaskLocationProps> = ({
  address,
  errors = {},
  onAddressChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="address" className="flex items-center">
        <MapPin className="h-4 w-4 mr-1" />
        Location
      </Label>
      <Input 
        id="address" 
        value={address} 
        onChange={(e) => onAddressChange(e.target.value)}
        placeholder="Enter address or location"
        required
        className={errors.address ? "border-destructive" : ""}
      />
      {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
    </div>
  );
};
