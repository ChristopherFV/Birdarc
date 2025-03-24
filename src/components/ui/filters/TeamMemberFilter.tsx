
import React from 'react';
import { Users } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { FilterDropdown, FilterDropdownItem } from './FilterDropdown';

interface TeamMemberFilterProps {
  technicianView?: boolean;
}

export const TeamMemberFilter: React.FC<TeamMemberFilterProps> = ({ 
  technicianView = false 
}) => {
  const { teamMembers, selectedTeamMember, setSelectedTeamMember } = useApp();
  const [showTeamMenu, setShowTeamMenu] = React.useState(false);
  
  const handleTeamMemberChange = (teamMemberId: string | null) => {
    setSelectedTeamMember(teamMemberId);
    setShowTeamMenu(false);
  };
  
  const getSelectedTeamMemberName = () => {
    if (!selectedTeamMember) return technicianView ? 'My Team' : 'All Team Members';
    const member = teamMembers.find(m => m.id === selectedTeamMember);
    return member ? member.name : technicianView ? 'My Team' : 'All Team Members';
  };
  
  return (
    <FilterDropdown
      label={
        <>
          <Users size={10} className="mr-1" />
          <span className="truncate">{getSelectedTeamMemberName()}</span>
        </>
      }
      isOpen={showTeamMenu}
      toggleOpen={() => setShowTeamMenu(!showTeamMenu)}
      onClose={() => setShowTeamMenu(false)}
      width="w-48"
    >
      <div className="p-1">
        {technicianView ? (
          <>
            <FilterDropdownItem
              onClick={() => handleTeamMemberChange(null)}
              isSelected={!selectedTeamMember}
            >
              My Team
            </FilterDropdownItem>
            <FilterDropdownItem
              onClick={() => handleTeamMemberChange('current-user')}
              isSelected={selectedTeamMember === 'current-user'}
            >
              Just Me
            </FilterDropdownItem>
          </>
        ) : (
          <>
            <FilterDropdownItem
              onClick={() => handleTeamMemberChange(null)}
              isSelected={!selectedTeamMember}
            >
              All Team Members
            </FilterDropdownItem>
            
            {teamMembers.map((member) => (
              <FilterDropdownItem
                key={member.id}
                onClick={() => handleTeamMemberChange(member.id)}
                isSelected={selectedTeamMember === member.id}
              >
                {member.name}
              </FilterDropdownItem>
            ))}
          </>
        )}
      </div>
    </FilterDropdown>
  );
};
