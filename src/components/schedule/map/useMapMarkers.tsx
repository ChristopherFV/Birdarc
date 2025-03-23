
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { createTaskMarker } from './MapMarker';
import { Task } from '@/context/ScheduleContext';

export const useMapMarkers = (
  map: mapboxgl.Map | null,
  showTasks: boolean,
  tasks: Task[],
  handleTaskClick: (id: string) => void
) => {
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  useEffect(() => {
    if (!map) return;
    
    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Wait for map to be loaded
    if (map.loaded()) {
      addMarkers();
    } else {
      map.once('load', addMarkers);
    }
    
    function addMarkers() {
      // Add markers for each task if tasks are visible
      if (showTasks) {
        tasks.forEach(task => {
          // Strict validation to ensure coordinates are not in the ocean
          if (task.location && 
              isValidCoordinate(task.location.lat, task.location.lng)) {
            const marker = createTaskMarker(map, task, handleTaskClick);
            markers.current.push(marker);
          } else {
            console.warn('Invalid task coordinates:', task.title, task.location);
          }
        });
      }
    }
    
    // Helper function to validate coordinates are in continental US
    function isValidCoordinate(lat: number, lng: number): boolean {
      // These boundaries are intentionally restrictive to ensure tasks stay on land
      return (
        lat >= 30 && lat <= 47 && // North-South bounds
        lng >= -119 && lng <= -75 // East-West bounds
      );
    }
    
    return () => {
      markers.current.forEach(marker => marker.remove());
    };
  }, [map, tasks, showTasks, handleTaskClick]);
};
