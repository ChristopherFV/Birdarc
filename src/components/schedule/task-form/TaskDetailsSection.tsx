
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TaskDetailsSectionProps {
  title: string;
  description: string;
  titleError?: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

export const TaskDetailsSection: React.FC<TaskDetailsSectionProps> = ({
  title,
  description,
  titleError,
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
          className={titleError ? "border-destructive" : ""}
        />
        {titleError && <p className="text-destructive text-sm">{titleError}</p>}
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
