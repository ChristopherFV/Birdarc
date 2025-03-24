
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/utils/charts';
import { ReceiptText } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface InvoicingStatusData {
  name: string;
  wip: number;
  invoiced: number;
  pending: number;
  total: number;
  formattedDate: string;
}

export const InvoicingStatusChart: React.FC = () => {
  const { getFilteredEntries, billingCodes, projects, startDate, endDate, groupBy } = useApp();
  const [chartData, setChartData] = useState<InvoicingStatusData[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      // This would typically be replaced with actual data processing
      // Here we're using mock data for demonstration
      const data: InvoicingStatusData[] = [
        { name: 'Jan', formattedDate: 'Jan', wip: 4000, invoiced: 2400, pending: 1200, total: 7600 },
        { name: 'Feb', formattedDate: 'Feb', wip: 3000, invoiced: 2800, pending: 800, total: 6600 },
        { name: 'Mar', formattedDate: 'Mar', wip: 2000, invoiced: 3800, pending: 400, total: 6200 },
        { name: 'Apr', formattedDate: 'Apr', wip: 2780, invoiced: 3908, pending: 600, total: 7288 },
        { name: 'May', formattedDate: 'May', wip: 1890, invoiced: 4800, pending: 300, total: 6990 },
        { name: 'Jun', formattedDate: 'Jun', wip: 2390, invoiced: 3800, pending: 500, total: 6690 },
        { name: 'Jul', formattedDate: 'Jul', wip: 3490, invoiced: 4300, pending: 700, total: 8490 },
      ];
      setChartData(data);
    }
  }, [getFilteredEntries, billingCodes, projects, startDate, endDate, groupBy, isMounted]);
  
  // Calculate max values for scaling
  const maxRevenue = Math.max(...chartData.map(item => Math.max(item.wip, item.invoiced, item.pending)));
  const maxCumulative = Math.max(...chartData.map(item => item.total));
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
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Invoicing Overview</CardTitle>
        <CardDescription>
          Revenue breakdown by work in progress, invoiced, and pending approval
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
                <linearGradient id="colorWIP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F18E1D" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F18E1D" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorInvoiced" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00b6cf" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00b6cf" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#52461B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#52461B" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#9b87f5" stopOpacity={1}/>
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
                dataKey="wip" 
                name="Work In Progress" 
                fill="url(#colorWIP)" 
                radius={[4, 4, 0, 0]}
                barSize={32}
                animationDuration={1000}
                stackId="a"
              />
              <Bar 
                yAxisId="left" 
                dataKey="invoiced" 
                name="Invoiced" 
                fill="url(#colorInvoiced)" 
                animationDuration={1000}
                stackId="a"
              />
              <Bar 
                yAxisId="left" 
                dataKey="pending" 
                name="Pending Approval" 
                fill="url(#colorPending)" 
                radius={[0, 0, 4, 4]}
                animationDuration={1000}
                stackId="a"
              />
              <Line 
                yAxisId="right" 
                dataKey="total" 
                name="Total Value" 
                type="monotone" 
                stroke="url(#colorTotal)"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 0, fill: "#9b87f5" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#9b87f5" }}
                animationDuration={1500}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
