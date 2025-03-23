
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimplePageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const SimplePageLayout: React.FC<SimplePageLayoutProps> = ({ 
  children, 
  title,
  subtitle 
}) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="mb-4"
            >
              <Link to="/" className="inline-flex items-center">
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            
            {title && <h1 className="text-2xl font-semibold mb-1">{title}</h1>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
};
