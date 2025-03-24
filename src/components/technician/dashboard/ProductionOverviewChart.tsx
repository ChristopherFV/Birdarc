
import React from 'react';
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
import { useApp } from '@/context/AppContext';
import { formatUnits } from '@/utils/charts';
import { sampleCompletedTasks } from '@/utils/sampleTaskGenerator';
import { CustomTooltip } from './chart-components/CustomTooltip';
import { ChartGradients } from './chart-components/ChartGradients';
import { useProductionChartData } from '@/hooks/useProductionChartData';

interface ProductionOverviewChartProps {
  completedTasks: Task[];
}

export const ProductionOverviewChart: React.FC<ProductionOverviewChartProps> = ({ 
  completedTasks = sampleCompletedTasks // Use enhanced sample data as default
}) => {
  const { 
    selectedProject,
    selectedTeamMember,
    billingUnit,
    selectedBillingCodeId,
    billingCodes
  } = useApp();

  // Get the unit type from selected billing code
  const getUnitLabel = () => {
    if (selectedBillingCodeId) {
      const selectedCode = billingCodes.find(code => code.id === selectedBillingCodeId);
      return selectedCode?.unitType || billingUnit;
    }
    return billingUnit;
  };

  // Use our custom hook to process chart data
  const { chartData, maxUnits, maxCumulative, dataScale } = useProductionChartData(
    completedTasks,
    selectedProject,
    selectedTeamMember,
    selectedBillingCodeId
  );

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 text-muted-foreground mr-1" />
          <span className="text-xs text-muted-foreground">12-Month Overview</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {selectedBillingCodeId ? 
            `Filtered by: ${billingCodes.find(b => b.id === selectedBillingCodeId)?.description || "Selected Billing Code"}` : 
            "All billing codes"}
        </div>
      </div>
      {chartData.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No completed tasks to display</p>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <ComposedChart data={chartData}>
            <ChartGradients />
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
              tickFormatter={(value) => formatUnits(value, getUnitLabel())}
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
              tickFormatter={(value) => formatUnits(value, getUnitLabel())}
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              width={45}
              tickCount={5}
            />
            <Tooltip content={<CustomTooltip billingUnit={getUnitLabel()} />} />
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
