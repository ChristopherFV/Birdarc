
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Pin, MinusCircle, PlusCircle } from 'lucide-react';

interface MapControlsProps {
  mapVisible: boolean;
  isAddingPin: boolean;
  toggleMapVisibility: () => void;
  togglePinMode: () => void;
  location: {
    lat: number;
    lng: number;
  };
  showMapTokenInput: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  mapVisible,
  isAddingPin,
  toggleMapVisibility,
  togglePinMode,
  location,
  showMapTokenInput
}) => {
  return (
    <div className="flex items-center gap-1">
      {mapVisible && !showMapTokenInput && (
        <Button 
          variant="ghost" 
          size="sm" 
          className={`text-xs h-7 px-2 ${isAddingPin ? 'bg-fieldvision-blue/10 text-fieldvision-blue' : ''}`}
          onClick={togglePinMode}
        >
          <Pin className="h-3 w-3 mr-1" color={isAddingPin ? '#00b6cf' : 'currentColor'} />
          <span className="hidden sm:inline">{isAddingPin ? 'Cancel' : 'Add Pin'}</span>
          <span className="sm:hidden">{isAddingPin ? 'Cancel' : 'Pin'}</span>
        </Button>
      )}
      {mapVisible && !showMapTokenInput && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-7 px-2"
          onClick={() => window.open(`https://maps.google.com/?q=${location.lat},${location.lng}`, '_blank')}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Open in Google Maps</span>
          <span className="sm:hidden">Maps</span>
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs h-7 px-2"
        onClick={toggleMapVisibility}
      >
        {mapVisible ? <MinusCircle className="h-3 w-3" /> : <PlusCircle className="h-3 w-3" />}
        <span className="hidden sm:inline ml-1">{mapVisible ? 'Hide Map' : 'Show Map'}</span>
      </Button>
    </div>
  );
};
