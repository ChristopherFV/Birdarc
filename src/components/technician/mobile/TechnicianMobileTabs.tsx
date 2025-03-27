
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { Map, FileText, MessageSquare, Trash2 } from 'lucide-react';
import { MapNote } from '../TechnicianLocationMap';
import { Button } from '@/components/ui/button';
import { TechnicianMainContent } from '../TechnicianMainContent';
import { PendingNotification } from '@/components/repository/page/PendingNotification';

interface TechnicianMobileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  taskData: any;
  mapboxToken: string;
  showMapTokenInput: boolean;
  setShowMapTokenInput: (show: boolean) => void;
  setMapboxToken: (token: string) => void;
  mapNotes: MapNote[];
  addMapNote: (note: MapNote) => void;
  deleteMapNote: (id: string) => void;
  currentTool: 'pen' | 'text' | 'circle' | 'square';
  setCurrentTool: (tool: 'pen' | 'text' | 'circle' | 'square') => void;
  mapVisible: boolean;
  onMapVisibilityChange: (visible: boolean) => void;
  generalNotes: string;
  saveGeneralNotes: (notes: string) => void;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}

export const TechnicianMobileTabs: React.FC<TechnicianMobileTabsProps> = ({
  activeTab,
  setActiveTab,
  taskData,
  mapboxToken,
  showMapTokenInput,
  setShowMapTokenInput,
  setMapboxToken,
  mapNotes,
  addMapNote,
  deleteMapNote,
  currentTool,
  setCurrentTool,
  mapVisible,
  onMapVisibilityChange,
  generalNotes,
  saveGeneralNotes,
  formatDate,
  formatTime
}) => {
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
      <TabsList className="w-full grid grid-cols-3 bg-muted/70 p-1 rounded-lg shadow-sm mx-2">
        <TabsTrigger value="map" className="text-xs py-1.5">
          <Map className="h-3.5 w-3.5 mr-1" />
          Map
        </TabsTrigger>
        <TabsTrigger value="details" className="text-xs py-1.5">
          <FileText className="h-3.5 w-3.5 mr-1" />
          Details
        </TabsTrigger>
        <TabsTrigger value="notes" className="text-xs py-1.5">
          <MessageSquare className="h-3.5 w-3.5 mr-1" />
          Notes
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="map" className="flex-1 p-0 mt-0 overflow-hidden">
        <div className="h-full">
          <TechnicianMainContent 
            taskData={taskData}
            mapboxToken={mapboxToken}
            showMapTokenInput={showMapTokenInput}
            setShowMapTokenInput={setShowMapTokenInput}
            setMapboxToken={setMapboxToken}
            notes={mapNotes}
            addNote={addMapNote}
            currentTool={currentTool}
            setCurrentTool={setCurrentTool}
            mapVisible={mapVisible}
            onMapVisibilityChange={onMapVisibilityChange}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="details" className="flex-1 p-2 mt-0 overflow-auto">
        <Card className="p-3 mb-3">
          <h3 className="text-sm font-medium mb-2">Task Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Title:</span>
              <span className="font-medium">{taskData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{formatDate(taskData.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span>{formatTime(taskData.startDate)} - {formatTime(taskData.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {taskData.status || "Active"}
              </span>
            </div>
          </div>
        </Card>
        
        <Card className="p-3">
          <h3 className="text-sm font-medium mb-2">Task Description</h3>
          <p className="text-sm text-muted-foreground">
            {taskData.description || "No description available for this task."}
          </p>
        </Card>
      </TabsContent>
      
      <TabsContent value="notes" className="flex-1 p-2 mt-0 overflow-auto">
        <Card className="p-3 mb-3">
          <h3 className="text-sm font-medium mb-2">Notes</h3>
          <textarea
            className="w-full p-2 border rounded-md text-sm min-h-[120px]"
            placeholder="Add your notes here..."
            value={generalNotes}
            onChange={(e) => saveGeneralNotes(e.target.value)}
          />
        </Card>
        
        <Card className="p-3">
          <h3 className="text-sm font-medium mb-2">Map Notes</h3>
          {mapNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No map notes added yet.</p>
          ) : (
            <div className="space-y-2">
              {mapNotes.map((note, index) => (
                <div key={index} className="flex justify-between items-start border-b pb-2">
                  <div>
                    <div className="text-xs font-medium">{`Note ${index + 1}`}</div>
                    <div className="text-xs text-muted-foreground">{note.text}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => deleteMapNote(note.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
};
