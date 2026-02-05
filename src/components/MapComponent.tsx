import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { GeoProject } from '../types/index';
import { getStatusColor, calculateBounds } from '../utils/helpers';
import './MapComponent.css';

interface MapComponentProps {
  projects: GeoProject[];
  selectedProjectId: string | null;
  onMarkerClick: (projectId: string) => void;
}

// Custom marker icons for different statuses
const createCustomMarker = (status: string) => {
  const color = getStatusColor(status);
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: all 0.2s;
      ">
        <span style="color: white; font-weight: bold; font-size: 12px;">●</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const selectedMarkerIcon = L.divIcon({
  className: 'selected-marker',
  html: `
    <div style="
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 4px solid #FF9800;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.2), 0 2px 12px rgba(0,0,0,0.5);
      animation: pulse 1.2s ease-in-out infinite;
      background: white;
    ">
      <div style="width: 100%; height: 100%; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #FF9800;">
        <span style="font-weight: bold; font-size: 20px; color: #FF9800;">★</span>
      </div>
    </div>
  `,
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

export const MapComponent: React.FC<MapComponentProps> = ({
  projects,
  selectedProjectId,
  onMarkerClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Initialize map centered on India
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    try {
      // Set explicit dimensions before creating map
      const container = mapContainer.current;
      container.style.position = 'relative';
      container.style.width = '100%';
      container.style.height = '100%';

      mapInstance.current = L.map(container, {
        zoomAnimation: true,
        fadeAnimation: true,
      }).setView([20.5937, 78.9629], 5); // Center of India

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);

      // Invalidate size immediately and with small delays to ensure proper rendering
      const map = mapInstance.current;
      map.invalidateSize();
      
      // Additional invalidations for edge cases
      setTimeout(() => map.invalidateSize(), 50);
      setTimeout(() => map.invalidateSize(), 150);
      
      // Use ResizeObserver to handle container size changes
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
      };
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  }, []);

  // Update markers when projects change
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    projects.forEach(project => {
      const marker = L.marker([project.latitude, project.longitude], {
        icon: createCustomMarker(project.status),
      });

      marker.bindPopup(`
        <div style="font-size: 12px; width: 200px;">
          <strong>${project.projectName}</strong><br/>
          Status: ${project.status}<br/>
          Lat: ${project.latitude.toFixed(4)}<br/>
          Lon: ${project.longitude.toFixed(4)}<br/>
          Updated: ${project.lastUpdated}
        </div>
      `);

      marker.on('click', () => {
        onMarkerClick(project.id);
        // Add ripple effect
        marker.setIcon(selectedMarkerIcon);
      });

      if (mapInstance.current) {
        marker.addTo(mapInstance.current);
      }
      markersRef.current[project.id] = marker;
    });

    // Fit bounds if projects exist
    if (projects.length > 0) {
      const bounds = calculateBounds(projects);
      if (bounds && mapInstance.current) {
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [projects, onMarkerClick]);

  // Highlight selected marker
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([projectId, marker]) => {
      if (projectId === selectedProjectId) {
        marker.setIcon(selectedMarkerIcon);
        if (mapInstance.current) {
          mapInstance.current.setView(
            [marker.getLatLng().lat, marker.getLatLng().lng],
            mapInstance.current.getZoom(),
            { animate: true, duration: 1 }
          );
          // Bounce effect on selection
          setTimeout(() => {
            if (mapInstance.current && mapInstance.current.getZoom() < 15) {
              mapInstance.current.setZoom(mapInstance.current.getZoom() + 1, { animate: true });
            }
          }, 500);
        }
      } else {
        const project = projects.find(p => p.id === projectId);
        if (project) {
          marker.setIcon(createCustomMarker(project.status));
        }
      }
    });
  }, [selectedProjectId, projects]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    />
  );
};
