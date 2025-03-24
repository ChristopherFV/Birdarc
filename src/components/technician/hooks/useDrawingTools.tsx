
import { useState } from 'react';

export const useDrawingTools = () => {
  const [currentTool, setCurrentTool] = useState<'pen' | 'text' | 'circle' | 'square'>('pen');
  
  return {
    currentTool,
    setCurrentTool
  };
};
