
import React, { useRef, useState } from 'react';
import { Upload, FileCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

interface CSVImporterProps {
  onDataImported: (data: any[]) => void;
}

export const CSVImporter: React.FC<CSVImporterProps> = ({ onDataImported }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      throw new Error('CSV must have a header row and at least one data row');
    }
    
    const headers = lines[0].split(',').map(header => header.trim());
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
      const data = lines[i].split(',').map(item => item.trim());
      if (data.length === headers.length) {
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = data[index];
        });
        result.push(row);
      }
    }
    
    return result;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          const csvData = parseCSV(event.target.result as string);
          onDataImported(csvData);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive"
        });
        setFileName(null);
      }
    };
    
    reader.readAsText(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-2 border-dashed border-input rounded-md p-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />
      
      {!fileName ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-muted-foreground">
            Drag and drop your CSV file here, or click to browse
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            className="mt-2"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileCheck className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium">{fileName}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFile}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}
    </div>
  );
};
