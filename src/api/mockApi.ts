import type { GeoProject, ApiResponse, FilterState } from '../types/index';

// Generate mock data for 5k+ projects with Indian locations
const generateMockProjects = (count: number): GeoProject[] => {
  const statuses: Array<'Active' | 'Completed' | 'Pending' | 'On Hold'> = ['Active', 'Completed', 'Pending', 'On Hold'];
  
  // Indian regions with coordinates
  const regions = [
    { name: 'North', city: 'Delhi', latRange: [28.4, 28.8], lonRange: [77.0, 77.4] },
    { name: 'North', city: 'Punjab', latRange: [31.0, 32.0], lonRange: [74.5, 76.5] },
    { name: 'South', city: 'Bangalore', latRange: [12.8, 13.2], lonRange: [77.5, 77.9] },
    { name: 'South', city: 'Chennai', latRange: [12.8, 13.2], lonRange: [80.1, 80.5] },
    { name: 'South', city: 'Hyderabad', latRange: [17.3, 17.5], lonRange: [78.4, 78.6] },
    { name: 'East', city: 'Kolkata', latRange: [22.5, 22.6], lonRange: [88.3, 88.5] },
    { name: 'East', city: 'Patna', latRange: [25.5, 25.7], lonRange: [85.1, 85.3] },
    { name: 'West', city: 'Mumbai', latRange: [19.0, 19.3], lonRange: [72.8, 73.0] },
    { name: 'West', city: 'Pune', latRange: [18.5, 18.6], lonRange: [73.8, 73.9] },
    { name: 'West', city: 'Ahmedabad', latRange: [23.0, 23.2], lonRange: [72.5, 72.7] },
    { name: 'Central', city: 'Indore', latRange: [22.7, 22.8], lonRange: [75.8, 75.9] },
    { name: 'Central', city: 'Nagpur', latRange: [21.1, 21.2], lonRange: [79.0, 79.2] },
  ];

  const industries = [
    'IT & Software',
    'Manufacturing',
    'Healthcare',
    'Renewable Energy',
    'Transportation',
    'Agriculture',
    'Real Estate',
    'Retail',
    'Finance',
    'Education',
  ];

  const projects: GeoProject[] = [];

  for (let i = 0; i < count; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const lat = region.latRange[0] + Math.random() * (region.latRange[1] - region.latRange[0]);
    const lon = region.lonRange[0] + Math.random() * (region.lonRange[1] - region.lonRange[0]);

    projects.push({
      id: `IND-${String(i + 1).padStart(6, '0')}`,
      projectName: `${region.city} ${industries[Math.floor(Math.random() * industries.length)]} Project ${i + 1}`,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lon.toFixed(6)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastUpdated: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `Strategic project in ${region.city}, ${region.name} India`,
      budget: Math.floor(Math.random() * 5000000) + 100000,
      progress: Math.floor(Math.random() * 100),
    });
  }

  return projects;
};

// Store all projects in memory
const allProjects = generateMockProjects(5000);

// Mock API implementation
export const mockApi = {
  fetchProjects: async (
    pageNumber: number,
    pageSize: number,
    sortField: keyof GeoProject = 'projectName',
    sortOrder: 'asc' | 'desc' = 'asc',
    filters?: FilterState
  ): Promise<ApiResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filtered = [...allProjects];

    // Apply filters
    if (filters) {
      if (filters.projectName) {
        filtered = filtered.filter(p =>
          p.projectName.toLowerCase().includes(filters.projectName.toLowerCase())
        );
      }
      if (filters.status && filters.status !== 'All') {
        filtered = filtered.filter(p => p.status === filters.status);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }

      return sortOrder === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    // Apply pagination
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        pageNumber,
        pageSize,
        totalCount: filtered.length,
      },
    };
  },

  getProjectById: async (id: string): Promise<GeoProject | null> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return allProjects.find(p => p.id === id) || null;
  },
};
