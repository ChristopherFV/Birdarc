
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, DollarSign, Layers } from 'lucide-react';
import { useSchedule } from '@/context/ScheduleContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockProjectLocations } from '@/utils/mockMapData';

interface ScheduleMapProps {
  mapboxApiKey?: string;
}

export const ScheduleMap: React.FC<ScheduleMapProps> = ({ mapboxApiKey }) => {
  const { tasks } = useSchedule();
  const { billingCodes, projects } = useApp();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [usingMapbox, setUsingMapbox] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [showTasks, setShowTasks] = useState(true);
  
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
  
  // Add markers for tasks and mock projects to the map
  useEffect(() => {
    if (!map.current || !usingMapbox) return;
    
    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Wait for map to be loaded
    map.current.once('load', () => {
      // Add markers for each task if tasks are visible
      if (showTasks) {
        tasks.forEach(task => {
          const priorityColor = 
            task.priority === 'high' ? '#ef4444' : 
            task.priority === 'medium' ? '#f59e0b' : '#3b82f6';
            
          const el = document.createElement('div');
          el.className = 'task-marker';
          el.style.backgroundColor = priorityColor;
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.borderRadius = '50%';
          el.style.cursor = 'pointer';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          
          const icon = document.createElement('div');
          icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
          el.appendChild(icon);
          
          // Create and add the marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat([task.location.lng, task.location.lat])
            .addTo(map.current!);
            
          // Add click event
          el.addEventListener('click', () => {
            handleTaskClick(task.id);
            setSelectedProjectId(null);
          });
          
          markers.current.push(marker);
        });
      }
      
      // Add markers for mock projects if projects are visible
      if (showProjects) {
        mockProjectLocations.forEach(project => {
          // Determine color based on project status/priority
          const projectColor = 
            project.priority === 'high' ? '#dc2626' : 
            project.priority === 'medium' ? '#f97316' : '#0ea5e9';
            
          const el = document.createElement('div');
          el.className = 'project-marker';
          el.style.backgroundColor = 'white';
          el.style.border = `2px solid ${projectColor}`;
          el.style.width = '22px';
          el.style.height = '22px';
          el.style.borderRadius = '50%';
          el.style.cursor = 'pointer';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          
          const icon = document.createElement('div');
          icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="${projectColor}" stroke="${projectColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
          el.appendChild(icon);
          
          // Create and add the marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat([project.lng, project.lat])
            .addTo(map.current!);
            
          // Add click event
          el.addEventListener('click', () => {
            setSelectedProjectId(project.id);
            setSelectedTaskId(null);
          });
          
          markers.current.push(marker);
        });
      }
    });
  }, [tasks, usingMapbox, showProjects, showTasks]);
  
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId === selectedTaskId ? null : taskId);
  };
  
  const selectedTask = tasks.find(task => task.id === selectedTaskId);
  const selectedProject = mockProjectLocations.find(proj => proj.id === selectedProjectId);
  
  // Helper to get billing code details
  const getBillingCode = (codeId: string | null) => {
    if (!codeId) return null;
    return billingCodes.find(code => code.id === codeId);
  };
  
  // Helper to get project name
  const getProjectName = (projectId: string | null) => {
    if (!projectId) return "No Project";
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };
  
  const selectedBillingCode = selectedTask ? getBillingCode(selectedTask.billingCodeId) : null;
  
  // Render a fallback UI if Mapbox isn't initialized
  if (!mapboxApiKey) {
    return (
      <div className="relative h-full w-full bg-gray-100 overflow-hidden">
        {/* Placeholder Map Background */}
        <div className="absolute inset-0 bg-fieldvision-navy/10 flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Enter Mapbox API Key to view map
            <br />
            <span className="text-xs">
              You can get a free API key at mapbox.com
            </span>
          </p>
        </div>
        
        {/* Fallback Task Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className="absolute"
              style={{
                // Placeholder positioning - in a real app these would correspond to actual map coordinates
                left: `${(task.location.lng + 122.44) * 400}px`,
                top: `${(37.79 - task.location.lat) * 400}px`,
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'auto'
              }}
            >
              <button
                onClick={() => handleTaskClick(task.id)}
                className={`
                  text-white p-1 rounded-full transition-all duration-300 
                  ${task.priority === 'high' ? 'bg-red-500' : 
                    task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}
                  ${selectedTaskId === task.id ? 'scale-125 shadow-lg' : ''}
                `}
              >
                <MapPin size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Map layer controls */}
      <div className="absolute left-4 top-4 z-10">
        <div className="bg-white p-2 rounded-md shadow-md space-y-1 border">
          <div className="text-xs font-medium text-gray-500 mb-1 flex items-center">
            <Layers className="h-3 w-3 mr-1" />
            Map Layers
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant={showTasks ? "default" : "outline"} 
              size="sm" 
              className="text-xs h-7 px-2" 
              onClick={() => setShowTasks(!showTasks)}
            >
              Tasks ({tasks.length})
            </Button>
            <Button 
              variant={showProjects ? "default" : "outline"} 
              size="sm" 
              className="text-xs h-7 px-2" 
              onClick={() => setShowProjects(!showProjects)}
            >
              Projects (100)
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mapbox container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Selected Task Info */}
      {selectedTask && (
        <div className="absolute right-4 top-4 w-72 pointer-events-auto z-10">
          <Card className="p-3 shadow-lg border-l-4 border-l-fieldvision-orange">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{selectedTask.title}</h3>
              <Badge variant={
                selectedTask.priority === 'high' ? 'destructive' : 
                selectedTask.priority === 'medium' ? 'default' : 'outline'
              }>
                {selectedTask.priority}
              </Badge>
            </div>
            <p className="text-xs mb-2">{getProjectName(selectedTask.projectId)}</p>
            <p className="text-xs text-muted-foreground mb-2">{selectedTask.description}</p>
            
            {selectedBillingCode && (
              <div className="text-xs mb-2 flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                <span>
                  {selectedBillingCode.code} - {selectedTask.quantityEstimate} units 
                  (${(selectedBillingCode.ratePerFoot * selectedTask.quantityEstimate).toFixed(2)})
                </span>
              </div>
            )}
            
            <div className="text-xs mb-1">
              <span className="font-medium">Location: </span> 
              {selectedTask.location.address}
            </div>
            <div className="text-xs">
              <span className="font-medium">Schedule: </span> 
              {format(selectedTask.startDate, 'MMM d')}
              {!format(selectedTask.startDate, 'yyyy-MM-dd').includes(format(selectedTask.endDate, 'yyyy-MM-dd')) && 
                ` - ${format(selectedTask.endDate, 'MMM d')}`
              }
            </div>
          </Card>
        </div>
      )}

      {/* Selected Project Info */}
      {selectedProject && (
        <div className="absolute right-4 top-4 w-72 pointer-events-auto z-10">
          <Card className="p-3 shadow-lg border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{selectedProject.title}</h3>
              <Badge variant={
                selectedProject.priority === 'high' ? 'destructive' : 
                selectedProject.priority === 'medium' ? 'default' : 'outline'
              }>
                {selectedProject.priority}
              </Badge>
            </div>
            <p className="text-xs mb-2">{selectedProject.type}</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {selectedProject.status}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedProject.size} ft
              </span>
            </div>
            <div className="text-xs mb-1">
              <span className="font-medium">Location: </span> 
              {`${selectedProject.lat.toFixed(4)}, ${selectedProject.lng.toFixed(4)}`}
            </div>
            <div className="text-xs mt-2 text-blue-600">
              <Button variant="link" className="h-auto p-0 text-xs">
                View Project Details
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
