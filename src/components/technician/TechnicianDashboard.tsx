
import React, { useState, useEffect } from 'react';
import { useSchedule, Task } from '@/context/ScheduleContext';
import { FilterBar } from '@/components/ui/FilterBar';
import { useApp } from '@/context/AppContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TechnicianWorkEntryDialog } from './TechnicianWorkEntryDialog';

// Import our dashboard components
import { TechDashboardMap } from './dashboard/TechDashboardMap';
import { ProductionOverviewChart } from './dashboard/ProductionOverviewChart';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardFooter } from './dashboard/DashboardFooter';
import { TaskColumns } from './dashboard/TaskColumns';
import { CheckCheck, Map as MapIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader } from './dashboard/SectionHeader';

export const TechnicianDashboard: React.FC = () => {
  const { tasks } = useSchedule();
  const { projects } = useApp();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [showMapTokenInput, setShowMapTokenInput] = useState(false);
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
      // Without a valid token, we'll show the input
      setShowMapTokenInput(true);
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
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="container mx-auto py-6">
        <TechnicianWorkEntryDialog
          open={workEntryDialogOpen}
          onOpenChange={setWorkEntryDialogOpen}
          projectId={selectedProjectId || "project-1"}
        />
        
        <DashboardHeader handleOpenWorkEntry={handleOpenWorkEntry} />
        
        <FilterBar technicianView={true} />
        
        {/* Main layout with two column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left column with chart and map */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Production Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    <SectionHeader icon={<CheckCheck className="h-5 w-5" />} title="Production Overview" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[280px]">
                    <ProductionOverviewChart completedTasks={completedTasks} />
                  </div>
                </CardContent>
              </Card>
              
              {/* Map */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    <SectionHeader icon={<MapIcon className="h-5 w-5" />} title="Task Map" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[280px]">
                    <TechDashboardMap 
                      tasks={[...assignedTasks, ...completedTasks]}
                      mapboxToken={mapboxToken}
                      showMapTokenInput={showMapTokenInput}
                      setMapboxToken={setMapboxToken}
                      setShowMapTokenInput={setShowMapTokenInput}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Right column with task cards */}
          <div className="space-y-6">
            <TaskColumns 
              assignedTasks={assignedTasks}
              completedTasks={completedTasks}
              handleOpenWorkEntry={handleOpenWorkEntry}
              getProjectName={getProjectName}
            />
          </div>
        </div>
        
        <DashboardFooter />
      </div>
    </ScrollArea>
  );
};
