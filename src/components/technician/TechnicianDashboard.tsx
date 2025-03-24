import React, { useState, useEffect } from 'react';
import { useSchedule, Task } from '@/context/ScheduleContext';
import { FilterBar } from '@/components/ui/FilterBar';
import { useApp } from '@/context/AppContext';
import { Calendar, CheckCheck, Clock, MapIcon, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import our dashboard components
import { TechDashboardMap } from './dashboard/TechDashboardMap';
import { ProductionOverviewChart } from './dashboard/ProductionOverviewChart';
import { TasksOverview } from './dashboard/TasksOverview';
import { TechnicianWorkEntryDialog } from './TechnicianWorkEntryDialog';

export const TechnicianDashboard: React.FC = () => {
  const { tasks } = useSchedule();
  const { projects } = useApp();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [showMapTokenInput, setShowMapTokenInput] = useState(false);
  const [workEntryDialogOpen, setWorkEntryDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const isMobile = useIsMobile();

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
      // Default test token if none stored
      const defaultToken = "pk.eyJ1IjoiY2h1Y2swZGIsImEiOiJjbTFwdHYzN0oZGIzMm1wdHYzIn0.KUTPcuD8hk7VOzTYJ5WODg";
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

  // Section header component
  const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-center gap-2 font-semibold text-lg mb-2">
      {icon}
      {title}
    </div>
  );

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="container mx-auto py-6">
        <TechnicianWorkEntryDialog
          open={workEntryDialogOpen}
          onOpenChange={setWorkEntryDialogOpen}
          projectId={selectedProjectId || "project-1"}
        />
        
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Technician Dashboard</h1>
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleOpenWorkEntry()} 
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Clock className="h-4 w-4" /> Log Time
            </Button>
            <Button 
              onClick={() => handleOpenWorkEntry()} 
              variant="default" 
              size="sm"
              className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Log Work
            </Button>
          </div>
        </div>
        
        <FilterBar />
        
        {/* Main layout grid with production on top, map in middle, tasks on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Production Chart (spans 2 columns on large screens) */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  <SectionHeader icon={<CheckCheck className="h-5 w-5" />} title="Production Overview" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductionOverviewChart completedTasks={completedTasks} />
              </CardContent>
            </Card>
          </div>
          
          {/* Tasks Column (right side) */}
          <div className="space-y-6">
            {/* My Assigned Tasks */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  <SectionHeader icon={<Calendar className="h-5 w-5" />} title="My Assigned Tasks" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {assignedTasks.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No active tasks</p>
                  ) : (
                    assignedTasks.map(task => (
                      <div 
                        key={task.id} 
                        className="block p-3 border rounded-md hover:bg-secondary transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-sm">{task.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
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
            
            {/* Upcoming Schedule */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  <SectionHeader icon={<Clock className="h-5 w-5" />} title="Upcoming Schedule" />
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
                                Project: {getProjectName(task.projectId)}
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
            
            {/* Recently Completed */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  <SectionHeader icon={<CheckCheck className="h-5 w-5" />} title="Recently Completed" />
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
          </div>
          
          {/* Map (spans 2 columns on large screens) */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  <SectionHeader icon={<MapIcon className="h-5 w-5" />} title="Task Map" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-2">
                <TechDashboardMap 
                  tasks={[...assignedTasks, ...completedTasks]}
                  mapboxToken={mapboxToken}
                  showMapTokenInput={showMapTokenInput}
                  setMapboxToken={setMapboxToken}
                  setShowMapTokenInput={setShowMapTokenInput}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center mt-8 mb-4">
          <img 
            src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
            alt="Fieldvision Logo" 
            className="h-6 sm:h-8 w-auto object-contain" 
          />
        </div>
      </div>
    </ScrollArea>
  );
};
