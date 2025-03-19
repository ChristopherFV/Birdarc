import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Filter,
  Download,
  CalendarDays,
  ChevronDown,
  Check,
  Users,
  Briefcase
} from 'lucide-react';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { DateRangeType, GroupByType } from '@/context/AppContext';

export const FilterBar: React.FC = () => {
  const { 
    projects,
    teamMembers,
    dateRange,
    setDateRange,
    groupBy,
    setGroupBy,
    selectedProject,
    setSelectedProject,
    selectedTeamMember,
    setSelectedTeamMember,
    exportData
  } = useApp();
  
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showGroupByMenu, setShowGroupByMenu] = React.useState(false);
  const [showProjectsMenu, setShowProjectsMenu] = React.useState(false);
  const [showTeamMenu, setShowTeamMenu] = React.useState(false);
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  
  const dateRangeLabels: Record<DateRangeType, string> = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
    custom: 'Custom Range'
  };
  
  const groupByLabels: Record<GroupByType, string> = {
    day: 'By Day',
    week: 'By Week',
    month: 'By Month',
    year: 'By Year'
  };
  
  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRange(range);
    setShowDatePicker(false);
  };
  
  const handleGroupByChange = (group: GroupByType) => {
    setGroupBy(group);
    setShowGroupByMenu(false);
  };
  
  const handleProjectChange = (projectId: string | null) => {
    setSelectedProject(projectId);
    setShowProjectsMenu(false);
  };
  
  const handleTeamMemberChange = (teamMemberId: string | null) => {
    setSelectedTeamMember(teamMemberId);
    setShowTeamMenu(false);
  };
  
  const handleExport = (type: 'raw' | 'summary') => {
    exportData(type);
    setShowExportMenu(false);
  };
  
  const getSelectedProjectName = () => {
    if (!selectedProject) return 'All Projects';
    const project = projects.find(p => p.id === selectedProject);
    return project ? project.name : 'All Projects';
  };
  
  const getSelectedTeamMemberName = () => {
    if (!selectedTeamMember) return 'All Team Members';
    const member = teamMembers.find(m => m.id === selectedTeamMember);
    return member ? member.name : 'All Team Members';
  };
  
  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle mb-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
        <div className="flex items-center text-sm font-medium text-muted-foreground">
          <Filter size={16} className="mr-1.5" />
          <span>Filters:</span>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center px-3 py-1.5 rounded-md bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <CalendarDays size={16} className="mr-1.5" />
            <span>{dateRangeLabels[dateRange]}</span>
            <ChevronDown size={14} className="ml-1.5 text-muted-foreground" />
          </button>
          
          {showDatePicker && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowDatePicker(false)}
              />
              <div className="absolute mt-1 left-0 z-20 bg-card shadow-card rounded-md border border-border animate-in slide-up">
                <div className="p-2">
                  <div className="flex flex-col space-y-1">
                    {(['day', 'week', 'month'] as DateRangeType[]).map((range) => (
                      <button
                        key={range}
                        onClick={() => handleDateRangeChange(range)}
                        className={`
                          w-full flex items-center px-3 py-2 text-sm rounded-md
                          ${dateRange === range ? 'bg-secondary/80 font-medium' : 'hover:bg-secondary'}
                        `}
                      >
                        <span>{dateRangeLabels[range]}</span>
                        {dateRange === range && <Check size={16} className="ml-auto" />}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2">
                    <DateRangePicker />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowGroupByMenu(!showGroupByMenu)}
            className="flex items-center px-3 py-1.5 rounded-md bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <span>{groupByLabels[groupBy]}</span>
            <ChevronDown size={14} className="ml-1.5 text-muted-foreground" />
          </button>
          
          {showGroupByMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowGroupByMenu(false)}
              />
              <div className="absolute mt-1 z-20 w-40 bg-card shadow-card rounded-md border border-border animate-in slide-up">
                <div className="p-1">
                  {(Object.keys(groupByLabels) as GroupByType[]).map((group) => (
                    <button
                      key={group}
                      onClick={() => handleGroupByChange(group)}
                      className={`
                        w-full flex items-center px-3 py-2 text-sm rounded-md
                        ${groupBy === group ? 'bg-secondary/80 font-medium' : 'hover:bg-secondary'}
                      `}
                    >
                      <span>{groupByLabels[group]}</span>
                      {groupBy === group && <Check size={16} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowProjectsMenu(!showProjectsMenu)}
            className="flex items-center px-3 py-1.5 rounded-md bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <Briefcase size={16} className="mr-1.5" />
            <span className="truncate max-w-[150px]">{getSelectedProjectName()}</span>
            <ChevronDown size={14} className="ml-1.5 text-muted-foreground" />
          </button>
          
          {showProjectsMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowProjectsMenu(false)}
              />
              <div className="absolute mt-1 z-20 w-64 bg-card shadow-card rounded-md border border-border animate-in slide-up max-h-80 overflow-y-auto">
                <div className="p-1">
                  <button
                    onClick={() => handleProjectChange(null)}
                    className={`
                      w-full flex items-center px-3 py-2 text-sm rounded-md
                      ${!selectedProject ? 'bg-secondary/80 font-medium' : 'hover:bg-secondary'}
                    `}
                  >
                    <span>All Projects</span>
                    {!selectedProject && <Check size={16} className="ml-auto" />}
                  </button>
                  
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectChange(project.id)}
                      className={`
                        w-full flex items-center px-3 py-2 text-sm rounded-md
                        ${selectedProject === project.id ? 'bg-secondary/80 font-medium' : 'hover:bg-secondary'}
                      `}
                    >
                      <span className="truncate">{project.name}</span>
                      {selectedProject === project.id && <Check size={16} className="ml-auto flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowTeamMenu(!showTeamMenu)}
            className="flex items-center px-3 py-1.5 rounded-md bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <Users size={16} className="mr-1.5" />
            <span className="truncate max-w-[150px]">{getSelectedTeamMemberName()}</span>
            <ChevronDown size={14} className="ml-1.5 text-muted-foreground" />
          </button>
          
          {showTeamMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowTeamMenu(false)}
              />
              <div className="absolute mt-1 z-20 w-64 bg-card shadow-card rounded-md border border-border animate-in slide-up max-h-80 overflow-y-auto">
                <div className="p-1">
                  <button
                    onClick={() => handleTeamMemberChange(null)}
                    className={`
                      w-full flex items-center px-3 py-2 text-sm rounded-md
                      ${!selectedTeamMember ? 'bg-secondary/80 font-medium' : 'hover:bg-secondary'}
                    `}
                  >
                    <span>All Team Members</span>
                    {!selectedTeamMember && <Check size={16} className="ml-auto" />}
                  </button>
                  
                  {teamMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleTeamMemberChange(member.id)}
                      className={`
                        w-full flex items-center px-3 py-2 text-sm rounded-md
                        ${selectedTeamMember === member.id ? 'bg-secondary/80 font-medium' : 'hover:bg-secondary'}
                      `}
                    >
                      <span className="truncate">{member.name}</span>
                      {selectedTeamMember === member.id && <Check size={16} className="ml-auto flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="relative ml-auto">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center px-3 py-1.5 rounded-md bg-fieldvision-blue text-white text-sm font-medium hover:bg-fieldvision-blue/90 transition-colors"
          >
            <Download size={16} className="mr-1.5" />
            <span>Export</span>
            <ChevronDown size={14} className="ml-1.5" />
          </button>
          
          {showExportMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute right-0 mt-1 z-20 w-48 bg-card shadow-card rounded-md border border-border animate-in slide-up">
                <div className="p-1">
                  <button
                    onClick={() => handleExport('raw')}
                    className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-secondary"
                  >
                    <span>Raw Data (CSV)</span>
                  </button>
                  <button
                    onClick={() => handleExport('summary')}
                    className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-secondary"
                  >
                    <span>Summary Report (CSV)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
