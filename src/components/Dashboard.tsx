import React, { useEffect, useState, useCallback } from 'react';
import { Box, Container, Paper, Typography, Alert, Stack, Button } from '@mui/material';
import { DataTable } from './DataTable';
import { MapComponent } from './MapComponent';
import { useDataTable } from '../hooks/useDataTable';
import { mockApi } from '../api/mockApi';
import './Dashboard.css';

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
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', animation: 'fadeInApp 0.8s ease-out' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 25%, #FFB84D 50%, #52C6B6 75%, #4A90E2 100%)',
          color: 'white',
          p: 2.5,
          boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
          animation: 'slideDownHeader 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Container maxWidth="lg" disableGutters sx={{ width: '100%', maxWidth: '100%', px: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                🗺️ India Geo Data Dashboard
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.95, letterSpacing: '0.5px' }}>
                Interactive visualization of spatial data across India with real-time synchronization
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', background: 'rgba(255,255,255,0.15)', px: 2, py: 1, borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#FFE66D', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                Page {pagination.pageNumber}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {pagination.pageSize} items per page
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          py: 2,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          width: '100%',
          minHeight: 0,
          animation: 'fadeIn 0.8s ease-out 0.2s both, pageTransition 0.5s ease-in-out',
        }}
      >
        {error && <Alert severity="error" sx={{ mb: 2, animation: 'slideDown 0.4s ease-out' }}>{error}</Alert>}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          {/* Data Table */}
          <Box sx={{ flex: 1, overflow: 'hidden', minWidth: 0, minHeight: 0, animation: 'slideInLeft 0.6s ease-out' }}>
            <Paper
              elevation={2}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ p: 2, background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)', borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.3px' }}>
                  📊 Projects ({pagination.totalCount} total)
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
          <Box sx={{ flex: 1, overflow: 'hidden', minWidth: 0, minHeight: 0, animation: 'slideInRight 0.6s ease-out', display: 'flex', flexDirection: 'column' }}>
            <Paper
              elevation={2}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ p: 2, background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)', borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.3px' }}>
                  🗺️ Map View
                  {selectedProjectId && (
                    <Typography variant="caption" sx={{ ml: 1, color: '#FF9800', fontWeight: 'bold', animation: 'pulse 1.5s ease-in-out infinite' }}>
                      ★ {selectedProjectId}
                    </Typography>
                  )}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, overflow: 'hidden', minHeight: 0, width: '100%' }}>
                <MapComponent
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onMarkerClick={handleMarkerClick}
                />
              </Box>
            </Paper>
          </Box>
        </Stack>
      </Box>

      {/* Footer with Page Navigation */}
      <Box
        sx={{
          background: 'linear-gradient(90deg, #ffffff 0%, #f9f9f9 50%, #ffffff 100%)',
          borderTop: '3px solid #FF6B6B',
          p: 2,
          textAlign: 'center',
          animation: 'slideUpFooter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Button
            variant="contained"
            onClick={() => setPageNumber(Math.max(1, pagination.pageNumber - 1))}
            disabled={pagination.pageNumber === 1}
            sx={{
              background: pagination.pageNumber === 1 ? '#d0d0d0' : 'linear-gradient(135deg, #FF6B6B, #FF8E72)',
              color: 'white',
              fontWeight: 'bold',
              padding: '8px 16px',
              fontSize: '0.9rem',
              borderRadius: '8px',
              '&:hover': {
                background: pagination.pageNumber === 1 ? '#d0d0d0' : 'linear-gradient(135deg, #FF8E72, #FFB84D)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(255, 107, 107, 0.3)',
              },
            }}
          >
            ← Previous
          </Button>

          <Box sx={{
            display: 'flex',
            gap: 0.5,
            alignItems: 'center',
            px: 1.5,
            py: 0.5,
            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(74, 144, 226, 0.1) 100%)',
            borderRadius: '8px',
            border: '2px solid #FF6B6B',
          }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FF6B6B', minWidth: '25px', textAlign: 'center' }}>
              {pagination.pageNumber}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>/</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4A90E2', minWidth: '25px', textAlign: 'center' }}>
              {Math.ceil(pagination.totalCount / pagination.pageSize)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => setPageNumber(pagination.pageNumber + 1)}
            disabled={pagination.pageNumber >= Math.ceil(pagination.totalCount / pagination.pageSize)}
            sx={{
              background: pagination.pageNumber >= Math.ceil(pagination.totalCount / pagination.pageSize) ? '#d0d0d0' : 'linear-gradient(135deg, #52C6B6, #4A90E2)',
              color: 'white',
              fontWeight: 'bold',
              padding: '8px 16px',
              fontSize: '0.9rem',
              borderRadius: '8px',
              '&:hover': {
                background: pagination.pageNumber >= Math.ceil(pagination.totalCount / pagination.pageSize) ? '#d0d0d0' : 'linear-gradient(135deg, #4A90E2, #FF6B6B)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(74, 144, 226, 0.3)',
              },
            }}
          >
            Next →
          </Button>
        </Box>

        <Typography variant="caption" sx={{ fontWeight: 500, color: '#555', letterSpacing: '0.5px' }}>
          ✨ Displaying <span style={{ fontWeight: 'bold', color: '#FF6B6B' }}>{projects.length}</span> of <span style={{ fontWeight: 'bold', color: '#4A90E2' }}>{pagination.totalCount}</span> projects • <span style={{ color: '#FFB84D', fontWeight: 'bold' }}>📄 Page {pagination.pageNumber}</span>
        </Typography>
      </Box>
    </Box>
  );
};

