
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Type, Circle, Square } from 'lucide-react';
import { DrawingTool } from './types';

interface MobileDrawingToolsProps {
  currentTool: DrawingTool;
  setCurrentTool: (tool: DrawingTool) => void;
}

export const MobileDrawingTools: React.FC<MobileDrawingToolsProps> = ({
  currentTool,
  setCurrentTool
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button 
        variant={currentTool === 'pen' ? 'orange' : 'outline'} 
        size="sm"
        onClick={() => setCurrentTool('pen')}
        className="h-8 px-2"
      >
        <Pencil className="h-3 w-3 mr-1" />
        Pen
      </Button>
      <Button 
        variant={currentTool === 'text' ? 'orange' : 'outline'} 
        size="sm"
        onClick={() => setCurrentTool('text')}
        className="h-8 px-2"
      >
        <Type className="h-3 w-3 mr-1" />
        Text
      </Button>
      <Button 
        variant={currentTool === 'circle' ? 'orange' : 'outline'} 
        size="sm"
        onClick={() => setCurrentTool('circle')}
        className="h-8 px-2"
      >
        <Circle className="h-3 w-3 mr-1" />
        Circle
      </Button>
      <Button 
        variant={currentTool === 'square' ? 'orange' : 'outline'} 
        size="sm"
        onClick={() => setCurrentTool('square')}
        className="h-8 px-2"
      >
        <Square className="h-3 w-3 mr-1" />
        Square
      </Button>
      <div className="col-span-2 mt-2">
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
  );
};
