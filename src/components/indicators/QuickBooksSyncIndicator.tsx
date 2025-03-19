
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const QuickBooksSyncIndicator: React.FC = () => {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium">QuickBooks sync'd</span>
          <CheckCircle size={16} className="ml-auto text-green-500" />
        </div>
      </CardContent>
    </Card>
  );
};
