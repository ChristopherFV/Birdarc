
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Filter, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/repository/FileUploader';
import { FileRepository } from '@/components/repository/FileRepository';
import { useIsMobile } from '@/hooks/use-mobile';
import { ExportButton } from '@/components/ui/filters/ExportButton';

interface FileSectionProps {
  selectedTab: 'all' | 'pending' | 'approved' | 'rejected';
  totalPendingFiles: number;
  showUploader: boolean;
  setShowUploader: (show: boolean) => void;
}

export const FileSection: React.FC<FileSectionProps> = ({
  selectedTab,
  totalPendingFiles,
  showUploader,
  setShowUploader
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      {showUploader && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Upload Project Files</CardTitle>
            <CardDescription>
              Add multiple files to the repository for review and approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader />
          </CardContent>
          <CardFooter className="justify-end gap-2 pt-2 flex-wrap">
            <Button variant="outline" onClick={() => setShowUploader(false)} size={isMobile ? "sm" : "default"}>
              Cancel
            </Button>
            <Button size={isMobile ? "sm" : "default"}>
              Submit Files
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {!showUploader && (
        <div className="flex justify-end mb-4">
          <ExportButton filesView={true} />
        </div>
      )}
      
      <FileRepository status={selectedTab} />
    </>
  );
};
