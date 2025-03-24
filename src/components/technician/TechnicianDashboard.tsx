
import React, { useState, useEffect } from 'react';
import { useSchedule, Task } from '@/context/ScheduleContext';
import { FilterBar } from '@/components/ui/FilterBar';
import { useApp } from '@/context/AppContext';
import { Calendar, CheckCheck, Clock, MapIcon, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

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

  // Section header component
  const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-center gap-2 font-semibold text-lg mb-2">
      {icon}
      {title}
    </div>
  );

  // Card wrapper component with animation
  const AnimatedCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="container mx-auto py-6 space-y-6">
        <TechnicianWorkEntryDialog
          open={workEntryDialogOpen}
          onOpenChange={setWorkEntryDialogOpen}
          projectId={selectedProjectId || "project-1"}
        />
        
        <div className="flex items-center justify-between mb-2">
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
        
        {/* Vertical full-width layout */}
        <div className="flex flex-col space-y-6 w-full">
          {/* Section 1: Tasks */}
          <AnimatedCard>
            <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="py-3 bg-gradient-to-r from-fieldvision-navy/10 to-transparent">
                <SectionHeader icon={<Calendar className="h-5 w-5" />} title="Tasks" />
              </CardHeader>
              <CardContent>
                <TasksOverview 
                  assignedTasks={assignedTasks}
                  completedTasks={completedTasks}
                  onOpenWorkEntry={handleOpenWorkEntry}
                  getProjectName={getProjectName}
                />
              </CardContent>
            </Card>
          </AnimatedCard>
          
          {/* Section 2: Map View */}
          <AnimatedCard>
            <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="py-3 bg-gradient-to-r from-fieldvision-navy/10 to-transparent">
                <SectionHeader icon={<MapIcon className="h-5 w-5" />} title="Map View" />
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
          </AnimatedCard>
          
          {/* Section 3: Production */}
          <AnimatedCard>
            <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="py-3 bg-gradient-to-r from-fieldvision-navy/10 to-transparent">
                <SectionHeader icon={<CheckCheck className="h-5 w-5" />} title="Production" />
              </CardHeader>
              <CardContent>
                <ProductionOverviewChart completedTasks={completedTasks} />
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
        
        <div className="flex flex-col items-center justify-center mt-4 mb-4 sm:mb-6">
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
