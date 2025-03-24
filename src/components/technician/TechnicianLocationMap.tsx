
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapIcon } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from "@/hooks/use-toast";
import { MapControls } from './map/MapControls';
import { MapTokenInput } from './map/MapTokenInput';
import { useMapInitialization } from './map/useMapInitialization';

export interface MapNote {
  id: string;
  lat: number;
  lng: number;
  text: string;
  timestamp: Date;
}

interface TechnicianLocationMapProps {
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  mapboxToken: string;
  showMapTokenInput: boolean;
  setShowMapTokenInput: (show: boolean) => void;
  setMapboxToken: (token: string) => void;
  notes: MapNote[];
  addNote: (note: MapNote) => void;
  onMapVisibilityChange?: (visible: boolean) => void;
}

export const TechnicianLocationMap: React.FC<TechnicianLocationMapProps> = ({
  location,
  mapboxToken,
  showMapTokenInput,
  setShowMapTokenInput,
  setMapboxToken,
  notes,
  addNote,
  onMapVisibilityChange
}) => {
  const { toast } = useToast();
  const [mapVisible, setMapVisible] = useState(true);
  const [isAddingPin, setIsAddingPin] = useState(false);

  const handleSetMapboxToken = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('mapboxToken') as string;
    
    if (token) {
      setMapboxToken(token);
      setShowMapTokenInput(false);
      localStorage.setItem('mapbox_token', token);
    }
  };

  const toggleMapVisibility = () => {
    const newVisibility = !mapVisible;
    setMapVisible(newVisibility);
    if (onMapVisibilityChange) {
      onMapVisibilityChange(newVisibility);
    }
  };

  const togglePinMode = () => {
    setIsAddingPin(!isAddingPin);
    
    if (!isAddingPin) {
      toast({
        title: "Pin mode activated",
        description: "Click on the map to add a note pin",
      });
    } else {
      toast({
        title: "Pin mode deactivated",
        description: "You can now interact with the map normally",
      });
    }
  };

  const { mapContainer } = useMapInitialization({
    mapVisible,
    location,
    mapboxToken,
    notes,
    addNote,
    isAddingPin,
    setIsAddingPin
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-2 px-3 sm:px-4 bg-fieldvision-navy/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
            <MapIcon className="h-3 sm:h-4 w-3 sm:w-4" />
            Job Location
          </CardTitle>
          <MapControls 
            mapVisible={mapVisible}
            isAddingPin={isAddingPin}
            toggleMapVisibility={toggleMapVisibility}
            togglePinMode={togglePinMode}
            location={location}
            showMapTokenInput={showMapTokenInput}
          />
        </div>
      </CardHeader>
      {mapVisible && (
        <CardContent className="p-0">
          {showMapTokenInput ? (
            <MapTokenInput 
              mapboxToken={mapboxToken} 
              handleSetMapboxToken={handleSetMapboxToken} 
            />
          ) : (
            <div 
              ref={mapContainer} 
              className="w-full h-[200px] sm:h-[250px]"
            />
          )}
        </CardContent>
      )}
    </Card>
  );
};
