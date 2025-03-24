
import React from 'react';
import { TechnicianLocationMap, MapNote } from './TechnicianLocationMap';
import { TechnicianPdfViewer } from './TechnicianPdfViewer';

interface TechnicianMainContentProps {
  taskData: {
    location: {
      address: string;
      lat: number;
      lng: number;
    };
  };
  mapboxToken: string;
  showMapTokenInput: boolean;
  setShowMapTokenInput: (show: boolean) => void;
  setMapboxToken: (token: string) => void;
  notes: MapNote[];
  addNote: (note: MapNote) => void;
  currentTool: 'pen' | 'text' | 'circle' | 'square';
  setCurrentTool: (tool: 'pen' | 'text' | 'circle' | 'square') => void;
  mapVisible: boolean;
  onMapVisibilityChange: (visible: boolean) => void;
}

export const TechnicianMainContent: React.FC<TechnicianMainContentProps> = ({
  taskData,
  mapboxToken,
  showMapTokenInput,
  setShowMapTokenInput,
  setMapboxToken,
  notes,
  addNote,
  currentTool,
  setCurrentTool,
  mapVisible,
  onMapVisibilityChange
}) => {
  return (
    <div className="flex-1 overflow-auto p-2 sm:p-4">
      {mapVisible && (
        <div className="mb-2 sm:mb-4">
          <TechnicianLocationMap
            location={taskData.location}
            mapboxToken={mapboxToken}
            showMapTokenInput={showMapTokenInput}
            setShowMapTokenInput={setShowMapTokenInput}
            setMapboxToken={setMapboxToken}
            notes={notes}
            addNote={addNote}
            onMapVisibilityChange={onMapVisibilityChange}
          />
        </div>
      )}
      
      <TechnicianPdfViewer
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
      />
    </div>
  );
};
