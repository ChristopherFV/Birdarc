
export interface ScreenOrientationAPI {
  lock?: (orientation: 'portrait' | 'landscape') => Promise<void>;
  unlock?: () => void;
  type?: string;
  angle?: number;
  onchange?: EventListener;
  addEventListener?: (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) => void;
  removeEventListener?: (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ) => void;
  dispatchEvent?: (event: Event) => boolean;
}

declare global {
  interface Window {
    screen: Screen & {
      orientation?: ScreenOrientationAPI;
    }
  }
}

export type DrawingTool = 'pen' | 'text' | 'circle' | 'square';

export interface PdfViewerProps {
  currentTool: DrawingTool;
  setCurrentTool: (tool: DrawingTool) => void;
}
