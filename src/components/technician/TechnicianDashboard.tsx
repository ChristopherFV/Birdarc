import React, { useState, useEffect } from 'react';
import { useSchedule, Task, TaskStatus } from '@/context/ScheduleContext';
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
import { PageFooter } from '@/components/layout/PageFooter';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TechnicianDashboard: React.FC = () => {
  const { tasks, updateTask } = useSchedule();
  const { projects } = useApp();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>("pk.eyJ1IjoiY2h1Y2F0eCIsImEiOiJjbThra2NrcHIwZGIzMm1wdDYzNnpreTZyIn0.KUTPCuD8hk7VOzTYJ-WODg");
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
    
    // We're now using the hardcoded token, so we don't need to check localStorage
    setShowMapTokenInput(false);
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

  // Handle task completion
  const handleCompleteTask = (task: Task) => {
    // Update task status
    const updatedTask = { ...task, status: 'completed' as TaskStatus };
    
    try {
      // Update in main task list
      updateTask(updatedTask);
      
      // Update the completed tasks list
      const updatedCompletedTasks = [...completedTasks, updatedTask];
      setCompletedTasks(updatedCompletedTasks);
      
      // Update localStorage for persistence
      localStorage.setItem('technician_completed_tasks', JSON.stringify(updatedCompletedTasks));
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="container mx-auto py-6">
          <TechnicianWorkEntryDialog
            open={workEntryDialogOpen}
            onOpenChange={setWorkEntryDialogOpen}
            projectId={selectedProjectId || "project-1"}
          />
          
          <DashboardHeader />
          
          <FilterBar technicianView={true} />
          
          {/* Main layout with two column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left column with chart and map in a vertical layout */}
            <div className="lg:col-span-2 space-y-6">
              {/* Production Chart - Now placed above the map */}
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
              
              {/* Map - Now below the chart and without title */}
              <Card>
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
            
            {/* Right column with task cards */}
            <div className="space-y-6">
              <TaskColumns 
                assignedTasks={assignedTasks}
                completedTasks={completedTasks}
                handleOpenWorkEntry={handleOpenWorkEntry}
                getProjectName={getProjectName}
                onCompleteTask={handleCompleteTask}
              />
            </div>
          </div>
          
          <DashboardFooter />
        </div>
      </ScrollArea>
      
      {/* Replace the existing PageFooter with updated version */}
      <PageFooter
        backLink="/technician"
        backLabel="My Tasks"
        actionButton={
          <Link to="/technician">
            <Button variant="blue" size="sm" className="text-white">
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </Link>
        }
      />
    </div>
  );
};
