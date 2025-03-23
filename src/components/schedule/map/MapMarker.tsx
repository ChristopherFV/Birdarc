
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

export const createMarkerElement = (color: string, icon: string, size: number = 24): HTMLDivElement => {
  const el = document.createElement('div');
  el.style.backgroundColor = color;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = '50%';
  el.style.cursor = 'pointer';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.border = '2px solid white';
  el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  
  const iconElement = document.createElement('div');
  iconElement.innerHTML = icon;
  el.appendChild(iconElement);
  
  return el;
};

export const createTaskMarker = (map: mapboxgl.Map, task: Task, handleClick: (id: string) => void): mapboxgl.Marker => {
  const priorityColor = 
    task.priority === 'high' ? '#ef4444' : 
    task.priority === 'medium' ? '#f59e0b' : '#3b82f6';
    
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
  
  const el = createMarkerElement(priorityColor, iconSvg);
  
  // Create and add the marker
  const marker = new mapboxgl.Marker(el)
    .setLngLat([task.location.lng, task.location.lat])
    .addTo(map);
    
  // Add click event
  el.addEventListener('click', () => {
    handleClick(task.id);
  });
  
  return marker;
};
