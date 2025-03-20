
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project, TeamMember } from '@/types/app-types';
import { TaskFormErrors } from './validation';

interface ProjectTeamSelectorProps {
  projectId: string;
  teamMemberId: string;
  projects: Project[];
  teamMembers: TeamMember[];
  errors: TaskFormErrors;
  onProjectChange: (value: string) => void;
  onTeamMemberChange: (value: string) => void;
}

export const ProjectTeamSelector: React.FC<ProjectTeamSelectorProps> = ({
  projectId,
  teamMemberId,
  projects,
  teamMembers,
  errors,
  onProjectChange,
  onTeamMemberChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="project">Project *</Label>
        <Select value={projectId} onValueChange={onProjectChange}>
          <SelectTrigger className={errors.projectId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.projectId && <p className="text-destructive text-sm">{errors.projectId}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="teamMember">Team Member</Label>
        <Select value={teamMemberId} onValueChange={onTeamMemberChange}>
          <SelectTrigger>
            <SelectValue placeholder="Assign to" />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
