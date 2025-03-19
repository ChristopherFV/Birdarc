
import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image, File, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@/components/ui/badge';

// Define the form schema
const formSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  billingCodeId: z.string().min(1, "Billing code is required"),
  description: z.string().optional(),
  files: z.array(z.any()).min(1, "At least one file is required")
});

type FormValues = z.infer<typeof formSchema>;

// Mock billing codes
const mockBillingCodes = [
  { id: "1", code: "FBR-001", description: "Fiber Installation" },
  { id: "2", code: "UND-025", description: "Underground Construction" },
  { id: "3", code: "PMT-103", description: "Permit Documentation" },
  { id: "4", code: "SPL-072", description: "Splice Work" },
];

export const FileUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: "",
      billingCodeId: "",
      description: "",
      files: []
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    console.log(`Submitting ${uploadedFiles.length} files`);
    // Here you would typically upload the files to your server
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      form.setValue('files', [...uploadedFiles, ...newFiles], { shouldValidate: true });
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    form.setValue('files', uploadedFiles.filter((_, index) => index !== indexToRemove), { shouldValidate: true });
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.includes('image')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (type.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (type.includes('word') || type.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (type.includes('excel') || type.includes('spreadsheet')) {
      return <FileText className="h-5 w-5 text-green-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get the selected billing code display
  const getSelectedBillingCode = () => {
    const billingCodeId = form.watch('billingCodeId');
    if (!billingCodeId) return null;
    
    const billingCode = mockBillingCodes.find(bc => bc.id === billingCodeId);
    return billingCode ? (
      <Badge className="flex items-center gap-1 mt-1" variant="outline">
        <Tag className="h-3 w-3" />
        {billingCode.code} - {billingCode.description}
      </Badge>
    ) : null;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                  >
                    <option value="">Select Project</option>
                    <option value="1">Cedar Heights Fiber</option>
                    <option value="2">Oakridge Expansion</option>
                    <option value="3">Downtown Connection</option>
                    <option value="4">Westside Network</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billingCodeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Code <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                  >
                    <option value="">Select Billing Code</option>
                    {mockBillingCodes.map(code => (
                      <option key={code.id} value={code.id}>
                        {code.code} - {code.description}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
                {getSelectedBillingCode()}
              </FormItem>
            )}
          />
        </div>

        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Brief description of these files" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Drag and drop files here or click to browse</p>
          <p className="text-sm text-muted-foreground mt-1">
            Upload multiple files for the same project and billing code
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFilesSelected}
          />
        </div>

        <FormField
          control={form.control}
          name="files"
          render={() => (
            <FormItem>
              <FormMessage />
            </FormItem>
          )}
        />

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Selected Files ({uploadedFiles.length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-accent/50 rounded-md p-2 text-sm"
                >
                  <div className="flex items-center gap-2 truncate">
                    {getFileIcon(file)}
                    <span className="truncate">{file.name}</span>
                    <span className="text-muted-foreground">({(file.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveFile(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};
