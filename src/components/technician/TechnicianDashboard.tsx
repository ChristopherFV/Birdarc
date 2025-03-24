
import React from 'react';
import { useSchedule, Task } from '@/context/ScheduleContext';
import { FilterBar } from '@/components/ui/FilterBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { MapIcon, Calendar, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useEffect, useState } from 'react';

export const TechnicianDashboard: React.FC = () => {
  const { tasks } = useSchedule();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showMapTokenInput, setShowMapTokenInput] = useState(true);

  // Filter for assigned tasks (in a real app, this would filter by the current user ID)
  const assignedTasks = tasks.filter(task => 
    task.status !== 'completed' && task.status !== 'cancelled'
  );

  // Get completed tasks from localStorage to simulate persistence
  useEffect(() => {
    const storedTasks = localStorage.getItem('technician_completed_tasks');
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      // Convert string dates back to Date objects
      const tasksWithDates = parsedTasks.map((task: any) => ({
        ...task,
        startDate: new Date(task.startDate),
        endDate: new Date(task.endDate)
      }));
      setCompletedTasks(tasksWithDates);
    }
    
    // Get the mapbox token from localStorage if available
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
      setShowMapTokenInput(false);
    }
  }, []);

  // Initialize map when we have a token
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || showMapTokenInput) return;
    
    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 3
      });
      
      // Add tasks as markers
      const allTasks = [...assignedTasks, ...completedTasks];
      allTasks.forEach(task => {
        const { lat, lng } = task.location;
        
        // Create marker element
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = task.status === 'completed' ? '#22c55e' : '#3b82f6';
        el.style.width = '15px';
        el.style.height = '15px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        
        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <strong>${task.title}</strong><br>
            <small>${task.location.address}</small><br>
            <small>Status: ${task.status}</small>
          `))
          .addTo(map.current);
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
    }
  }, [mapboxToken, showMapTokenInput, assignedTasks, completedTasks]);

  // Handle mapbox token input
  const handleSetMapboxToken = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('mapboxToken') as string;
    
    if (token) {
      setMapboxToken(token);
      setShowMapTokenInput(false);
      localStorage.setItem('mapbox_token', token);
    }
  };

  // Production data for the chart (using completed tasks)
  const productionData = completedTasks.map(task => {
    // Get month name for the x-axis
    const monthName = format(task.endDate, 'MMM');
    return {
      name: monthName,
      units: task.quantityEstimate,
      task: task.title
    };
  });

  // Group by month for the chart
  const aggregatedData = productionData.reduce((acc: any[], curr) => {
    const existingMonth = acc.find(item => item.name === curr.name);
    if (existingMonth) {
      existingMonth.units += curr.units;
    } else {
      acc.push({ name: curr.name, units: curr.units });
    }
    return acc;
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Technician Dashboard</h1>
      
      <FilterBar />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              My Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {assignedTasks.length === 0 ? (
                <p className="text-muted-foreground text-sm">No active tasks</p>
              ) : (
                assignedTasks.map(task => (
                  <Link 
                    key={task.id} 
                    to={`/technician?taskId=${task.id}`}
                    className="block p-3 border rounded-md hover:bg-secondary transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{task.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(task.startDate, 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {task.location.address}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapIcon className="h-5 w-5" />
              Task Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showMapTokenInput ? (
              <div className="p-4 border rounded-md">
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
              <div ref={mapContainer} className="h-[300px] w-full rounded-md"></div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCheck className="h-5 w-5" />
            Production Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No completed tasks to display</p>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aggregatedData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="units" fill="#3b82f6" name="Units Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
