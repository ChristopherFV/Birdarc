
import { addDays, subDays, format } from 'date-fns';
import { Project, BillingCode, TeamMember, WorkEntry, Company } from '@/context/AppContext';

// Helper to generate dates within a range
const generateDateBetween = (startDate: Date, endDate: Date): string => {
  const timeDiff = endDate.getTime() - startDate.getTime();
  const randomTime = Math.random() * timeDiff;
  const randomDate = new Date(startDate.getTime() + randomTime);
  return format(randomDate, 'yyyy-MM-dd');
};

// Generate random number between min and max
const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Mock companies
export const mockCompanies: Company[] = [
  { id: 'comp-1', name: 'Fiber Network Solutions' },
  { id: 'comp-2', name: 'OptiConnect Systems' },
  { id: 'comp-3', name: 'LightSpeed Installations' }
];

// Mock projects
export const mockProjects: Project[] = [
  { id: 'proj-1', name: 'Downtown Fiber Expansion', client: 'Metro City Council' },
  { id: 'proj-2', name: 'Westside Business District', client: 'Westside Development Corp' },
  { id: 'proj-3', name: 'North County Residential', client: 'North County ISP' },
  { id: 'proj-4', name: 'Industrial Park Network', client: 'Industrial Growth Partners' },
  { id: 'proj-5', name: 'University Campus Upgrade', client: 'State University System' }
];

// Mock billing codes
export const mockBillingCodes: BillingCode[] = [
  { id: 'code-1', code: 'UG-STD', description: 'Underground Standard Installation', ratePerFoot: 8.50 },
  { id: 'code-2', code: 'UG-CPLX', description: 'Underground Complex Installation', ratePerFoot: 12.75 },
  { id: 'code-3', code: 'AER-STD', description: 'Aerial Standard Installation', ratePerFoot: 6.25 },
  { id: 'code-4', code: 'AER-CPLX', description: 'Aerial Complex Installation', ratePerFoot: 9.50 },
  { id: 'code-5', code: 'DIR-BORE', description: 'Directional Boring', ratePerFoot: 15.00 },
  { id: 'code-6', code: 'SPLICING', description: 'Fiber Splicing', ratePerFoot: 20.00 }
];

// Mock team members
export const mockTeamMembers: TeamMember[] = [
  { id: 'tm-1', name: 'Alex Johnson', role: 'Lead Installer' },
  { id: 'tm-2', name: 'Sam Rodriguez', role: 'Fiber Technician' },
  { id: 'tm-3', name: 'Jordan Smith', role: 'Equipment Operator' },
  { id: 'tm-4', name: 'Casey Williams', role: 'Installer' },
  { id: 'tm-5', name: 'Taylor Brown', role: 'Splice Technician' }
];

// Generate mock work entries (90 days of data)
const generateWorkEntries = (): WorkEntry[] => {
  const entries: WorkEntry[] = [];
  const endDate = new Date();
  const startDate = subDays(endDate, 90);
  
  // Generate between 200-300 entries
  const entryCount = randomNumber(200, 300);
  
  for (let i = 0; i < entryCount; i++) {
    const date = generateDateBetween(startDate, endDate);
    const projectId = mockProjects[randomNumber(0, mockProjects.length - 1)].id;
    const billingCodeId = mockBillingCodes[randomNumber(0, mockBillingCodes.length - 1)].id;
    const teamMemberId = mockTeamMembers[randomNumber(0, mockTeamMembers.length - 1)].id;
    const companyId = mockCompanies[randomNumber(0, mockCompanies.length - 1)].id;
    
    // More realistic feet values based on billing code
    let feetCompleted = 0;
    switch (billingCodeId) {
      case 'code-1': // Underground Standard
        feetCompleted = randomNumber(100, 500);
        break;
      case 'code-2': // Underground Complex
        feetCompleted = randomNumber(75, 300);
        break;
      case 'code-3': // Aerial Standard
        feetCompleted = randomNumber(200, 800);
        break;
      case 'code-4': // Aerial Complex
        feetCompleted = randomNumber(100, 400);
        break;
      case 'code-5': // Directional Boring
        feetCompleted = randomNumber(50, 200);
        break;
      case 'code-6': // Splicing
        feetCompleted = randomNumber(10, 50);
        break;
      default:
        feetCompleted = randomNumber(100, 500);
    }
    
    entries.push({
      id: `entry-${i + 1}`,
      date,
      projectId,
      billingCodeId,
      feetCompleted,
      teamMemberId,
      companyId
    });
  }
  
  // Sort entries by date (newest first)
  return entries.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const mockWorkEntries = generateWorkEntries();
