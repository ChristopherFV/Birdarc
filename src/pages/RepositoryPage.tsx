
import React, { useState } from 'react';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Plus, Check, XCircle, Filter, SortDesc, CircleAlert, Calendar, MapPin } from 'lucide-react';
import { FileRepository } from '@/components/repository/FileRepository';
import { FileUploader } from '@/components/repository/FileUploader';
import { Badge } from '@/components/ui/badge';
import { useSchedule } from '@/context/ScheduleContext';
import { FilterBar } from '@/components/ui/FilterBar';
import { ScheduleMap } from '@/components/schedule/ScheduleMap';
import { ScheduleCalendar } from '@/components/schedule/ScheduleCalendar';
import { TaskForm } from '@/components/schedule/TaskForm';

// Mock project data with pending files count
const projectsWithPendingFiles = [
  { id: '1', name: 'Cedar Heights Fiber', pendingCount: 25, billingCodes: ['FBR-001'] },
  { id: '2', name: 'Oakridge Expansion', pendingCount: 12, billingCodes: ['UND-025'] },
  { id: '3', name: 'Downtown Connection', pendingCount: 0, billingCodes: ['PMT-103'] },
  { id: '4', name: 'Westside Network', pendingCount: 8, billingCodes: ['SPL-072'] },
];

const RepositoryPage = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'schedule'>('all');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { tasks } = useSchedule();

  // Total pending files across all projects
  const totalPendingFiles = projectsWithPendingFiles.reduce((sum, project) => sum + project.pendingCount, 0);

  return (
    <SimplePageLayout 
      title="FieldVision Sandbox" 
      subtitle="Upload and manage project files, schedule tasks and monitor field operations"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <SortDesc className="h-4 w-4" />
            <span>Sort</span>
          </Button>
        </div>
        <div className="flex gap-2">
          {selectedTab === 'schedule' && (
            <Button 
              onClick={() => setIsTaskFormOpen(true)} 
              className="flex items-center gap-2 bg-fieldvision-orange hover:bg-fieldvision-orange/90 text-white"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </Button>
          )}
          {selectedTab !== 'schedule' && (
            <Button 
              onClick={() => setShowUploader(true)} 
              className="flex items-center gap-2"
              disabled={showUploader}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Files</span>
            </Button>
          )}
        </div>
      </div>

      {selectedTab === 'schedule' && <FilterBar />}

      {/* Project summary with pending files */}
      {totalPendingFiles > 0 && selectedTab !== 'schedule' && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-700 mb-2">
              <CircleAlert className="h-5 w-5" />
              <h3 className="font-medium">Files Pending Approval</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {projectsWithPendingFiles
                .filter(project => project.pendingCount > 0)
                .map(project => (
                  <div 
                    key={project.id} 
                    className="flex justify-between items-center bg-white rounded-md p-3 shadow-sm cursor-pointer"
                    onClick={() => setSelectedTab('pending')}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium truncate">{project.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {project.billingCodes.join(', ')}
                      </span>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {project.pendingCount} files
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showUploader && selectedTab !== 'schedule' && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Upload Project Files</CardTitle>
            <CardDescription>
              Add multiple files to the repository for review and approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader />
          </CardContent>
          <CardFooter className="justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowUploader(false)}>
              Cancel
            </Button>
            <Button>
              Submit Files
            </Button>
          </CardFooter>
        </Card>
      )}

      <Tabs 
        defaultValue="all" 
        className="w-full"
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as any)}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Review
            {totalPendingFiles > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalPendingFiles}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Schedule</span>
            {tasks.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {tasks.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <FileRepository status="all" />
        </TabsContent>
        <TabsContent value="pending">
          <FileRepository status="pending" />
        </TabsContent>
        <TabsContent value="approved">
          <FileRepository status="approved" />
        </TabsContent>
        <TabsContent value="rejected">
          <FileRepository status="rejected" />
        </TabsContent>
        <TabsContent value="schedule">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <Tabs defaultValue="map">
                  <TabsList>
                    <TabsTrigger value="map">
                      <MapPin className="mr-2 h-4 w-4" />
                      Map View
                    </TabsTrigger>
                    <TabsTrigger value="calendar">
                      <Calendar className="mr-2 h-4 w-4" />
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
          </div>
        </TabsContent>
      </Tabs>
      
      <TaskForm open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen} />
    </SimplePageLayout>
  );
};

export default RepositoryPage;
