
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Plus, Trash2 } from 'lucide-react';
import { useSchedule, TaskPriority } from '@/context/ScheduleContext';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AttachmentButton } from '@/components/forms/work-entry/AttachmentButton';
import { Switch } from '@/components/ui/switch';
import { BillingCodeSelector } from '@/components/forms/work-entry/BillingCodeSelector';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ContractorBillingCode {
  billingCodeId: string;
  percentage: number;
  ratePerUnit: number;
}

export const TaskForm: React.FC<TaskFormProps> = ({ open, onOpenChange }) => {
  const { addTask } = useSchedule();
  const { projects, teamMembers, billingCodes } = useApp();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [projectId, setProjectId] = useState('');
  const [teamMemberId, setTeamMemberId] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [address, setAddress] = useState('');
  const [billingCodeId, setBillingCodeId] = useState('');
  const [quantityEstimate, setQuantityEstimate] = useState<number>(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Contractor specific state
  const [isContractor, setIsContractor] = useState(false);
  const [contractorBillingCodes, setContractorBillingCodes] = useState<ContractorBillingCode[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const errors: Record<string, string> = {};
    if (!title) errors.title = "Title is required";
    if (!projectId) errors.projectId = "Project is required";
    if (!address) errors.address = "Location is required";
    
    if (!isContractor && !billingCodeId) {
      errors.billingCodeId = "Billing code is required";
    }
    
    if (isContractor && contractorBillingCodes.length === 0) {
      errors.contractorBillingCodes = "At least one billing code is required for contractor";
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
    
    const newTask = {
      title,
      description,
      location: {
        address,
        lat: 37.7749, // Default to San Francisco coordinates for now
        lng: -122.4194,
      },
      startDate,
      endDate,
      projectId,
      teamMemberId: teamMemberId || null,
      priority,
      status: 'pending' as const,
      billingCodeId: isContractor ? null : billingCodeId,
      quantityEstimate,
      attachments,
      isContractor,
      contractorBillingCodes: isContractor ? contractorBillingCodes : [],
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
  
  const handleAddContractorBillingCode = () => {
    setContractorBillingCodes([
      ...contractorBillingCodes, 
      { 
        billingCodeId: '', 
        percentage: 75, // Default to 75%
        ratePerUnit: 0 
      }
    ]);
  };
  
  const handleRemoveContractorBillingCode = (index: number) => {
    const updatedCodes = [...contractorBillingCodes];
    updatedCodes.splice(index, 1);
    setContractorBillingCodes(updatedCodes);
  };
  
  const handleContractorBillingCodeChange = (index: number, field: keyof ContractorBillingCode, value: string | number) => {
    const updatedCodes = [...contractorBillingCodes];
    
    if (field === 'billingCodeId') {
      updatedCodes[index].billingCodeId = value as string;
      
      // Calculate contractor rate based on selected billing code and percentage
      const selectedCode = billingCodes.find(code => code.id === value);
      if (selectedCode) {
        const percentage = updatedCodes[index].percentage;
        updatedCodes[index].ratePerUnit = (selectedCode.ratePerFoot * percentage) / 100;
      }
    } else if (field === 'percentage') {
      const percentage = Number(value);
      updatedCodes[index].percentage = percentage;
      
      // Recalculate rate based on new percentage
      const selectedCode = billingCodes.find(code => code.id === updatedCodes[index].billingCodeId);
      if (selectedCode) {
        updatedCodes[index].ratePerUnit = (selectedCode.ratePerFoot * percentage) / 100;
      }
    }
    
    setContractorBillingCodes(updatedCodes);
  };
  
  const handleClose = () => {
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setProjectId('');
    setTeamMemberId('');
    setStartDate(new Date());
    setEndDate(new Date());
    setAddress('');
    setBillingCodeId('');
    setQuantityEstimate(0);
    setAttachments([]);
    setFormErrors({});
    setIsContractor(false);
    setContractorBillingCodes([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
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
              <Label htmlFor="project">Project *</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className={formErrors.projectId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.projectId && <p className="text-destructive text-sm">{formErrors.projectId}</p>}
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
          
          <div className="grid grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Estimate (units)</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantityEstimate.toString()}
                onChange={(e) => setQuantityEstimate(Number(e.target.value))}
              />
            </div>
          </div>
          
          {!isContractor && (
            <div className="space-y-2">
              <Label htmlFor="billingCode">Billing Code *</Label>
              <Select 
                value={billingCodeId} 
                onValueChange={setBillingCodeId}
                disabled={isContractor}
              >
                <SelectTrigger className={formErrors.billingCodeId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select code" />
                </SelectTrigger>
                <SelectContent>
                  {billingCodes.map((code) => (
                    <SelectItem key={code.id} value={code.id}>
                      {code.code} (${code.ratePerFoot}/unit)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.billingCodeId && <p className="text-destructive text-sm">{formErrors.billingCodeId}</p>}
            </div>
          )}
          
          {isContractor && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Contractor Billing Codes</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddContractorBillingCode}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Code
                </Button>
              </div>
              
              {contractorBillingCodes.length === 0 && formErrors.contractorBillingCodes && (
                <p className="text-destructive text-sm">{formErrors.contractorBillingCodes}</p>
              )}
              
              {contractorBillingCodes.map((item, index) => (
                <div key={index} className="space-y-2 p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Billing Code {index + 1}</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveContractorBillingCode(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Select
                      value={item.billingCodeId}
                      onValueChange={(value) => handleContractorBillingCodeChange(index, 'billingCodeId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select billing code" />
                      </SelectTrigger>
                      <SelectContent>
                        {billingCodes.map((code) => (
                          <SelectItem key={code.id} value={code.id}>
                            {code.code} (${code.ratePerFoot}/unit)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Percentage</Label>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={item.percentage.toString()}
                          onChange={(e) => handleContractorBillingCodeChange(index, 'percentage', Number(e.target.value))}
                          className="text-right pr-0"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Contractor Rate</Label>
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
                </div>
              ))}
            </div>
          )}
          
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
      </DialogContent>
    </Dialog>
  );
};
