
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Task } from '@/context/ScheduleContext';
import { useMapMarkers } from './useMapMarkers';
import { MapFallback } from './MapFallback';
import { useIsMobile } from '@/hooks/use-mobile';

interface MapContentProps {
  mapboxApiKey?: string;
  showTasks: boolean;
  tasks: Task[];
  onTaskClick: (id: string) => void;
  selectedTaskId: string | null;
  fullScreen?: boolean;
}

export const MapContent: React.FC<MapContentProps> = ({
  mapboxApiKey,
  showTasks,
  tasks,
  onTaskClick,
  selectedTaskId,
  fullScreen = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [usingMapbox, setUsingMapbox] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [hasInitialZoom, setHasInitialZoom] = useState(false);
  const previousSelectedId = useRef<string | null>(null);
  const isMobile = useIsMobile();
  const hasZoomedToSelection = useRef<boolean>(false);
  const isInitialLoad = useRef<boolean>(true);
  
  // Initialize and set up Mapbox when API key is provided
  useEffect(() => {
    if (!mapContainer.current || !mapboxApiKey) return;
    
    try {
      console.log("Initializing map with", tasks.length, "tasks");
      
      // Set Mapbox access token
      mapboxgl.accessToken = mapboxApiKey;
      
      // Initialize the map with more immersive settings
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 3.5,
        attributionControl: false,
        pitchWithRotate: true,
        dragRotate: true,
        touchZoomRotate: true,
        maxPitch: 85
      });
      
      // Add attribution in bottom right
      map.current.addControl(new mapboxgl.AttributionControl(), 'bottom-right');
      
      // Add error handling
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError(e.error?.message || 'Failed to load map');
        setUsingMapbox(false);
      });
      
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setUsingMapbox(true);
        setMapError(null);
        
        // Add 3D building layer for more immersive experience
        if (map.current?.getStyle().layers) {
          const layers = map.current.getStyle().layers;
          
          // Find the first symbol layer in the map style
          let labelLayerId;
          for (let i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout && layers[i].layout['text-field']) {
              labelLayerId = layers[i].id;
              break;
            }
          }
          
          // Add 3D building layer if style supports it
          try {
            map.current.addLayer({
              'id': '3d-buildings',
              'source': 'composite',
              'source-layer': 'building',
              'filter': ['==', 'extrude', 'true'],
              'type': 'fill-extrusion',
              'minzoom': 15,
              'paint': {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': [
                  'interpolate', ['linear'], ['zoom'],
                  15, 0,
                  15.05, ['get', 'height']
                ],
                'fill-extrusion-base': [
                  'interpolate', ['linear'], ['zoom'],
                  15, 0,
                  15.05, ['get', 'min_height']
                ],
                'fill-extrusion-opacity': .6
              }
            }, labelLayerId);
          } catch (err) {
            console.log('Could not add 3D building layer', err);
          }
        }
        
        // Only fit bounds to all markers on initial load if no task is selected
        if (tasks.length > 0 && !selectedTaskId && !hasInitialZoom && isInitialLoad.current) {
          const bounds = new mapboxgl.LngLatBounds();
          
          tasks.forEach(task => {
            if (task.location && task.location.lng && task.location.lat) {
              bounds.extend([task.location.lng, task.location.lat]);
            }
          });
          
          if (!bounds.isEmpty()) {
            map.current?.fitBounds(bounds, {
              padding: { top: 50, bottom: 150, left: 50, right: 50 },
              maxZoom: 12
            });
            setHasInitialZoom(true);
          }
          isInitialLoad.current = false;
        }

        // If a task is already selected during initialization, zoom to it
        if (selectedTaskId) {
          zoomToSelectedTask(selectedTaskId);
          previousSelectedId.current = selectedTaskId;
          hasZoomedToSelection.current = true;
        }
      });
      
      // Add navigation controls but position them in top-right
      map.current.addControl(new mapboxgl.NavigationControl({
        visualizePitch: true,
        showCompass: true
      }), 'top-right');
      
      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
      
      // Cleanup function
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
          isInitialLoad.current = true;
        }
      };
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      setMapError(error instanceof Error ? error.message : 'Failed to initialize map');
      setUsingMapbox(false);
    }
  }, [mapboxApiKey, tasks, selectedTaskId, hasInitialZoom]);
  
  // Function to zoom to a selected task
  const zoomToSelectedTask = (taskId: string) => {
    if (!map.current) return;
    
    const selectedTask = tasks.find(task => task.id === taskId);
    if (selectedTask?.location && selectedTask.location.lat && selectedTask.location.lng) {
      console.log('Zooming to selected task:', selectedTask.title, selectedTask.location);
      
      // Zoom to the selected task location with smoother animation
      map.current.flyTo({
        center: [selectedTask.location.lng, selectedTask.location.lat],
        zoom: 14,
        essential: true,
        duration: 1500,
        pitch: 60, // Tilt the view for better 3D perspective
      });
    }
  };
  
  // Effect to zoom to selected task when selectedTaskId changes
  useEffect(() => {
    // Skip this effect on initial render when map is not ready yet
    if (!map.current) return;
    
    console.log("Selected task ID changed:", selectedTaskId, "Previous:", previousSelectedId.current);
    
    if (selectedTaskId && selectedTaskId !== previousSelectedId.current) {
      // New project selected, zoom to it
      zoomToSelectedTask(selectedTaskId);
      hasZoomedToSelection.current = true;
    } else if (previousSelectedId.current && !selectedTaskId) {
      // If a task was selected before but now none is selected, zoom out to show all tasks
      const bounds = new mapboxgl.LngLatBounds();
      
      tasks.forEach(task => {
        if (task.location && task.location.lat && task.location.lng) {
          bounds.extend([task.location.lng, task.location.lat]);
        }
      });
      
      if (!bounds.isEmpty()) {
        map.current.flyTo({
          center: [-98.5795, 39.8283], // Center of USA
          zoom: 3.5,
          pitch: 0,
          duration: 1500
        });
        hasZoomedToSelection.current = false;
      }
    }
    
    // Update previous selected ID reference
    previousSelectedId.current = selectedTaskId;
  }, [selectedTaskId, tasks]);
  
  // Use custom hook to manage markers
  useMapMarkers(
    map.current,
    showTasks,
    tasks,
    onTaskClick,
    selectedTaskId
  );
  
  // Render a fallback UI if Mapbox isn't initialized or has an error
  if (!mapboxApiKey || mapError) {
    return (
      <MapFallback 
        tasks={tasks} 
        onTaskClick={onTaskClick} 
        selectedTaskId={selectedTaskId}
        errorMessage={mapError} 
      />
    );
  }
  
  const containerClass = isMobile && fullScreen 
    ? "fixed inset-0 z-50" 
    : "absolute inset-0";
  
  return <div ref={mapContainer} className={containerClass} />;
};
