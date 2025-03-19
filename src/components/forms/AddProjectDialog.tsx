
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAddProjectDialog } from '@/hooks/useAddProjectDialog';
import { useApp } from '@/context/AppContext';
import { CSVImporter } from '@/components/forms/CSVImporter';
import { BillingCode } from '@/types/app-types';

export const AddProjectDialog = () => {
  const { isOpen, closeAddProjectDialog } = useAddProjectDialog();
  const { projects, addProject } = useApp();
  const { toast } = useToast();
  
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [billingCodes, setBillingCodes] = useState<Omit<BillingCode, 'id'>[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate project name
    if (projects.some(p => p.name.toLowerCase() === projectName.toLowerCase())) {
      toast({
        title: "Error",
        description: "A project with this name already exists",
        variant: "destructive"
      });
      return;
    }

    try {
      addProject({
        name: projectName,
        client: clientName,
        billingCodes
      });
      
      toast({
        title: "Success",
        description: "Project added successfully",
      });
      
      // Reset form
      setProjectName('');
      setClientName('');
      setBillingCodes([]);
      closeAddProjectDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive"
      });
    }
  };

  const handleCSVData = (data: any[]) => {
    try {
      const parsedCodes = data.map(row => ({
        code: row.code || row.Code || '',
        description: row.description || row.Description || '',
        ratePerFoot: parseFloat(row.rate || row.Rate || row.ratePerFoot || row.RatePerFoot || '0')
      }));
      
      setBillingCodes(parsedCodes);
      
      toast({
        title: "Success",
        description: `Imported ${parsedCodes.length} billing codes`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process CSV data. Please check the format.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeAddProjectDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name <span className="text-destructive">*</span></Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="block mb-2">Import Billing Codes (CSV)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Upload a CSV file with columns: code, description, rate
              </p>
              <CSVImporter onDataImported={handleCSVData} />
              
              {billingCodes.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">{billingCodes.length} billing codes ready to import</p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeAddProjectDialog}>
              Cancel
            </Button>
            <Button type="submit">Add Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
