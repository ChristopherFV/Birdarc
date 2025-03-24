
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MapNote } from '../TechnicianLocationMap';

export const useTechnicianMap = () => {
  const { toast } = useToast();
  const [mapboxToken, setMapboxToken] = useState<string>("pk.eyJ1IjoiY2h1Y2F0eCIsImEiOiJjbThra2NrcHIwZGIzMm1wdDYzNnpreTZyIn0.KUTPCuD8hk7VOzTYJ-WODg");
  const [showMapTokenInput, setShowMapTokenInput] = useState(false);
  const [mapNotes, setMapNotes] = useState<MapNote[]>([]);
  const [mapVisible, setMapVisible] = useState(true);
  
  const addMapNote = (note: MapNote) => {
    setMapNotes(prev => [...prev, note]);
  };
  
  const deleteMapNote = (id: string) => {
    setMapNotes(prev => prev.filter(note => note.id !== id));
  };
  
  const handleMapVisibilityChange = (visible: boolean) => {
    setMapVisible(visible);
  };
  
  return {
    mapboxToken,
    setMapboxToken,
    showMapTokenInput,
    setShowMapTokenInput,
    mapNotes,
    addMapNote,
    deleteMapNote,
    mapVisible,
    handleMapVisibilityChange
  };
};
