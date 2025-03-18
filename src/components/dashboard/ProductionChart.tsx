
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
import { prepareProductionData, formatFeet } from '@/utils/charts';
import { ChartData } from '@/utils/charts';

export const ProductionChart: React.FC = () => {
  const { getFilteredEntries, startDate, endDate, groupBy } = useApp();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      const entries = getFilteredEntries();
      const data = prepareProductionData(entries, startDate, endDate, groupBy);
      setChartData(data);
    }
  }, [getFilteredEntries, startDate, endDate, groupBy, isMounted]);
  
  // Calculate max values for scaling
  const maxFeet = Math.max(...chartData.map(item => item.feet || 0));
  const maxCumulative = Math.max(...chartData.map(item => item.cumulativeFeet || 0));
  const dataScale = maxCumulative > maxFeet * 5 ? 1.2 : 2;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-[#E6E6E6] shadow-sm rounded-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center text-sm mb-1">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="mr-2">{entry.name}:</span>
              <span className="font-medium">
                {formatFeet(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white rounded-3xl border border-[#E6E6E6] shadow-sm p-5 mb-6 animate-in fade-in" style={{ animationDelay: '100ms' }}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-[#262626]">Production Overview</h3>
        <p className="text-[#6B6B6B] text-sm">
          Feet completed over time
        </p>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12, fill: "#6B6B6B" }}
              tickLine={false}
              axisLine={{ stroke: '#E6E6E6' }}
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={value => `${value} ft`}
              tick={{ fontSize: 12, fill: "#6B6B6B" }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, (maxFeet * dataScale) || 1000]}
              tickFormatter={value => `${value} ft`}
              tick={{ fontSize: 12, fill: "#6B6B6B" }}
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
            />
            <Bar 
              yAxisId="left" 
              dataKey="feet" 
              name="Feet Completed" 
              fill="#9575CD" 
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
            <Line 
              yAxisId="right" 
              dataKey="cumulativeFeet" 
              name="Cumulative Feet" 
              type="monotone" 
              stroke="#F97316"
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
