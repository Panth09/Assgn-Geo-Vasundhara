import { useState, useCallback } from 'react';
import type { GeoProject, PaginationState, SortState, FilterState, ApiResponse } from '../types/index';

interface UseDataTableReturn {
  projects: GeoProject[];
  pagination: PaginationState;
  sort: SortState;
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
  
  setPageNumber: (page: number) => void;
  setPageSize: (size: number) => void;
  setSort: (field: keyof GeoProject, order: 'asc' | 'desc') => void;
  setFilters: (filters: FilterState) => void;
  loadData: (fetchFn: (p: number, ps: number, f: keyof GeoProject, o: 'asc' | 'desc', fil?: FilterState) => Promise<ApiResponse>) => void;
}

export const useDataTable = (): UseDataTableReturn => {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageNumber: 1,
    pageSize: 50,
    totalCount: 0,
  });
  const [sort, setSort] = useState<SortState>({ field: 'projectName', order: 'asc' });
  const [filters, setFilters] = useState<FilterState>({ projectName: '', status: 'All' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (fetchFn: (p: number, ps: number, f: keyof GeoProject, o: 'asc' | 'desc', fil?: FilterState) => Promise<ApiResponse>) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchFn(
          pagination.pageNumber,
          pagination.pageSize,
          sort.field,
          sort.order,
          filters
        );
        setProjects(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.pageNumber, pagination.pageSize, sort, filters]
  );

  const setPageNumber = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, pageNumber: page }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPagination(prev => ({ ...prev, pageNumber: 1, pageSize: size }));
  }, []);

  const setSortState = useCallback((field: keyof GeoProject, order: 'asc' | 'desc') => {
    setSort({ field, order });
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
  }, []);

  const setFiltersState = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
  }, []);

  return {
    projects,
    pagination,
    sort,
    filters,
    isLoading,
    error,
    setPageNumber,
    setPageSize,
    setSort: setSortState,
    setFilters: setFiltersState,
    loadData,
  };
};
