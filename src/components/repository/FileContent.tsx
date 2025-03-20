
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileRepository } from '@/components/repository/FileRepository';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FileUploader } from '@/components/repository/FileUploader';
import { Button } from '@/components/ui/button';

interface FileContentProps {
  selectedTab: 'all' | 'pending' | 'approved' | 'rejected' | 'schedule';
  setSelectedTab: (tab: 'all' | 'pending' | 'approved' | 'rejected' | 'schedule') => void;
  showUploader: boolean;
  setShowUploader: (show: boolean) => void;
  totalPendingFiles: number;
}

export const FileContent: React.FC<FileContentProps> = ({
  selectedTab,
  setSelectedTab,
  showUploader,
  setShowUploader,
  totalPendingFiles
}) => {
  return (
    <>
      {showUploader && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardContent className="p-0">
              <h2 className="text-lg font-semibold">Upload Project Files</h2>
              <p className="text-sm text-muted-foreground">
                Add multiple files to the repository for review and approval
              </p>
            </CardContent>
          </CardHeader>
          <CardContent>
            <FileUploader />
          </CardContent>
          <CardContent className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowUploader(false)}>
              Cancel
            </Button>
            <Button>
              Submit Files
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs 
        defaultValue="all" 
        className="w-full"
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as any)}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Review
            {totalPendingFiles > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalPendingFiles}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <FileRepository status="all" />
        </TabsContent>
        <TabsContent value="pending">
          <FileRepository status="pending" />
        </TabsContent>
        <TabsContent value="approved">
          <FileRepository status="approved" />
        </TabsContent>
        <TabsContent value="rejected">
          <FileRepository status="rejected" />
        </TabsContent>
      </Tabs>
    </>
  );
};
