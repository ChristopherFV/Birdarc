
import React, { useRef, useEffect, useState } from 'react';
import { MapIcon, MapPin, CheckCircle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from "@/hooks/use-toast";
import { Task } from '@/context/ScheduleContext';
import { Button } from '@/components/ui/button';

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
  
  const handleSetMapboxToken = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('mapboxToken') as string;
    
    if (token) {
      setMapboxToken(token);
      localStorage.setItem('mapbox_token', token);
      setShowMapTokenInput(false);
      
      // Initialize map with the new token
      initializeMap(token);
    }
  };
  
  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;

    try {
      // Clear any existing map
      if (map.current) {
        map.current.remove();
        map.current = null;
      }

      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-98.5795, 39.8283],
        zoom: 3
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
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
  
  const addMarkers = () => {
    if (!map.current) return;
    
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    if (tasks.length === 0) {
      // If no tasks, center on US
      map.current.setCenter([-98.5795, 39.8283]);
      map.current.setZoom(3);
      return;
    }
    
    const bounds = new mapboxgl.LngLatBounds();
    let validLocations = 0;
    
    tasks.forEach(task => {
      if (!task.location || typeof task.location.lat !== 'number' || typeof task.location.lng !== 'number') {
        return;
      }
      
      const { lat, lng } = task.location;
      
      // Simple validation to prevent errors
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        return;
      }
      
      validLocations++;
      
      const el = document.createElement('div');
      el.className = 'marker';
      
      if (task.status === 'completed') {
        el.style.backgroundColor = '#22c55e';
        el.style.width = '20px';
        el.style.height = '20px';
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
      } else {
        el.style.backgroundColor = task.priority === 'high' ? '#ef4444' : 
                                  task.priority === 'medium' ? '#f59e0b' : '#3b82f6';
        el.style.width = '18px';
        el.style.height = '18px';
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      }
      
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.cursor = 'pointer';
      
      try {
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <strong>${task.title}</strong><br>
            <small>${task.location.address || 'No address'}</small><br>
            <small>Status: ${task.status}</small>
          `))
          .addTo(map.current!);
        
        markers.current.push(marker);
        bounds.extend([lng, lat]);
      } catch (err) {
        console.error('Error adding marker:', err);
      }
    });
    
    if (validLocations > 0) {
      try {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 12
        });
      } catch (err) {
        console.error('Error fitting bounds:', err);
        // Fall back to US view
        map.current.setCenter([-98.5795, 39.8283]);
        map.current.setZoom(3);
      }
    }
  };
  
  useEffect(() => {
    if (mapboxToken && !showMapTokenInput) {
      initializeMap(mapboxToken);
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, showMapTokenInput]);
  
  useEffect(() => {
    if (map.current && !showMapTokenInput) {
      addMarkers();
    }
  }, [tasks]);

  return (
    <>
      {showMapTokenInput ? (
        <div className="p-4 h-full">
          <p className="text-sm mb-2">Please enter your Mapbox token to view the map:</p>
          <form onSubmit={handleSetMapboxToken} className="flex gap-2">
            <input
              type="text"
              name="mapboxToken"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter your Mapbox token"
            />
            <Button type="submit" className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm">
              Set Token
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            You can get a token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
          </p>
        </div>
      ) : (
        <div ref={mapContainer} className="h-[280px] w-full" />
      )}
    </>
  );
};
