
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Plus, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { useSchedule, TaskPriority, BillingCodeEntry } from '@/context/ScheduleContext';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AttachmentButton } from '@/components/forms/work-entry/AttachmentButton';
import { Switch } from '@/components/ui/switch';
import { DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BillingCodeImporter } from './BillingCodeImporter';
import { ProjectSelector } from '@/components/forms/work-entry/ProjectSelector';

interface TaskFormProps {
  onOpenChange: (open: boolean) => void;
  open?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onOpenChange, open }) => {
  const { addTask } = useSchedule();
  const { projects, teamMembers, billingCodes } = useApp();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [projectId, setProjectId] = useState('');
  const [teamMemberId, setTeamMemberId] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [address, setAddress] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [selectedBillingCodes, setSelectedBillingCodes] = useState<BillingCodeEntry[]>([]);
  
  const [isContractor, setIsContractor] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [contractorPercentage, setContractorPercentage] = useState(100);
  const [bulkQuantityEstimate, setBulkQuantityEstimate] = useState(0);
  const [selectedBillingCodeIds, setSelectedBillingCodeIds] = useState<string[]>([]);
  
  // Get billing codes specific to the selected project (in a real app, this would filter by project)
  const projectBillingCodes = projectId 
    ? billingCodes 
    : [];

  useEffect(() => {
    setSelectedBillingCodes([]);
    setSelectedBillingCodeIds([]);
  }, [isContractor]);

  // Handle project change
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setProjectId(value);
    setSelectedBillingCodes([]);
    setSelectedBillingCodeIds([]);
    
    // Clear project error if it exists
    if (formErrors.projectId) {
      const newErrors = { ...formErrors };
      delete newErrors.projectId;
      setFormErrors(newErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: Record<string, string> = {};
    if (!title) errors.title = "Title is required";
    if (!projectId) errors.projectId = "Project is required";
    if (!address) errors.address = "Location is required";
    
    if (selectedBillingCodes.length === 0 && selectedBillingCodeIds.length === 0) {
      errors.billingCodes = "At least one billing code is required";
    }
    
    if (!isContractor) {
      selectedBillingCodes.forEach((entry, index) => {
        if (!entry.billingCodeId) {
          errors[`billingCode_${index}`] = "Billing code selection is required";
        }
        
        if (entry.quantityEstimate <= 0) {
          errors[`quantityEstimate_${index}`] = "Quantity must be greater than 0";
        }
      });
    } else {
      if (selectedBillingCodeIds.length === 0) {
        errors.bulkBillingCodes = "At least one billing code must be selected";
      }
      
      if (contractorPercentage <= 0 || contractorPercentage > 100) {
        errors.contractorPercentage = "Percentage must be between 1-100";
      }
      
      if (bulkQuantityEstimate <= 0) {
        errors.bulkQuantity = "Total quantity must be greater than 0";
      }
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    let billingCodeEntries: BillingCodeEntry[] = [];
    
    if (isContractor) {
      billingCodeEntries = selectedBillingCodeIds.map(id => {
        const billingCode = billingCodes.find(code => code.id === id);
        const ratePerUnit = billingCode ? (billingCode.ratePerFoot * contractorPercentage) / 100 : 0;
        const individualQuantity = Math.round((bulkQuantityEstimate / selectedBillingCodeIds.length) * 100) / 100;
        
        return {
          billingCodeId: id,
          percentage: contractorPercentage,
          ratePerUnit,
          quantityEstimate: individualQuantity,
          hideRateFromTeamMember: false
        };
      });
    } else {
      billingCodeEntries = selectedBillingCodes;
    }
    
    const totalQuantity = isContractor 
      ? bulkQuantityEstimate 
      : selectedBillingCodes.reduce((sum, entry) => sum + entry.quantityEstimate, 0);
    
    const newTask = {
      title,
      description,
      location: {
        address,
        lat: 37.7749,
        lng: -122.4194,
      },
      startDate,
      endDate,
      projectId,
      teamMemberId: teamMemberId || null,
      priority,
      status: 'pending' as const,
      billingCodeId: null,
      quantityEstimate: totalQuantity,
      attachments,
      isContractor,
      contractorBillingCodes: isContractor ? billingCodeEntries : [],
      teamMemberBillingCodes: !isContractor ? billingCodeEntries : [],
    };
    
    addTask(newTask);
    toast({
      title: "Success",
      description: "Task created successfully",
    });
    handleClose();
  };

  const handleFileAttachment = (files: File[]) => {
    setAttachments(files);
    if (formErrors.attachments) {
      const newErrors = { ...formErrors };
      delete newErrors.attachments;
      setFormErrors(newErrors);
    }
  };

  const handleAddBillingCode = () => {
    setSelectedBillingCodes([
      ...selectedBillingCodes, 
      { 
        billingCodeId: '', 
        percentage: isContractor ? 100 : 0,
        ratePerUnit: 0,
        quantityEstimate: 0,
        hideRateFromTeamMember: false
      }
    ]);
  };

  const handleRemoveBillingCode = (index: number) => {
    const updatedCodes = [...selectedBillingCodes];
    updatedCodes.splice(index, 1);
    setSelectedBillingCodes(updatedCodes);
  };

  const handleBillingCodeChange = (index: number, field: keyof BillingCodeEntry, value: string | number | boolean) => {
    const updatedCodes = [...selectedBillingCodes];
    
    if (field === 'billingCodeId') {
      updatedCodes[index].billingCodeId = value as string;
      
      const selectedCode = billingCodes.find(code => code.id === value);
      if (selectedCode && isContractor) {
        const percentage = updatedCodes[index].percentage;
        updatedCodes[index].ratePerUnit = (selectedCode.ratePerFoot * percentage) / 100;
      } else if (selectedCode) {
        updatedCodes[index].ratePerUnit = selectedCode.ratePerFoot;
      }
    } else if (field === 'percentage') {
      const percentage = Number(value);
      updatedCodes[index].percentage = percentage;
      
      const selectedCode = billingCodes.find(code => code.id === updatedCodes[index].billingCodeId);
      if (selectedCode && isContractor) {
        updatedCodes[index].ratePerUnit = (selectedCode.ratePerFoot * percentage) / 100;
      }
    } else if (field === 'hideRateFromTeamMember') {
      updatedCodes[index].hideRateFromTeamMember = value as boolean;
    } else if (field === 'quantityEstimate') {
      updatedCodes[index].quantityEstimate = Number(value);
    }
    
    setSelectedBillingCodes(updatedCodes);
  };

  const handleBillingCodesImported = (importedEntries: BillingCodeEntry[]) => {
    if (isContractor) {
      const importedIds = importedEntries.map(entry => entry.billingCodeId);
      setSelectedBillingCodeIds(importedIds);
      
      setBulkQuantityEstimate(importedEntries.length * 10);
    } else {
      setSelectedBillingCodes(importedEntries);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setProjectId('');
    setTeamMemberId('');
    setStartDate(new Date());
    setEndDate(new Date());
    setAddress('');
    setAttachments([]);
    setFormErrors({});
    setIsContractor(false);
    setSelectedBillingCodes([]);
    setSelectedBillingCodeIds([]);
    setSearchTerm('');
    setContractorPercentage(100);
    setBulkQuantityEstimate(0);
    onOpenChange(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          className={formErrors.title ? "border-destructive" : ""}
        />
        {formErrors.title && <p className="text-destructive text-sm">{formErrors.title}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task details"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <ProjectSelector
            projectId={projectId}
            projects={projects}
            onChange={handleProjectChange}
            error={formErrors.projectId}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="teamMember">Assign To</Label>
            <div className="flex items-center gap-2">
              <Label htmlFor="isContractor" className="text-sm">Contractor</Label>
              <Switch
                id="isContractor"
                checked={isContractor}
                onCheckedChange={setIsContractor}
              />
            </div>
          </div>
          
          {!isContractor && (
            <Select value={teamMemberId} onValueChange={setTeamMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Assign to team member" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Location *</Label>
        <div className="flex">
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            className={`flex-1 ${formErrors.address ? "border-destructive" : ""}`}
            required
          />
          <Button type="button" variant="outline" className="ml-2">
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
        {formErrors.address && <p className="text-destructive text-sm">{formErrors.address}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Billing Codes *</Label>
          {!isContractor && projectId && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddBillingCode}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Code
            </Button>
          )}
        </div>
        
        {formErrors.billingCodes && (
          <p className="text-destructive text-sm">{formErrors.billingCodes}</p>
        )}
        
        <BillingCodeImporter 
          billingCodes={projectBillingCodes}
          onImport={handleBillingCodesImported}
          isContractor={isContractor}
          projectId={projectId}
        />
        
        {isContractor && projectId && (
          <div className="space-y-4 border rounded-md p-4">
            <div className="space-y-2">
              <Label htmlFor="contractorPercentage">Contractor Percentage</Label>
              <div className="flex items-center">
                <Input
                  id="contractorPercentage"
                  type="number"
                  min="1"
                  max="100"
                  value={contractorPercentage.toString()}
                  onChange={(e) => setContractorPercentage(Number(e.target.value))}
                  className={`text-right pr-0 ${formErrors.contractorPercentage ? "border-destructive" : ""}`}
                />
                <span className="ml-2">%</span>
              </div>
              {formErrors.contractorPercentage && (
                <p className="text-destructive text-sm">{formErrors.contractorPercentage}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bulkQuantity">Total Quantity Estimate</Label>
              <Input
                id="bulkQuantity"
                type="number"
                min="0"
                value={bulkQuantityEstimate.toString()}
                onChange={(e) => setBulkQuantityEstimate(Number(e.target.value))}
                className={formErrors.bulkQuantity ? "border-destructive" : ""}
              />
              {formErrors.bulkQuantity && (
                <p className="text-destructive text-sm">{formErrors.bulkQuantity}</p>
              )}
            </div>
          </div>
        )}
        
        {!isContractor && (
          <>
            {selectedBillingCodes.length === 0 && projectId && (
              <div className={`p-4 border ${formErrors.billingCodes ? "border-destructive" : "border-border"} rounded-md text-sm text-muted-foreground text-center`}>
                Select billing codes above or click "Add Code" to add a billing code manually.
              </div>
            )}
            
            {selectedBillingCodes.map((item, index) => (
              <div key={index} className="space-y-2 p-3 border rounded-md">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Billing Code {index + 1}</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveBillingCode(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Select
                    value={item.billingCodeId}
                    onValueChange={(value) => handleBillingCodeChange(index, 'billingCodeId', value)}
                  >
                    <SelectTrigger className={formErrors[`billingCode_${index}`] ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select billing code" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectBillingCodes.map((code) => (
                        <SelectItem key={code.id} value={code.id}>
                          {code.code} (${code.ratePerFoot}/unit)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors[`billingCode_${index}`] && (
                    <p className="text-destructive text-sm">{formErrors[`billingCode_${index}`]}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Quantity Estimate</Label>
                    <Input
                      type="number"
                      min="0"
                      value={item.quantityEstimate.toString()}
                      onChange={(e) => handleBillingCodeChange(index, 'quantityEstimate', Number(e.target.value))}
                      className={formErrors[`quantityEstimate_${index}`] ? "border-destructive" : ""}
                    />
                    {formErrors[`quantityEstimate_${index}`] && (
                      <p className="text-destructive text-sm">{formErrors[`quantityEstimate_${index}`]}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Rate per Unit</Label>
                    <div className="flex items-center">
                      <span className="mr-1">$</span>
                      <Input
                        type="number"
                        value={item.ratePerUnit.toFixed(2)}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    id={`hideRate-${index}`}
                    checked={item.hideRateFromTeamMember}
                    onCheckedChange={(checked) => handleBillingCodeChange(index, 'hideRateFromTeamMember', checked)}
                  />
                  <Label htmlFor={`hideRate-${index}`} className="text-xs cursor-pointer flex items-center">
                    {item.hideRateFromTeamMember ? (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Hide rate from team member
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Show rate to team member
                      </>
                    )}
                  </Label>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      
      <AttachmentButton
        attachments={attachments}
        onAttach={handleFileAttachment}
        error={formErrors.attachments}
      />
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit">Create Task</Button>
      </DialogFooter>
    </form>
  );
};
