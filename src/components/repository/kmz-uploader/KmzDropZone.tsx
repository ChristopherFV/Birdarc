
import React from 'react';
import { MapPin, FileType } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KmzDropZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const KmzDropZone: React.FC<KmzDropZoneProps> = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange
}) => {
  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-6 text-center
        ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="bg-primary/10 p-3 rounded-full">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium">Upload KMZ File</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Drag and drop a KMZ file or click to browse. We'll import all location and metadata for tracking.
          </p>
        </div>
        <div>
          <label htmlFor="kmz-file-upload" className="cursor-pointer">
            <Button size="sm" variant="outline" className="relative overflow-hidden">
              <FileType className="h-4 w-4 mr-2" />
              Browse Files
              <input
                id="kmz-file-upload"
                type="file"
                accept=".kmz"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={onFileChange}
              />
            </Button>
          </label>
        </div>
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        Supports .kmz files exported from Google Earth/Maps or other GIS software
      </div>
    </div>
  );
};
