
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Type, Circle, Square } from 'lucide-react';

interface TechnicianDrawingToolsProps {
  currentTool: 'pen' | 'text' | 'circle' | 'square';
  setCurrentTool: (tool: 'pen' | 'text' | 'circle' | 'square') => void;
}

export const TechnicianDrawingTools: React.FC<TechnicianDrawingToolsProps> = ({
  currentTool,
  setCurrentTool
}) => {
  return (
    <>
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
    </>
  );
};
