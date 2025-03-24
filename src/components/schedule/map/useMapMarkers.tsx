
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
  const markerElements = useRef<{[key: string]: HTMLElement}>({});
  
  useEffect(() => {
    if (!map) return;
    
    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    markerElements.current = {};
    
    // Wait for map to be loaded
    if (map.loaded()) {
      addMarkers();
    } else {
      map.once('load', addMarkers);
    }
    
    function addMarkers() {
      // Add markers for each task if tasks are visible
      if (showTasks) {
        console.log('Adding markers for tasks:', tasks.length);
        tasks.forEach(task => {
          // Strict validation to ensure coordinates are valid
          if (task.location && 
              isValidCoordinate(task.location.lat, task.location.lng)) {
            console.log('Creating marker for task:', task.title, task.location);
            const marker = createTaskMarker(map, task, handleTaskClick, task.id === selectedTaskId);
            markers.current.push(marker);
            
            // Store reference to the marker's DOM element
            const el = marker.getElement();
            markerElements.current[task.id] = el;
            
            // Apply pulsing effect to selected marker
            if (task.id === selectedTaskId) {
              applySelectedStyle(el);
            } else {
              removeSelectedStyle(el);
            }
          } else {
            console.warn('Invalid task coordinates:', task.title, task.location);
          }
        });
      }
      
      // If we have valid markers and no task is selected, fit the map to show all of them
      if (markers.current.length > 0 && !selectedTaskId) {
        fitMapToMarkers(map, tasks);
      }
    }
    
    // Helper function to apply selected style to a marker
    function applySelectedStyle(element: HTMLElement) {
      element.classList.add('selected-marker');
      element.style.zIndex = '10';
      
      // Add pulsing effect with CSS animation
      const innerElement = element.querySelector('.marker-inner') as HTMLElement;
      if (innerElement) {
        innerElement.style.animation = 'pulse 1.5s infinite';
        innerElement.style.boxShadow = '0 0 0 rgba(255, 106, 0, 0.4)';
        innerElement.style.transform = 'scale(1.1)';
      }
    }
    
    // Helper function to remove selected style from a marker
    function removeSelectedStyle(element: HTMLElement) {
      element.classList.remove('selected-marker');
      element.style.zIndex = '1';
      
      const innerElement = element.querySelector('.marker-inner') as HTMLElement;
      if (innerElement) {
        innerElement.style.animation = 'none';
        innerElement.style.boxShadow = 'none';
        innerElement.style.transform = 'scale(1)';
      }
    }
    
    // Helper function to validate coordinates
    function isValidCoordinate(lat: number, lng: number): boolean {
      return (
        lat !== undefined && lng !== undefined &&
        !isNaN(lat) && !isNaN(lng) &&
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
        if (task.location) {
          bounds.extend([task.location.lng, task.location.lat]);
        }
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
  
  // Effect to update marker styling when selection changes
  useEffect(() => {
    if (!selectedTaskId) {
      // No marker selected, reset all markers
      Object.keys(markerElements.current).forEach(taskId => {
        const el = markerElements.current[taskId];
        if (el) {
          el.classList.remove('selected-marker');
          el.style.zIndex = '1';
          
          const innerElement = el.querySelector('.marker-inner') as HTMLElement;
          if (innerElement) {
            innerElement.style.animation = 'none';
            innerElement.style.boxShadow = 'none';
            innerElement.style.transform = 'scale(1)';
          }
        }
      });
    } else {
      // Apply selected style to the selected marker and remove from others
      Object.keys(markerElements.current).forEach(taskId => {
        const el = markerElements.current[taskId];
        if (el) {
          if (taskId === selectedTaskId) {
            el.classList.add('selected-marker');
            el.style.zIndex = '10';
            
            const innerElement = el.querySelector('.marker-inner') as HTMLElement;
            if (innerElement) {
              innerElement.style.animation = 'pulse 1.5s infinite';
              innerElement.style.boxShadow = '0 0 0 rgba(255, 106, 0, 0.4)';
              innerElement.style.transform = 'scale(1.1)';
            }
          } else {
            el.classList.remove('selected-marker');
            el.style.zIndex = '1';
            
            const innerElement = el.querySelector('.marker-inner') as HTMLElement;
            if (innerElement) {
              innerElement.style.animation = 'none';
              innerElement.style.boxShadow = 'none';
              innerElement.style.transform = 'scale(1)';
            }
          }
        }
      });
    }
  }, [selectedTaskId]);
};
