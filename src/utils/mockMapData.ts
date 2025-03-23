
// Generate 20 random task locations across the United States
// These coordinates precisely cover only the continental United States
export const generateMockProjectLocations = (count: number = 20) => {
  // More precise boundaries for continental US to avoid tasks in the ocean
  const minLat = 30.0; // Southern border (excluding southern Florida)
  const maxLat = 47.0; // Northern border with Canada
  const minLng = -119.0; // Western coast (avoiding coastal waters)
  const maxLng = -75.0; // Eastern coast (avoiding coastal waters)

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

  const generateRandomLocation = () => {
    const lat = minLat + Math.random() * (maxLat - minLat);
    const lng = minLng + Math.random() * (maxLng - minLng);
    const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const priority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
    
    return {
      id: `task-${Math.floor(Math.random() * 100000)}`,
      title: `${projectType} Task`,
      description: `${projectType} task in location with coordinates ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      location: {
        address: `Location in the US (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        lat,
        lng
      },
      startDate: new Date(),
      endDate: new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000),
      projectId: `proj-${Math.floor(Math.random() * 10)}`,
      teamMemberId: null,
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
