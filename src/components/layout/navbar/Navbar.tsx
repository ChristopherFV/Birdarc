
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Bell, LogOut, Settings, User } from 'lucide-react';
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
  
  // Using placeholder user data since currentUser is not available in context
  const user = {
    name: "Anima Agrawal",
    location: "U.P, India",
    email: "user@example.com",
    avatarUrl: undefined
  };
  
  return (
    <div className="h-16 border-b border-border bg-background px-6 md:px-8 flex items-center justify-between w-full sticky top-0 z-50">
      {/* Left side with company logo/name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-fieldvision-blue flex items-center justify-center text-white mr-3">
            <span className="text-sm font-semibold">A</span>
          </div>
          <h1 className="text-lg font-medium">{selectedCompany.name}</h1>
        </div>
      </div>
      
      {/* Right side with notifications and user profile */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 h-10 pl-2 pr-2">
              <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.location}</span>
              </div>
              <Avatar className="h-9 w-9">
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                <AvatarFallback className="bg-orange-500 text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
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
    </div>
  );
};
