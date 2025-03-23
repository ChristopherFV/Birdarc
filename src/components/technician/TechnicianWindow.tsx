
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Download, Maximize2, RotateCw, ZoomIn, ZoomOut, Type, Pencil, Circle, Square, MapPin, Calendar, Clock, FileText, User, HardHat, MapIcon, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TechnicianWorkEntryDialog } from './TechnicianWorkEntryDialog';
import { useToast } from "@/hooks/use-toast";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TaskConfirmationDialog } from '../schedule/map/TaskConfirmationDialog';

const taskData = {
  id: 'task-123',
  title: 'Field Dashboard',
  description: 'Review the construction drawings for the new commercial building project. Check for structural issues and compliance with local building codes.',
  location: {
    address: '123 Construction Ave, Building 3, San Francisco, CA 94103',
    lat: 37.7749,
    lng: -122.4194
  },
  startDate: new Date('2023-10-15T09:00:00'),
  endDate: new Date('2023-10-15T17:00:00'),
  projectId: 'project-1',
  teamMemberId: 'team-1',
  priority: 'high',
  status: 'in_progress'
};

export const TechnicianWindow: React.FC = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentTool, setCurrentTool] = useState<'pen' | 'text' | 'circle' | 'square'>('pen');
  const [workEntryDialogOpen, setWorkEntryDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'drawing' | 'notes'>('drawing');
  const [mapboxToken, setMapboxToken] = useState<string>("pk.eyJ1IjoiY2h1Y2F0eCIsImEiOiJjbThra2NrcHIwZGIzMm1wdDYzNnpreTZyIn0.KUTPCuD8hk7VOzTYJ-WODg");
  const [showMapTokenInput, setShowMapTokenInput] = useState(false);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [taskData.location.lng, taskData.location.lat],
        zoom: 15
      });
      
      new mapboxgl.Marker({ color: '#F18E1D' })
        .setLngLat([taskData.location.lng, taskData.location.lat])
        .addTo(map.current);
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      toast({
        title: "Map loaded successfully",
        description: "Task location is now visible on the map",
      });
      
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Map initialization failed",
        description: "Please check your Mapbox token and try again",
        variant: "destructive"
      });
    }
    
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, toast]);
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleCompleteReview = () => {
    setConfirmDialogOpen(true);
  };
  
  const completeTask = () => {
    toast({
      title: "Task closed",
      description: "Please log your work entry for this task.",
    });
    setWorkEntryDialogOpen(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleSetMapboxToken = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('mapboxToken') as string;
    
    if (token) {
      setMapboxToken(token);
      setShowMapTokenInput(false);
      
      localStorage.setItem('mapbox_token', token);
    }
  };
  
  useEffect(() => {
    setShowMapTokenInput(false);
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <TechnicianWorkEntryDialog 
        open={workEntryDialogOpen} 
        onOpenChange={setWorkEntryDialogOpen} 
        projectId="project-1"
      />
      
      <TaskConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={completeTask}
        actionType="complete"
        taskTitle={taskData.title}
      />
      
      <header className="border-b border-border p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">{taskData.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              style={{ backgroundColor: "#F18E1D", color: "white" }}
              onClick={handleCompleteReview}
            >
              Close Task
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-4">
            <Card className="overflow-hidden">
              <CardHeader className="py-2 px-4 bg-fieldvision-navy/10">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapIcon className="h-4 w-4" />
                    Job Location
                  </CardTitle>
                  {!showMapTokenInput && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => window.open(`https://maps.google.com/?q=${taskData.location.lat},${taskData.location.lng}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open in Google Maps
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {showMapTokenInput ? (
                  <div className="p-4">
                    <form onSubmit={handleSetMapboxToken} className="space-y-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        Please enter your Mapbox public token to display the map. You can get a token by creating an account at{' '}
                        <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          mapbox.com
                        </a>
                      </p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          name="mapboxToken" 
                          placeholder="pk.eyJ1IjoieW91..." 
                          className="flex-1 px-2 py-1 text-sm border rounded"
                          defaultValue={mapboxToken}
                        />
                        <Button type="submit" size="sm">
                          Set Token
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div 
                    ref={mapContainer} 
                    className="w-full h-[250px]"
                  />
                )}
              </CardContent>
            </Card>
          </div>
          
          <div 
            className="mx-auto bg-white shadow-lg border border-border rounded-md"
            style={{ 
              width: `${zoomLevel}%`, 
              height: 'calc(100vh - 440px)', 
              position: 'relative'
            }}
          >
            <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-muted-foreground p-8">
                  <p className="text-lg font-semibold mb-2">Construction Drawing - Page {currentPage}</p>
                  <p>This would display the actual PDF content in a real implementation.</p>
                  <p className="mt-4 text-sm">Use the tools on the right to add redlines and annotations.</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/90 p-2 rounded-md shadow-sm border border-border">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
              <div className="h-5 border-l border-border mx-2"></div>
              <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm w-16 text-center">{zoomLevel}%</span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="w-72 border-l border-border overflow-y-auto">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'drawing' | 'notes')} className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="drawing">Drawing</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="drawing" className="p-4 space-y-4">
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">Drawing Tools</CardTitle>
                </CardHeader>
                <CardContent className="py-2 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={currentTool === 'pen' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setCurrentTool('pen')}
                      className={currentTool === 'pen' ? 'bg-fieldvision-orange hover:bg-fieldvision-orange/90' : ''}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Pen
                    </Button>
                    <Button 
                      variant={currentTool === 'text' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setCurrentTool('text')}
                      className={currentTool === 'text' ? 'bg-fieldvision-orange hover:bg-fieldvision-orange/90' : ''}
                    >
                      <Type className="h-4 w-4 mr-2" />
                      Text
                    </Button>
                    <Button 
                      variant={currentTool === 'circle' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setCurrentTool('circle')}
                      className={currentTool === 'circle' ? 'bg-fieldvision-orange hover:bg-fieldvision-orange/90' : ''}
                    >
                      <Circle className="h-4 w-4 mr-2" />
                      Circle
                    </Button>
                    <Button 
                      variant={currentTool === 'square' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setCurrentTool('square')}
                      className={currentTool === 'square' ? 'bg-fieldvision-orange hover:bg-fieldvision-orange/90' : ''}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Square
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">Tool Properties</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Color</label>
                      <div className="flex gap-2 mt-1">
                        {['red', 'blue', 'green', 'yellow', 'black'].map(color => (
                          <button
                            key={color}
                            className={`w-6 h-6 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-ring`}
                            style={{ backgroundColor: color }}
                            aria-label={`Select ${color} color`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Line Width</label>
                      <div className="flex gap-2 mt-1">
                        {[1, 2, 4, 6].map(width => (
                          <button
                            key={width}
                            className="w-8 h-8 border border-border rounded flex items-center justify-center hover:bg-muted"
                          >
                            <div 
                              className="bg-foreground rounded"
                              style={{ height: `${width}px`, width: '20px' }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">Task Details</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Date:</span>
                      </div>
                      <p className="text-sm pl-6">{formatDate(taskData.startDate)}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Time:</span>
                      </div>
                      <p className="text-sm pl-6">{formatTime(taskData.startDate)} - {formatTime(taskData.endDate)}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Location:</span>
                      </div>
                      <p className="text-sm pl-6">{taskData.location.address}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Description:</span>
                      </div>
                      <p className="text-sm pl-6">{taskData.description}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <HardHat className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Priority:</span>
                      </div>
                      <div className="pl-6">
                        <span className={`text-xs font-medium rounded-full px-2 py-1 ${
                          taskData.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : taskData.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Status:</span>
                      </div>
                      <div className="pl-6">
                        <span className={`text-xs font-medium rounded-full px-2 py-1 ${
                          taskData.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : taskData.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : taskData.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {taskData.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="p-4">
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">Task Notes</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Please mark completed sections on the drawing and note any issues encountered.
                    </p>
                    <textarea 
                      className="w-full border border-border rounded-md p-2 h-32 text-sm"
                      placeholder="Add your notes here..."
                    />
                    <Button size="sm" className="w-full">Save Notes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center mt-4 mb-6">
        <img 
          src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
          alt="Fieldvision Logo" 
          className="h-8 w-auto object-contain" 
        />
      </div>
    </div>
  );
};
