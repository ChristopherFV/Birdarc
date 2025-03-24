
import { useState, useEffect, RefObject } from 'react';

export const useFullscreenControl = (containerRef: RefObject<HTMLDivElement>) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      if (window.screen.orientation) {
        try {
          // Using type assertion to handle the orientation lock
          const orientation = window.screen.orientation as any;
          if (orientation && typeof orientation.lock === 'function') {
            orientation.lock('landscape').catch((err: Error) => {
              console.error('Failed to lock screen orientation:', err);
            });
          }
        } catch (err) {
          console.error('Screen orientation API error:', err);
        }
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement && window.screen.orientation) {
        try {
          // Using type assertion for unlock method as well
          const orientation = window.screen.orientation as any;
          if (orientation && typeof orientation.unlock === 'function') {
            orientation.unlock();
          }
        } catch (err) {
          console.error('Screen orientation unlock error:', err);
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, toggleFullscreen };
};
