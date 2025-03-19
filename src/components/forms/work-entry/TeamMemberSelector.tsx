
import React from 'react';
import { TeamMember } from '@/context/AppContext';

interface TeamMemberSelectorProps {
  teamMemberId: string;
  teamMembers: TeamMember[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

export const TeamMemberSelector: React.FC<TeamMemberSelectorProps> = ({
  teamMemberId,
  teamMembers,
  onChange,
  error
}) => {
  return (
    <div>
      <label htmlFor="teamMemberId" className="block text-sm font-medium mb-1">
        Team Member
      </label>
      <select
        id="teamMemberId"
        name="teamMemberId"
        value={teamMemberId}
        onChange={onChange}
        className={`
          w-full px-3 py-2 bg-background border rounded-md text-sm 
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
          transition-colors
          ${error ? 'border-destructive' : 'border-input'}
        `}
      >
        <option value="">Select Team Member</option>
        {teamMembers.map(member => (
          <option key={member.id} value={member.id}>
            {member.name} - {member.role}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
};
