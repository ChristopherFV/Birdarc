
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
import { 
  Card,
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";

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
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Production Overview</CardTitle>
        <CardDescription>
          Feet completed over time
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="h-[420px] w-full px-2 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorFeet" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="formattedDate" 
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={{ stroke: '#eaeaea' }}
                dy={10}
              />
              <YAxis 
                yAxisId="left"
                tickFormatter={value => `${value} ft`}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, (maxFeet * dataScale) || 1000]}
                tickFormatter={value => `${value} ft`}
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
                dataKey="feet" 
                name="Feet Completed" 
                fill="url(#colorFeet)" 
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
              <Line 
                yAxisId="right" 
                dataKey="cumulativeFeet" 
                name="Cumulative Feet" 
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
      </CardContent>
    </Card>
  );
};
