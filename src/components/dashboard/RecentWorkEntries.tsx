
import React from 'react';
import { 
  Calendar, 
  Briefcase, 
  User, 
  FileText, 
  ChevronRight 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/utils/charts';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

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
    return code.rate * entry.feetCompleted;
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Recent Work Entries</h2>
          <button className="text-sm text-blue-500 flex items-center">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {recentEntries.map((entry) => (
          <Card key={entry.id} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">
                  {getBillingCodeInfo(entry.billingCodeId)}
                </div>
                <div className="font-semibold text-green-600">
                  {formatCurrency(calculateRevenue(entry))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(new Date(entry.date))}
                </div>
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {getTeamMemberName(entry.teamMemberId)}
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {getProjectName(entry.projectId)}
                </div>
                <div className="flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  {entry.feetCompleted} ft
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <Card className="w-full">
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
