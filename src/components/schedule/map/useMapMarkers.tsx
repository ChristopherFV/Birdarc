
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { createTaskMarker } from './MapMarker';
import { Task } from '@/context/ScheduleContext';

export const useMapMarkers = (
  map: mapboxgl.Map | null,
  showTasks: boolean,
  tasks: Task[],
  handleTaskClick: (id: string) => void,
  selectedTaskId: string | null = null
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
          // Strict validation to ensure coordinates are valid
          if (task.location && 
              isValidCoordinate(task.location.lat, task.location.lng)) {
            const marker = createTaskMarker(map, task, handleTaskClick, task.id === selectedTaskId);
            markers.current.push(marker);
          } else {
            console.warn('Invalid task coordinates:', task.title, task.location);
          }
        });
      }
      
      // If we have valid markers, fit the map to show all of them
      if (markers.current.length > 0) {
        fitMapToMarkers(map, tasks);
      }
    }
    
    // Helper function to validate coordinates
    function isValidCoordinate(lat: number, lng: number): boolean {
      return (
        lat >= -90 && lat <= 90 && // Valid latitude range
        lng >= -180 && lng <= 180  // Valid longitude range
      );
    }
    
    // Helper function to fit map to show all markers
    function fitMapToMarkers(map: mapboxgl.Map, tasks: Task[]) {
      const validTasks = tasks.filter(task => 
        task.location && isValidCoordinate(task.location.lat, task.location.lng)
      );
      
      if (validTasks.length === 0) return;
      
      const bounds = new mapboxgl.LngLatBounds();
      
      validTasks.forEach(task => {
        bounds.extend([task.location.lng, task.location.lat]);
      });
      
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
    
    return () => {
      markers.current.forEach(marker => marker.remove());
    };
  }, [map, tasks, showTasks, handleTaskClick, selectedTaskId]);
};
