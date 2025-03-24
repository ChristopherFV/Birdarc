
import React from 'react';
import { FileType } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { VisibilitySettingsForm } from './VisibilitySettingsForm';
import { UseFormReturn } from 'react-hook-form';
import { VisibilityFormData } from './VisibilitySettingsForm';
import { Upload } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  isUploading: boolean;
  uploadProgress: number;
  showVisibilitySettings: boolean;
  form: UseFormReturn<VisibilityFormData>;
  onCancelUpload: () => void;
  onUpload: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  isUploading,
  uploadProgress,
  showVisibilitySettings,
  form,
  onCancelUpload,
  onUpload
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileType className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <div className="font-medium">{file.name}</div>
          <div className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(2)} KB
          </div>
        </div>
        <Badge variant="outline" className="ml-auto">
          KMZ
        </Badge>
      </div>
      
      {showVisibilitySettings && !isUploading && (
        <VisibilitySettingsForm form={form} />
      )}
      
      {isUploading ? (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {uploadProgress < 100 
              ? `Processing file... ${uploadProgress}%` 
              : 'Import complete!'}
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onCancelUpload}
          >
            Cancel
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-fieldvision-orange hover:bg-fieldvision-orange/90 text-white"
            onClick={onUpload}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
        </div>
      )}
    </div>
  );
};
