
import React, { useState } from 'react';
import { Upload, AlertCircle, Check, FileType, MapPin, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { parseKmzFile, KmzFeature } from '@/utils/kmzUtils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Sample team and user data (in a real app, this would come from the backend)
const teams = [
  { id: 'team-1', name: 'North Region Team' },
  { id: 'team-2', name: 'South Region Team' },
  { id: 'team-3', name: 'East Region Team' },
  { id: 'team-4', name: 'West Region Team' },
];

const users = [
  { id: 'user-1', name: 'John Davis', team: 'team-1' },
  { id: 'user-2', name: 'Emily Wilson', team: 'team-1' },
  { id: 'user-3', name: 'Michael Scott', team: 'team-2' },
  { id: 'user-4', name: 'Sarah Johnson', team: 'team-3' },
  { id: 'user-5', name: 'Robert Chen', team: 'team-4' },
];

const visibilitySchema = z.object({
  visibilityType: z.enum(['all', 'team', 'specific']),
  teamId: z.string().optional(),
  userId: z.string().optional(),
});

type VisibilityFormData = z.infer<typeof visibilitySchema>;

interface KmzUploaderProps {
  onKmzDataImported: (features: KmzFeature[], visibility: VisibilityFormData) => void;
}

export const KmzUploader: React.FC<KmzUploaderProps> = ({ onKmzDataImported }) => {
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
  
  const visibilityType = form.watch('visibilityType');
  
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
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 mb-4 text-center
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'}
          ${selectedFile ? 'bg-muted/20' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <>
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
                      onChange={handleFileChange}
                    />
                  </Button>
                </label>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Supports .kmz files exported from Google Earth/Maps or other GIS software
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileType className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="font-medium">{selectedFile.name}</div>
                <div className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </div>
              </div>
              <Badge variant="outline" className="ml-auto">
                KMZ
              </Badge>
            </div>
            
            {showVisibilitySettings && !isUploading && (
              <div className="text-left border border-border rounded-md p-4 mt-4 bg-background/50">
                <h4 className="font-medium mb-3">Visibility Settings</h4>
                <Form {...form}>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="visibilityType"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Who should see this data?</FormLabel>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="visibility-all"
                                value="all"
                                checked={field.value === 'all'}
                                onChange={() => field.onChange('all')}
                                className="rounded text-primary"
                              />
                              <Label htmlFor="visibility-all" className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                Everyone (All teams)
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="visibility-team"
                                value="team"
                                checked={field.value === 'team'}
                                onChange={() => field.onChange('team')}
                                className="rounded text-primary"
                              />
                              <Label htmlFor="visibility-team" className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                Specific Team
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="visibility-specific"
                                value="specific"
                                checked={field.value === 'specific'}
                                onChange={() => field.onChange('specific')}
                                className="rounded text-primary"
                              />
                              <Label htmlFor="visibility-specific" className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Specific User
                              </Label>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {visibilityType === 'team' && (
                      <FormField
                        control={form.control}
                        name="teamId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Team</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a team" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {teams.map(team => (
                                  <SelectItem key={team.id} value={team.id}>
                                    {team.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {visibilityType === 'specific' && (
                      <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select User</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {users.map(user => (
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </Form>
              </div>
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
                  onClick={cancelUpload}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-fieldvision-orange hover:bg-fieldvision-orange/90 text-white"
                  onClick={handleUpload}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
