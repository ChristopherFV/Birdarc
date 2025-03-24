
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, CheckSquare, FileText, BarChart2, Settings } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, href, isActive }) => {
  return (
    <Link 
      to={href}
      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-fieldvision-blue/10 text-fieldvision-blue font-medium' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', href: '/' },
    { icon: <Briefcase size={20} />, label: 'Project', href: '/repository' },
    { icon: <CheckSquare size={20} />, label: 'Tasks', href: '/technician' },
    { icon: <FileText size={20} />, label: 'Work Logs', href: '/work-entries' },
    { icon: <BarChart2 size={20} />, label: 'Performance', href: '/technician/dashboard' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="w-60 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* Logo section */}
      <div className="flex items-center px-6 h-16">
        <img 
          src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
          alt="Fieldvision Logo" 
          className="h-8" 
        />
      </div>
      
      {/* Menu items */}
      <div className="px-3 py-4 space-y-1">
        {menuItems.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={
              item.href === '/' 
                ? pathname === '/' 
                : pathname.startsWith(item.href)
            }
          />
        ))}
      </div>
    </div>
  );
};
