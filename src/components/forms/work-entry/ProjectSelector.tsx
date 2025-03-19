
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/context/AppContext';
import { useAddProjectDialog } from '@/hooks/useAddProjectDialog';

interface ProjectSelectorProps {
  projectId: string;
  projects: Project[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projectId,
  projects,
  onChange,
  error
}) => {
  const { openAddProjectDialog } = useAddProjectDialog();

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor="projectId" className="block text-sm font-medium">
          Project
        </label>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs"
          onClick={openAddProjectDialog}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Project
        </Button>
      </div>
      <select
        id="projectId"
        name="projectId"
        value={projectId}
        onChange={onChange}
        className={`
          w-full px-3 py-2 bg-background border rounded-md text-sm 
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
          transition-colors
          ${error ? 'border-destructive' : 'border-input'}
        `}
      >
        <option value="">Select Project</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
};
