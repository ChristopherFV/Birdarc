
import React, { useState } from 'react';
import { useSchedule, Task } from '@/context/ScheduleContext';
import { FilterBar } from '@/components/ui/FilterBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { MapIcon, Calendar, CheckCheck, Clock, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TechnicianWorkEntryDialog } from './TechnicianWorkEntryDialog';
import { useApp } from '@/context/AppContext';

export const TechnicianDashboard: React.FC = () => {
  const { tasks } = useSchedule();
  const { projects } = useApp();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [showMapTokenInput, setShowMapTokenInput] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>('tasks');
  const [workEntryDialogOpen, setWorkEntryDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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
    } else {
      // Default test token if none is stored
      const defaultToken = "pk.eyJ1IjoiY2h1Y2F0eCIsImEiOiJjbThra2NrcHIwZGIzMm1wdDYzNnpreTZyIn0.KUTPCuD8hk7VOzTYJ-WODg";
      setMapboxToken(defaultToken);
      localStorage.setItem('mapbox_token', defaultToken);
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

  // Open work entry dialog
  const handleOpenWorkEntry = (projectId: string | null = null) => {
    setSelectedProjectId(projectId);
    setWorkEntryDialogOpen(true);
  };

  // Get project name by ID
  const getProjectName = (projectId: string | null) => {
    if (!projectId) return "No Project";
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <TechnicianWorkEntryDialog
        open={workEntryDialogOpen}
        onOpenChange={setWorkEntryDialogOpen}
        projectId={selectedProjectId || "project-1"}
      />
      
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Technician Dashboard</h1>
        <Button 
          onClick={() => handleOpenWorkEntry()} 
          variant="default" 
          className="bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Log Work Entry
        </Button>
      </div>
      
      <FilterBar />
      
      <Tabs defaultValue="tasks" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="tasks">
            <Calendar className="h-4 w-4 mr-2" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="map">
            <MapIcon className="h-4 w-4 mr-2" /> Map View
          </TabsTrigger>
          <TabsTrigger value="production">
            <CheckCheck className="h-4 w-4 mr-2" /> Production
          </TabsTrigger>
          <TabsTrigger value="timesheet">
            <Clock className="h-4 w-4 mr-2" /> Timesheet
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  My Assigned Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
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
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCheck className="h-5 w-5" />
                  Recently Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {completedTasks.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No completed tasks</p>
                  ) : (
                    completedTasks.slice(0, 5).map(task => (
                      <div 
                        key={task.id} 
                        className="block p-3 border rounded-md bg-secondary/30"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-sm">{task.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Completed: {format(task.endDate, 'MMM d, yyyy')}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              Project: {getProjectName(task.projectId)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {assignedTasks.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No scheduled tasks</p>
                  ) : (
                    [...assignedTasks]
                      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                      .map(task => (
                        <div 
                          key={task.id} 
                          className="block p-3 border rounded-md hover:bg-secondary/20 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-sm">{task.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                Date: {format(task.startDate, 'MMM d, yyyy')}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                Time: {format(task.startDate, 'h:mm a')} - {format(task.endDate, 'h:mm a')}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenWorkEntry(task.projectId);
                              }}
                            >
                              Log Hours
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="map">
          <Card>
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
                <div ref={mapContainer} className="h-[500px] w-full rounded-md"></div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="production">
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
                <div className="h-[400px] w-full">
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
        </TabsContent>
        
        <TabsContent value="timesheet">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <p className="text-sm text-muted-foreground">
                  Log your work hours or add production details for completed tasks.
                </p>
                <Button
                  onClick={() => handleOpenWorkEntry()}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Work Entry
                </Button>
                
                <div className="border rounded-md p-4 mt-4">
                  <h3 className="font-medium mb-2">Recent Entries</h3>
                  {completedTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent work entries</p>
                  ) : (
                    <div className="space-y-2">
                      {completedTasks.slice(0, 3).map(task => (
                        <div key={task.id} className="border-b pb-2 last:border-0">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium text-sm">{task.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(task.endDate, 'MMM d, yyyy')} • {task.quantityEstimate} units
                              </p>
                            </div>
                            <div className="text-sm font-medium">
                              {task.projectId ? getProjectName(task.projectId) : 'No Project'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex flex-col items-center justify-center mt-4 mb-4 sm:mb-6">
        <img 
          src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
          alt="Fieldvision Logo" 
          className="h-6 sm:h-8 w-auto object-contain" 
        />
      </div>
    </div>
  );
};
