import React, { useState, useEffect } from 'react';
import { useSchedule, Task, TaskStatus } from '@/context/ScheduleContext';
import { FilterBar } from '@/components/ui/FilterBar';
import { useApp } from '@/context/AppContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TechnicianWorkEntryDialog } from './TechnicianWorkEntryDialog';
import { useIsMobile } from '@/hooks/use-mobile';

// Import our dashboard components
import { TechDashboardMap } from './dashboard/TechDashboardMap';
import { ProductionOverviewChart } from './dashboard/ProductionOverviewChart';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { TaskColumns } from './dashboard/TaskColumns';
import { CheckCheck, Map as MapIcon, BarChart, Layers, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader } from './dashboard/SectionHeader';
import { PageFooter } from '@/components/layout/PageFooter';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardFooter } from './dashboard/DashboardFooter';

export const TechnicianDashboard: React.FC = () => {
  const { tasks, updateTask } = useSchedule();
  const { projects, billingUnit, setSelectedBillingCodeId, selectedBillingCodeId } = useApp();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>("pk.eyJ1IjoiY2h1Y2F0eCIsImEiOiJjbThra2NrcHIwZGIzMm1wdDYzNnpreTZyIn0.KUTPCuD8hk7VOzTYJ-WODg");
  const [showMapTokenInput, setShowMapTokenInput] = useState(false);
  const [workEntryDialogOpen, setWorkEntryDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
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

  const handleBillingUnitChange = (value: string | null) => {
    if (value) {
      setSelectedBillingCodeId(value);
    } else {
      setSelectedBillingCodeId(null);
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="container mx-auto p-2 md:p-4">
            <TechnicianWorkEntryDialog
              open={workEntryDialogOpen}
              onOpenChange={setWorkEntryDialogOpen}
              projectId={selectedProjectId || "project-1"}
            />
            
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Technician Dashboard</h1>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleOpenWorkEntry()}
                className="text-xs shadow-sm"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Log Work
              </Button>
            </div>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full mt-2"
            >
              <TabsList className="w-full grid grid-cols-4 mb-4 bg-muted/70 p-1 rounded-lg sticky top-0 z-20 shadow-sm">
                <TabsTrigger value="overview" className="text-xs py-1.5">
                  <Layers className="h-3.5 w-3.5 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="tasks" className="text-xs py-1.5">
                  <ListChecks className="h-3.5 w-3.5 mr-1" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="map" className="text-xs py-1.5">
                  <MapIcon className="h-3.5 w-3.5 mr-1" />
                  Map
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-xs py-1.5">
                  <BarChart className="h-3.5 w-3.5 mr-1" />
                  Stats
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 pb-20 animate-fade-in">
                <Card className="shadow-sm p-3 mb-4">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-base flex items-center">
                      <CheckCheck className="h-4 w-4 mr-1.5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <div className="text-blue-600 text-sm font-medium">Pending</div>
                        <div className="text-2xl font-bold">{assignedTasks.length}</div>
                      </div>
                      <div className="bg-green-50 p-2 rounded-lg">
                        <div className="text-green-600 text-sm font-medium">Completed</div>
                        <div className="text-2xl font-bold">{completedTasks.length}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm overflow-hidden mb-4">
                  <CardHeader className="py-2 px-3">
                    <CardTitle className="text-base flex items-center">
                      <MapIcon className="h-4 w-4 mr-1.5" />
                      Location Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[200px]">
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
                
                <Card className="shadow-sm overflow-hidden">
                  <CardHeader className="py-2 px-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center">
                        <BarChart className="h-4 w-4 mr-1.5" />
                        Production
                      </CardTitle>
                      <select 
                        className="text-xs bg-muted/50 border border-muted rounded px-2 py-1"
                        onChange={(e) => handleBillingUnitChange(e.target.value || null)}
                        value={selectedBillingCodeId || ""}
                      >
                        <option value="">All Units</option>
                        <option value="billing-1">Feet</option>
                        <option value="billing-2">Hours</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[180px]">
                      <ProductionOverviewChart 
                        completedTasks={completedTasks} 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader className="py-2 px-3">
                    <CardTitle className="text-base flex items-center">
                      <ListChecks className="h-4 w-4 mr-1.5" />
                      Today's Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-3 max-h-[200px] overflow-auto">
                    {assignedTasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2">No tasks scheduled for today.</p>
                    ) : (
                      <div className="space-y-2 py-2">
                        {assignedTasks.slice(0, 3).map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-2 bg-muted/40 rounded-lg">
                            <div className="truncate flex-1">
                              <div className="font-medium text-sm truncate">{task.title}</div>
                              <div className="text-xs text-muted-foreground truncate">{getProjectName(task.projectId)}</div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tasks" className="space-y-4 pb-20 animate-fade-in">
                <FilterBar technicianView={true} />
                
                <TaskColumns 
                  assignedTasks={assignedTasks}
                  completedTasks={completedTasks}
                  handleOpenWorkEntry={handleOpenWorkEntry}
                  getProjectName={getProjectName}
                  onCompleteTask={handleCompleteTask}
                />
              </TabsContent>
              
              <TabsContent value="map" className="pb-20 animate-fade-in">
                <Card>
                  <CardContent className="p-0 pt-3">
                    <div className="h-[350px]">
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
              </TabsContent>
              
              <TabsContent value="stats" className="space-y-4 pb-20 animate-fade-in">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        <SectionHeader icon={<CheckCheck className="h-5 w-5" />} title="Production Overview" />
                      </CardTitle>
                      <select 
                        className="text-xs bg-muted/50 border border-muted rounded px-2 py-1"
                        onChange={(e) => handleBillingUnitChange(e.target.value || null)}
                        value={selectedBillingCodeId || ""}
                      >
                        <option value="">All Units</option>
                        <option value="billing-1">Feet</option>
                        <option value="billing-2">Hours</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[280px]">
                      <ProductionOverviewChart completedTasks={completedTasks} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
        
        <DashboardFooter />
      </div>
    );
  }

  // Desktop view
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      <SectionHeader icon={<CheckCheck className="h-5 w-5" />} title="Production Overview" />
                    </CardTitle>
                    <select 
                      className="text-sm bg-muted/50 border border-muted rounded px-3 py-1"
                      onChange={(e) => handleBillingUnitChange(e.target.value || null)}
                      value={selectedBillingCodeId || ""}
                    >
                      <option value="">All Units</option>
                      <option value="billing-1">Feet</option>
                      <option value="billing-2">Hours</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[280px]">
                    <ProductionOverviewChart completedTasks={completedTasks} />
                  </div>
                </CardContent>
              </Card>
              
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
        </div>
      </ScrollArea>
      
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
