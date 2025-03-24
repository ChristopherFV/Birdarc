
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Type, Circle, Square } from 'lucide-react';

interface TechnicianDrawingToolsProps {
  currentTool: 'pen' | 'text' | 'circle' | 'square';
  setCurrentTool: (tool: 'pen' | 'text' | 'circle' | 'square') => void;
  currentColor?: string;
  setCurrentColor?: (color: string) => void;
  currentWidth?: number;
  setCurrentWidth?: (width: number) => void;
}

export const TechnicianDrawingTools: React.FC<TechnicianDrawingToolsProps> = ({
  currentTool,
  setCurrentTool,
  currentColor = 'red',
  setCurrentColor = () => {},
  currentWidth = 2,
  setCurrentWidth = () => {}
}) => {
  // Available colors for drawing
  const colors = ['red', 'blue', 'green', 'yellow', 'black'];
  
  // Available line widths
  const lineWidths = [1, 2, 4, 6];
  
  return (
    <>
      <Card className="border-fieldvision-blue">
        <CardHeader className="py-2 bg-fieldvision-blue/10">
          <CardTitle className="text-sm text-fieldvision-blue">Drawing Tools</CardTitle>
        </CardHeader>
        <CardContent className="py-2 space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={currentTool === 'pen' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentTool('pen')}
              className={currentTool === 'pen' ? 'bg-fieldvision-blue hover:bg-fieldvision-blue/90' : ''}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Pen
            </Button>
            <Button 
              variant={currentTool === 'text' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentTool('text')}
              className={currentTool === 'text' ? 'bg-fieldvision-blue hover:bg-fieldvision-blue/90' : ''}
            >
              <Type className="h-4 w-4 mr-2" />
              Text
            </Button>
            <Button 
              variant={currentTool === 'circle' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentTool('circle')}
              className={currentTool === 'circle' ? 'bg-fieldvision-blue hover:bg-fieldvision-blue/90' : ''}
            >
              <Circle className="h-4 w-4 mr-2" />
              Circle
            </Button>
            <Button 
              variant={currentTool === 'square' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentTool('square')}
              className={currentTool === 'square' ? 'bg-fieldvision-blue hover:bg-fieldvision-blue/90' : ''}
            >
              <Square className="h-4 w-4 mr-2" />
              Square
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-fieldvision-blue">
        <CardHeader className="py-2 bg-fieldvision-blue/10">
          <CardTitle className="text-sm text-fieldvision-blue">Tool Properties</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Color</label>
              <div className="flex gap-2 mt-1">
                {colors.map(color => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full hover:ring-2 hover:ring-offset-1 ${
                      color === currentColor ? 'ring-2 ring-fieldvision-blue ring-offset-1' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color} color`}
                    onClick={() => setCurrentColor(color)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Line Width</label>
              <div className="flex gap-2 mt-1">
                {lineWidths.map(width => (
                  <button
                    key={width}
                    className={`w-8 h-8 border border-border rounded flex items-center justify-center hover:bg-muted ${
                      width === currentWidth ? 'bg-fieldvision-blue/10 border-fieldvision-blue' : ''
                    }`}
                    onClick={() => setCurrentWidth(width)}
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
