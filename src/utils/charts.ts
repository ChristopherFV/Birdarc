
import { format, parseISO, startOfWeek, startOfMonth, startOfYear, startOfDay, addDays, addWeeks, addMonths } from 'date-fns';
import { WorkEntry, BillingCode, Project, GroupByType, BillingUnitType } from '@/types/app-types';
import { calculateRevenue } from '@/utils/app-utils';

// Type for revenue data
export type RevenueData = {
  date: string;
  revenue: number;
  contractorCost: number;
  profit: number;
  cumulativeRevenue: number;
  cumulativeProfit: number;
  formattedDate: string;
};

// Type for production data
export type ProductionData = {
  date: string;
  units: number;
  cumulativeUnits: number;
  formattedDate: string;
};

// Type for formatted chart data
export type ChartData = {
  formattedDate: string;
  revenue?: number;
  contractorCost?: number;
  profit?: number;
  cumulativeRevenue?: number;
  cumulativeProfit?: number;
  units?: number;
  cumulativeUnits?: number;
};

// Calculate contractor cost based on margin
const calculateContractorCost = (revenue: number, marginPercentage: number): number => {
  if (!marginPercentage || marginPercentage <= 0) return 0;
  
  // Calculate the contractor cost based on the margin percentage
  // For example, if revenue is $100 and margin is 20%, the contractor cost is $80
  return revenue * (1 - marginPercentage / 100);
};

// Group entries by time unit
const groupEntriesByTimeUnit = (
  entries: WorkEntry[],
  billingCodes: BillingCode[],
  projects: Project[],
  groupBy: GroupByType
): { [key: string]: { revenue: number; contractorCost: number; profit: number; units: number } } => {
  const groupedData: { [key: string]: { revenue: number; contractorCost: number; profit: number; units: number } } = {};
  
  entries.forEach(entry => {
    const date = parseISO(entry.date);
    let period: string;
    
    switch (groupBy) {
      case 'day':
        period = format(startOfDay(date), 'yyyy-MM-dd');
        break;
      case 'week':
        period = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        break;
      case 'month':
        period = format(startOfMonth(date), 'yyyy-MM');
        break;
      case 'year':
        period = format(startOfYear(date), 'yyyy');
        break;
      default:
        period = entry.date;
    }
    
    if (!groupedData[period]) {
      groupedData[period] = { revenue: 0, contractorCost: 0, profit: 0, units: 0 };
    }
    
    const revenue = calculateRevenue(entry, billingCodes);
    
    // Find project to check for contractor info
    const project = projects.find(p => p.id === entry.projectId);
    let contractorCost = 0;
    
    if (project?.useContractor && project.contractorHourlyRate) {
      contractorCost = calculateContractorCost(revenue, project.contractorHourlyRate);
    }
    
    const profit = revenue - contractorCost;
    
    groupedData[period].revenue += revenue;
    groupedData[period].contractorCost += contractorCost;
    groupedData[period].profit += profit;
    groupedData[period].units += entry.feetCompleted;
  });
  
  return groupedData;
};

// Get formatted label based on group by type
const getFormattedLabel = (date: string, groupBy: GroupByType): string => {
  const parsedDate = typeof date === 'string' && date.length === 7 
    ? parseISO(`${date}-01`) 
    : parseISO(date);
  
  switch (groupBy) {
    case 'day':
      return format(parsedDate, 'MMM d, yyyy');
    case 'week':
      return `Week of ${format(parsedDate, 'MMM d')}`;
    case 'month':
      return format(parsedDate, 'MMM yyyy');
    case 'year':
      return format(parsedDate, 'yyyy');
    default:
      return format(parsedDate, 'MMM d');
  }
};

// Fill in missing periods for continuous timeline
const fillMissingPeriods = (
  data: { [key: string]: { revenue: number; contractorCost: number; profit: number; units: number } },
  startDate: Date,
  endDate: Date,
  groupBy: GroupByType
) => {
  const filledData: { [key: string]: { revenue: number; contractorCost: number; profit: number; units: number } } = { ...data };
  let currentDate = startDate;
  
  while (currentDate <= endDate) {
    let period: string;
    let nextDate: Date;
    
    switch (groupBy) {
      case 'day':
        period = format(startOfDay(currentDate), 'yyyy-MM-dd');
        nextDate = addDays(currentDate, 1);
        break;
      case 'week':
        period = format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        nextDate = addWeeks(currentDate, 1);
        break;
      case 'month':
        period = format(startOfMonth(currentDate), 'yyyy-MM');
        nextDate = addMonths(currentDate, 1);
        break;
      case 'year':
        period = format(startOfYear(currentDate), 'yyyy');
        nextDate = new Date(currentDate.getFullYear() + 1, 0, 1);
        break;
      default:
        period = format(currentDate, 'yyyy-MM-dd');
        nextDate = addDays(currentDate, 1);
    }
    
    if (!filledData[period]) {
      filledData[period] = { revenue: 0, contractorCost: 0, profit: 0, units: 0 };
    }
    
    currentDate = nextDate;
  }
  
  return filledData;
};

