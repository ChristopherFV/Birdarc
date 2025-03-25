
import React from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

export const ExportButton: React.FC<{
  filesView?: boolean;
}> = ({ filesView = false }) => {
  const { exportData } = useApp();
  const { toast } = useToast();
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  
  const handleExport = (type: 'raw' | 'summary' | 'files-by-project') => {
    if (type === 'files-by-project') {
      toast({
        title: "Export started",
        description: "Exporting files by project for completed tasks...",
      });
      
      // In a real app, this would connect to a backend service
      setTimeout(() => {
        toast({
          title: "Export complete",
          description: "Files have been exported successfully",
        });
      }, 1500);
    } else {
      exportData(type);
    }
    
    setShowExportMenu(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowExportMenu(!showExportMenu)}
        className="flex items-center px-2 py-1 rounded-md bg-fieldvision-blue text-white text-xs font-medium hover:bg-fieldvision-blue/90 transition-colors"
      >
        <Download size={12} className="mr-1" />
        <span>Export</span>
        <ChevronDown size={10} className="ml-1" />
      </button>
      
      {showExportMenu && (
        <>
          <div 
            className="fixed inset-0 z-50" 
            onClick={() => setShowExportMenu(false)}
          />
          <div className="absolute right-0 mt-1 z-50 w-48 bg-card shadow-md rounded-md border border-border animate-in slide-in-from-top-5">
            <div className="p-1">
              {filesView ? (
                <>
                  <button
                    onClick={() => handleExport('files-by-project')}
                    className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-secondary"
                  >
                    <span>Files By Project (ZIP)</span>
                  </button>
                  <button
                    onClick={() => handleExport('raw')}
                    className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-secondary"
                  >
                    <span>All Files (ZIP)</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleExport('raw')}
                    className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-secondary"
                  >
                    <span>Raw Data (CSV)</span>
                  </button>
                  <button
                    onClick={() => handleExport('summary')}
                    className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-secondary"
                  >
                    <span>Summary Report (CSV)</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
