
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TaskFormErrors } from './validation';

interface BasicTaskInfoProps {
  title: string;
  description: string;
  errors: TaskFormErrors;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const BasicTaskInfo: React.FC<BasicTaskInfoProps> = ({
  title,
  description,
  errors,
  onTitleChange,
  onDescriptionChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
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
          placeholder="Enter task details"
          rows={3}
        />
      </div>
    </>
  );
};
