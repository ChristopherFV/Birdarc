import { Task } from '@/context/ScheduleContext';

export const useTaskMetadata = (
  tasks: Task[],
  billingCodes: any[],
  projects: any[],
  teamMembers: any[],
  selectedTaskId: string | null
) => {
  // Helper to get billing code details
  const getBillingCode = (codeId: string | null) => {
    if (!codeId) return null;
    return billingCodes.find(code => code.id === codeId);
  };
  
  // Helper to get project name
  const getProjectName = (projectId: string | null, task?: Task) => {
    if (!projectId) return "No Project";
    
    // First check if task has projectName directly
    if (task && task.projectName) {
      return task.projectName;
    }
    
    // Otherwise look it up from projects array
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };
  
  // Helper to get team member name
  const getTeamMemberName = (teamMemberId: string | null, task?: Task) => {
    if (!teamMemberId) return "Unassigned";
    
    // First check if task has teamMemberName directly
    if (task && task.teamMemberName) {
      return task.teamMemberName;
    }
    
    // Otherwise look it up from teamMembers array
    const teamMember = teamMembers.find(tm => tm.id === teamMemberId);
    return teamMember ? teamMember.name : "Unknown";
  };
  
  const selectedTask = tasks.find(task => task.id === selectedTaskId);
  const selectedBillingCode = selectedTask ? getBillingCode(selectedTask.billingCodeId) : null;
  const selectedProjectName = selectedTask ? getProjectName(selectedTask.projectId, selectedTask) : "";
  
  return {
    selectedTask,
    selectedBillingCode,
    selectedProjectName,
    getBillingCode,
    getProjectName,
    getTeamMemberName
  };
};
