
import React, { useRef, useState } from 'react';
import { Upload, FileCheck, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

interface InvoiceUploaderProps {
  onDataImported: (data: any) => void;
}

export const InvoiceUploader: React.FC<InvoiceUploaderProps> = ({ onDataImported }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const parseInvoiceFile = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          // For now, we'll simulate parsing by creating a simple object
          // In a real app, this would use actual parsing logic based on the file type
          const result = {
            invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toISOString().split('T')[0],
            client: 'Client Name',
            amount: Math.floor(Math.random() * 10000),
            entries: [
              { id: crypto.randomUUID(), projectId: '', billingCodeId: '', feetCompleted: 0 },
            ]
          };
          
          setTimeout(() => resolve(result), 500); // Simulate processing time
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setProcessing(true);
    
    try {
      const invoiceData = await parseInvoiceFile(file);
      onDataImported(invoiceData);
      toast({
        title: "Success",
        description: "Invoice data imported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse invoice file. Please check the format.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
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
        accept=".pdf,.csv,.xlsx,.xls"
        className="hidden"
      />
      
      {!fileName ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-muted-foreground">
            Drag and drop your invoice file here, or click to browse
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            className="mt-2"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Invoice
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <File className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium">{fileName}</span>
            {processing && (
              <span className="ml-2 text-xs text-muted-foreground">Processing...</span>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFile}
            className="h-8 w-8 p-0"
            disabled={processing}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}
    </div>
  );
};
