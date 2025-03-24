
import React from 'react';
import { Button } from '@/components/ui/button';

interface MapTokenInputProps {
  mapboxToken: string;
  handleSetMapboxToken: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const MapTokenInput: React.FC<MapTokenInputProps> = ({ 
  mapboxToken, 
  handleSetMapboxToken 
}) => {
  return (
    <div className="p-4">
      <form onSubmit={handleSetMapboxToken} className="space-y-2">
        <p className="text-sm text-muted-foreground mb-2">
          Please enter your Mapbox public token to display the map. You can get a token by creating an account at{' '}
          <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            mapbox.com
          </a>
        </p>
        <div className="flex gap-2">
          <input 
            type="text" 
            name="mapboxToken" 
            placeholder="pk.eyJ1IjoieW91..." 
            className="flex-1 px-2 py-1 text-sm border rounded"
            defaultValue={mapboxToken}
          />
          <Button type="submit" size="sm">
            Set Token
          </Button>
        </div>
      </form>
    </div>
  );
};
