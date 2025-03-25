
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Project, TeamMember } from '@/context/AppContext';

interface ProjectTeamSectionProps {
  projectId: string;
  teamMemberId: string;
  isContractor: boolean;
  projects: Project[];
  teamMembers: TeamMember[];
  projectError?: string;
  onProjectChange: (projectId: string) => void;
  onTeamMemberChange: (teamMemberId: string) => void;
  onContractorToggle: (isContractor: boolean) => void;
}

export const ProjectTeamSection: React.FC<ProjectTeamSectionProps> = ({
  projectId,
  teamMemberId,
  isContractor,
  projects,
  teamMembers,
  projectError,
  onProjectChange,
  onTeamMemberChange,
  onContractorToggle
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="project">Project *</Label>
        <Select value={projectId} onValueChange={onProjectChange}>
          <SelectTrigger className={projectError ? "border-destructive" : ""}>
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
        {projectError && <p className="text-destructive text-sm">{projectError}</p>}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="teamMember">Assign To</Label>
          <div className="flex items-center gap-2">
            <Label htmlFor="isContractor" className="text-sm">Contractor</Label>
            <Switch
              id="isContractor"
              checked={isContractor}
              onCheckedChange={onContractorToggle}
            />
          </div>
        </div>
        
        {!isContractor && (
          <Select value={teamMemberId} onValueChange={onTeamMemberChange}>
            <SelectTrigger>
              <SelectValue placeholder="Assign to team member" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};
