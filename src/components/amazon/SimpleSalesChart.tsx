
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock sales data for the last 7 days
const salesData = [
  { day: 'Mon', revenue: 3850, units: 34 },
  { day: 'Tue', revenue: 4120, units: 38 },
  { day: 'Wed', revenue: 3950, units: 36 },
  { day: 'Thu', revenue: 4350, units: 41 },
  { day: 'Fri', revenue: 4680, units: 45 },
  { day: 'Sat', revenue: 4250, units: 38 },
  { day: 'Sun', revenue: 4250, units: 38 }
];

export function SimpleSalesChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Sales Overview</CardTitle>
        <p className="text-sm text-muted-foreground">Last 7 days performance</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'revenue') {
                    return [`$${Number(value).toFixed(2)}`, 'Revenue'];
                  }
                  return [value, 'Units'];
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue (7d)</p>
            <p className="text-2xl font-bold text-green-600">
              ${salesData.reduce((sum, day) => sum + day.revenue, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Units (7d)</p>
            <p className="text-2xl font-bold text-blue-600">
              {salesData.reduce((sum, day) => sum + day.units, 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
