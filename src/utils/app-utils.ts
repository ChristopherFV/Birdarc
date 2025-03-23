
import { format } from 'date-fns';
import { BillingCode, WorkEntry, Project, TeamMember, GeoJsonFeatureProperties } from '../types/app-types';

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

// Generate a work entry report from a GeoJSON feature
export const generateWorkEntryFromGeoJson = (
  feature: any, 
  billingCodes: BillingCode[], 
  teamMembers: TeamMember[]
): Partial<WorkEntry> | null => {
  if (!feature.properties) return null;
  
  const properties = feature.properties as GeoJsonFeatureProperties;
  
  // Skip if required data is missing
  if (!properties.billingCodeId || !properties.projectId) {
    return null;
  }
  
  // Calculate feet completed based on feature type and geometry
  let feetCompleted = 0;
  
  if (feature.geometry.type === 'LineString' && feature.geometry.coordinates) {
    // For lines, calculate length
    feetCompleted = calculateLineStringLength(feature.geometry.coordinates);
  } else if (feature.geometry.type === 'Point') {
    // For points, use 1 unit (e.g., splice point)
    feetCompleted = 1;
  } else if (feature.geometry.type === 'Polygon') {
    // For polygons, could calculate area or perimeter
    feetCompleted = calculatePolygonPerimeter(feature.geometry.coordinates[0]); 
  }
  
  // Extract coordinates for location data
  const locationData = extractLocationData(feature.geometry);
  
  // Create work entry
  return {
    projectId: properties.projectId,
    billingCodeId: properties.billingCodeId,
    feetCompleted: feetCompleted,
    teamMemberId: properties.teamMemberId || teamMembers[0]?.id || '',
    date: properties.completedDate || new Date().toISOString().split('T')[0],
    invoiceStatus: 'not_invoiced',
    geoJsonId: properties.id,
    locationData
  };
};

// Calculate length of a LineString in feet (simplified)
export const calculateLineStringLength = (coordinates: number[][]): number => {
  // Simple implementation - for a real app, use a proper geodesic calculation
  let totalLengthFeet = 0;
  
  for (let i = 1; i < coordinates.length; i++) {
    const [lng1, lat1] = coordinates[i - 1];
    const [lng2, lat2] = coordinates[i];
    
    // Very simplified distance calculation (not accurate for real-world use)
    // Convert to proper feet calculation for production
    const dx = (lng2 - lng1) * 53000; // rough conversion for longitude
    const dy = (lat2 - lat1) * 69000; // rough conversion for latitude
    const segmentLengthFeet = Math.sqrt(dx * dx + dy * dy);
    
    totalLengthFeet += segmentLengthFeet;
  }
  
  return Math.round(totalLengthFeet);
};

// Calculate perimeter of a Polygon in feet (simplified)
export const calculatePolygonPerimeter = (coordinates: number[][]): number => {
  let perimeter = 0;
  
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lng1, lat1] = coordinates[i];
    const [lng2, lat2] = coordinates[i + 1];
    
    // Very simplified distance calculation (not accurate for real-world use)
    const dx = (lng2 - lng1) * 53000; // rough conversion
    const dy = (lat2 - lat1) * 69000; // rough conversion
    const segmentLength = Math.sqrt(dx * dx + dy * dy);
    
    perimeter += segmentLength;
  }
  
  return Math.round(perimeter);
};

// Extract location data from a GeoJSON geometry
export const extractLocationData = (geometry: any): { lat: number, lng: number, address?: string } | undefined => {
  if (!geometry || !geometry.coordinates) return undefined;
  
  if (geometry.type === 'Point') {
    const [lng, lat] = geometry.coordinates;
    return { lng, lat };
  } else if (geometry.type === 'LineString' && geometry.coordinates.length > 0) {
    // Use the first point of the line
    const [lng, lat] = geometry.coordinates[0];
    return { lng, lat };
  } else if (geometry.type === 'Polygon' && geometry.coordinates.length > 0 && geometry.coordinates[0].length > 0) {
    // Use the first point of the polygon
    const [lng, lat] = geometry.coordinates[0][0];
    return { lng, lat };
  }
  
  return undefined;
};

// Generate a summary report from GeoJSON features
export const generateGeoJsonReport = (
  features: any[], 
  billingCodes: BillingCode[], 
  projects: Project[]
): any => {
  const summary = {
    totalFeatures: features.length,
    completedFeatures: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    byProject: {} as Record<string, {
      name: string,
      features: number,
      completed: number,
      footage: number,
      revenue: number,
      cost: number,
      profit: number
    }>
  };
  
  features.forEach(feature => {
    const properties = feature.properties as GeoJsonFeatureProperties;
    if (!properties) return;
    
    const projectId = properties.projectId;
    if (!projectId) return;
    
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Initialize project summary if not exists
    if (!summary.byProject[projectId]) {
      summary.byProject[projectId] = {
        name: project.name,
        features: 0,
        completed: 0,
        footage: 0,
        revenue: 0,
        cost: 0,
        profit: 0
      };
    }
    
    // Update project summary
    summary.byProject[projectId].features += 1;
    
    // Calculate footage based on geometry
    let footage = 0;
    if (feature.geometry.type === 'LineString') {
      footage = calculateLineStringLength(feature.geometry.coordinates);
    } else if (feature.geometry.type === 'Polygon') {
      footage = calculatePolygonPerimeter(feature.geometry.coordinates[0]);
    } else if (feature.geometry.type === 'Point') {
      footage = 1; // Each point counts as 1 unit
    }
    
    summary.byProject[projectId].footage += footage;
    
    // Handle completed features
    if (properties.completed) {
      summary.completedFeatures += 1;
      summary.byProject[projectId].completed += 1;
      
      // Calculate revenue and cost for completed features
      const billingCode = billingCodes.find(code => code.id === properties.billingCodeId);
      if (billingCode) {
        const revenue = footage * billingCode.ratePerFoot;
        let cost = 0;
        
        if (project.useContractor && project.contractorHourlyRate) {
          cost = revenue * (1 - project.contractorHourlyRate / 100);
        }
        
        const profit = revenue - cost;
        
        // Update totals
        summary.totalRevenue += revenue;
        summary.totalCost += cost;
        summary.totalProfit += profit;
        
        // Update project totals
        summary.byProject[projectId].revenue += revenue;
        summary.byProject[projectId].cost += cost;
        summary.byProject[projectId].profit += profit;
      }
    }
  });
  
  return summary;
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
