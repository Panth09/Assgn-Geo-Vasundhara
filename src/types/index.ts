export interface GeoProject {
  id: string;
  projectName: string;
  latitude: number;
  longitude: number;
  status: 'Active' | 'Completed' | 'Pending' | 'On Hold';
  lastUpdated: string;
  description?: string;
  budget?: number;
  progress?: number;
}

export interface PaginationState {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export interface SortState {
  field: keyof GeoProject;
  order: 'asc' | 'desc';
}

export interface FilterState {
  projectName: string;
  status: string;
}

export interface ApiResponse {
  data: GeoProject[];
  pagination: PaginationState;
}
