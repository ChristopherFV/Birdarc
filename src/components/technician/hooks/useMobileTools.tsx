
import { useState } from 'react';

export const useMobileTools = () => {
  const [showMobileTools, setShowMobileTools] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("map");
  
  return {
    showMobileTools,
    setShowMobileTools,
    activeTab,
    setActiveTab
  };
};
