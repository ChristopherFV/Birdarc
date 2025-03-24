
import { useState, useEffect, RefObject } from 'react';
import { ScreenOrientationAPI } from './types';

export const useFullscreenControl = (containerRef: RefObject<HTMLDivElement>) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      
      // Safely attempt to lock screen orientation
      try {
        const screenOrientation = window.screen.orientation as unknown as ScreenOrientationAPI;
        if (screenOrientation && typeof screenOrientation.lock === 'function') {
          screenOrientation.lock('landscape').catch((err: Error) => {
            console.error('Failed to lock screen orientation:', err);
          });
        }
      } catch (err) {
        console.error('Screen orientation API error:', err);
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
      
      // If exiting fullscreen, unlock orientation
      if (!document.fullscreenElement) {
        try {
          const screenOrientation = window.screen.orientation as unknown as ScreenOrientationAPI;
          if (screenOrientation && typeof screenOrientation.unlock === 'function') {
            screenOrientation.unlock();
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
