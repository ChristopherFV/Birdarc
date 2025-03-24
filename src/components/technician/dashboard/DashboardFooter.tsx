
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardFooter: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#CB9D06] shadow-inner">
      <div className="flex-1 flex justify-center items-center">
        <img 
          src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
          alt="Fieldvision Logo" 
          className="h-7 w-auto object-contain" 
        />
      </div>
      
      <Link to="/technician">
        <Button variant="secondary" size="sm" className="text-xs whitespace-nowrap">
          <Plus className="h-3.5 w-3.5 mr-1" />
          View Tasks
        </Button>
      </Link>
    </div>
  );
};
