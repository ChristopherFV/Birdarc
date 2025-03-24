
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Task } from '@/context/ScheduleContext';
import { useMapMarkers } from './useMapMarkers';
import { MapFallback } from './MapFallback';

interface MapContentProps {
  mapboxApiKey?: string;
  showTasks: boolean;
  tasks: Task[];
  onTaskClick: (id: string) => void;
  selectedTaskId: string | null;
}

export const MapContent: React.FC<MapContentProps> = ({
  mapboxApiKey,
  showTasks,
  tasks,
  onTaskClick,
  selectedTaskId
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [usingMapbox, setUsingMapbox] = useState(false);
  
  // Initialize and set up Mapbox when API key is provided
  useEffect(() => {
    if (!mapContainer.current || !mapboxApiKey) return;
    
    try {
      // Set Mapbox access token
      mapboxgl.accessToken = mapboxApiKey;
      
      // Initialize the map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 3
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      setUsingMapbox(true);
      
      // Cleanup function
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      setUsingMapbox(false);
    }
  }, [mapboxApiKey]);
  
  // Use custom hook to manage markers
  useMapMarkers(
    map.current,
    showTasks,
    tasks,
    onTaskClick
  );
  
  // Render a fallback UI if Mapbox isn't initialized
  if (!mapboxApiKey) {
    return (
      <MapFallback 
        tasks={tasks} 
        onTaskClick={onTaskClick} 
        selectedTaskId={selectedTaskId} 
      />
    );
  }
  
  return <div ref={mapContainer} className="absolute inset-0" />;
};
