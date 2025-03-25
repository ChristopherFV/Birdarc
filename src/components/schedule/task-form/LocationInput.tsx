
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  address: string;
  error?: string;
  onChange: (address: string) => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  address,
  error,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="address">Location *</Label>
      <div className="flex">
        <Input
          id="address"
          value={address}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter address"
          className={`flex-1 ${error ? "border-destructive" : ""}`}
          required
        />
        <Button type="button" variant="outline" className="ml-2">
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
};
