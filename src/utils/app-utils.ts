
import { format } from 'date-fns';
import { BillingCode, WorkEntry, Project, TeamMember } from '../types/app-types';

// Calculate revenue for a work entry
export const calculateRevenue = (entry: WorkEntry, billingCodes: BillingCode[]): number => {
  const billingCode = billingCodes.find(code => code.id === entry.billingCodeId);
  if (!billingCode) return 0;
  return entry.feetCompleted * billingCode.ratePerFoot;
};

// Export data to CSV
export const exportDataToCSV = (
  filteredEntries: WorkEntry[], 
  type: 'raw' | 'summary',
  projects: Project[],
  billingCodes: BillingCode[],
  teamMembers: TeamMember[]
) => {
  if (type === 'raw') {
    // CSV with all details
    const csvData = [
      ['Date', 'Project', 'Billing Code', 'Feet Completed', 'Revenue', 'Team Member'],
      ...filteredEntries.map(entry => {
        const project = projects.find(p => p.id === entry.projectId);
        const billingCode = billingCodes.find(b => b.id === entry.billingCodeId);
        const teamMember = teamMembers.find(t => t.id === entry.teamMemberId);
        const revenue = calculateRevenue(entry, billingCodes);
        
        return [
          entry.date,
          project?.name,
          billingCode?.code,
          entry.feetCompleted,
          revenue.toFixed(2),
          teamMember?.name
        ];
      })
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    downloadFile(csvContent, 'fieldvision_raw_data.csv', 'text/csv');
  } else {
    // Summary data by project per month
    const summaryData: Record<string, Record<string, { feet: number, revenue: number }>> = {};
    
    filteredEntries.forEach(entry => {
      const project = projects.find(p => p.id === entry.projectId);
      const billingCode = billingCodes.find(b => b.id === entry.billingCodeId);
      if (!project || !billingCode) return;
      
      const monthYear = format(new Date(entry.date), 'MMM yyyy');
      const revenue = entry.feetCompleted * billingCode.ratePerFoot;
      
      if (!summaryData[project.name]) {
        summaryData[project.name] = {};
      }
      
      if (!summaryData[project.name][monthYear]) {
        summaryData[project.name][monthYear] = { feet: 0, revenue: 0 };
      }
      
      summaryData[project.name][monthYear].feet += entry.feetCompleted;
      summaryData[project.name][monthYear].revenue += revenue;
    });
    
    // Convert summary to CSV
    const months = Array.from(new Set(
      filteredEntries.map(entry => format(new Date(entry.date), 'MMM yyyy'))
    )).sort();
    
    const csvData = [
      ['Project', ...months.map(m => `${m} Feet`), ...months.map(m => `${m} Revenue`)],
      ...Object.entries(summaryData).map(([project, data]) => {
        return [
          project,
          ...months.map(month => data[month]?.feet.toString() || '0'),
          ...months.map(month => data[month]?.revenue.toFixed(2) || '0.00')
        ];
      })
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    downloadFile(csvContent, 'fieldvision_summary.csv', 'text/csv');
  }
};

// Helper to download files
export const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};
