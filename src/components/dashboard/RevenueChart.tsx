
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
  Area,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { prepareRevenueData, formatCurrency } from '@/utils/charts';
import { ChartData } from '@/utils/charts';
import { 
  Card,
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";

export const RevenueChart: React.FC = () => {
  const { getFilteredEntries, billingCodes, projects, startDate, endDate, groupBy } = useApp();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      const entries = getFilteredEntries();
      const data = prepareRevenueData(entries, billingCodes, projects, startDate, endDate, groupBy);
      setChartData(data);
    }
  }, [getFilteredEntries, billingCodes, projects, startDate, endDate, groupBy, isMounted]);
  
  // Calculate max values for scaling
  const maxRevenue = Math.max(...chartData.map(item => item.revenue || 0));
  const maxContractorCost = Math.max(...chartData.map(item => item.contractorCost || 0));
  const maxCumulative = Math.max(...chartData.map(item => item.cumulativeProfit || 0));
  const dataScale = maxCumulative > maxRevenue * 5 ? 1.2 : 2;
  
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
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
        <CardDescription>
          Expected revenue from completed work with contractor costs
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
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorContractorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorCumulativeProfit" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={1}/>
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
                tickFormatter={value => formatCurrency(value)}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, (maxRevenue * dataScale) || 10000]}
                tickFormatter={value => formatCurrency(value)}
                tick={{ fontSize: 11, fill: "#64748b" }}
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
                formatter={(value) => <span className="text-xs font-medium text-gray-700">{value}</span>}
              />
              <Bar 
                yAxisId="left" 
                dataKey="revenue" 
                name="Revenue" 
                fill="url(#colorRevenue)" 
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
                stackId="a"
              />
              <Bar 
                yAxisId="left" 
                dataKey="contractorCost" 
                name="Contractor Cost" 
                fill="url(#colorContractorCost)" 
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
                stackId="a"
              />
              <Line 
                yAxisId="right" 
                dataKey="cumulativeProfit" 
                name="Cumulative Profit" 
                type="monotone" 
                stroke="url(#colorCumulativeProfit)"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 0, fill: "#10b981" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
                animationDuration={1500}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
