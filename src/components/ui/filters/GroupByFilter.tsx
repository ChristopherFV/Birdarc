
import React from 'react';
import { useApp } from '@/context/AppContext';
import { GroupByType } from '@/context/AppContext';
import { FilterDropdown, FilterDropdownItem } from './FilterDropdown';

const groupByLabels: Record<GroupByType, string> = {
  day: 'By Day',
  week: 'By Week',
  month: 'By Month',
  year: 'By Year'
};

export const GroupByFilter: React.FC = () => {
  const { groupBy, setGroupBy } = useApp();
  const [showGroupByMenu, setShowGroupByMenu] = React.useState(false);
  
  const handleGroupByChange = (group: GroupByType) => {
    setGroupBy(group);
    setShowGroupByMenu(false);
  };
  
  return (
    <FilterDropdown
      label={<span className="truncate">{groupByLabels[groupBy]}</span>}
      isOpen={showGroupByMenu}
      toggleOpen={() => setShowGroupByMenu(!showGroupByMenu)}
      onClose={() => setShowGroupByMenu(false)}
      width="w-36"
    >
      <div className="p-1">
        {(Object.keys(groupByLabels) as GroupByType[]).map((group) => (
          <FilterDropdownItem
            key={group}
            onClick={() => handleGroupByChange(group)}
            isSelected={groupBy === group}
          >
            {groupByLabels[group]}
          </FilterDropdownItem>
        ))}
      </div>
    </FilterDropdown>
  );
};
