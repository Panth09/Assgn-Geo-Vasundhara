import React, { useEffect, useState, useCallback } from 'react';
import { Box, Container, Paper, Typography, Alert, Stack } from '@mui/material';
import { DataTable } from './DataTable';
import { MapComponent } from './MapComponent';
import { useDataTable } from '../hooks/useDataTable';
import { mockApi } from '../api/mockApi';

export const Dashboard: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const {
    projects,
    pagination,
    sort,
    filters,
    isLoading,
    error,
    setPageNumber,
    setPageSize,
    setSort,
    setFilters,
    loadData,
  } = useDataTable();

  // Initial data load
  useEffect(() => {
    loadData(mockApi.fetchProjects);
  }, []);

  // Reload data when pagination, sort, or filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(mockApi.fetchProjects);
    }, 300); // Debounce to avoid too many requests

    return () => clearTimeout(timer);
  }, [pagination.pageNumber, pagination.pageSize, sort, filters, loadData]);

  // Handle row selection
  const handleRowSelect = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
  }, []);

  // Handle marker click - if marker is on different page, we need to navigate
  const handleMarkerClick = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProjectId(projectId);
    }
  }, [projects]);

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          p: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            🗺️ Geo Data Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
            Interactive visualization of spatial data with advanced filtering and synchronization
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ flex: 1, overflow: 'hidden' }}>
          {/* Data Table */}
          <Box sx={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
            <Paper
              elevation={2}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6">
                  Projects ({pagination.totalCount} total)
                </Typography>
              </Box>
              <DataTable
                projects={projects}
                isLoading={isLoading}
                pageNumber={pagination.pageNumber}
                pageSize={pagination.pageSize}
                totalCount={pagination.totalCount}
                sort={sort}
                filters={filters}
                selectedProjectId={selectedProjectId}
                onPageChange={setPageNumber}
                onPageSizeChange={setPageSize}
                onSortChange={setSort}
                onFilterChange={setFilters}
                onRowSelect={handleRowSelect}
              />
            </Paper>
          </Box>

          {/* Map */}
          <Box sx={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
            <Paper
              elevation={2}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6">
                  Map View
                  {selectedProjectId && (
                    <Typography variant="caption" sx={{ ml: 1, color: '#FF9800' }}>
                      (Selected: {selectedProjectId})
                    </Typography>
                  )}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <MapComponent
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onMarkerClick={handleMarkerClick}
                />
              </Box>
            </Paper>
          </Box>
        </Stack>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #e0e0e0',
          p: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="textSecondary">
          Displaying {projects.length} of {pagination.totalCount} projects • Page {pagination.pageNumber}
        </Typography>
      </Box>
    </Box>
  );
};

