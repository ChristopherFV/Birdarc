
import { addDays, subDays, format } from 'date-fns';
import { Project, BillingCode, TeamMember, WorkEntry, Company, InvoiceStatus } from '@/context/AppContext';

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

// Generate a past date formatted as YYYY-MM-DD
const generatePastDate = (maxDaysAgo: number = 60): string => {
  const daysAgo = randomNumber(1, maxDaysAgo);
  return format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
};

// Mock companies
export const mockCompanies: Company[] = [
  { id: 'comp-1', name: 'Fiber Network Solutions' },
  { id: 'comp-2', name: 'OptiConnect Systems' },
  { id: 'comp-3', name: 'LightSpeed Installations' }
];

// Enhanced mock projects with more Fieldvision-specific details
export const mockProjects: Project[] = [
  { 
    id: 'proj-1', 
    name: 'Downtown Fiber Expansion', 
    client: 'Metro City Council',
    status: 'Active',
    progress: 65,
    lastUpdated: generatePastDate(10),
    location: 'Downtown, Metro City',
    totalFootage: 15800,
    completedFootage: 10270,
    startDate: '2023-06-15',
    estimatedCompletion: '2023-10-30',
    budget: 478000,
    description: 'Expanding fiber network in downtown Metro City to improve connectivity for businesses and government buildings.'
  },
  { 
    id: 'proj-2', 
    name: 'Westside Business District', 
    client: 'Westside Development Corp',
    status: 'Active',
    progress: 42,
    lastUpdated: generatePastDate(5),
    location: 'Westside Business Park',
    totalFootage: 12500,
    completedFootage: 5250,
    startDate: '2023-07-20',
    estimatedCompletion: '2023-11-15',
    budget: 356000,
    description: 'Fiber installation for new business district development with 25 commercial buildings.'
  },
  { 
    id: 'proj-3', 
    name: 'North County Residential', 
    client: 'North County ISP',
    status: 'Planning',
    progress: 12,
    lastUpdated: generatePastDate(3),
    location: 'North County Subdivision',
    totalFootage: 22000,
    completedFootage: 2640,
    startDate: '2023-08-05',
    estimatedCompletion: '2024-02-28',
    budget: 625000,
    description: 'Residential fiber deployment across 450 homes in North County subdivision.'
  },
  { 
    id: 'proj-4', 
    name: 'Industrial Park Network', 
    client: 'Industrial Growth Partners',
    status: 'Completed',
    progress: 100,
    lastUpdated: generatePastDate(25),
    location: 'Eastside Industrial Zone',
    totalFootage: 8500,
    completedFootage: 8500,
    startDate: '2023-05-10',
    estimatedCompletion: '2023-07-31',
    budget: 295000,
    description: 'Complete fiber network installation for industrial park with specialized requirements for manufacturing facilities.'
  },
  { 
    id: 'proj-5', 
    name: 'University Campus Upgrade', 
    client: 'State University System',
    status: 'Active',
    progress: 78,
    lastUpdated: generatePastDate(7),
    location: 'State University Main Campus',
    totalFootage: 18200,
    completedFootage: 14196,
    startDate: '2023-06-01',
    estimatedCompletion: '2023-09-30',
    budget: 512000,
    description: 'Upgrading existing fiber infrastructure across university campus to support advanced research requirements.'
  },
  { 
    id: 'proj-6', 
    name: 'Medical Center Network', 
    client: 'Regional Healthcare System',
    status: 'Active',
    progress: 55,
    lastUpdated: generatePastDate(4),
    location: 'Regional Medical Center',
    totalFootage: 9600,
    completedFootage: 5280,
    startDate: '2023-07-12',
    estimatedCompletion: '2023-10-15',
    budget: 380000,
    description: 'High-capacity fiber network for medical imaging and healthcare data transmission across hospital complex.'
  },
  { 
    id: 'proj-7', 
    name: 'Government Complex', 
    client: 'County Administration',
    status: 'On Hold',
    progress: 35,
    lastUpdated: generatePastDate(15),
    location: 'County Government Center',
    totalFootage: 6800,
    completedFootage: 2380,
    startDate: '2023-06-22',
    estimatedCompletion: '2023-11-30',
    budget: 255000,
    description: 'Secure fiber network installation for county government buildings with redundant pathways.'
  },
  { 
    id: 'proj-8', 
    name: 'South Harbor Marina', 
    client: 'Marina Development Authority',
    status: 'Planning',
    progress: 8,
    lastUpdated: generatePastDate(2),
    location: 'South Harbor Waterfront',
    totalFootage: 5400,
    completedFootage: 432,
    startDate: '2023-09-01',
    estimatedCompletion: '2023-12-15',
    budget: 185000,
    description: 'Weather-resistant fiber network for marina facilities with specialized marine environment protections.'
  }
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
    
    // Randomly assign invoice status
    const invoiceStatusOptions: InvoiceStatus[] = ['not_invoiced', 'invoiced', 'paid'];
    const invoiceStatus = invoiceStatusOptions[randomNumber(0, 2)];
    
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
      companyId,
      invoiceStatus
    });
  }
  
  // Sort entries by date (newest first)
  return entries.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const mockWorkEntries = generateWorkEntries();
