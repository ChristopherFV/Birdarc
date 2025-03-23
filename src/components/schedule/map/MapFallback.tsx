
import React from 'react';
import { MapPin } from 'lucide-react';

interface MapFallbackProps {
  tasks: any[];
  onTaskClick: (taskId: string) => void;
  selectedTaskId: string | null;
}

export const MapFallback: React.FC<MapFallbackProps> = ({ tasks, onTaskClick, selectedTaskId }) => {
  return (
    <div className="relative h-full w-full bg-gray-100 overflow-hidden">
      {/* Placeholder Map Background */}
      <div className="absolute inset-0 bg-fieldvision-navy/10 flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          Enter Mapbox API Key to view map
          <br />
          <span className="text-xs">
            You can get a free API key at mapbox.com
          </span>
        </p>
      </div>
      
      {/* Fallback Task Markers */}
      <div className="absolute inset-0 pointer-events-none">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="absolute"
            style={{
              // Placeholder positioning - in a real app these would correspond to actual map coordinates
              left: `${(task.location.lng + 122.44) * 400}px`,
              top: `${(37.79 - task.location.lat) * 400}px`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'auto'
            }}
          >
            <button
              onClick={() => onTaskClick(task.id)}
              className={`
                text-white p-1 rounded-full transition-all duration-300 
                ${task.priority === 'high' ? 'bg-red-500' : 
                  task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}
                ${selectedTaskId === task.id ? 'scale-125 shadow-lg' : ''}
              `}
            >
              <MapPin size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
