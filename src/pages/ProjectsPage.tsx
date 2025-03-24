import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, FileEdit, Trash2, Search, MapPin, List, Map as MapIcon, Building2, ArrowLeft } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapContent } from '@/components/schedule/map/MapContent';
import { mockProjectLocations } from '@/utils/mockMapData';
import { useToast } from "@/hooks/use-toast";
import { TaskStatus } from "@/context/ScheduleContext";
import { useIsMobile } from '@/hooks/use-mobile';

const ProjectsPage = () => {
  const { projects } = useApp();
  const { openAddProjectDialog } = useAddProjectDialog();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMapView, setShowMapView] = useState(false);
  const [showListOverlay, setShowListOverlay] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const mapboxToken = "pk.eyJ1IjoiY2h1Y2F0eCIsImEiOiJjbThra2NrcHIwZGIzMm1wdDYzNnpreTZyIn0.KUTPCuD8hk7VOzTYJ-WODg";

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.location && project.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const mapProjectStatusToTaskStatus = (status: string | undefined): TaskStatus => {
    if (!status) return 'pending';
    
    const lowercaseStatus = status.toLowerCase();
    
    if (lowercaseStatus.includes('complete')) return 'completed';
    if (lowercaseStatus.includes('progress') || lowercaseStatus.includes('active')) return 'in_progress';
    if (lowercaseStatus.includes('cancel')) return 'cancelled';
    
    return 'pending';
  };

  const projectLocations = projects.map(project => {
    const mockLocation = mockProjectLocations.find(loc => loc.projectId === project.id) || 
      mockProjectLocations[Math.floor(Math.random() * mockProjectLocations.length)];
      
    return {
      id: project.id,
      title: project.name,
      description: `Client: ${project.client}`,
      location: mockLocation.location,
      startDate: new Date(),
      endDate: new Date(),
      projectId: project.id,
      projectName: project.name,
      teamMemberId: null,
      priority: 'medium' as const,
      status: mapProjectStatusToTaskStatus(project.status),
      billingCodeId: null,
      quantityEstimate: 0
    };
  });

  const handleProjectMarkerClick = (id: string) => {
    setSelectedProjectId(id === selectedProjectId ? null : id);
    console.log('Project clicked:', id);
    
    const project = projects.find(p => p.id === id);
    if (project) {
      toast({
        title: "Project Selected",
        description: `${project.name} has been selected on the map`,
      });
    }
  };

  const handleProjectClick = (projectId: string) => {
    if (selectedProjectId === projectId) return;
    
    setSelectedProjectId(projectId);
    
    if (!showMapView) {
      setShowMapView(true);
    }
    
    const project = projects.find(p => p.id === projectId);
    if (project) {
      toast({
        title: "Project Location",
        description: `Navigating to ${project.name} location`,
      });
    }
  };

  const toggleView = () => {
    setShowMapView(!showMapView);
    if (!showMapView) {
      setShowListOverlay(true);
    }
  };

  // Mobile full-screen map view
  if (isMobile && showMapView) {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <div className="absolute top-0 left-0 z-[60] p-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowMapView(false)}
            className="bg-white dark:bg-gray-800 shadow-md"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
        
        {selectedProjectId && (
          <div className="absolute bottom-4 left-2 right-2 z-[60]">
            <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-3">
                {(() => {
                  const project = projects.find(p => p.id === selectedProjectId);
                  return project ? (
                    <div className="space-y-2">
                      <h3 className="font-medium">{project.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        Client: {project.client}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Location: {project.location || "No location"}
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          {project.status || "Active"}
                        </span>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => setSelectedProjectId(null)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : <div>No project selected</div>;
                })()}
              </CardContent>
            </Card>
          </div>
        )}
        
        <MapContent 
          mapboxApiKey={mapboxToken}
          showTasks={true}
          tasks={projectLocations}
          onTaskClick={handleProjectMarkerClick}
          selectedTaskId={selectedProjectId}
          fullScreen={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-2 md:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your fiber installation projects
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleView} 
            className="flex items-center"
          >
            {showMapView ? (
              <>
                <List className="mr-2 h-4 w-4" />
                List View
              </>
            ) : (
              <>
                <MapIcon className="mr-2 h-4 w-4" />
                Map View
              </>
            )}
          </Button>
          <Button onClick={openAddProjectDialog} className="shrink-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="w-full max-w-sm mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>

      {showMapView ? (
        <div className="relative">
          <Card className="w-full">
            <CardHeader className="pb-3 flex flex-row justify-between items-center">
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Project Locations
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowListOverlay(!showListOverlay)}
                className="flex items-center"
              >
                <List className="mr-2 h-4 w-4" />
                {showListOverlay ? "Hide List" : "Show List"}
              </Button>
            </CardHeader>
            <CardContent className="relative p-0">
              <div className="h-[75vh] w-full relative">
                <MapContent 
                  mapboxApiKey={mapboxToken}
                  showTasks={true}
                  tasks={projectLocations}
                  onTaskClick={handleProjectMarkerClick}
                  selectedTaskId={selectedProjectId}
                />
                
                {showListOverlay && (
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm max-h-[300px] overflow-y-auto border-t shadow-lg transition-all duration-300 ease-in-out rounded-t-lg">
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Projects List</h3>
                        <Button variant="ghost" size="sm" onClick={() => setShowMapView(false)}>
                          View Full List
                        </Button>
                      </div>
                      
                      {filteredProjects.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          <p className="text-sm">No projects found</p>
                        </div>
                      ) : (
                        <div className="p-3">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Project Name</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredProjects.slice(0, 5).map((project) => (
                                <TableRow 
                                  key={project.id} 
                                  className={selectedProjectId === project.id ? "bg-muted" : "cursor-pointer hover:bg-muted/50"}
                                  onClick={() => handleProjectClick(project.id)}
                                >
                                  <TableCell className="font-medium">{project.name}</TableCell>
                                  <TableCell>{project.client}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                                      {project.location || "No location"}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      {project.status || "Active"}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {filteredProjects.length > 5 && (
                            <div className="text-center py-2">
                              <Button variant="link" size="sm" onClick={() => setShowMapView(false)}>
                                View All ({filteredProjects.length}) Projects
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Projects List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No projects found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow 
                      key={project.id}
                      className={selectedProjectId === project.id ? "bg-muted" : ""}
                    >
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          {project.location || "No location"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {project.status || "Active"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">{project.progress || 0}%</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleProjectClick(project.id)}
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            Map
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectsPage;
