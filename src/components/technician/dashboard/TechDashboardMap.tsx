
import React, { useRef, useEffect, useState } from 'react';
import { MapIcon, MapPin, CheckCircle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from "@/hooks/use-toast";
import { Task } from '@/context/ScheduleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    
    // Get bounds for auto-fitting
    const bounds = new mapboxgl.LngLatBounds();
    
    // Add task markers
    tasks.forEach(task => {
      const { lat, lng } = task.location;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      
      // Style based on task status
      if (task.status === 'completed') {
        // Completed task styling
        el.style.backgroundColor = '#22c55e'; // Green
        el.style.width = '20px';
        el.style.height = '20px';
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
      } else {
        // Active task styling (pending or in_progress)
        el.style.backgroundColor = task.priority === 'high' ? '#ef4444' : 
                                  task.priority === 'medium' ? '#f59e0b' : '#3b82f6';
        el.style.width = '18px';
        el.style.height = '18px';
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      }
      
      // Common styles
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.cursor = 'pointer';
      
      // Add marker to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <strong>${task.title}</strong><br>
          <small>${task.location.address}</small><br>
          <small>Status: ${task.status}</small>
          <small>Priority: ${task.priority}</small>
        `))
        .addTo(map.current);
      
      markers.current.push(marker);
      
      // Extend bounds to include this marker
      bounds.extend([lng, lat]);
    });
    
    // Fit bounds if we have markers
    if (markers.current.length > 0) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12
      });
    }
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
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 font-semibold">
          <MapIcon className="h-5 w-5" />
          Task Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {showMapTokenInput ? (
          <div className="p-4">
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
          <div ref={mapContainer} className="h-[300px] w-full" />
        )}
        
        {/* Legend for map markers */}
        {!showMapTokenInput && (
          <div className="flex gap-6 p-3 text-xs border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
              <span>Assigned (Low Priority)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 border border-white"></div>
              <span>Assigned (Medium Priority)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
              <span>Assigned (High Priority)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
              <span>Completed</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
