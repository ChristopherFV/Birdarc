
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Download, Maximize2, RotateCw, ZoomIn, ZoomOut, Type, Pencil, Circle, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TechnicianWorkEntryDialog } from './TechnicianWorkEntryDialog';
import { useToast } from "@/hooks/use-toast";

export const TechnicianWindow: React.FC = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3); // Example - in a real app this would come from the PDF
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentTool, setCurrentTool] = useState<'pen' | 'text' | 'circle' | 'square'>('pen');
  const [workEntryDialogOpen, setWorkEntryDialogOpen] = useState(false);
  
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
    toast({
      title: "Review marked as complete",
      description: "Please log your work entry for this review.",
    });
    setWorkEntryDialogOpen(true);
  };
  
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Work Entry Dialog */}
      <TechnicianWorkEntryDialog 
        open={workEntryDialogOpen} 
        onOpenChange={setWorkEntryDialogOpen} 
        projectId="project-1" // In a real app, this would be dynamically set
      />
      
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Construction Drawing Review</h1>
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
              Complete Review
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto p-4">
          <div 
            className="mx-auto bg-white shadow-lg border border-border rounded-md"
            style={{ 
              width: `${zoomLevel}%`, 
              height: 'calc(100vh - 180px)',
              position: 'relative'
            }}
          >
            {/* Placeholder for PDF content */}
            <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-muted-foreground p-8">
                  <p className="text-lg font-semibold mb-2">Construction Drawing - Page {currentPage}</p>
                  <p>This would display the actual PDF content in a real implementation.</p>
                  <p className="mt-4 text-sm">Use the tools on the right to add redlines and annotations.</p>
                </div>
              </div>
            </div>
            
            {/* PDF Controls */}
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
        
        {/* Tools Panel */}
        <div className="w-72 border-l border-border overflow-y-auto">
          <Tabs defaultValue="drawing" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="drawing">Drawing Tools</TabsTrigger>
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
    </div>
  );
};
