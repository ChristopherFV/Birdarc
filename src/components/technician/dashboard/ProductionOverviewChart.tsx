
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCheck } from 'lucide-react';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
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
    selectedTeamMember,
    billingUnit
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
        cumulativeUnits
      };
    });
  }, [completedTasks, groupBy, selectedProject, dateRange, selectedTeamMember]);

  // Format units based on billing unit type
  const formatUnits = (value: number) => {
    switch (billingUnit) {
      case 'foot':
        return `${value} ft`;
      case 'meter':
        return `${value} m`;
      case 'each':
        return value.toString();
      default:
        return `${value} units`;
    }
  };

  // Calculate max values for scaling
  const maxUnits = Math.max(...chartData.map(item => item.units || 0));
  const maxCumulative = Math.max(...chartData.map(item => item.cumulativeUnits || 0));
  const dataScale = maxCumulative > maxUnits * 5 ? 1.2 : 2;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg bg-white p-3 shadow-md border border-gray-100">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center text-sm mb-1">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="mr-2 text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-800">
                {formatUnits(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <div className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCheck className="h-5 w-5" />
              Production Overview
            </CardTitle>
            <CardDescription>
              Units completed over time
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No completed tasks to display</p>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorCumulative" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff9800" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={{ stroke: '#eaeaea' }}
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => formatUnits(value)}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  domain={[0, (maxUnits * dataScale) || 1000]}
                  tickFormatter={(value) => formatUnits(value)}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingBottom: '10px' }}
                  formatter={(value) => <span className="text-xs font-medium text-gray-700">{value}</span>}
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="units" 
                  name="Units Completed" 
                  fill="url(#colorUnits)" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
                <Line 
                  yAxisId="right" 
                  dataKey="cumulativeUnits" 
                  name="Cumulative Units" 
                  type="monotone" 
                  stroke="url(#colorCumulative)"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 0, fill: "#ff9800" }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#ff9800" }}
                  animationDuration={1500}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
