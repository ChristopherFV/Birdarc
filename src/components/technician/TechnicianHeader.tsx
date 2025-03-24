
import React from 'react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Check, ChevronLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface TechnicianHeaderProps {
  taskTitle: string;
}

export const TechnicianHeader: React.FC<TechnicianHeaderProps> = ({ taskTitle }) => {
  return (
    <header className="bg-fieldvision-navy p-3 flex justify-center items-center shadow-md sticky top-0 z-10">
      <h1 className="text-white font-semibold truncate max-w-[80%]">{taskTitle}</h1>
    </header>
  );
};
