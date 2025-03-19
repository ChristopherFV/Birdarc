
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScheduleMap } from '@/components/schedule/ScheduleMap';
import { ScheduleCalendar } from '@/components/schedule/ScheduleCalendar';
import { TaskList } from '@/components/schedule/TaskList';
import { AddTaskDialog } from '@/components/schedule/AddTaskDialog';
import { MapPin, Calendar as CalendarIcon, ListTodo } from 'lucide-react';

const SchedulePage: React.FC = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Schedule Tasks & Jobs</h1>
          <p className="text-muted-foreground">Plan and manage your field operations visually.</p>
        </div>
        <Button 
          onClick={() => setIsAddTaskOpen(true)}
          className="bg-fieldvision-orange hover:bg-fieldvision-orange/90 text-white"
        >
          New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <Tabs defaultValue="map">
              <TabsList>
                <TabsTrigger value="map">
                  <MapPin className="mr-2 h-4 w-4" />
                  Map View
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Calendar View
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="map" className="mt-0">
              <div className="h-[500px] w-full rounded-md overflow-hidden border">
                <ScheduleMap />
              </div>
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              <div className="h-[500px] w-full rounded-md overflow-hidden border p-4">
                <ScheduleCalendar />
              </div>
            </TabsContent>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <ListTodo className="mr-2 h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList />
          </CardContent>
        </Card>
      </div>
      
      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} />
    </div>
  );
};

export default SchedulePage;
