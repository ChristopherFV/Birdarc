
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { createTaskMarker, createProjectMarker } from './MapMarker';

export const useMapMarkers = (
  map: mapboxgl.Map | null,
  showTasks: boolean,
  showProjects: boolean,
  tasks: any[],
  projects: any[],
  handleTaskClick: (id: string) => void,
  handleProjectClick: (id: string) => void
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
          const marker = createTaskMarker(map, task, handleTaskClick);
          markers.current.push(marker);
        });
      }
      
      // Add markers for projects if projects are visible
      if (showProjects) {
        projects.forEach(project => {
          const marker = createProjectMarker(map, project, handleProjectClick);
          markers.current.push(marker);
        });
      }
    }
    
    return () => {
      markers.current.forEach(marker => marker.remove());
    };
  }, [map, tasks, projects, showTasks, showProjects, handleTaskClick, handleProjectClick]);
};
