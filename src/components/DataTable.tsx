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

  const visibleColumns: (keyof GeoProject)[] = useMemo(
    () => ['projectName', 'latitude', 'longitude', 'status', 'lastUpdated'],
    []
  );

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Filters */}
      <Box
        sx={{
          p: 2,
          backgroundColor: '#f5f5f5',
          display: 'flex',
          gap: 2,
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
          sx={{ minWidth: 200 }}
          placeholder="Project name..."
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
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
      <TableContainer component={Paper} sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', animation: 'fadeIn 0.4s ease-out', width: '100%' }}>
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
          <Table stickyHeader size="small" sx={{ tableLayout: 'auto', width: '100%' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                {visibleColumns.map(column => (
                  <TableCell
                    key={column}
                    sortDirection={sort.field === column ? sort.order : false}
                    sx={{
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      padding: '12px 8px',
                      minWidth: column === 'projectName' ? '150px' : column === 'latitude' ? '90px' : column === 'longitude' ? '90px' : column === 'status' ? '80px' : '100px',
                    }}
                  >
                    <TableSortLabel
                      active={sort.field === column}
                      direction={sort.order}
                      onClick={() => handleSort(column)}
                    >
                      {column === 'projectName' && 'Project Name'}
                      {column === 'latitude' && 'Latitude'}
                      {column === 'longitude' && 'Longitude'}
                      {column === 'status' && 'Status'}
                      {column === 'lastUpdated' && 'Last Updated'}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length} align="center" sx={{ py: 3 }}>
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
                    <TableCell sx={{ wordBreak: 'break-word', fontSize: '0.85rem', padding: '10px 8px', whiteSpace: 'nowrap' }}>{project.projectName}</TableCell>
                    <TableCell sx={{ wordBreak: 'break-word', fontSize: '0.85rem', padding: '10px 8px', whiteSpace: 'nowrap' }}>{project.latitude.toFixed(4)}</TableCell>
                    <TableCell sx={{ wordBreak: 'break-word', fontSize: '0.85rem', padding: '10px 8px', whiteSpace: 'nowrap' }}>{project.longitude.toFixed(4)}</TableCell>
                    <TableCell sx={{ wordBreak: 'break-word', fontSize: '0.85rem', padding: '10px 8px', whiteSpace: 'nowrap' }}>
                      <Chip
                        label={project.status}
                        size="small"
                        sx={{
                          backgroundColor: statusColors[project.status as keyof typeof statusColors],
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ wordBreak: 'break-word', fontSize: '0.85rem', padding: '10px 8px', whiteSpace: 'nowrap' }}>{formatDate(project.lastUpdated)}</TableCell>
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
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          background: 'linear-gradient(90deg, #fafafa 0%, #f5f5f5 50%, #fafafa 100%)',
          borderTop: '2px solid #e0e0e0',
          animation: 'slideDown 0.4s ease-out',
        }}
      >
        <Box sx={{ fontWeight: 'bold', color: '#333' }}>
          Page <span style={{ color: '#FF6B6B', fontSize: '1.1rem', fontWeight: 'bold' }}>{pageNumber}</span> of{' '}
          <span style={{ color: '#4A90E2', fontSize: '1.1rem', fontWeight: 'bold' }}>{Math.ceil(totalCount / pageSize)}</span>
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
            '& .MuiIconButton-root': {
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
              },
            },
            '& .MuiTablePagination-toolbar': {
              paddingRight: 0,
            },
          }}
        />
      </Box>
    </Box>
  );
};
