
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useSidebar } from "@/components/ui/sidebar";
import { ArrowLeft, ArrowRight, LogOut, Settings, User } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const Navbar: React.FC = () => {
  const { selectedCompany } = useApp();
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  // Using placeholder user data since currentUser is not available in context
  const user = {
    name: "Demo User",
    email: "user@example.com",
    avatarUrl: undefined
  };
  
  return (
    <div className="h-16 border-b border-border bg-background px-6 md:px-8 flex items-center justify-between z-50">
      {/* Left side with toggle button and company name */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSidebar}
          className="flex items-center gap-1 border border-border"
        >
          {isCollapsed ? (
            <>
              <ArrowRight className="h-3 w-3" />
              <span className="text-xs">Menu</span>
            </>
          ) : (
            <>
              <ArrowLeft className="h-3 w-3" />
              <span className="text-xs">Hide</span>
            </>
          )}
        </Button>
        <h1 className="text-lg font-medium">{selectedCompany.name}</h1>
      </div>
      
      {/* User profile on the right */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 rounded-full p-0 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
              <AvatarFallback className="bg-fieldvision-blue/20 text-fieldvision-blue">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm hidden md:block">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
