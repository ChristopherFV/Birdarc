
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapIcon, ExternalLink } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from "@/hooks/use-toast";

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
}

export const TechnicianLocationMap: React.FC<TechnicianLocationMapProps> = ({
  location,
  mapboxToken,
  showMapTokenInput,
  setShowMapTokenInput,
  setMapboxToken
}) => {
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

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

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [location.lng, location.lat],
        zoom: 15
      });
      
      new mapboxgl.Marker({ color: '#F18E1D' })
        .setLngLat([location.lng, location.lat])
        .addTo(map.current);
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      toast({
        title: "Map loaded successfully",
        description: "Task location is now visible on the map",
      });
      
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Map initialization failed",
        description: "Please check your Mapbox token and try again",
        variant: "destructive"
      });
    }
    
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, location.lat, location.lng, toast]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-2 px-3 sm:px-4 bg-fieldvision-navy/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
            <MapIcon className="h-3 sm:h-4 w-3 sm:w-4" />
            Job Location
          </CardTitle>
          {!showMapTokenInput && (
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
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {showMapTokenInput ? (
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
        ) : (
          <div 
            ref={mapContainer} 
            className="w-full h-[200px] sm:h-[250px]"
          />
        )}
      </CardContent>
    </Card>
  );
};
