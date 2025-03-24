
import React from 'react';
import { 
  Calendar, 
  Briefcase, 
  User, 
  FileText, 
  ChevronRight,
  AlertCircle
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
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Recent Work</CardTitle>
            <Link to="/work-entries">
              <Button variant="ghost" size="sm" className="text-xs text-fieldvision-blue flex items-center h-7 px-2">
                View All <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <CardDescription className="text-xs">Latest completed work activities</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          {recentEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <AlertCircle className="h-10 w-10 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium">No work entries found</p>
              <p className="text-xs mt-1">Add your first work entry above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="border-b pb-3 last:border-0 last:pb-1 hover:bg-muted/30 rounded-md p-2 transition-colors">
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="font-medium text-sm truncate pr-2 max-w-[65%] text-fieldvision-blue">
                      {getBillingCodeInfo(entry.billingCodeId)}
                    </div>
                    <div className="font-semibold text-green-600 text-sm">
                      {formatCurrency(calculateRevenue(entry))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{formatDate(new Date(entry.date))}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{getTeamMemberName(entry.teamMemberId)}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-3 w-3 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{getProjectName(entry.projectId)}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{entry.feetCompleted} ft</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Recent Work</CardTitle>
          <Link to="/work-entries">
            <Button variant="ghost" size="sm" className="text-fieldvision-blue flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <CardDescription>
          Latest completed work entries
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <AlertCircle className="h-12 w-12 text-muted-foreground/60 mb-3" />
            <p className="text-base font-medium">No work entries found</p>
            <p className="text-sm mt-1">Create your first work entry to see it here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-medium text-muted-foreground text-xs uppercase py-3 px-3">Date</th>
                  <th className="text-left font-medium text-muted-foreground text-xs uppercase py-3 px-3">Project</th>
                  <th className="text-left font-medium text-muted-foreground text-xs uppercase py-3 px-3">Billing Code</th>
                  <th className="text-left font-medium text-muted-foreground text-xs uppercase py-3 px-3">Technician</th>
                  <th className="text-left font-medium text-muted-foreground text-xs uppercase py-3 px-3">Feet</th>
                  <th className="text-right font-medium text-muted-foreground text-xs uppercase py-3 px-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {recentEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-3 text-sm">{formatDate(new Date(entry.date))}</td>
                    <td className="py-2.5 px-3 text-sm">{getProjectName(entry.projectId)}</td>
                    <td className="py-2.5 px-3 text-sm text-fieldvision-blue">{getBillingCodeInfo(entry.billingCodeId)}</td>
                    <td className="py-2.5 px-3 text-sm">{getTeamMemberName(entry.teamMemberId)}</td>
                    <td className="py-2.5 px-3 text-sm">{entry.feetCompleted}</td>
                    <td className="py-2.5 px-3 text-sm text-right font-medium text-green-600">
                      {formatCurrency(calculateRevenue(entry))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
