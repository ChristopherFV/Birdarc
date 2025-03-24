
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapIcon, ExternalLink, Pin, MinusCircle, PlusCircle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from "@/hooks/use-toast";

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapVisible, setMapVisible] = useState(true);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const markers = useRef<mapboxgl.Marker[]>([]);

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

  const addMapMarkers = () => {
    if (!map.current) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add markers for each note
    notes.forEach(note => {
      const el = document.createElement('div');
      el.className = 'note-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';
      el.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23F18E1D\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\'%3E%3C/path%3E%3Ccircle cx=\'12\' cy=\'10\' r=\'3\'%3E%3C/circle%3E%3C/svg%3E")';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([note.lng, note.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<div><strong>Note:</strong> ${note.text}</div>`))
        .addTo(map.current);
      
      markers.current.push(marker);
      
      el.addEventListener('click', () => {
        marker.togglePopup();
      });
    });
  };

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || !mapVisible) return;
    
    if (map.current) {
      addMapMarkers();
      return;
    }
    
    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [location.lng, location.lat],
        zoom: 15
      });
      
      // Add base location marker
      new mapboxgl.Marker({ color: '#F18E1D' })
        .setLngLat([location.lng, location.lat])
        .addTo(map.current);
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add click event for adding pins
      map.current.on('click', (e) => {
        if (isAddingPin) {
          const { lng, lat } = e.lngLat;
          
          // Show prompt for note text
          const noteText = prompt('Enter note for this location:');
          if (noteText) {
            const newNote: MapNote = {
              id: `note-${Date.now()}`,
              lat,
              lng,
              text: noteText,
              timestamp: new Date()
            };
            
            addNote(newNote);
            
            // Add marker for the new note
            const el = document.createElement('div');
            el.className = 'note-marker';
            el.style.width = '20px';
            el.style.height = '20px';
            el.style.backgroundSize = 'cover';
            el.style.cursor = 'pointer';
            el.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23F18E1D\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\'%3E%3C/path%3E%3Ccircle cx=\'12\' cy=\'10\' r=\'3\'%3E%3C/circle%3E%3C/svg%3E")';
            
            const marker = new mapboxgl.Marker(el)
              .setLngLat([lng, lat])
              .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<div><strong>Note:</strong> ${noteText}</div>`))
              .addTo(map.current);
            
            markers.current.push(marker);
            
            el.addEventListener('click', () => {
              marker.togglePopup();
            });
            
            // Deactivate pin mode after adding
            setIsAddingPin(false);
            
            toast({
              title: "Note added",
              description: "Pin has been placed on the map",
            });
          }
        }
      });
      
      addMapMarkers();
      
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
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, location.lat, location.lng, mapVisible, notes, isAddingPin, toast, addNote]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-2 px-3 sm:px-4 bg-fieldvision-navy/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
            <MapIcon className="h-3 sm:h-4 w-3 sm:w-4" />
            Job Location
          </CardTitle>
          <div className="flex items-center gap-1">
            {mapVisible && !showMapTokenInput && (
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-xs h-7 px-2 ${isAddingPin ? 'bg-orange-100' : ''}`}
                onClick={togglePinMode}
              >
                <Pin className="h-3 w-3 mr-1" color={isAddingPin ? '#F18E1D' : 'currentColor'} />
                <span className="hidden sm:inline">{isAddingPin ? 'Cancel' : 'Add Pin'}</span>
                <span className="sm:hidden">{isAddingPin ? 'Cancel' : 'Pin'}</span>
              </Button>
            )}
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
        </div>
      </CardHeader>
      {mapVisible && (
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
      )}
    </Card>
  );
};
