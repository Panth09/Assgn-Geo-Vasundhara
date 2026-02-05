import { useMemo } from 'react';
import type { GeoProject } from '../types/index';

// Virtualization utility for rendering large lists efficiently
export const useVirtualization = (
  items: GeoProject[],
  itemHeight: number,
  containerHeight: number,
  scrollPosition: number
) => {
  return useMemo(() => {
    const visibleStartIndex = Math.floor(scrollPosition / itemHeight);
    const visibleEndIndex = Math.ceil((scrollPosition + containerHeight) / itemHeight);

    return {
      visibleStartIndex: Math.max(0, visibleStartIndex),
      visibleEndIndex: Math.min(items.length, visibleEndIndex),
      offsetY: visibleStartIndex * itemHeight,
    };
  }, [items.length, itemHeight, containerHeight, scrollPosition]);
};

// Debounce utility for search/filter inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Format date string
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value);
};

// Calculate bounds for map
export const calculateBounds = (projects: GeoProject[]) => {
  if (projects.length === 0) {
    return null;
  }

  const lats = projects.map(p => p.latitude);
  const lons = projects.map(p => p.longitude);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);

  return [
    [minLat, minLon],
    [maxLat, maxLon],
  ] as [[number, number], [number, number]];
};

// Get status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Active':
      return '#4CAF50';
    case 'Completed':
      return '#2196F3';
    case 'Pending':
      return '#FF9800';
    case 'On Hold':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};
