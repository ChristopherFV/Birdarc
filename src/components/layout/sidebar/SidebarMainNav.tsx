
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  FolderArchive,
  FileText,
  BarChart2,
  Settings,
} from 'lucide-react';

export const SidebarMainNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="px-2 py-2">
      <div className="mb-1 px-3 text-xs font-medium text-muted-foreground">
        Main
      </div>
      <nav className="space-y-1">
        <Link
          to="/"
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
            ${isActive('/') 
              ? 'bg-accent text-accent-foreground' 
              : 'hover:bg-muted text-foreground'}`}
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        
        <Link
          to="/projects"
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
            ${isActive('/projects') 
              ? 'bg-accent text-accent-foreground' 
              : 'hover:bg-muted text-foreground'}`}
        >
          <BarChart2 className="h-4 w-4" />
          <span>Projects</span>
        </Link>
        
        <Link
          to="/work-entries"
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
            ${isActive('/work-entries') 
              ? 'bg-accent text-accent-foreground' 
              : 'hover:bg-muted text-foreground'}`}
        >
          <FileText className="h-4 w-4" />
          <span>Invoicing</span>
        </Link>
        
        <Link
          to="/repository"
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
            ${isActive('/repository') 
              ? 'bg-accent text-accent-foreground' 
              : 'hover:bg-muted text-foreground'}`}
        >
          <FolderArchive className="h-4 w-4" />
          <span>Team Files</span>
        </Link>
        
        <Link
          to="/settings"
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
            ${isActive('/settings') 
              ? 'bg-accent text-accent-foreground' 
              : 'hover:bg-muted text-foreground'}`}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
};
