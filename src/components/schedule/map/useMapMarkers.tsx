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
    
    if (!map.loaded()) {
      map.once('load', () => addMarkers());
      return;
    }
    
    addMarkers();
    
    function addMarkers() {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      markerElements.current = {};
      
      if (showTasks) {
        console.log('Adding markers for tasks:', tasks.length);
        tasks.forEach(task => {
          if (task.location && 
              isValidCoordinate(task.location.lat, task.location.lng)) {
            console.log('Creating marker for task:', task.title, task.location);
            const marker = createTaskMarker(map, task, handleTaskClick, task.id === selectedTaskId);
            markers.current.push(marker);
            
            const el = marker.getElement();
            markerElements.current[task.id] = el;
            
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
      
      if (markers.current.length > 0 && !selectedTaskId) {
        fitMapToMarkers(map, tasks);
      }
    }
    
    function applySelectedStyle(element: HTMLElement) {
      element.classList.add('selected-marker');
      element.style.zIndex = '10';
      
      const innerElement = element.querySelector('.marker-inner') as HTMLElement;
      if (innerElement) {
        innerElement.style.animation = 'pulse 1.5s infinite';
        innerElement.style.boxShadow = '0 0 0 rgba(255, 106, 0, 0.4)';
        innerElement.style.transform = 'scale(1.1)';
      }
    }
    
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
    
    function isValidCoordinate(lat: number, lng: number): boolean {
      return (
        lat !== undefined && lng !== undefined &&
        !isNaN(lat) && !isNaN(lng) &&
        lat >= -90 && lat <= 90 &&
        lng >= -180 && lng <= 180
      );
    }
    
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
  
  useEffect(() => {
    if (!selectedTaskId) {
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
