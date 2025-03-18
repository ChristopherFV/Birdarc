
import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { prepareRevenueData, formatCurrency } from '@/utils/charts';
import { ChartData } from '@/utils/charts';

export const RevenueChart: React.FC = () => {
  const { getFilteredEntries, billingCodes, startDate, endDate, groupBy } = useApp();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      const entries = getFilteredEntries();
      const data = prepareRevenueData(entries, billingCodes, startDate, endDate, groupBy);
      setChartData(data);
    }
  }, [getFilteredEntries, billingCodes, startDate, endDate, groupBy, isMounted]);
  
  // Calculate max values for scaling
  const maxRevenue = Math.max(...chartData.map(item => item.revenue || 0));
  const maxCumulative = Math.max(...chartData.map(item => item.cumulativeRevenue || 0));
  const dataScale = maxCumulative > maxRevenue * 5 ? 1.2 : 2;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border shadow-card rounded-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center text-sm mb-1">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="mr-2">{entry.name}:</span>
              <span className="font-medium">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle p-5 mb-6 animate-in fade-in" style={{ animationDelay: '0ms' }}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Revenue Overview</h3>
        <p className="text-muted-foreground text-sm">
          Expected revenue from completed work
        </p>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#eaeaea' }}
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={value => formatCurrency(value)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, (maxRevenue * dataScale) || 10000]}
              tickFormatter={value => formatCurrency(value)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: '10px' }}
            />
            <Bar 
              yAxisId="left" 
              dataKey="revenue" 
              name="Revenue" 
              fill="rgba(3, 155, 229, 0.8)" 
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
            <Line 
              yAxisId="right" 
              dataKey="cumulativeRevenue" 
              name="Cumulative Revenue" 
              type="monotone" 
              stroke="#4CAF50"
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
