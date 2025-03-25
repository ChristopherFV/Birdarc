
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageFooter } from './PageFooter';

interface SimplePageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showFooter?: boolean;
  footerProps?: {
    backLink?: string;
    backLabel?: string;
    actionButton?: React.ReactNode;
  };
}

export const SimplePageLayout: React.FC<SimplePageLayoutProps> = ({ 
  children, 
  title,
  subtitle,
  showFooter = false,
  footerProps
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
          <div className="mb-4 sm:mb-6 flex justify-between items-start">
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="mb-3 sm:mb-4"
              >
                <Link to="/" className="inline-flex items-center">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              
              {title && <h1 className="text-xl sm:text-2xl font-semibold mb-1">{title}</h1>}
              {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
            </div>
          </div>
          
          {children}
        </div>
      </div>
      
      {/* Only show footer on mobile if showFooter is true */}
      {showFooter && isMobile && <PageFooter {...footerProps} />}
    </div>
  );
};
