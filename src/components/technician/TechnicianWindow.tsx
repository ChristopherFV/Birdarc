import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Download, Maximize2, RotateCw, ZoomIn, ZoomOut, Type, Pencil, Circle, Square, MapPin, Calendar, Clock, FileText, User, HardHat, MapIcon, ExternalLink, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TechnicianWorkEntryDialog } from './TechnicianWorkEntryDialog';
import { useToast } from "@/hooks/use-toast";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TaskConfirmationDialog } from '../schedule/map/TaskConfirmationDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { TechnicianDrawingTools } from './TechnicianDrawingTools';
import { TechnicianTaskDetails } from './TechnicianTaskDetails';
import { TechnicianTaskSelector } from './TechnicianTaskSelector';
import { useSchedule, Task } from '@/context/ScheduleContext';

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
  const [showMobileTools, setShowMobileTools] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("task-123");
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const isMobile = useIsMobile();
  const { tasks } = useSchedule();
  
  const defaultTaskData: Task = {
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
    status: 'in_progress',
    billingCodeId: 'billing-1',
    quantityEstimate: 100
  };
  
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
  };
  
  const getSelectedTask = (): Task => {
    const foundTask = tasks.find(task => task.id === selectedTaskId);
    return foundTask || defaultTaskData;
  };
  
  const taskData = getSelectedTask();
  
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
  }, [mapboxToken, taskData.location.lat, taskData.location.lng, toast]);
  
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
        projectId={taskData.projectId || "project-1"}
      />
      
      <TaskConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={completeTask}
        actionType="complete"
        taskTitle={taskData.title}
      />
      
      <header className="border-b border-border p-3 sm:p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button asChild variant="ghost" size="sm" className="p-1 sm:p-2">
              <Link to="/" className="flex items-center gap-1 sm:gap-2">
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>
            </Button>
            <h1 className="text-base sm:text-xl font-semibold">{taskData.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              style={{ backgroundColor: "#F18E1D", color: "white" }}
              onClick={handleCompleteReview}
            >
              {isMobile ? 'Close' : 'Close Task'}
            </Button>
          </div>
        </div>
      </header>
      
      <div className="p-2 bg-background border-b border-border">
        <TechnicianTaskSelector 
          currentTaskId={selectedTaskId}
          onTaskSelect={handleTaskSelect}
        />
      </div>
      
      {isMobile && (
        <div className="p-2 bg-background border-b border-border">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Task Summary</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => setShowMobileTools(!showMobileTools)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-gray-500 flex-shrink-0" />
              <span className="truncate">{formatDate(taskData.startDate)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1 text-gray-500 flex-shrink-0" />
              <span className="truncate">{formatTime(taskData.startDate)}</span>
            </div>
            <div className="flex items-center col-span-2">
              <MapPin className="h-3 w-3 mr-1 text-gray-500 flex-shrink-0" />
              <span className="truncate">{taskData.location.address}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-2 sm:p-4">
          <div className="mb-2 sm:mb-4">
            <Card className="overflow-hidden">
              <CardHeader className="py-2 px-3 sm:px-4 bg-fieldvision-navy/10">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                    <MapIcon className="h-3 sm:h-4 w-3 sm:w-4" />
                    Job Location
                  </CardTitle>
                  {!showMapTokenInput && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-7 px-2"
                      onClick={() => window.open(`https://maps.google.com/?q=${taskData.location.lat},${taskData.location.lng}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Open in Google Maps</span>
                      <span className="sm:hidden">Maps</span>
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
                    className="w-full h-[200px] sm:h-[250px]"
                  />
                )}
              </CardContent>
            </Card>
          </div>
          
          <div 
            className="mx-auto bg-white shadow-lg border border-border rounded-md"
            style={{ 
              width: `${zoomLevel}%`, 
              height: isMobile ? 'calc(100vh - 370px)' : 'calc(100vh - 440px)', 
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
            
            {isMobile && showMobileTools && (
              <div className="absolute top-2 right-2 bg-background/95 p-2 rounded-md shadow-md border border-border">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={currentTool === 'pen' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setCurrentTool('pen')}
                    className={`h-8 px-2 ${currentTool === 'pen' ? 'bg-fieldvision-orange hover:bg-fieldvision-orange/90' : ''}`}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Pen
                  </Button>
                  <Button 
                    variant={currentTool === 'text' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setCurrentTool('text')}
                    className={`h-8 px-2 ${currentTool === 'text' ? 'bg-fieldvision-orange hover:bg-fieldvision-orange/90' : ''}`}
                  >
                    <Type className="h-3 w-3 mr-1" />
                    Text
                  </Button>
                  <Button 
                    variant={currentTool === 'circle' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setCurrentTool('circle')}
                    className={`h-8 px-2 ${currentTool === 'circle' ? 'bg-fieldvision-orange hover:bg-fieldvision-orange/90' : ''}`}
                  >
                    <Circle className="h-3 w-3 mr-1" />
                    Circle
                  </Button>
                  <Button 
                    variant={currentTool === 'square' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setCurrentTool('square')}
                    className={`h-8 px-2 ${currentTool === 'square' ? 'bg-fieldvision-orange hover:bg-fieldvision-orange/90' : ''}`}
                  >
                    <Square className="h-3 w-3 mr-1" />
                    Square
                  </Button>
                </div>
                <div className="mt-2">
                  <label className="text-xs font-medium">Color</label>
                  <div className="flex gap-1 mt-1">
                    {['red', 'blue', 'green', 'yellow', 'black'].map(color => (
                      <button
                        key={color}
                        className="w-5 h-5 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-ring"
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color} color`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1 sm:gap-2 bg-background/90 p-1 sm:p-2 rounded-md shadow-sm border border-border">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="h-7 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm"
              >
                Prev
              </Button>
              <span className="text-xs sm:text-sm">
                {currentPage}/{totalPages}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="h-7 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm"
              >
                Next
              </Button>
              <div className="h-5 border-l border-border mx-1 sm:mx-2"></div>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={handleZoomOut}>
                <ZoomOut className="h-3 sm:h-4 w-3 sm:w-4" />
              </Button>
              <span className="text-xs sm:text-sm w-10 sm:w-16 text-center">{zoomLevel}%</span>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={handleZoomIn}>
                <ZoomIn className="h-3 sm:h-4 w-3 sm:w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hidden sm:flex">
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hidden sm:flex">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {!isMobile && (
          <div className="w-72 border-l border-border overflow-y-auto">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'drawing' | 'notes')} className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="drawing">Drawing</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="drawing" className="p-4 space-y-4">
                <TechnicianDrawingTools 
                  currentTool={currentTool} 
                  setCurrentTool={setCurrentTool} 
                />
                
                <TechnicianTaskDetails 
                  task={taskData} 
                  formatDate={formatDate} 
                  formatTime={formatTime} 
                />
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
        )}
      </div>
      
      <div className="flex flex-col items-center justify-center mt-4 mb-4 sm:mb-6">
        <img 
          src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
          alt="Fieldvision Logo" 
          className="h-6 sm:h-8 w-auto object-contain" 
        />
      </div>
    </div>
  );
};
