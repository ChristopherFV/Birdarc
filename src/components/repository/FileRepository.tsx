
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, XCircle, FileText, Image, File, MoreVertical, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FileStatus = 'all' | 'pending' | 'approved' | 'rejected';

interface RepositoryFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  project: string;
}

interface FileRepositoryProps {
  status: FileStatus;
}

// Mock data for demonstration
const mockFiles: RepositoryFile[] = [
  {
    id: '1',
    name: 'site-survey-report.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadedBy: 'John Doe',
    uploadDate: '2023-09-15',
    status: 'pending',
    project: 'Cedar Heights Fiber'
  },
  {
    id: '2',
    name: 'underground-path-diagram.jpg',
    type: 'image',
    size: '1.7 MB',
    uploadedBy: 'Sarah Johnson',
    uploadDate: '2023-09-14',
    status: 'approved',
    project: 'Oakridge Expansion'
  },
  {
    id: '3',
    name: 'permit-application.docx',
    type: 'document',
    size: '850 KB',
    uploadedBy: 'Mike Wilson',
    uploadDate: '2023-09-13',
    status: 'rejected',
    project: 'Downtown Connection'
  },
  {
    id: '4',
    name: 'fiber-splice-locations.xlsx',
    type: 'spreadsheet',
    size: '1.2 MB',
    uploadedBy: 'Emma Davis',
    uploadDate: '2023-09-12',
    status: 'pending',
    project: 'Westside Network'
  }
];

export const FileRepository: React.FC<FileRepositoryProps> = ({ status }) => {
  // Filter files based on status
  const filteredFiles = status === 'all' 
    ? mockFiles 
    : mockFiles.filter(file => file.status === status);

  // Helper to render the appropriate file icon
  const getFileIcon = (type: string) => {
    switch(type) {
      case 'image':
        return <Image className="h-8 w-8 text-blue-500" />;
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'document':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'spreadsheet':
        return <FileText className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  // Helper to render status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return (
          <div className="flex items-center text-yellow-600 text-sm font-medium">
            <Clock className="h-4 w-4 mr-1" />
            Pending
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <Check className="h-4 w-4 mr-1" />
            Approved
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center text-red-600 text-sm font-medium">
            <XCircle className="h-4 w-4 mr-1" />
            Rejected
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <File className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No files found</p>
          </CardContent>
        </Card>
      ) : (
        filteredFiles.map(file => (
          <Card key={file.id} className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium truncate">{file.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {file.project} • {file.size} • Uploaded on {file.uploadDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(file.status)}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    Uploaded by <span className="font-medium">{file.uploadedBy}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
