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
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 4px solid #FF9800;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.2), 0 2px 8px rgba(0,0,0,0.4);
      animation: pulse 1s infinite;
    ">
      <div style="width: 100%; height: 100%; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <span style="font-weight: bold; font-size: 14px;">★</span>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export const MapComponent: React.FC<MapComponentProps> = ({
  projects,
  selectedProjectId,
  onMarkerClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current).setView([39.8283, -98.5795], 4);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);
    }

    return () => {
      // Keep map instance alive for updates
    };
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
            { animate: true, duration: 0.5 }
          );
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
