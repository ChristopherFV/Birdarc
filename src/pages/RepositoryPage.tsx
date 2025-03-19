
import React, { useState } from 'react';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Plus, Check, XCircle, Filter, SortDesc, CircleAlert } from 'lucide-react';
import { FileRepository } from '@/components/repository/FileRepository';
import { FileUploader } from '@/components/repository/FileUploader';
import { Badge } from '@/components/ui/badge';

// Mock project data with pending files count
const projectsWithPendingFiles = [
  { id: '1', name: 'Cedar Heights Fiber', pendingCount: 3 },
  { id: '2', name: 'Oakridge Expansion', pendingCount: 1 },
  { id: '3', name: 'Downtown Connection', pendingCount: 0 },
  { id: '4', name: 'Westside Network', pendingCount: 2 },
];

const RepositoryPage = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Total pending files across all projects
  const totalPendingFiles = projectsWithPendingFiles.reduce((sum, project) => sum + project.pendingCount, 0);

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

      {/* Project summary with pending files */}
      {totalPendingFiles > 0 && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-700 mb-2">
              <CircleAlert className="h-5 w-5" />
              <h3 className="font-medium">Files Pending Approval</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {projectsWithPendingFiles
                .filter(project => project.pendingCount > 0)
                .map(project => (
                  <div 
                    key={project.id} 
                    className="flex justify-between items-center bg-white rounded-md p-3 shadow-sm"
                    onClick={() => setSelectedTab('pending')}
                  >
                    <span className="font-medium truncate">{project.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {project.pendingCount} pending
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

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
    </SimplePageLayout>
  );
};

export default RepositoryPage;
