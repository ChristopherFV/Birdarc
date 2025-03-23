
import { format } from 'date-fns';
import { BillingCode, WorkEntry, Project, TeamMember } from '../types/app-types';

// Calculate revenue for a work entry
export const calculateRevenue = (entry: WorkEntry, billingCodes: BillingCode[]): number => {
  const billingCode = billingCodes.find(code => code.id === entry.billingCodeId);
  if (!billingCode) return 0;
  return entry.feetCompleted * billingCode.ratePerFoot;
};

// Calculate contractor cost based on a work entry
export const calculateContractorCost = (
  entry: WorkEntry, 
  billingCodes: BillingCode[], 
  projects: Project[]
): number => {
  const revenue = calculateRevenue(entry, billingCodes);
  const project = projects.find(p => p.id === entry.projectId);
  
  if (!project?.useContractor || !project.contractorHourlyRate) {
    return 0;
  }
  
  // Contractor cost is calculated as revenue minus the margin
  // E.g., if revenue is $100 and margin is 20%, contractor cost is $80
  return revenue * (1 - project.contractorHourlyRate / 100);
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
      ['Date', 'Project', 'Billing Code', 'Feet Completed', 'Revenue', 'Contractor Cost', 'Profit', 'Team Member'],
      ...filteredEntries.map(entry => {
        const project = projects.find(p => p.id === entry.projectId);
        const billingCode = billingCodes.find(b => b.id === entry.billingCodeId);
        const teamMember = teamMembers.find(t => t.id === entry.teamMemberId);
        const revenue = calculateRevenue(entry, billingCodes);
        const contractorCost = calculateContractorCost(entry, billingCodes, projects);
        const profit = revenue - contractorCost;
        
        return [
          entry.date,
          project?.name,
          billingCode?.code,
          entry.feetCompleted,
          revenue.toFixed(2),
          contractorCost.toFixed(2),
          profit.toFixed(2),
          teamMember?.name
        ];
      })
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    downloadFile(csvContent, 'fieldvision_raw_data.csv', 'text/csv');
  } else {
    // Summary data by project per month
    const summaryData: Record<string, Record<string, { feet: number, revenue: number, contractorCost: number, profit: number }>> = {};
    
    filteredEntries.forEach(entry => {
      const project = projects.find(p => p.id === entry.projectId);
      const billingCode = billingCodes.find(b => b.id === entry.billingCodeId);
      if (!project || !billingCode) return;
      
      const monthYear = format(new Date(entry.date), 'MMM yyyy');
      const revenue = entry.feetCompleted * billingCode.ratePerFoot;
      const contractorCost = calculateContractorCost(entry, billingCodes, projects);
      const profit = revenue - contractorCost;
      
      if (!summaryData[project.name]) {
        summaryData[project.name] = {};
      }
      
      if (!summaryData[project.name][monthYear]) {
        summaryData[project.name][monthYear] = { feet: 0, revenue: 0, contractorCost: 0, profit: 0 };
      }
      
      summaryData[project.name][monthYear].feet += entry.feetCompleted;
      summaryData[project.name][monthYear].revenue += revenue;
      summaryData[project.name][monthYear].contractorCost += contractorCost;
      summaryData[project.name][monthYear].profit += profit;
    });
    
    // Convert summary to CSV
    const months = Array.from(new Set(
      filteredEntries.map(entry => format(new Date(entry.date), 'MMM yyyy'))
    )).sort();
    
    const csvData = [
      [
        'Project', 
        ...months.map(m => `${m} Feet`), 
        ...months.map(m => `${m} Revenue`),
        ...months.map(m => `${m} Contractor Cost`),
        ...months.map(m => `${m} Profit`)
      ],
      ...Object.entries(summaryData).map(([project, data]) => {
        return [
          project,
          ...months.map(month => data[month]?.feet.toString() || '0'),
          ...months.map(month => data[month]?.revenue.toFixed(2) || '0.00'),
          ...months.map(month => data[month]?.contractorCost.toFixed(2) || '0.00'),
          ...months.map(month => data[month]?.profit.toFixed(2) || '0.00')
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
