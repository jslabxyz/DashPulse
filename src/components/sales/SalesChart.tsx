
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { SalesData } from '@/utils/salesApi';

interface SalesChartProps {
  dailySales: SalesData[];
  weeklySales: SalesData[];
  monthlySales: SalesData[];
}

type TimeRange = 'daily' | 'weekly' | 'monthly';
type ChartType = 'line' | 'bar';

export function SalesChart({ dailySales, weeklySales, monthlySales }: SalesChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [chartType, setChartType] = useState<ChartType>('line');

  const getData = () => {
    switch (timeRange) {
      case 'weekly':
        return weeklySales;
      case 'monthly':
        return monthlySales;
      default:
        return dailySales;
    }
  };

  const data = getData();

  const formatTooltipValue = (value: any, name: string) => {
    if (name === 'revenue') return [`$${value.toFixed(2)}`, 'Revenue'];
    if (name === 'unitsSold') return [`${value}`, 'Units Sold'];
    if (name === 'orders') return [`${value}`, 'Orders'];
    if (name === 'averageOrderValue') return [`$${value.toFixed(2)}`, 'Avg Order Value'];
    return [value, name];
  };

  const Chart = chartType === 'line' ? LineChart : BarChart;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sales Analytics</CardTitle>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Button
                variant={timeRange === 'daily' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('daily')}
              >
                Daily
              </Button>
              <Button
                variant={timeRange === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('weekly')}
              >
                Weekly
              </Button>
              <Button
                variant={timeRange === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('monthly')}
              >
                Monthly
              </Button>
            </div>
            <div className="flex gap-1">
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
              >
                Line
              </Button>
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                Bar
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <Chart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (timeRange === 'daily') {
                    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }
                  return value;
                }}
              />
              <YAxis yAxisId="revenue" orientation="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="units" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
              
              {chartType === 'line' ? (
                <>
                  <Line
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Revenue"
                  />
                  <Line
                    yAxisId="units"
                    type="monotone"
                    dataKey="unitsSold"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Units Sold"
                  />
                  <Line
                    yAxisId="units"
                    type="monotone"
                    dataKey="orders"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Orders"
                  />
                </>
              ) : (
                <>
                  <Bar yAxisId="revenue" dataKey="revenue" fill="#10b981" name="Revenue" />
                  <Bar yAxisId="units" dataKey="unitsSold" fill="#3b82f6" name="Units Sold" />
                </>
              )}
            </Chart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
