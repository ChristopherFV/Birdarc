
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegendContent,
  ChartLegend
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Line,
  ComposedChart,
  Tooltip
} from 'recharts';
import { formatCurrency } from '@/utils/charts';
import { ReceiptText, Clock } from 'lucide-react';

interface InvoicingStatusData {
  name: string;
  wip: number;
  invoiced: number;
  pending: number;
  total: number;
}

const data: InvoicingStatusData[] = [
  { name: 'Jan', wip: 4000, invoiced: 2400, pending: 1200, total: 7600 },
  { name: 'Feb', wip: 3000, invoiced: 2800, pending: 800, total: 6600 },
  { name: 'Mar', wip: 2000, invoiced: 3800, pending: 400, total: 6200 },
  { name: 'Apr', wip: 2780, invoiced: 3908, pending: 600, total: 7288 },
  { name: 'May', wip: 1890, invoiced: 4800, pending: 300, total: 6990 },
  { name: 'Jun', wip: 2390, invoiced: 3800, pending: 500, total: 6690 },
  { name: 'Jul', wip: 3490, invoiced: 4300, pending: 700, total: 8490 },
];

// Fieldvision colors
const chartConfig = {
  wip: {
    label: "Work In Progress",
    color: "#F18E1D" // Orange
  },
  invoiced: {
    label: "Invoiced",
    color: "#00b6cf" // Blue
  },
  pending: {
    label: "Pending Approval",
    color: "#52461B" // Brown
  },
  total: {
    label: "Total Value",
    color: "#9b87f5" // Purple
  }
};

export const InvoicingStatusChart: React.FC = () => {
  return (
    <Card className="col-span-2 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <ReceiptText className="h-5 w-5 text-muted-foreground" />
            <span>Invoicing & WIP Status</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last updated: Today</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[280px] w-full">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E0E0E0', strokeWidth: 1 }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fontSize: 11 }}
                  width={60}
                  tickLine={false}
                  axisLine={false}
                  dx={-5}
                />
                <Tooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar 
                  dataKey="wip" 
                  stackId="a" 
                  fill="#F18E1D" 
                  radius={[4, 4, 0, 0]} 
                  barSize={32}
                />
                <Bar 
                  dataKey="invoiced" 
                  stackId="a" 
                  fill="#00b6cf" 
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="pending" 
                  stackId="a" 
                  fill="#52461B" 
                  radius={[0, 0, 4, 4]}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#9b87f5" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
