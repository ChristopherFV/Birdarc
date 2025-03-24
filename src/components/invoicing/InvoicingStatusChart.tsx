
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

const chartConfig = {
  wip: {
    label: "Work In Progress",
    color: "#f97316"  // Orange
  },
  invoiced: {
    label: "Invoiced",
    color: "#22c55e"  // Green
  },
  pending: {
    label: "Pending Approval",
    color: "#f59e0b"  // Amber
  },
  total: {
    label: "Total Value",
    color: "#6366f1"  // Indigo
  }
};

export const InvoicingStatusChart: React.FC = () => {
  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
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
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="wip" stackId="a" fill="var(--color-wip)" />
                <Bar dataKey="invoiced" stackId="a" fill="var(--color-invoiced)" />
                <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="var(--color-total)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
