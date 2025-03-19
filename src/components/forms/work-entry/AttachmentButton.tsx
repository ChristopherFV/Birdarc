
import React, { useRef } from 'react';
import { Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttachmentButtonProps {
  attachments: File[];
  onAttach: (files: File[]) => void;
  error?: string;
}

export const AttachmentButton: React.FC<AttachmentButtonProps> = ({
  attachments,
  onAttach,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onAttach(filesArray);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    onAttach(newAttachments);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Attachments</label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={handleClick}
          className="text-xs"
        >
          <Paperclip className="h-3.5 w-3.5 mr-1" />
          Attach Files
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
        />
      </div>
      
      {error && <p className="text-destructive text-sm">{error}</p>}
      
      {attachments.length > 0 && (
        <div className="space-y-2 mt-2">
          {attachments.map((file, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between bg-accent/50 rounded-md p-2 text-sm"
            >
              <span className="truncate max-w-[250px]">{file.name}</span>
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
      )}
    </div>
  );
};
