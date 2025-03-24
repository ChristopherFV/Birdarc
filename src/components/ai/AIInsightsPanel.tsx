
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIAnalyticsService } from '@/services/AIAnalyticsService';
import { WorkEntry } from '@/types/app-types';
import { BillingCode, Project, TeamMember } from '@/context/AppContext';
import { Lightbulb, TrendingUp, BarChart3, MapPin, ChevronRight, ChevronDown } from 'lucide-react';
import { Task } from '@/context/ScheduleContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIInsightsPanelProps {
  workEntries: WorkEntry[];
  billingCodes: BillingCode[];
  projects: Project[];
  teamMembers: TeamMember[];
  tasks: Task[];
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  workEntries,
  billingCodes,
  projects,
  teamMembers,
  tasks,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<'insights' | 'revenue' | 'assignments' | 'geographic'>('insights');

  // Generate insights on render
  const workEntryInsights = AIAnalyticsService.analyzeWorkEntries(workEntries);
  const revenuePrediections = AIAnalyticsService.predictRevenue(workEntries, billingCodes);
  const taskAssignments = AIAnalyticsService.suggestTaskAssignments(tasks, teamMembers);
  const geographicInsights = AIAnalyticsService.analyzeGeographicData(tasks);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card className="bg-card border-border shadow-sm overflow-hidden transition-all duration-300" 
      style={{ maxHeight: expanded ? '800px' : '160px' }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md mr-3">
              <Lightbulb className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Insights</CardTitle>
              <CardDescription>AI-powered analytics and recommendations</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="ml-auto">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {expanded ? (
        <CardContent>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <Button 
              variant={activeSection === 'insights' ? 'default' : 'outline'} 
              onClick={() => setActiveSection('insights')}
              className="flex items-center justify-center"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              <span className="text-xs">Work Insights</span>
            </Button>
            <Button 
              variant={activeSection === 'revenue' ? 'default' : 'outline'} 
              onClick={() => setActiveSection('revenue')}
              className="flex items-center justify-center"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="text-xs">Revenue</span>
            </Button>
            <Button 
              variant={activeSection === 'assignments' ? 'default' : 'outline'} 
              onClick={() => setActiveSection('assignments')}
              className="flex items-center justify-center"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="text-xs">Assignments</span>
            </Button>
            <Button 
              variant={activeSection === 'geographic' ? 'default' : 'outline'} 
              onClick={() => setActiveSection('geographic')}
              className="flex items-center justify-center"
            >
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-xs">Geographic</span>
            </Button>
          </div>
          
          {activeSection === 'insights' && (
            <div>
              <h3 className="text-sm font-medium mb-2">Work Entry Analysis</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Efficiency Score: {Math.round(workEntryInsights.efficiencyScore * 100)}%
              </p>
              <div className="space-y-2">
                {workEntryInsights.insights.map((insight, i) => (
                  <Alert key={i}>
                    <AlertDescription className="text-sm">{insight}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}
          
          {activeSection === 'revenue' && (
            <div>
              <h3 className="text-sm font-medium mb-2">Revenue Predictions</h3>
              <p className="text-xs text-muted-foreground mb-1">
                Predicted Revenue: <span className="font-bold text-green-600">{formatCurrency(revenuePrediections.predictedRevenue)}</span>
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Confidence: {Math.round(revenuePrediections.confidenceScore * 100)}%
              </p>
              <div className="space-y-2">
                {revenuePrediections.recommendations.map((rec, i) => (
                  <Alert key={i}>
                    <AlertDescription className="text-sm">{rec}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}
          
          {activeSection === 'assignments' && (
            <div>
              <h3 className="text-sm font-medium mb-2">Suggested Task Assignments</h3>
              {Object.keys(taskAssignments).length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {Object.entries(taskAssignments).map(([memberId, taskIds]) => {
                    const member = teamMembers.find(m => m.id === memberId);
                    return (
                      <div key={memberId} className="border rounded-md p-2">
                        <p className="text-sm font-medium">{member?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{taskIds.length} suggested tasks</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Alert>
                  <AlertDescription className="text-sm">No task assignment suggestions available.</AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          {activeSection === 'geographic' && (
            <div>
              <h3 className="text-sm font-medium mb-2">Geographic Analysis</h3>
              {geographicInsights.hotspots.length > 0 ? (
                <>
                  <p className="text-xs text-muted-foreground mb-3">
                    {geographicInsights.hotspots.length} work concentration areas identified
                  </p>
                  <div className="space-y-2">
                    {geographicInsights.recommendations.map((rec, i) => (
                      <Alert key={i}>
                        <AlertDescription className="text-sm">{rec}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </>
              ) : (
                <Alert>
                  <AlertDescription className="text-sm">No geographic insights available.</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      ) : (
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{workEntryInsights.insights[0]}</p>
            <Button variant="outline" size="sm" onClick={() => setExpanded(true)}>
              View All Insights
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
