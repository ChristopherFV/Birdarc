
import React, { useState, useEffect } from 'react';
import { useSchedule, Task } from '@/context/ScheduleContext';
import { FilterBar } from '@/components/ui/FilterBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TechnicianWorkEntryDialog } from './TechnicianWorkEntryDialog';
import { useApp } from '@/context/AppContext';
import { Calendar, CheckCheck, Clock, MapIcon, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import our newly created dashboard components
import { TechDashboardMap } from './dashboard/TechDashboardMap';
import { ProductionOverviewChart } from './dashboard/ProductionOverviewChart';
import { TasksOverview } from './dashboard/TasksOverview';
import { TimeEntryCard } from './dashboard/TimeEntryCard';

export const TechnicianDashboard: React.FC = () => {
  const { tasks } = useSchedule();
  const { projects } = useApp();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
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
          <TasksOverview 
            assignedTasks={assignedTasks}
            completedTasks={completedTasks}
            onOpenWorkEntry={handleOpenWorkEntry}
            getProjectName={getProjectName}
          />
        </TabsContent>
        
        <TabsContent value="map">
          <TechDashboardMap 
            tasks={[...assignedTasks, ...completedTasks]}
            mapboxToken={mapboxToken}
            showMapTokenInput={showMapTokenInput}
            setMapboxToken={setMapboxToken}
            setShowMapTokenInput={setShowMapTokenInput}
          />
        </TabsContent>
        
        <TabsContent value="production">
          <ProductionOverviewChart completedTasks={completedTasks} />
        </TabsContent>
        
        <TabsContent value="timesheet">
          <TimeEntryCard 
            onOpenWorkEntry={() => handleOpenWorkEntry()}
            completedTasks={completedTasks}
            getProjectName={getProjectName}
          />
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
