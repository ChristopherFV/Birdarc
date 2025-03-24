
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TechnicianDrawingTools } from './TechnicianDrawingTools';
import { TechnicianTaskDetails } from './TechnicianTaskDetails';
import { TechnicianNotesTab } from './TechnicianNotesTab';
import { MapNote } from './TechnicianLocationMap';

interface TechnicianSidebarProps {
  taskData: {
    id: string;
    title: string;
    description: string;
    location: {
      address: string;
      lat: number;
      lng: number;
    };
    startDate: Date;
    endDate: Date;
    projectId: string;
    teamMemberId: string;
    priority: string;
    status: string;
  };
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  currentTool: 'pen' | 'text' | 'circle' | 'square';
  setCurrentTool: (tool: 'pen' | 'text' | 'circle' | 'square') => void;
  notes: MapNote[];
  deleteNote: (id: string) => void;
  saveGeneralNotes: (notes: string) => void;
  generalNotes: string;
}

export const TechnicianSidebar: React.FC<TechnicianSidebarProps> = ({
  taskData,
  formatDate,
  formatTime,
  currentTool,
  setCurrentTool,
  notes,
  deleteNote,
  saveGeneralNotes,
  generalNotes
}) => {
  const [activeTab, setActiveTab] = React.useState<'drawing' | 'notes'>('drawing');
  
  return (
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
          <TechnicianNotesTab 
            notes={notes}
            deleteNote={deleteNote}
            saveGeneralNotes={saveGeneralNotes}
            generalNotes={generalNotes}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
