
import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  ListTodo, 
  FileText, 
  Settings, 
  Building2, 
  LogOut,
  HardHat
} from 'lucide-react';
import { CompanySelector } from '@/components/ui/CompanySelector';
import { Link } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { companies, selectedCompany, setSelectedCompany } = useApp();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div 
        className={`${
          collapsed ? 'w-16' : 'w-64'
        } flex flex-col bg-card border-r border-border fixed h-full transition-all duration-300 ease-in-out z-10`}
      >
        {/* Logo */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 h-16 border-b border-border`}>
          {!collapsed && (
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
                alt="Fieldvision Logo" 
                className="h-8" 
              />
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-fieldvision-blue rounded-md flex items-center justify-center">
              <span className="text-white font-bold">FV</span>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-full p-1 hover:bg-muted text-muted-foreground"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Company selector */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-2">
            <CompanySelector 
              companies={companies}
              selectedCompany={selectedCompany}
              onChange={setSelectedCompany}
            />
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 pt-4">
          <ul className="space-y-1 px-2">
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
              href="/" 
              collapsed={collapsed} 
              active={location.pathname === '/'}
            />
            <NavItem 
              icon={<ListTodo size={20} />} 
              label="Invoices" 
              href="/work-entries" 
              collapsed={collapsed} 
              active={location.pathname === '/work-entries'}
            />
            <NavItem 
              icon={<FileText size={20} />} 
              label="Team Files" 
              href="/repository" 
              collapsed={collapsed}
              active={location.pathname === '/repository'} 
            />
            <NavItem 
              icon={<Building2 size={20} />} 
              label="Projects" 
              href="#" 
              collapsed={collapsed} 
            />
            <NavItem 
              icon={<HardHat size={20} />} 
              label="Technician" 
              href="/technician" 
              collapsed={collapsed}
              active={location.pathname.startsWith('/technician')} 
            />
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Tech Dashboard" 
              href="/technician/dashboard" 
              collapsed={collapsed}
              active={location.pathname === '/technician/dashboard'} 
            />
            <NavItem 
              icon={<Settings size={20} />} 
              label="Settings" 
              href="#" 
              collapsed={collapsed} 
            />
          </ul>
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-border py-4 px-2">
          <NavItem 
            icon={<LogOut size={20} />} 
            label="Logout" 
            href="#" 
            collapsed={collapsed} 
          />
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 ${collapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        <main className="p-6 md:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed: boolean;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href, collapsed, active }) => {
  return (
    <li>
      <Link 
        to={href}
        className={`
          flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3 py-2.5 
          rounded-md transition-colors duration-200
          ${active 
            ? 'bg-fieldvision-blue/10 text-fieldvision-blue font-medium' 
            : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
          }
        `}
      >
        <span className="flex-shrink-0">{icon}</span>
        {!collapsed && <span className="ml-3">{label}</span>}
      </Link>
    </li>
  );
};
