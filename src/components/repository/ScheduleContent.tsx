
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilterBar } from '@/components/ui/FilterBar';
import { ScheduleMap } from '@/components/schedule/ScheduleMap';
import { ScheduleCalendar } from '@/components/schedule/ScheduleCalendar';
import { MapPin, Calendar } from 'lucide-react';

export const ScheduleContent: React.FC = () => {
  return (
    <>
      <FilterBar />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <Tabs defaultValue="map">
              <TabsList>
                <TabsTrigger value="map">
                  <MapPin className="mr-2 h-4 w-4" />
                  Map View
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar View
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="map" className="mt-0">
              <div className="h-[500px] w-full rounded-md overflow-hidden border">
                <ScheduleMap />
              </div>
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              <div className="h-[500px] w-full rounded-md overflow-hidden border p-4">
                <ScheduleCalendar />
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
