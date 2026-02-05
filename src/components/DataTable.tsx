import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  TableSortLabel,
  Chip,
} from '@mui/material';
import type { GeoProject, FilterState, SortState } from '../types/index';
import { formatDate } from '../utils/helpers';
import './DataTable.css';

interface DataTableProps {
  projects: GeoProject[];
  isLoading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  sort: SortState;
  filters: FilterState;
  selectedProjectId: string | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (field: keyof GeoProject, order: 'asc' | 'desc') => void;
  onFilterChange: (filters: FilterState) => void;
  onRowSelect: (projectId: string) => void;
}

const statusColors = {
  Active: '#4CAF50',
  Completed: '#2196F3',
  Pending: '#FF9800',
  'On Hold': '#F44336',
};

export const DataTable: React.FC<DataTableProps> = ({
  projects,
  isLoading,
  pageNumber,
  pageSize,
  totalCount,
  sort,
  filters,
  selectedProjectId,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  onRowSelect,
}) => {
  const handleSort = (field: keyof GeoProject) => {
    const newOrder = sort.field === field && sort.order === 'asc' ? 'desc' : 'asc';
    onSortChange(field, newOrder);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    onFilterChange({ ...filters, [name]: value });
  };

  const mobileVisibleColumns: (keyof GeoProject)[] = useMemo(
    () => ['projectName', 'status'],
    []
  );

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Filters */}
      <Box
        sx={{
          p: { xs: 1, sm: 2 },
          backgroundColor: '#f5f5f5',
          display: 'flex',
          gap: { xs: 1, sm: 2 },
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <TextField
          name="projectName"
          label="Search Projects"
          variant="outlined"
          size="small"
          value={filters.projectName}
          onChange={handleFilterChange}
          sx={{ minWidth: { xs: 120, sm: 200 }, fontSize: '0.875rem' }}
          placeholder="Project name..."
        />
        <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 150 } }}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={filters.status}
            onChange={(e) => handleFilterChange(e as any)}
            label="Status"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        overflowX: { xs: 'auto', sm: 'auto' }, 
        animation: 'fadeIn 0.4s ease-out', 
        width: '100%',
        '&::-webkit-scrollbar': {
          height: { xs: '8px', sm: '0px' },
        },
        '&::-webkit-scrollbar-track': {
          background: { xs: '#f1f1f1', sm: 'transparent' },
          display: { xs: 'block', sm: 'none' },
        },
        '&::-webkit-scrollbar-thumb': {
          background: { xs: 'linear-gradient(90deg, #FF6B6B, #FF8E72)', sm: 'transparent' },
          borderRadius: { xs: '4px', sm: '0px' },
          display: { xs: 'block', sm: 'none' },
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: { xs: 'linear-gradient(90deg, #FF8E72, #FFB84D)', sm: 'transparent' },
        },
      }}>
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {!isLoading && (
          <Table stickyHeader size="small" sx={{ width: '100%', '& td': { fontSize: { xs: '0.75rem', sm: '0.85rem' } } }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                {/* Mobile columns */}
                {mobileVisibleColumns.map(column => (
                  <TableCell
                    key={column}
                    sortDirection={sort.field === column ? sort.order : false}
                    sx={{
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      padding: { xs: '8px 4px', sm: '12px 8px' },
                      minWidth: column === 'projectName' ? '80px' : '70px',
                      display: { xs: 'table-cell', md: 'table-cell' },
                    }}
                  >
                    <TableSortLabel
                      active={sort.field === column}
                      direction={sort.order}
                      onClick={() => handleSort(column)}
                    >
                      {column === 'projectName' && 'Project'}
                      {column === 'status' && 'Status'}
                    </TableSortLabel>
                  </TableCell>
                ))}
                {/* Desktop only columns */}
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    padding: '12px 8px',
                    minWidth: '90px',
                    display: { xs: 'none', md: 'table-cell' },
                  }}
                >
                  <TableSortLabel
                    active={sort.field === 'latitude'}
                    direction={sort.order}
                    onClick={() => handleSort('latitude')}
                  >
                    Latitude
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    padding: '12px 8px',
                    minWidth: '90px',
                    display: { xs: 'none', md: 'table-cell' },
                  }}
                >
                  <TableSortLabel
                    active={sort.field === 'longitude'}
                    direction={sort.order}
                    onClick={() => handleSort('longitude')}
                  >
                    Longitude
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    padding: '12px 8px',
                    minWidth: '100px',
                    display: { xs: 'none', md: 'table-cell' },
                  }}
                >
                  <TableSortLabel
                    active={sort.field === 'lastUpdated'}
                    direction={sort.order}
                    onClick={() => handleSort('lastUpdated')}
                  >
                    Last Updated
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={mobileVisibleColumns.length + 3} align="center" sx={{ py: 3 }}>
                    No projects found
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project, index) => (
                  <TableRow
                    key={project.id}
                    hover
                    onClick={() => onRowSelect(project.id)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor:
                        selectedProjectId === project.id ? '#e3f2fd' : 'inherit',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                      animation: `slideIn 0.3s ease-out ${index * 0.02}s both`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {/* Mobile columns - always visible */}
                    <TableCell sx={{ padding: { xs: '8px 4px', sm: '10px 8px' } }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px' }}>
                        {project.projectName}
                      </span>
                    </TableCell>
                    <TableCell sx={{ padding: { xs: '8px 4px', sm: '10px 8px' } }}>
                      <Chip
                        label={project.status}
                        size="small"
                        sx={{
                          backgroundColor: statusColors[project.status as keyof typeof statusColors],
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.65rem', sm: '0.75rem' },
                          height: { xs: '20px', sm: '24px' },
                        }}
                      />
                    </TableCell>
                    {/* Desktop only columns */}
                    <TableCell sx={{ padding: { xs: '8px 4px', sm: '10px 8px' }, display: { xs: 'none', md: 'table-cell' } }}>
                      {project.latitude.toFixed(4)}
                    </TableCell>
                    <TableCell sx={{ padding: { xs: '8px 4px', sm: '10px 8px' }, display: { xs: 'none', md: 'table-cell' } }}>
                      {project.longitude.toFixed(4)}
                    </TableCell>
                    <TableCell sx={{ padding: { xs: '8px 4px', sm: '10px 8px' }, display: { xs: 'none', md: 'table-cell' } }}>
                      {formatDate(project.lastUpdated)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', sm: 'space-between' },
          alignItems: 'center',
          p: { xs: 1, sm: 2 },
          background: 'linear-gradient(90deg, #fafafa 0%, #f5f5f5 50%, #fafafa 100%)',
          borderTop: '2px solid #e0e0e0',
          animation: 'slideDown 0.4s ease-out',
          gap: { xs: 1, sm: 2 },
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ fontWeight: 'bold', color: '#333', fontSize: { xs: '0.75rem', sm: '1rem' } }}>
          Page <span style={{ color: '#FF6B6B', fontSize: '1rem', fontWeight: 'bold' }}>{pageNumber}</span> of{' '}
          <span style={{ color: '#4A90E2', fontSize: '1rem', fontWeight: 'bold' }}>{Math.ceil(totalCount / pageSize)}</span>
        </Box>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={pageSize}
          page={pageNumber - 1}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          onRowsPerPageChange={e => onPageSizeChange(Number(e.target.value))}
          sx={{
            padding: 0,
            '& .MuiIconButton-root': {
              transition: 'all 0.2s ease',
              padding: { xs: '4px', sm: '8px' },
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
              },
            },
            '& .MuiTablePagination-toolbar': {
              paddingRight: 0,
              minHeight: '44px',
            },
            '& .MuiTablePagination-selectLabel': {
              display: { xs: 'none', sm: 'block' },
            },
            '& .MuiTablePagination-displayedRows': {
              fontSize: { xs: '0.75rem', sm: '1rem' },
            },
          }}
        />
      </Box>
    </Box>
  );
};
