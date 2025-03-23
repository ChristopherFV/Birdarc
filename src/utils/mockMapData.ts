
import { mockProjects, mockTeamMembers } from './mockData';

// Generate 20 random task locations across the United States with real addresses
export const generateMockProjectLocations = (count: number = 20) => {
  // More precise boundaries for continental US to avoid tasks in the ocean
  const minLat = 30.0; // Southern border (excluding southern Florida)
  const maxLat = 47.0; // Northern border with Canada
  const minLng = -119.0; // Western coast (avoiding coastal waters)
  const maxLng = -75.0; // Eastern coast (avoiding coastal waters)

  // Real cities across the continental US
  const cities = [
    { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321 },
    { name: 'Portland, OR', lat: 45.5152, lng: -122.6784 },
    { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
    { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
    { name: 'San Diego, CA', lat: 32.7157, lng: -117.1611 },
    { name: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740 },
    { name: 'Denver, CO', lat: 39.7392, lng: -104.9903 },
    { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970 },
    { name: 'Austin, TX', lat: 30.2672, lng: -97.7431 },
    { name: 'Houston, TX', lat: 29.7604, lng: -95.3698 },
    { name: 'Minneapolis, MN', lat: 44.9778, lng: -93.2650 },
    { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
    { name: 'St. Louis, MO', lat: 38.6270, lng: -90.1994 },
    { name: 'Nashville, TN', lat: 36.1627, lng: -86.7816 },
    { name: 'Atlanta, GA', lat: 33.7490, lng: -84.3880 },
    { name: 'Miami, FL', lat: 25.7617, lng: -80.1918 },
    { name: 'Washington, DC', lat: 38.9072, lng: -77.0369 },
    { name: 'Philadelphia, PA', lat: 39.9526, lng: -75.1652 },
    { name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
    { name: 'Boston, MA', lat: 42.3601, lng: -71.0589 }
  ];

  // Specific street addresses for each city
  const streetNames = [
    'Main St', 'Oak Ave', 'Maple Dr', 'Cedar Blvd', 'Pine Lane',
    'Washington Ave', 'Lincoln St', 'Jefferson Rd', 'Park Ave', 'Lake Dr',
    'River Rd', 'Mountain View', 'Sunset Blvd', 'Highland Ave', 'Valley Rd',
    'Forest Dr', 'Meadow Lane', 'Spring St', 'Summer Ave', 'Winter Blvd'
  ];

  const projectTypes = [
    'Fiber Installation',
    'Site Survey',
    'Maintenance',
    'Network Expansion',
    'Equipment Upgrade',
    'Infrastructure Repair',
    'New Construction',
    'Service Connection'
  ];

  const statusOptions = ['pending', 'in_progress', 'completed', 'cancelled'];
  const priorityOptions = ['low', 'medium', 'high'];

  // Get projects and team members from mockData
  const projects = mockProjects;
  const teamMembers = mockTeamMembers;

  const generateRandomLocation = () => {
    // Select a random city
    const city = cities[Math.floor(Math.random() * cities.length)];
    // Generate a random street number
    const streetNumber = Math.floor(Math.random() * 1900) + 100;
    // Select a random street name
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    // Create a full address
    const address = `${streetNumber} ${streetName}, ${city.name}`;
    
    // Slightly adjust coordinates for variety within the city
    const latOffset = (Math.random() * 0.04) - 0.02;
    const lngOffset = (Math.random() * 0.04) - 0.02;
    const lat = city.lat + latOffset;
    const lng = city.lng + lngOffset;
    
    const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const priority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
    
    // Select a random project and team member
    const project = projects[Math.floor(Math.random() * projects.length)];
    const teamMember = teamMembers[Math.floor(Math.random() * teamMembers.length)];
    
    return {
      id: `task-${Math.floor(Math.random() * 100000)}`,
      title: `${projectType} Task`,
      description: `${projectType} task at ${address}`,
      location: {
        address: address,
        lat,
        lng
      },
      startDate: new Date(),
      endDate: new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000),
      projectId: project.id,
      projectName: project.name,
      teamMemberId: teamMember.id,
      teamMemberName: teamMember.name,
      priority: priority,
      status: status,
      billingCodeId: `bc-${Math.floor(Math.random() * 5) + 1}`,
      quantityEstimate: Math.floor(Math.random() * 100) + 10
    };
  };

  const locations = [];
  for (let i = 0; i < count; i++) {
    locations.push(generateRandomLocation());
  }

  return locations;
};

export const mockProjectLocations = generateMockProjectLocations(20);
