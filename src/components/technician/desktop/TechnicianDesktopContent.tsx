
import React from 'react';
import { MapNote } from '../TechnicianLocationMap';
import { TechnicianMainContent } from '../TechnicianMainContent';
import { TechnicianSidebar } from '../TechnicianSidebar';

interface TechnicianDesktopContentProps {
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
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  generalNotes: string;
  saveGeneralNotes: (notes: string) => void;
}

export const TechnicianDesktopContent: React.FC<TechnicianDesktopContentProps> = ({
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
  formatDate,
  formatTime,
  generalNotes,
  saveGeneralNotes
}) => {
  return (
    <div className="flex flex-1 overflow-hidden">
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
      
      <TechnicianSidebar 
        taskData={taskData}
        formatDate={formatDate}
        formatTime={formatTime}
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        notes={mapNotes}
        deleteNote={deleteMapNote}
        saveGeneralNotes={saveGeneralNotes}
        generalNotes={generalNotes}
      />
    </div>
  );
};
