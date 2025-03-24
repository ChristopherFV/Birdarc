
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapIcon } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from "@/hooks/use-toast";
import { Task } from '@/context/ScheduleContext';

interface TechDashboardMapProps {
  tasks: Task[];
  mapboxToken: string;
  showMapTokenInput: boolean;
  setMapboxToken: (token: string) => void;
  setShowMapTokenInput: (show: boolean) => void;
}

export const TechDashboardMap: React.FC<TechDashboardMapProps> = ({
  tasks,
  mapboxToken,
  showMapTokenInput,
  setMapboxToken,
  setShowMapTokenInput
}) => {
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  // Handle mapbox token input
  const handleSetMapboxToken = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('mapboxToken') as string;
    
    if (token) {
      setMapboxToken(token);
      setShowMapTokenInput(false);
      localStorage.setItem('mapbox_token', token);
      
      // Initialize map after setting token
      initializeMap();
    }
  };
  
  // Initialize map
  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      if (map.current) map.current.remove();
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 3
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add markers after map is loaded
      map.current.on('load', () => addMarkers());
      
      toast({
        title: "Map loaded successfully",
        description: "Task locations are now visible on the map",
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Map initialization failed",
        description: "Please check your Mapbox token and try again",
        variant: "destructive"
      });
      setShowMapTokenInput(true);
    }
  };
  
  // Add markers for each task
  const addMarkers = () => {
    if (!map.current) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add task markers
    tasks.forEach(task => {
      const { lat, lng } = task.location;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = task.status === 'completed' ? '#22c55e' : '#3b82f6';
      el.style.width = '15px';
      el.style.height = '15px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      
      // Add marker to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <strong>${task.title}</strong><br>
          <small>${task.location.address}</small><br>
          <small>Status: ${task.status}</small>
        `))
        .addTo(map.current);
      
      markers.current.push(marker);
    });
  };
  
  // Initialize map when component mounts and token is available
  useEffect(() => {
    if (mapboxToken && !showMapTokenInput) {
      initializeMap();
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, showMapTokenInput]);
  
  // Update markers when tasks change
  useEffect(() => {
    if (map.current && !showMapTokenInput) {
      addMarkers();
    }
  }, [tasks]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapIcon className="h-5 w-5" />
          Task Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showMapTokenInput ? (
          <div className="p-4 border rounded-md">
            <p className="text-sm mb-2">Please enter your Mapbox token to view the map:</p>
            <form onSubmit={handleSetMapboxToken} className="flex gap-2">
              <input
                type="text"
                name="mapboxToken"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your Mapbox token"
              />
              <button type="submit" className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm">
                Set Token
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              You can get a token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
            </p>
          </div>
        ) : (
          <div ref={mapContainer} className="h-[500px] w-full rounded-md"></div>
        )}
      </CardContent>
    </Card>
  );
};
