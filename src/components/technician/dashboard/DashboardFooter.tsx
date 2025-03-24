
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const DashboardFooter: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-2 mb-4 bg-[#CB9D06] p-3">
      <img 
        src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
        alt="Fieldvision Logo" 
        className="h-6 sm:h-8 w-auto object-contain mb-2" 
      />
    </div>
  );
};

