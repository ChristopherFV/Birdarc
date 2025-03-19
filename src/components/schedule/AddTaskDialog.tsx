
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSchedule, TaskPriority } from '@/context/ScheduleContext';
import { CalendarIcon, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '@/context/AppContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ open, onOpenChange }) => {
  const { addTask } = useSchedule();
  const { projects, teamMembers } = useApp();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [teamMemberId, setTeamMemberId] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would geocode the address to get lat/lng
    // For this example, we'll use a dummy location
    const newTask = {
      title,
      description,
      location: {
        address,
        lat: 37.7749 + (Math.random() * 0.03 - 0.015),
        lng: -122.4194 + (Math.random() * 0.03 - 0.015)
      },
      startDate,
      endDate,
      projectId: projectId || null,
      teamMemberId: teamMemberId || null,
      priority,
      status: 'pending' as const
    };
    
    addTask(newTask);
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAddress('');
    setProjectId('');
    setTeamMemberId('');
    setPriority('medium');
    setStartDate(new Date());
    setEndDate(new Date());
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Location
            </Label>
            <Input 
              id="address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address or location"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Date Range
            </Label>
            <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "MMM dd, yyyy") + 
                    (format(startDate, "yyyy-MM-dd") !== format(endDate, "yyyy-MM-dd") 
                      ? ` - ${format(endDate, "MMM dd, yyyy")}` 
                      : "")
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: startDate,
                    to: endDate,
                  }}
                  onSelect={(range) => {
                    if (range?.from) {
                      setStartDate(range.from);
                      setEndDate(range.to || range.from);
                    }
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project (Optional)</Label>
              <select
                id="project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-background border rounded-md text-sm"
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team">Team Member (Optional)</Label>
              <select
                id="team"
                value={teamMemberId}
                onChange={(e) => setTeamMemberId(e.target.value)}
                className="w-full px-3 py-2 bg-background border rounded-md text-sm"
              >
                <option value="">Select Team Member</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <div className="flex space-x-2">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <Button
                  key={p}
                  type="button"
                  variant={priority === p ? 'default' : 'outline'}
                  className={cn(
                    "flex-1 capitalize",
                    priority === p && p === 'high' && "bg-red-500 hover:bg-red-600",
                    priority === p && p === 'medium' && "bg-amber-500 hover:bg-amber-600",
                    priority === p && p === 'low' && "bg-blue-500 hover:bg-blue-600"
                  )}
                  onClick={() => setPriority(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-fieldvision-orange hover:bg-fieldvision-orange/90 text-white"
            >
              Save Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