// Prepare revenue chart data
export const prepareRevenueData = (
  entries: WorkEntry[],
  billingCodes: BillingCode[],
  projects: Project[],
  startDate: Date,
  endDate: Date,
  groupBy: GroupByType
): ChartData[] => {
  // Group data by time period
  const groupedData = groupEntriesByTimeUnit(entries, billingCodes, projects, groupBy);
  
  // Fill in any missing periods for a continuous timeline
  const filledData = fillMissingPeriods(groupedData, startDate, endDate, groupBy);
  
  // Sort periods chronologically
  const sortedPeriods = Object.keys(filledData).sort((a, b) => {
    // Handle different format based on groupBy
    if (groupBy === 'month' && a.length === 7 && b.length === 7) {
      return a.localeCompare(b);
    }
    if (groupBy === 'year' && a.length === 4 && b.length === 4) {
      return a.localeCompare(b);
    }
    return new Date(a).getTime() - new Date(b).getTime();
  });
  
  // Calculate cumulative values and format
  let cumulativeRevenue = 0;
  let cumulativeProfit = 0;
  
  return sortedPeriods.map(period => {
    const { revenue, contractorCost, profit, units } = filledData[period];
    cumulativeRevenue += revenue;
    cumulativeProfit += profit;
    
    return {
      formattedDate: getFormattedLabel(period, groupBy),
      revenue,
      contractorCost,
      profit,
      cumulativeRevenue,
      cumulativeProfit,
      units
    };
  });
};

// Prepare production chart data
export const prepareProductionData = (
  entries: WorkEntry[],
  startDate: Date,
  endDate: Date,
  groupBy: GroupByType
): ChartData[] => {
  // Group data by time period
  const groupedData = groupEntriesByTimeUnit(entries, [], [], groupBy);
  
  // Fill in any missing periods for a continuous timeline
  const filledData = fillMissingPeriods(groupedData, startDate, endDate, groupBy);
  
  // Sort periods chronologically
  const sortedPeriods = Object.keys(filledData).sort((a, b) => {
    // Handle different format based on groupBy
    if (groupBy === 'month' && a.length === 7 && b.length === 7) {
      return a.localeCompare(b);
    }
    if (groupBy === 'year' && a.length === 4 && b.length === 4) {
      return a.localeCompare(b);
    }
    return new Date(a).getTime() - new Date(b).getTime();
  });
  
  // Calculate cumulative values and format
  let cumulativeUnits = 0;
  
  return sortedPeriods.map(period => {
    const { units } = filledData[period];
    cumulativeUnits += units;
    
    return {
      formattedDate: getFormattedLabel(period, groupBy),
      units,
      cumulativeUnits
    };
  });
};

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Format units measurements based on selected unit type
export const formatUnits = (value: number, unitType: BillingUnitType = 'foot'): string => {
  switch (unitType) {
    case 'foot':
      return `${new Intl.NumberFormat('en-US').format(value)} ft`;
    case 'meter':
      return `${new Intl.NumberFormat('en-US').format(value)} m`;
    case 'each':
      return `${new Intl.NumberFormat('en-US').format(value)}`;
    default:
      return `${new Intl.NumberFormat('en-US').format(value)} units`;
  }
};

// Legacy format for backward compatibility
export const formatFeet = (value: number): string => {
  return formatUnits(value, 'foot');
};

// Get a custom color based on project or billing code
export const getEntityColor = (id: string): string => {
  // Simple hash function to generate a consistent color
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate color hues spaced around the color wheel
  // Use blue/teal as base with variations
  const h = ((hash % 60) + 180) % 360; // Blues and greens (180-240)
  const s = 70 + (hash % 30); // 70-100% saturation
  const l = 45 + (hash % 15); // 45-60% lightness
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};
