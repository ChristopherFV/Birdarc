
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { selectedCompany, currentUser } = useApp();
  
  // Using placeholder user data if none exists in the context
  const user = currentUser || {
    name: "Demo User",
    email: "user@example.com",
    avatarUrl: undefined
  };
  
  return (
    <div className="h-16 border-b border-border bg-background px-6 md:px-8 flex items-center justify-between">
      {/* Company name on the left */}
      <div className="flex items-center">
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
