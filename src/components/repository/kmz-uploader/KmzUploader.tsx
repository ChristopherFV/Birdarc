
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KmzFeature } from '@/utils/kmzUtils';
import { useKmzUploader } from './useKmzUploader';
import { KmzDropZone } from './KmzDropZone';
import { FilePreview } from './FilePreview';
import { VisibilityFormData } from './VisibilitySettingsForm';

interface KmzUploaderProps {
  onKmzDataImported: (features: KmzFeature[], visibility: VisibilityFormData) => void;
}

export const KmzUploader: React.FC<KmzUploaderProps> = ({ onKmzDataImported }) => {
  const {
    isDragging,
    isUploading,
    uploadProgress,
    errorMessage,
    selectedFile,
    showVisibilitySettings,
    form,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleUpload,
    cancelUpload,
  } = useKmzUploader({ onKmzDataImported });
  
  return (
    <div className="w-full">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      <div className={`${selectedFile ? 'bg-muted/20' : ''}`}>
        {!selectedFile ? (
          <KmzDropZone
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
          />
        ) : (
          <FilePreview
            file={selectedFile}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            showVisibilitySettings={showVisibilitySettings}
            form={form}
            onCancelUpload={cancelUpload}
            onUpload={handleUpload}
          />
        )}
      </div>
    </div>
  );
};
