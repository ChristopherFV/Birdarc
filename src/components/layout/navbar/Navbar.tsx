
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
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
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Using American user data
  const user = {
    name: "Michael Johnson",
    location: "Seattle, WA",
    email: "michael.johnson@example.com",
    avatarUrl: undefined
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    
    navigate('/login');
  };
  
  return (
    <div className="h-14 md:h-16 border-b border-border bg-background px-3 md:px-8 flex items-center justify-between w-full sticky top-0 z-50">
      {/* Left side with company logo/name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-fieldvision-blue flex items-center justify-center text-white mr-2">
            <span className="text-sm font-semibold">
              {selectedCompany?.name?.charAt(0) || 'F'}
            </span>
          </div>
          <h1 className="text-base md:text-lg font-medium truncate max-w-[140px] md:max-w-full">
            {selectedCompany.name}
          </h1>
        </div>
      </div>
      
      {/* Right side with notifications and user profile */}
      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1 md:gap-3 h-8 md:h-10 pl-1 md:pl-2 pr-1 md:pr-2">
              {!isMobile && (
                <div className="flex flex-col items-end mr-2">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.location}</span>
                </div>
              )}
              <Avatar className="h-7 w-7 md:h-9 md:w-9">
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                <AvatarFallback className="bg-orange-500 text-white text-xs md:text-sm">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isMobile && <ChevronDown className="h-3 w-3 text-muted-foreground" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
