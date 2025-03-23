
// Generate 100 random project locations across the United States
// These coordinates roughly cover the continental United States
export const generateMockProjectLocations = (count: number = 100) => {
  // Boundaries for continental US
  const minLat = 24.396308; // Southern tip of Florida
  const maxLat = 49.384358; // Northern border with Canada
  const minLng = -125.000000; // Western coast
  const maxLng = -66.934570; // Eastern coast

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

  const statusOptions = ['planned', 'in-progress', 'completed', 'delayed'];
  const priorityOptions = ['low', 'medium', 'high'];

  const generateRandomLocation = () => {
    const lat = minLat + Math.random() * (maxLat - minLat);
    const lng = minLng + Math.random() * (maxLng - minLng);
    const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const priority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
    
    return {
      id: `proj-${Math.floor(Math.random() * 100000)}`,
      lat,
      lng,
      title: `${projectType} Project`,
      type: projectType,
      status,
      priority,
      size: Math.floor(Math.random() * 5000) + 500, // Project size in feet
    };
  };

  const locations = [];
  for (let i = 0; i < count; i++) {
    locations.push(generateRandomLocation());
  }

  return locations;
};

export const mockProjectLocations = generateMockProjectLocations(100);
