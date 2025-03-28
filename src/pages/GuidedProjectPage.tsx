
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAddProjectDialog } from '@/hooks/useAddProjectDialog';
import { useApp } from '@/context/AppContext';
import { useSchedule } from '@/context/ScheduleContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCircle2, ClipboardList, MapPin, Calendar, ArrowRight, ClockIcon, Users } from 'lucide-react';

const GuidedProjectPage = () => {
  const navigate = useNavigate();
  const { openAddProjectDialog } = useAddProjectDialog();
  const { projects } = useApp();
  const { tasks } = useSchedule();
  const [activeTab, setActiveTab] = useState("project");
  const [completed, setCompleted] = useState({
    project: false,
    task: false
  });

  // Check if user has completed steps (projects or tasks exist)
  useEffect(() => {
    if (projects && projects.length > 0) {
      setCompleted(prev => ({ ...prev, project: true }));
    }
    
    if (tasks && tasks.length > 0) {
      setCompleted(prev => ({ ...prev, task: true }));
    }
  }, [projects, tasks]);

  // Move to tasks tab after project creation only if coming from project tab
  useEffect(() => {
    if (completed.project && activeTab === "project") {
      setActiveTab("task");
    }
  }, [completed.project, activeTab]);

  const handleCreateProject = () => {
    // Ensure we're on the project tab
    setActiveTab("project");
    // Open the dialog
    openAddProjectDialog();
  };

  const handleCreateTask = () => {
    navigate('/schedule');
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  return (
    <SimplePageLayout 
      title="Get Started with Fieldvision" 
      subtitle="Complete these steps to set up your work management flow"
    >
      <div className="max-w-3xl mx-auto">
        {/* Progress indicators */}
        <div className="mb-8 w-full">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-medium">Start</span>
            <span className={`text-xs ${completed.project ? "text-fieldvision-blue font-medium" : "text-muted-foreground"}`}>Create Project</span>
            <span className={`text-xs ${completed.task ? "text-fieldvision-orange font-medium" : "text-muted-foreground"}`}>Schedule Tasks</span>
            <span className="text-xs text-muted-foreground">Complete</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-fieldvision-blue to-fieldvision-orange transition-all duration-500" 
              style={{ 
                width: completed.task ? '100%' : (completed.project ? '66%' : '33%') 
              }}
            />
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 border border-muted">
            <TabsTrigger 
              value="project" 
              className="relative data-[state=active]:bg-white data-[state=active]:text-fieldvision-blue"
            >
              {completed.project && (
                <span className="absolute -right-1 -top-1">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </span>
              )}
              <ClipboardList className="h-4 w-4 mr-2" />
              Create Project
            </TabsTrigger>
            <TabsTrigger 
              value="task" 
              disabled={!completed.project}
              className="relative data-[state=active]:bg-white data-[state=active]:text-fieldvision-orange"
            >
              {completed.task && (
                <span className="absolute -right-1 -top-1">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </span>
              )}
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Tasks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="project" className="space-y-6 animate-in fade-in-50">
            <Card className="border-fieldvision-blue/20 shadow-lg overflow-hidden">
              <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-fieldvision-blue to-fieldvision-blue/70"></div>
              <CardHeader className="bg-gradient-to-r from-fieldvision-blue/5 to-fieldvision-blue/10">
                <CardTitle className="text-fieldvision-blue flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2" />
                  Create Your First Project
                </CardTitle>
                <CardDescription>
                  Projects help you organize jobs, track work done, and manage payments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-md border">
                    <h3 className="font-medium mb-2 text-fieldvision-blue flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Define Location
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Set the project location so technicians know where to go to complete tasks.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-md border">
                    <h3 className="font-medium mb-2 text-fieldvision-blue flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Client Details
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add client information to track who the work is being done for.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center p-6">
                  <Button 
                    size="lg"
                    onClick={handleCreateProject}
                    className="bg-fieldvision-blue hover:bg-fieldvision-blue/90 text-white"
                  >
                    Create Your First Project
                  </Button>
                </div>
              </CardContent>
              {completed.project && (
                <CardFooter className="bg-green-50 border-t flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium">Project Created!</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("task")}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="task" className="space-y-6 animate-in fade-in-50">
            <Card className="border-fieldvision-orange/20 shadow-lg overflow-hidden">
              <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-fieldvision-orange to-fieldvision-orange/70"></div>
              <CardHeader className="bg-gradient-to-r from-fieldvision-orange/5 to-fieldvision-orange/10">
                <CardTitle className="text-fieldvision-orange flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Your First Task
                </CardTitle>
                <CardDescription>
                  Assign work to team members with specific billing codes or hourly rates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-md border border-fieldvision-orange/10 hover:border-fieldvision-orange/30 transition-colors">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-fieldvision-orange mr-2" />
                      <h3 className="font-medium text-fieldvision-orange">Task Location</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Specify where the task needs to be performed - you'll see it on the map.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-md border border-fieldvision-orange/10 hover:border-fieldvision-orange/30 transition-colors">
                    <div className="flex items-center mb-2">
                      <ClockIcon className="h-5 w-5 text-fieldvision-orange mr-2" />
                      <h3 className="font-medium text-fieldvision-orange">Billing & Timing</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Track costs with billing codes or hourly assignments.
                    </p>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-md border border-fieldvision-orange/10">
                  <h3 className="font-medium mb-2 text-fieldvision-orange flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Assign to Team Members
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a team member or contractor to perform the work, or leave it unassigned for now.
                  </p>
                </div>
                <div className="flex items-center justify-center p-6">
                  <Button 
                    size="lg"
                    onClick={handleCreateTask}
                    className="bg-fieldvision-orange hover:bg-fieldvision-orange/90 text-white"
                  >
                    Schedule Your First Task
                  </Button>
                </div>
              </CardContent>
              {completed.task && (
                <CardFooter className="bg-green-50 border-t flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium">Task Created!</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleFinish}>
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={handleFinish}
                className="border-fieldvision-blue/20 hover:bg-fieldvision-blue/5 hover:text-fieldvision-blue"
              >
                Skip for now
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SimplePageLayout>
  );
};

export default GuidedProjectPage;
