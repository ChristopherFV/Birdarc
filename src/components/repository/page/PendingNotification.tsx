
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CircleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  name: string;
  pendingCount: number;
  billingCodes: string[];
}

interface PendingNotificationProps {
  projectsWithPendingFiles: Project[];
  onProjectClick: () => void;
}

export const PendingNotification: React.FC<PendingNotificationProps> = ({ 
  projectsWithPendingFiles,
  onProjectClick
}) => {
  const totalPendingFiles = projectsWithPendingFiles.reduce((sum, project) => sum + project.pendingCount, 0);
  
  if (totalPendingFiles === 0) {
    return null;
  }
  
  return (
    <Card className="mb-6 border-fieldvision-blue bg-fieldvision-blue/10">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-fieldvision-blue mb-2">
          <CircleAlert className="h-5 w-5" />
          <h3 className="font-medium">Files Pending Approval</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projectsWithPendingFiles
            .filter(project => project.pendingCount > 0)
            .map(project => (
              <div 
                key={project.id} 
                className="flex justify-between items-center bg-white rounded-md p-3 shadow-sm cursor-pointer"
                onClick={onProjectClick}
              >
                <div className="flex flex-col">
                  <span className="font-medium truncate max-w-[150px] sm:max-w-none">{project.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {project.billingCodes.join(', ')}
                  </span>
                </div>
                <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                  {project.pendingCount} files
                </Badge>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
