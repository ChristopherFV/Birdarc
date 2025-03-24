
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from "@/hooks/use-toast";
import { MapNote } from '../TechnicianLocationMap';

interface UseMapInitializationProps {
  mapVisible: boolean;
  location: {
    lat: number;
    lng: number;
  };
  mapboxToken: string;
  notes: MapNote[];
  addNote: (note: MapNote) => void;
  isAddingPin: boolean;
  setIsAddingPin: (isAdding: boolean) => void;
}

export const useMapInitialization = ({
  mapVisible,
  location,
  mapboxToken,
  notes,
  addNote,
  isAddingPin,
  setIsAddingPin
}: UseMapInitializationProps) => {
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const mapInitialized = useRef(false);

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

  // Effect for map initialization - only runs when necessary parameters change
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || !mapVisible) return;
    
    // Only initialize the map once
    if (!map.current && !mapInitialized.current) {
      try {
        mapboxgl.accessToken = mapboxToken;
        
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
              setIsAddingPin(false);
              
              toast({
                title: "Note added",
                description: "Pin has been placed on the map",
              });
            }
          }
        });
        
        mapInitialized.current = true;
        
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
    }
    
    // Update markers whenever notes change
    if (map.current && mapVisible) {
      addMapMarkers();
    }
    
    return () => {
      if (map.current && !mapVisible) {
        map.current.remove();
        map.current = null;
        mapInitialized.current = false;
      }
    };
  }, [mapboxToken, mapVisible]); // Removed dependencies that cause continuous reloads
  
  // Separate effect for updating markers when notes change
  useEffect(() => {
    if (map.current && mapVisible) {
      addMapMarkers();
    }
  }, [notes, mapVisible]);
  
  // Separate effect for updating map center when location changes
  useEffect(() => {
    if (map.current && mapVisible) {
      map.current.setCenter([location.lng, location.lat]);
    }
  }, [location.lat, location.lng, mapVisible]);

  return { mapContainer };
};
