
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const TechnicianNotesTab: React.FC = () => {
  return (
    <Card>
      <CardHeader className="py-2">
        <CardTitle className="text-sm">Task Notes</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Please mark completed sections on the drawing and note any issues encountered.
          </p>
          <textarea 
            className="w-full border border-border rounded-md p-2 h-32 text-sm"
            placeholder="Add your notes here..."
          />
          <Button size="sm" className="w-full">Save Notes</Button>
        </div>
      </CardContent>
    </Card>
  );
};
