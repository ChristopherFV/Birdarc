
import React from 'react';
import { Label } from '@/components/ui/label';
import { Project, TeamMember } from '@/types/app-types';

interface TaskAssignmentProps {
  projectId: string;
  teamMemberId: string;
  projects: Project[];
  teamMembers: TeamMember[];
  onProjectChange: (value: string) => void;
  onTeamMemberChange: (value: string) => void;
}

export const TaskAssignment: React.FC<TaskAssignmentProps> = ({
  projectId,
  teamMemberId,
  projects,
  teamMembers,
  onProjectChange,
  onTeamMemberChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="project">Project (Optional)</Label>
        <select
          id="project"
          value={projectId}
          onChange={(e) => onProjectChange(e.target.value)}
          className="w-full px-3 py-2 bg-background border rounded-md text-sm"
        >
          <option value="">Select Project</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="team">Team Member (Optional)</Label>
        <select
          id="team"
          value={teamMemberId}
          onChange={(e) => onTeamMemberChange(e.target.value)}
          className="w-full px-3 py-2 bg-background border rounded-md text-sm"
        >
          <option value="">Select Team Member</option>
          {teamMembers.map(member => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
