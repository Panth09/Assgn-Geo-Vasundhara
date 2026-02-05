import type { GeoProject, ApiResponse, FilterState } from '../types/index';

// Generate mock data for 5k+ projects
const generateMockProjects = (count: number): GeoProject[] => {
  const statuses: Array<'Active' | 'Completed' | 'Pending' | 'On Hold'> = ['Active', 'Completed', 'Pending', 'On Hold'];
  const regions = [
    { name: 'North', latRange: [35, 40], lonRange: [-120, -110] },
    { name: 'South', latRange: [25, 30], lonRange: [-100, -85] },
    { name: 'East', latRange: [40, 45], lonRange: [-80, -70] },
    { name: 'West', latRange: [37, 42], lonRange: [-125, -120] },
    { name: 'Central', latRange: [38, 42], lonRange: [-95, -85] },
  ];

  const projects: GeoProject[] = [];

  for (let i = 0; i < count; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const lat = region.latRange[0] + Math.random() * (region.latRange[1] - region.latRange[0]);
    const lon = region.lonRange[0] + Math.random() * (region.lonRange[1] - region.lonRange[0]);

    projects.push({
      id: `PRJ-${String(i + 1).padStart(6, '0')}`,
      projectName: `${region.name} Project ${i + 1}`,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lon.toFixed(6)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastUpdated: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `Project in ${region.name} region`,
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
