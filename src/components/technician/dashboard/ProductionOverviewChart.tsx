
import React, { useMemo } from 'react';
import { CheckCheck, CalendarDays } from 'lucide-react';
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
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { useApp } from '@/context/AppContext';
import { formatUnits } from '@/utils/charts';

interface ProductionOverviewChartProps {
  completedTasks: Task[];
}

// Sample task data for demonstration
const sampleCompletedTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Fiber Installation - Downtown',
    description: 'Install 75 feet of fiber optic cable',
    location: { address: '123 Main St', lat: 37.7749, lng: -122.4194 },
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-06-01'),
    projectId: '1',
    projectName: 'Downtown Fiber Expansion',
    teamMemberId: '1',
    teamMemberName: 'Alex Johnson',
    priority: 'medium',
    status: 'completed',
    billingCodeId: 'code-1',
    quantityEstimate: 75
  },
  {
    id: 'task-2',
    title: 'Splicing - Business District',
    description: 'Complete fiber splicing for business district',
    location: { address: '456 Market St', lat: 37.7899, lng: -122.4014 },
    startDate: new Date('2023-06-03'),
    endDate: new Date('2023-06-03'),
    projectId: '1',
    projectName: 'Downtown Fiber Expansion',
    teamMemberId: '1',
    teamMemberName: 'Alex Johnson',
    priority: 'high',
    status: 'completed',
    billingCodeId: 'code-6',
    quantityEstimate: 30
  },
  {
    id: 'task-3',
    title: 'Aerial Installation',
    description: 'Complete 120 feet of aerial installation',
    location: { address: '789 Oak St', lat: 37.7691, lng: -122.4449 },
    startDate: new Date('2023-06-05'),
    endDate: new Date('2023-06-05'),
    projectId: '1',
    projectName: 'Downtown Fiber Expansion',
    teamMemberId: '1',
    teamMemberName: 'Alex Johnson',
    priority: 'medium',
    status: 'completed',
    billingCodeId: 'code-3',
    quantityEstimate: 120
  },
  {
    id: 'task-4',
    title: 'Underground Installation',
    description: 'Install 200 feet of underground conduit',
    location: { address: '101 Pine St', lat: 37.7924, lng: -122.3990 },
    startDate: new Date('2023-06-10'),
    endDate: new Date('2023-06-10'),
    projectId: '2',
    projectName: 'Westside Business District',
    teamMemberId: '1',
    teamMemberName: 'Alex Johnson',
    priority: 'high',
    status: 'completed',
    billingCodeId: 'code-1',
    quantityEstimate: 200
  },
  {
    id: 'task-5',
    title: 'Equipment Installation',
    description: 'Install networking equipment at 3 locations',
    location: { address: '222 Montgomery St', lat: 37.7904, lng: -122.4024 },
    startDate: new Date('2023-06-15'),
    endDate: new Date('2023-06-15'),
    projectId: '2',
    projectName: 'Westside Business District',
    teamMemberId: '1',
    teamMemberName: 'Alex Johnson',
    priority: 'medium',
    status: 'completed',
    billingCodeId: 'code-5',
    quantityEstimate: 3
  }
];

export const ProductionOverviewChart: React.FC<ProductionOverviewChartProps> = ({ 
  completedTasks = sampleCompletedTasks // Use sample data as default
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
    // Use sample data if no tasks provided
    const tasksToProcess = completedTasks.length > 0 ? completedTasks : sampleCompletedTasks;
    
    if (tasksToProcess.length === 0) return [];

    // Filter tasks based on project if selected
    let filteredTasks = tasksToProcess;
    if (selectedProject) {
      filteredTasks = filteredTasks.filter(task => task.projectId === selectedProject);
    }

    // Filter by team member if selected
    if (selectedTeamMember) {
      filteredTasks = filteredTasks.filter(task => task.teamMemberId === selectedTeamMember);
    }

    // Get the current date and the date 12 months ago
    const today = new Date();
    const twelveMonthsAgo = subMonths(today, 11); // 11 months ago to include current month (total 12)
    
    // Create an array of all months in the 12-month period
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthDate = subMonths(today, i);
      return {
        date: monthDate,
        name: format(monthDate, 'MMM yyyy')
      };
    }).reverse(); // To get chronological order
    
    // Initialize data structure with all months (ensures we have all 12 months even if some have no data)
    const groupedData = months.reduce((acc, month) => {
      acc[month.name] = { units: 0, tasks: 0 };
      return acc;
    }, {} as Record<string, { units: number, tasks: number }>);
    
    // Group tasks by month
    filteredTasks.forEach(task => {
      // Only include tasks that were completed within the last 12 months
      const monthStart = startOfMonth(task.endDate);
      const monthEnd = endOfMonth(task.endDate);
      
      if (isWithinInterval(task.endDate, { 
        start: startOfMonth(twelveMonthsAgo), 
        end: endOfMonth(today) 
      })) {
        const key = format(task.endDate, 'MMM yyyy');
        
        if (groupedData[key]) {
          groupedData[key].units += task.quantityEstimate || 0;
          groupedData[key].tasks += 1;
        }
      }
    });
    
    // Convert to array and add cumulative values
    const dataArray = months.map(month => {
      const monthData = groupedData[month.name];
      return {
        name: month.name,
        units: monthData.units,
        tasks: monthData.tasks
      };
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
  }, [completedTasks, selectedProject, selectedTeamMember]);

  // Calculate max values for scaling
  const maxUnits = Math.max(...chartData.map(item => item.units || 0), 1);
  const maxCumulative = Math.max(...chartData.map(item => item.cumulativeUnits || 0), 1);
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
                {formatUnits(entry.value, billingUnit)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 text-muted-foreground mr-1" />
          <span className="text-xs text-muted-foreground">12-Month Overview</span>
        </div>
      </div>
      {chartData.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No completed tasks to display</p>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
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
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: '#eaeaea' }}
              dy={5}
              height={30}
              // Limit the number of ticks displayed based on container width
              interval="preserveStartEnd"
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={(value) => formatUnits(value, billingUnit)}
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              width={45}
              tickCount={5}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, (maxUnits * dataScale) || 1000]}
              tickFormatter={(value) => formatUnits(value, billingUnit)}
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              width={45}
              tickCount={5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={25}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: '5px' }}
              formatter={(value) => <span className="text-xs font-medium text-gray-700">{value}</span>}
            />
            <Bar 
              yAxisId="left" 
              dataKey="units" 
              name="Units Completed" 
              fill="url(#colorUnits)" 
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              minPointSize={3}
              barSize={20}
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
      )}
    </div>
  );
};
