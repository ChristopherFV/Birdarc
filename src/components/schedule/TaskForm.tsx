
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
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

interface BillingCodeEntry {
  billingCodeId: string;
  percentage: number;
  ratePerUnit: number;
  hideRateFromTeamMember: boolean;
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
  const [quantityEstimate, setQuantityEstimate] = useState<number>(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Multiple billing codes state
  const [selectedBillingCodes, setSelectedBillingCodes] = useState<BillingCodeEntry[]>([]);
  
  // Contractor specific state
  const [isContractor, setIsContractor] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const errors: Record<string, string> = {};
    if (!title) errors.title = "Title is required";
    if (!projectId) errors.projectId = "Project is required";
    if (!address) errors.address = "Location is required";
    
    if (selectedBillingCodes.length === 0) {
      errors.billingCodes = "At least one billing code is required";
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
      billingCodeId: null, // Since we're using the array of billing codes now
      quantityEstimate,
      attachments,
      isContractor,
      contractorBillingCodes: isContractor ? selectedBillingCodes : [],
      teamMemberBillingCodes: !isContractor ? selectedBillingCodes : [],
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
        percentage: 100, // Default to 100%
        ratePerUnit: 0,
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
      
      // Calculate rate based on selected billing code and percentage
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
    } else if (field === 'hideRateFromTeamMember') {
      updatedCodes[index].hideRateFromTeamMember = value as boolean;
    }
    
    setSelectedBillingCodes(updatedCodes);
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
    setQuantityEstimate(0);
    setAttachments([]);
    setFormErrors({});
    setIsContractor(false);
    setSelectedBillingCodes([]);
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
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Billing Codes *</Label>
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
            </div>
            
            {selectedBillingCodes.length === 0 && (
              <div className={`p-4 border ${formErrors.billingCodes ? "border-destructive" : "border-border"} rounded-md text-sm text-muted-foreground text-center`}>
                No billing codes added. Click "Add Code" to add a billing code.
                {formErrors.billingCodes && <p className="text-destructive text-sm mt-1">{formErrors.billingCodes}</p>}
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
                        onChange={(e) => handleBillingCodeChange(index, 'percentage', Number(e.target.value))}
                        className="text-right pr-0"
                      />
                      <span className="ml-2">%</span>
                    </div>
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
                
                {!isContractor && (
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
                )}
              </div>
            ))}
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
      </DialogContent>
    </Dialog>
  );
};
