
import React from 'react';
import { Project } from '@/context/AppContext';

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
  return (
    <div>
      <label htmlFor="projectId" className="block text-sm font-medium mb-1">
        Project
      </label>
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
