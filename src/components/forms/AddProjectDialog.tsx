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
import { BillingCode, BillingUnitType } from '@/types/app-types';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Info, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AddProjectDialog = () => {
  const { isOpen, closeAddProjectDialog } = useAddProjectDialog();
  const { projects, addProject } = useApp();
  const { toast } = useToast();
  
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [billingType, setBillingType] = useState<'hourly' | 'unit'>('unit');
  const [hourlyRate, setHourlyRate] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [useContractor, setUseContractor] = useState(false);
  const [contractorHourlyRate, setContractorHourlyRate] = useState('');
  const [billingCodes, setBillingCodes] = useState<Omit<BillingCode, 'id'>[]>([]);
  const [manualBillingCodes, setManualBillingCodes] = useState<{ 
    code: string; 
    description: string; 
    ratePerFoot: string;
    unitType: BillingUnitType;
  }[]>([
    { code: '', description: '', ratePerFoot: '', unitType: 'foot' }
  ]);

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

    if (projects.some(p => p.name.toLowerCase() === projectName.toLowerCase())) {
      toast({
        title: "Error",
        description: "A project with this name already exists",
        variant: "destructive"
      });
      return;
    }

    if (billingType === 'hourly' && !hourlyRate) {
      toast({
        title: "Error",
        description: "Hourly rate is required for hourly billing",
        variant: "destructive"
      });
      return;
    }

    if (useContractor && !contractorHourlyRate) {
      toast({
        title: "Error",
        description: "Contractor margin percentage is required",
        variant: "destructive"
      });
      return;
    }

    try {
      let finalBillingCodes = billingCodes;
      
      if (billingType === 'unit' && billingCodes.length === 0 && manualBillingCodes.length > 0) {
        const filteredCodes = manualBillingCodes.filter(
          code => code.code.trim() !== '' || code.description.trim() !== '' || code.ratePerFoot.trim() !== ''
        );
        
        if (filteredCodes.length === 0 && billingType === 'unit') {
          toast({
            title: "Warning",
            description: "No billing codes provided for unit-based project",
          });
        }
        
        finalBillingCodes = filteredCodes.map(code => ({
          code: code.code,
          description: code.description,
          ratePerFoot: parseFloat(code.ratePerFoot || '0'),
          unitType: code.unitType
        }));
      }

      addProject({
        name: projectName,
        client: clientName,
        billingCodes: finalBillingCodes,
        billingType,
        hourlyRate: billingType === 'hourly' ? parseFloat(hourlyRate) : undefined,
        serviceName: billingType === 'hourly' ? serviceName : undefined,
        useContractor,
        contractorHourlyRate: useContractor ? parseFloat(contractorHourlyRate) : undefined
      });
      
      toast({
        title: "Success",
        description: "Project added successfully",
      });
      
      setProjectName('');
      setClientName('');
      setBillingType('unit');
      setHourlyRate('');
      setServiceName('');
      setUseContractor(false);
      setContractorHourlyRate('');
      setBillingCodes([]);
      setManualBillingCodes([{ code: '', description: '', ratePerFoot: '', unitType: 'foot' }]);
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
        ratePerFoot: parseFloat(row.rate || row.Rate || row.ratePerFoot || row.RatePerFoot || '0'),
        unitType: (row.unitType || row.UnitType || 'foot') as BillingUnitType
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

  const addBillingCodeRow = () => {
    setManualBillingCodes([...manualBillingCodes, { code: '', description: '', ratePerFoot: '', unitType: 'foot' }]);
  };

  const removeBillingCodeRow = (index: number) => {
    if (manualBillingCodes.length > 1) {
      const updatedCodes = [...manualBillingCodes];
      updatedCodes.splice(index, 1);
      setManualBillingCodes(updatedCodes);
    }
  };

  const updateBillingCodeField = (index: number, field: 'code' | 'description' | 'ratePerFoot' | 'unitType', value: string) => {
    const updatedCodes = [...manualBillingCodes];
    if (field === 'unitType') {
      updatedCodes[index][field] = value as BillingUnitType;
    } else {
      updatedCodes[index][field] = value;
    }
    setManualBillingCodes(updatedCodes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeAddProjectDialog}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-background z-10">
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(85vh-8rem)] px-6 overflow-y-auto">
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
                <Label>Billing Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="billingTypeUnit"
                      checked={billingType === 'unit'}
                      onChange={() => setBillingType('unit')}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <Label htmlFor="billingTypeUnit" className="font-normal">Unit-based</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="billingTypeHourly"
                      checked={billingType === 'hourly'}
                      onChange={() => setBillingType('hourly')}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <Label htmlFor="billingTypeHourly" className="font-normal">Hourly</Label>
                  </div>
                </div>
              </div>
              
              {billingType === 'hourly' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate ($) <span className="text-destructive">*</span></Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceName">Service Name</Label>
                      <Input
                        id="serviceName"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="e.g., Consulting, Installation"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="useContractor" 
                      checked={useContractor}
                      onCheckedChange={setUseContractor}
                    />
                    <Label htmlFor="useContractor" className="font-normal">Project uses contractor</Label>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Info className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="text-sm">
                        <p>Enable this option if the project uses external contractors with different rates.</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {useContractor && (
                  <div className="pt-2">
                    <Label htmlFor="contractorRate">Contractor Margin (%) <span className="text-destructive">*</span></Label>
                    <Input
                      id="contractorRate"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={contractorHourlyRate}
                      onChange={(e) => setContractorHourlyRate(e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
              
              {billingType === 'unit' && (
                <div className="space-y-2 pt-2">
                  <Label className="block mb-2">Billing Codes</Label>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Option 1: Import from CSV</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload a CSV file with columns: code, description, rate, unitType
                      </p>
                      <CSVImporter onDataImported={handleCSVData} />
                      
                      {billingCodes.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">{billingCodes.length} billing codes imported</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Option 2: Add codes manually</Label>
                      
                      <div className="space-y-2">
                        {manualBillingCodes.map((code, index) => (
                          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <Input
                              placeholder="Code"
                              value={code.code}
                              onChange={(e) => updateBillingCodeField(index, 'code', e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Description"
                              value={code.description}
                              onChange={(e) => updateBillingCodeField(index, 'description', e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Rate/Unit"
                              type="number"
                              min="0"
                              step="0.01"
                              value={code.ratePerFoot}
                              onChange={(e) => updateBillingCodeField(index, 'ratePerFoot', e.target.value)}
                              className="flex-1"
                            />
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <Select
                                value={code.unitType}
                                onValueChange={(value) => updateBillingCodeField(index, 'unitType', value)}
                              >
                                <SelectTrigger className="w-full sm:w-[110px]">
                                  <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="foot">Foot</SelectItem>
                                  <SelectItem value="meter">Meter</SelectItem>
                                  <SelectItem value="each">Each</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBillingCodeRow(index)}
                                disabled={manualBillingCodes.length === 1}
                                className="flex-none"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addBillingCodeRow}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Billing Code
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </ScrollArea>
        
        <DialogFooter className="px-6 py-4 sticky bottom-0 bg-background border-t">
          <Button type="button" variant="outline" onClick={closeAddProjectDialog}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>Add Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
