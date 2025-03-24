
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Task } from '@/context/ScheduleContext';

interface MarkerProps {
  lat: number;
  lng: number;
  color: string;
  icon: string;
  size?: number;
  onClick: () => void;
}

export const createMarkerElement = (color: string, icon: string, size: number = 24, isSelected: boolean = false): HTMLDivElement => {
  const el = document.createElement('div');
  el.style.backgroundColor = color;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = '50%';
  el.style.cursor = 'pointer';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.border = isSelected ? '3px solid white' : '2px solid white';
  el.style.boxShadow = isSelected ? '0 0 0 2px rgba(59, 130, 246, 0.8), 0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.3)';
  el.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)';
  el.style.transition = 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out';
  
  const iconElement = document.createElement('div');
  iconElement.innerHTML = icon;
  el.appendChild(iconElement);
  
  // Add pulse animation for selected markers
  if (isSelected) {
    el.classList.add('pulse');
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
      }
      .pulse {
        animation: pulse 2s infinite;
      }
    `;
    document.head.appendChild(style);
  }
  
  return el;
};

export const createTaskMarker = (
  map: mapboxgl.Map, 
  task: Task, 
  handleClick: (id: string) => void,
  isSelected: boolean = false
): mapboxgl.Marker => {
  console.log('Creating marker for task:', task.title, task.location);
  
  // Determine marker color based on task type or priority
  let markerColor = '#3b82f6'; // Default blue
  
  if (task.priority) {
    // Priority-based coloring
    markerColor = 
      task.priority === 'high' ? '#ef4444' : 
      task.priority === 'medium' ? '#f59e0b' : '#3b82f6';
  } else if (task.status) {
    // Status-based coloring
    markerColor = 
      task.status === 'completed' ? '#10b981' : 
      task.status === 'in_progress' ? '#3b82f6' : 
      task.status === 'cancelled' ? '#6b7280' : '#f59e0b';
  }
  
  // Use project-specific icon if it's a project marker
  const iconSvg = task.projectName 
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="8" x2="12" y2="16"></line></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
  
  const el = createMarkerElement(markerColor, iconSvg, isSelected ? 32 : 24, isSelected);
  
  // Create popup with task information
  const popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: false,
    closeOnClick: false,
    className: 'project-marker-popup'
  }).setHTML(`
    <div class="p-3 max-w-xs">
      <div class="font-medium text-base">${task.title || 'Project'}</div>
      ${task.projectName ? `<div class="text-sm text-muted-foreground">${task.projectName}</div>` : ''}
      ${task.location && task.location.address ? `<div class="text-sm mt-1">${task.location.address}</div>` : ''}
      ${task.description ? `<div class="text-sm mt-2 text-muted-foreground">${task.description}</div>` : ''}
      ${task.status ? `<div class="mt-2"><span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">${task.status}</span></div>` : ''}
    </div>
  `);
  
  // Create and add the marker
  const marker = new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat([task.location.lng, task.location.lat])
    .setPopup(popup)
    .addTo(map);
    
  // Add click event
  el.addEventListener('click', () => {
    handleClick(task.id);
  });
  
  // Show popup if marker is selected
  if (isSelected) {
    marker.togglePopup();
  }
  
  return marker;
};
