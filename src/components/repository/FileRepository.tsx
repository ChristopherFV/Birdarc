
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, XCircle, FileText, Image, File, MoreVertical, Clock, Tag, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type FileStatus = 'all' | 'pending' | 'approved' | 'rejected';

interface RepositoryFile {
  id: string;
  name: string;
  type: string;
  count: number;
  uploadedBy: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  project: string;
  billingCode: string;
  isFromCompletedTask?: boolean;
}

interface FileRepositoryProps {
  status: FileStatus;
  compact?: boolean;
}

// Mock data for demonstration
const mockFiles: RepositoryFile[] = [
  {
    id: '1',
    name: 'Fiber Test Results',
    type: 'document',
    count: 25,
    uploadedBy: 'John Doe',
    uploadDate: '2023-09-15',
    status: 'pending',
    project: 'Cedar Heights Fiber',
    billingCode: 'FBR-001',
    isFromCompletedTask: true
  },
  {
    id: '2',
    name: 'Underground Path Redlines',
    type: 'image',
    count: 12,
    uploadedBy: 'Sarah Johnson',
    uploadDate: '2023-09-14',
    status: 'approved',
    project: 'Oakridge Expansion',
    billingCode: 'UND-025',
    isFromCompletedTask: false
  },
  {
    id: '3',
    name: 'Permit Applications',
    type: 'document',
    count: 5,
    uploadedBy: 'Mike Wilson',
    uploadDate: '2023-09-13',
    status: 'rejected',
    project: 'Downtown Connection',
    billingCode: 'PMT-103',
    isFromCompletedTask: true
  },
  {
    id: '4',
    name: 'Splice Location Documents',
    type: 'spreadsheet',
    count: 8,
    uploadedBy: 'Emma Davis',
    uploadDate: '2023-09-12',
    status: 'pending',
    project: 'Westside Network',
    billingCode: 'SPL-072',
    isFromCompletedTask: true
  }
];

export const FileRepository: React.FC<FileRepositoryProps> = ({ status, compact = false }) => {
  // Filter files based on status
  const filteredFiles = status === 'all' 
    ? mockFiles 
    : mockFiles.filter(file => file.status === status);

  // Display a limited number of files if compact mode is enabled
  const displayFiles = compact ? filteredFiles.slice(0, 3) : filteredFiles;

  // Helper to render the appropriate file icon
  const getFileIcon = (type: string) => {
    switch(type) {
      case 'image':
        return <Image className={`${compact ? 'h-6 w-6' : 'h-8 w-8'} text-blue-500`} />;
      case 'pdf':
        return <FileText className={`${compact ? 'h-6 w-6' : 'h-8 w-8'} text-red-500`} />;
      case 'document':
        return <FileText className={`${compact ? 'h-6 w-6' : 'h-8 w-8'} text-blue-500`} />;
      case 'spreadsheet':
        return <FileText className={`${compact ? 'h-6 w-6' : 'h-8 w-8'} text-green-500`} />;
      default:
        return <File className={`${compact ? 'h-6 w-6' : 'h-8 w-8'} text-gray-500`} />;
    }
  };

  // Helper to render status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {displayFiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <File className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No files found</p>
          </CardContent>
        </Card>
      ) : (
        displayFiles.map(file => (
          <Card key={file.id} className="hover:bg-accent/50 transition-colors">
            <CardContent className={compact ? "p-3" : "p-4"}>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-medium truncate ${compact ? 'text-sm' : ''}`}>{file.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1 items-center">
                        <span className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                          {file.project}
                        </span>
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          <Tag className="h-3 w-3" />
                          {file.billingCode}
                        </Badge>
                        <Badge variant="soft-green" className="text-xs">
                          {file.count} files
                        </Badge>
                        {file.isFromCompletedTask && (
                          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50 flex items-center gap-1 text-xs">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed Task
                          </Badge>
                        )}
                        {!compact && (
                          <span className="text-sm text-muted-foreground">
                            {file.uploadDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(file.status)}
                      {!compact && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {!compact && (
                    <div className="mt-2 text-sm">
                      Uploaded by <span className="font-medium">{file.uploadedBy}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      
      {compact && filteredFiles.length > displayFiles.length && (
        <div className="text-center">
          <Button variant="link" className="text-sm">
            View {filteredFiles.length - displayFiles.length} more files
          </Button>
        </div>
      )}
    </div>
  );
};
