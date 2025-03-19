
import React, { useState } from 'react';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Plus, Check, XCircle, Filter, SortDesc } from 'lucide-react';
import { FileRepository } from '@/components/repository/FileRepository';
import { FileUploader } from '@/components/repository/FileUploader';

const RepositoryPage = () => {
  const [showUploader, setShowUploader] = useState(false);

  return (
    <SimplePageLayout 
      title="Field Repository" 
      subtitle="Upload and manage project files for review and approval"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <SortDesc className="h-4 w-4" />
            <span>Sort</span>
          </Button>
        </div>
        <Button 
          onClick={() => setShowUploader(true)} 
          className="flex items-center gap-2"
          disabled={showUploader}
        >
          <Upload className="h-4 w-4" />
          <span>Upload Files</span>
        </Button>
      </div>

      {showUploader && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Upload Project Files</CardTitle>
            <CardDescription>
              Add files to the repository for review and approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader />
          </CardContent>
          <CardFooter className="justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowUploader(false)}>
              Cancel
            </Button>
            <Button>
              Submit Files
            </Button>
          </CardFooter>
        </Card>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
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
    </SimplePageLayout>
  );
};

export default RepositoryPage;
