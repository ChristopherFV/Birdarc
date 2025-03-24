
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
  
  return el;
};

export const createTaskMarker = (
  map: mapboxgl.Map, 
  task: Task, 
  handleClick: (id: string) => void,
  isSelected: boolean = false
): mapboxgl.Marker => {
  const priorityColor = 
    task.priority === 'high' ? '#ef4444' : 
    task.priority === 'medium' ? '#f59e0b' : '#3b82f6';
    
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
  
  const el = createMarkerElement(priorityColor, iconSvg, isSelected ? 28 : 24, isSelected);
  
  // Create popup with task information
  const popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: false,
    closeOnClick: false
  }).setHTML(`
    <div class="p-2">
      <div class="font-medium">${task.title}</div>
      <div class="text-xs text-gray-500">${task.projectName || 'No project'}</div>
      ${task.description ? `<div class="text-sm mt-1">${task.description}</div>` : ''}
    </div>
  `);
  
  // Create and add the marker
  const marker = new mapboxgl.Marker(el)
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
