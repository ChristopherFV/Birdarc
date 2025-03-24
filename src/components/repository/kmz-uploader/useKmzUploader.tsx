
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { parseKmzFile, KmzFeature } from '@/utils/kmzUtils';
import { visibilitySchema, VisibilityFormData } from './VisibilitySettingsForm';

interface UseKmzUploaderProps {
  onKmzDataImported: (features: KmzFeature[], visibility: VisibilityFormData) => void;
}

export const useKmzUploader = ({ onKmzDataImported }: UseKmzUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showVisibilitySettings, setShowVisibilitySettings] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<VisibilityFormData>({
    resolver: zodResolver(visibilitySchema),
    defaultValues: {
      visibilityType: 'all',
    },
  });
  
  const resetState = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setErrorMessage(null);
    setShowVisibilitySettings(false);
    form.reset({ visibilityType: 'all' });
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };
  
  const handleFileSelection = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.kmz')) {
      setErrorMessage('Please select a KMZ file');
      return;
    }
    
    setSelectedFile(file);
    setErrorMessage(null);
    setShowVisibilitySettings(true);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Simulate network delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(30);
      
      // Parse the KMZ file
      const features = await parseKmzFile(selectedFile);
      setUploadProgress(70);
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadProgress(100);
      
      // Get visibility settings
      const visibilityData = form.getValues();
      
      // Callback with the extracted features and visibility settings
      onKmzDataImported(features, visibilityData);
      
      toast({
        title: "KMZ file imported successfully",
        description: `Imported ${features.length} features from ${selectedFile.name}`,
        variant: "default",
      });
      
      // Reset the uploader
      resetState();
    } catch (error) {
      console.error('Error processing KMZ file:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process KMZ file');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const cancelUpload = () => {
    resetState();
  };

  return {
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
  };
};
