import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, FileEdit, Trash2, Search, Filter, MapPin } from "lucide-react";
import { useAddProjectDialog } from "@/hooks/useAddProjectDialog";
import { useApp } from '@/context/AppContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { FilterBar } from '@/components/ui/FilterBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapContent } from '@/components/schedule/map/MapContent';
import { mockProjectLocations } from '@/utils/mockMapData';

const ProjectsPage = () => {
  const { projects } = useApp();
  const { openAddProjectDialog } = useAddProjectDialog();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'map'>('map');
  const isMobile = useIsMobile();

  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Map the projects to task-like structure for the map component
  const projectLocations = mockProjectLocations.filter(loc => 
    projects.some(p => p.id === loc.projectId)
  );

  // Simple handler for project marker clicks
  const handleProjectMarkerClick = (id: string) => {
    console.log('Project clicked:', id);
  };

  return (
    <div className="container mx-auto space-y-6 px-2 md:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your fiber installation projects
          </p>
        </div>
        <Button onClick={openAddProjectDialog} className="shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <Tabs defaultValue="map" value={activeView} onValueChange={(value) => setActiveView(value as 'list' | 'map')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger 
            value="list" 
            className={activeView === 'list' ? 'text-primary font-semibold' : ''}
          >
            List View
          </TabsTrigger>
          <TabsTrigger 
            value="map" 
            className={activeView === 'map' ? 'text-primary font-semibold' : ''}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Map View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-0">
          <FilterBar />

          {isMobile ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
              
              {filteredProjects.length === 0 ? (
                <Card className="p-4 text-center text-muted-foreground">
                  <p className="text-sm">No projects found</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-sm">{project.name}</h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {project.status || "Active"}
                          </span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mb-2">
                          Client: {project.client}
                        </div>
                        
                        <div className="mb-2">
                          <div className="text-xs mb-1 flex justify-between">
                            <span>Progress</span>
                            <span>{project.progress || Math.floor(Math.random() * 100)}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${project.progress || Math.floor(Math.random() * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Updated: {project.lastUpdated || "2023-08-15"}
                          </span>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <FileEdit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-lg bg-card">
              <div className="p-4 border-b">
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.client}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {project.status || "Active"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="w-full bg-secondary rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${project.progress || Math.floor(Math.random() * 100)}%` }}
                            ></div>
                          </div>
                        </TableCell>
                        <TableCell>{project.lastUpdated || "2023-08-15"}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="map" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Project Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] sm:h-[600px] w-full rounded-md overflow-hidden">
                <MapContent 
                  mapboxApiKey="pk.eyJ1IjoiZmllbGR2aXNpb24iLCJhIjoiY2xncnI0ZXJuMHBxZjNkcWJkZnN3dXNxNCJ9.MiG64RL8E9Wt8SnEzw_jHQ"
                  showTasks={true}
                  tasks={projectLocations}
                  onTaskClick={handleProjectMarkerClick}
                  selectedTaskId={null}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectsPage;
