
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AddTaskFormErrors } from './validation';

interface TaskTitleDescriptionProps {
  title: string;
  description: string;
  errors?: AddTaskFormErrors;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const TaskTitleDescription: React.FC<TaskTitleDescriptionProps> = ({
  title,
  description,
  errors = {},
  onTitleChange,
  onDescriptionChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter task title"
          required
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter task description"
          rows={3}
        />
      </div>
    </>
  );
};
