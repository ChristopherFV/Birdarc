
import React from 'react';
import { Users, User } from 'lucide-react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

// Sample team and user data (in a real app, this would come from the backend)
const teams = [
  { id: 'team-1', name: 'North Region Team' },
  { id: 'team-2', name: 'South Region Team' },
  { id: 'team-3', name: 'East Region Team' },
  { id: 'team-4', name: 'West Region Team' },
];

const users = [
  { id: 'user-1', name: 'John Davis', team: 'team-1' },
  { id: 'user-2', name: 'Emily Wilson', team: 'team-1' },
  { id: 'user-3', name: 'Michael Scott', team: 'team-2' },
  { id: 'user-4', name: 'Sarah Johnson', team: 'team-3' },
  { id: 'user-5', name: 'Robert Chen', team: 'team-4' },
];

export const visibilitySchema = z.object({
  visibilityType: z.enum(['all', 'team', 'specific']),
  teamId: z.string().optional(),
  userId: z.string().optional(),
});

export type VisibilityFormData = z.infer<typeof visibilitySchema>;

interface VisibilitySettingsFormProps {
  form: ReturnType<typeof useForm<VisibilityFormData>>;
}

export const VisibilitySettingsForm: React.FC<VisibilitySettingsFormProps> = ({ form }) => {
  const visibilityType = form.watch('visibilityType');
  
  return (
    <div className="text-left border border-border rounded-md p-4 mt-4 bg-background/50">
      <h4 className="font-medium mb-3">Visibility Settings</h4>
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="visibilityType"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Who should see this data?</FormLabel>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="visibility-all"
                      value="all"
                      checked={field.value === 'all'}
                      onChange={() => field.onChange('all')}
                      className="rounded text-primary"
                    />
                    <Label htmlFor="visibility-all" className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Everyone (All teams)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="visibility-team"
                      value="team"
                      checked={field.value === 'team'}
                      onChange={() => field.onChange('team')}
                      className="rounded text-primary"
                    />
                    <Label htmlFor="visibility-team" className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Specific Team
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="visibility-specific"
                      value="specific"
                      checked={field.value === 'specific'}
                      onChange={() => field.onChange('specific')}
                      className="rounded text-primary"
                    />
                    <Label htmlFor="visibility-specific" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Specific User
                    </Label>
                  </div>
                </div>
              </FormItem>
            )}
          />
          
          {visibilityType === 'team' && (
            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Team</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}
          
          {visibilityType === 'specific' && (
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select User</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}
        </div>
      </Form>
    </div>
  );
};
