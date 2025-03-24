
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AppProvider } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { PieChart, Pie, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { Search, Bell, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample data for task status pie chart
const taskStatusData = [
  { name: 'Completed', value: 32, color: '#00b6cf' },
  { name: 'On Hold', value: 25, color: '#7c3aed' },
  { name: 'In Progress', value: 25, color: '#38bdf8' },
  { name: 'Pending', value: 18, color: '#f43f5e' },
];

// Sample data for work log donut chart
const workLogData = [
  { name: 'Product 1', value: 35, color: '#f43f5e' },
  { name: 'Product 2', value: 20, color: '#38bdf8' },
  { name: 'Product 4', value: 25, color: '#fbbf24' },
  { name: 'Product 5', value: 20, color: '#84cc16' },
];

// Sample data for performance line chart
const performanceData = [
  { month: 'Oct 2021', achieved: 3, target: 2.2 },
  { month: 'Nov 2021', achieved: 5, target: 4 },
  { month: 'Dec 2021', achieved: 4, target: 2.5 },
  { month: 'Jan 2022', achieved: 7, target: 5 },
  { month: 'Feb 2022', achieved: 5.5, target: 6 },
  { month: 'Mar 2022', achieved: 6, target: 4.5 },
];

// Sample projects data
const projects = [
  {
    id: 1,
    thumbnails: [
      '/lovable-uploads/62fc6464-989d-406c-91f8-f2e5b251cb6e.png',
      '/lovable-uploads/62fc6464-989d-406c-91f8-f2e5b251cb6e.png',
      '/lovable-uploads/62fc6464-989d-406c-91f8-f2e5b251cb6e.png'
    ],
    filesCount: 52
  }
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Grid2X2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xl font-medium">Projects</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {projects[0].filesCount} files
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {projects[0].thumbnails.map((thumbnail, index) => (
                <div key={index} className="flex-shrink-0 relative rounded-md overflow-hidden">
                  <img 
                    src={thumbnail}
                    alt={`Project thumbnail ${index+1}`}
                    className="w-40 h-60 object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xl font-medium">Tasks</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-xs h-7">
                This Week <span className="ml-1">▼</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-60 flex items-center justify-center">
              <div className="w-64 h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ml-4">
                <div className="space-y-2">
                  {taskStatusData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></div>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Log Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xl font-medium">Work Log</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-xs h-7">
                This Week <span className="ml-1">▼</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-60 flex items-center justify-center">
              <div className="w-64 h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workLogData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {workLogData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ml-4">
                <div className="space-y-2">
                  {workLogData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></div>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xl font-medium">Performance</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-xs h-7">
                This Week <span className="ml-1">▼</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="achieved"
                    name="Achieved"
                    stroke="#F18E1D"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Target"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#F18E1D] mr-2"></div>
                <span className="text-sm">7 Projects</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#7c3aed] mr-2"></div>
                <span className="text-sm">5 Projects</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
