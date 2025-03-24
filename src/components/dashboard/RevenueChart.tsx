import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useIsMobile } from '@/hooks/use-mobile';

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-md p-2 shadow-md">
        <p className="font-bold">{label}</p>
        {payload.map((item: any) => (
          <p key={item.dataKey} className="text-gray-700">
            {item.name}: <span className="font-medium">${item.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const useChartData = (workEntries: any, billingCodes: any, dateRange: any, groupBy: any, startDate: any, endDate: any) => {
  const [chartData, setChartData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    setIsLoading(true);
    
    // Group entries by the specified time interval
    const groupedEntries = workEntries.reduce((acc: any, entry: any) => {
      const entryDate = new Date(entry.date);
      let interval: string = '';
      
      switch (groupBy) {
        case 'day':
          interval = format(entryDate, 'MMM d');
          break;
        case 'week':
          const startOfWeek = format(entryDate, 'MMM d');
          const endOfWeek = format(new Date(entryDate.setDate(entryDate.getDate() + 6)), 'MMM d');
          interval = `${startOfWeek} - ${endOfWeek}`;
          break;
        case 'month':
          interval = format(entryDate, 'MMM yyyy');
          break;
        case 'year':
          interval = format(entryDate, 'yyyy');
          break;
        default:
          interval = format(entryDate, 'MMM d');
      }
      
      if (!acc[interval]) {
        acc[interval] = {
          notInvoiced: 0,
          invoiced: 0,
          paid: 0,
          total: 0,
          name: interval,
        };
      }
      
      const billingCode = billingCodes.find((code: any) => code.id === entry.billingCodeId);
      const revenue = billingCode ? entry.feetCompleted * billingCode.ratePerFoot : 0;
      
      switch (entry.invoiceStatus) {
        case 'not_invoiced':
          acc[interval].notInvoiced += revenue;
          break;
        case 'invoiced':
          acc[interval].invoiced += revenue;
          break;
        case 'paid':
          acc[interval].paid += revenue;
          break;
      }
      
      acc[interval].total += revenue;
      return acc;
    }, {});
    
    // Convert grouped entries to array
    const chartDataArray = Object.values(groupedEntries);
    setChartData(chartDataArray);
    setIsLoading(false);
  }, [workEntries, billingCodes, dateRange, groupBy, startDate, endDate]);
  
  return { chartData, isLoading };
};

export const RevenueChart = () => {
  const { workEntries, billingCodes, dateRange, groupBy, startDate, endDate } = useApp();
  const { chartData, isLoading } = useChartData(workEntries, billingCodes, dateRange, groupBy, startDate, endDate);
  const isMobile = useIsMobile();
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl">Revenue</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Revenue from {format(startDate, 'MMM d, yyyy')} to {format(endDate, 'MMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <ReloadIcon className="h-6 w-6 animate-spin text-primary/50" />
          </div>
        ) : (
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: isMobile ? 5 : 20,
                  left: isMobile ? 0 : 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  fontSize={isMobile ? 10 : 12}
                  tickMargin={10}
                  tick={{ fill: 'var(--foreground)' }}
                  tickFormatter={isMobile ? (value) => value.substring(0, 3) : undefined}
                />
                <YAxis 
                  fontSize={isMobile ? 10 : 12}
                  tick={{ fill: 'var(--foreground)' }}
                  tickFormatter={(value) => `$${value}`}
                  width={isMobile ? 45 : 60}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}
                  iconSize={isMobile ? 8 : 10}
                />
                <Bar 
                  name="Not Invoiced" 
                  dataKey="notInvoiced" 
                  fill="var(--color-wip)" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  name="Invoiced" 
                  dataKey="invoiced" 
                  fill="var(--color-invoiced)" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  name="Paid" 
                  dataKey="paid" 
                  fill="var(--color-pending)" 
                  radius={[4, 4, 0, 0]} 
                />
                <Line 
                  name="Total" 
                  type="monotone" 
                  dataKey="total" 
                  stroke="var(--color-total)" 
                  strokeWidth={2} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
