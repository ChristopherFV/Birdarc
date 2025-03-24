
import React from 'react';
import { Briefcase } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { FilterDropdown, FilterDropdownItem } from './FilterDropdown';

export const ProjectFilter: React.FC = () => {
  const { projects, selectedProject, setSelectedProject } = useApp();
  const [showProjectsMenu, setShowProjectsMenu] = React.useState(false);
  
  const handleProjectChange = (projectId: string | null) => {
    setSelectedProject(projectId);
    setShowProjectsMenu(false);
  };
  
  const getSelectedProjectName = () => {
    if (!selectedProject) return 'All Projects';
    const project = projects.find(p => p.id === selectedProject);
    return project ? project.name : 'All Projects';
  };
  
  return (
    <FilterDropdown
      label={
        <>
          <Briefcase size={10} className="mr-1" />
          <span className="truncate">{getSelectedProjectName()}</span>
        </>
      }
      isOpen={showProjectsMenu}
      toggleOpen={() => setShowProjectsMenu(!showProjectsMenu)}
      onClose={() => setShowProjectsMenu(false)}
      width="w-64"
      className="max-h-64 overflow-y-auto"
    >
      <div className="p-1">
        <FilterDropdownItem
          onClick={() => handleProjectChange(null)}
          isSelected={!selectedProject}
        >
          All Projects
        </FilterDropdownItem>
        
        {projects.map((project) => (
          <FilterDropdownItem
            key={project.id}
            onClick={() => handleProjectChange(project.id)}
            isSelected={selectedProject === project.id}
          >
            {project.name}
          </FilterDropdownItem>
        ))}
      </div>
    </FilterDropdown>
  );
};
