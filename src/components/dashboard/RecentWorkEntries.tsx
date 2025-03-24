
import React from 'react';
import { 
  Calendar, 
  Briefcase, 
  User, 
  FileText, 
  ChevronRight 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/charts';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';

export const RecentWorkEntries: React.FC = () => {
  const { workEntries, projects, billingCodes, teamMembers } = useApp();
  const isMobile = useIsMobile();
  
  // Get only the 5 most recent entries
  const recentEntries = [...workEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const getProjectName = (id: string) => {
    const project = projects.find(p => p.id === id);
    return project ? project.name : 'Unknown Project';
  };
  
  const getBillingCodeInfo = (id: string) => {
    const code = billingCodes.find(c => c.id === id);
    return code ? `${code.code} - ${code.description}` : 'Unknown Code';
  };
  
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : 'Unknown Person';
  };
  
  const calculateRevenue = (entry: any) => {
    const code = billingCodes.find(c => c.id === entry.billingCodeId);
    if (!code) return 0;
    return code.ratePerFoot * entry.feetCompleted;
  };

  // Helper function to format dates
  const formatDate = (date: Date): string => {
    return format(date, 'MMM d, yyyy');
  };

  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-base font-medium">Recent Work Entries</h2>
          <button className="text-xs text-fieldvision-blue flex items-center">
            View All <ChevronRight className="h-3 w-3 ml-1" />
          </button>
        </div>
        
        {recentEntries.length === 0 ? (
          <Card className="p-4 text-center text-muted-foreground">
            <FileText className="h-6 w-6 mx-auto mb-2 opacity-70" />
            <p className="text-sm">No work entries found</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentEntries.map((entry) => (
              <Card key={entry.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm truncate pr-2 max-w-[70%]">
                      {getBillingCodeInfo(entry.billingCodeId)}
                    </div>
                    <div className="font-semibold text-green-600 text-sm">
                      {formatCurrency(calculateRevenue(entry))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{formatDate(new Date(entry.date))}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{getTeamMemberName(entry.teamMemberId)}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{getProjectName(entry.projectId)}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{entry.feetCompleted} ft</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>Recent Work Entries</CardTitle>
        <CardDescription>
          The latest work entries added to the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-medium text-muted-foreground text-xs uppercase py-3 px-2">Date</th>
                <th className="text-left font-medium text-muted-foreground text-xs uppercase py-3 px-2">Project</th>
                <th className="text-left font-medium text-muted-foreground text-xs uppercase py-3 px-2">Billing Code</th>
                <th className="text-left font-medium text-muted-foreground text-xs uppercase py-3 px-2">Technician</th>
                <th className="text-left font-medium text-muted-foreground text-xs uppercase py-3 px-2">Feet</th>
                <th className="text-right font-medium text-muted-foreground text-xs uppercase py-3 px-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-2 px-2 text-sm">{formatDate(new Date(entry.date))}</td>
                  <td className="py-2 px-2 text-sm">{getProjectName(entry.projectId)}</td>
                  <td className="py-2 px-2 text-sm">{getBillingCodeInfo(entry.billingCodeId)}</td>
                  <td className="py-2 px-2 text-sm">{getTeamMemberName(entry.teamMemberId)}</td>
                  <td className="py-2 px-2 text-sm">{entry.feetCompleted}</td>
                  <td className="py-2 px-2 text-sm text-right font-medium">
                    {formatCurrency(calculateRevenue(entry))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
