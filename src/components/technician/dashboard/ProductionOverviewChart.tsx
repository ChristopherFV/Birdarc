
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCheck, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { Task } from '@/context/ScheduleContext';
import { format } from 'date-fns';
import { useApp } from '@/context/AppContext';

interface ProductionOverviewChartProps {
  completedTasks: Task[];
}

export const ProductionOverviewChart: React.FC<ProductionOverviewChartProps> = ({ 
  completedTasks
}) => {
  const { 
    dateRange, 
    groupBy,
    selectedProject,
    selectedTeamMember
  } = useApp();

  // Process data for the chart based on filters
  const chartData = useMemo(() => {
    if (completedTasks.length === 0) return [];

    // Filter tasks based on project if selected
    let filteredTasks = completedTasks;
    if (selectedProject) {
      filteredTasks = filteredTasks.filter(task => task.projectId === selectedProject);
    }

    // Group tasks by time period (day, week, month, year)
    const groupedData: Record<string, { units: number, tasks: number }> = {};
    
    filteredTasks.forEach(task => {
      let key: string;
      
      switch (groupBy) {
        case 'day':
          key = format(task.endDate, 'MMM dd');
          break;
        case 'week':
          key = `Week ${format(task.endDate, 'w')} - ${format(task.endDate, 'yyyy')}`;
          break;
        case 'month':
          key = format(task.endDate, 'MMM yyyy');
          break;
        case 'year':
          key = format(task.endDate, 'yyyy');
          break;
        default:
          key = format(task.endDate, 'MMM dd');
      }
      
      if (!groupedData[key]) {
        groupedData[key] = { units: 0, tasks: 0 };
      }
      
      groupedData[key].units += task.quantityEstimate || 0;
      groupedData[key].tasks += 1;
    });
    
    // Convert to array and add cumulative values
    const dataArray = Object.entries(groupedData).map(([name, data]) => ({
      name,
      units: data.units,
      tasks: data.tasks
    }));
    
    // Sort by date
    dataArray.sort((a, b) => {
      // Handle different date formats based on groupBy
      if (groupBy === 'week') {
        const weekA = parseInt(a.name.split(' ')[1]);
        const weekB = parseInt(b.name.split(' ')[1]);
        const yearA = parseInt(a.name.split(' - ')[1]);
        const yearB = parseInt(b.name.split(' - ')[1]);
        
        if (yearA !== yearB) return yearA - yearB;
        return weekA - weekB;
      }
      
      return new Date(a.name).getTime() - new Date(b.name).getTime();
    });
    
    // Add cumulative values
    let cumulativeUnits = 0;
    return dataArray.map(item => {
      cumulativeUnits += item.units;
      return {
        ...item,
        cumulative: cumulativeUnits
      };
    });
  }, [completedTasks, groupBy, selectedProject, dateRange]);

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCheck className="h-5 w-5" />
          Production Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No completed tasks to display</p>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="units" fill="#3b82f6" name="Units Completed" />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#22c55e" 
                  name="Cumulative Units"
                  strokeWidth={2} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
