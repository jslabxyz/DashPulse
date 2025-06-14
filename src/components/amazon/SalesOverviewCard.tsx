
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { SalesData, formatCurrency } from '@/utils/amazonApi';
import { TrendingUp, ShoppingCart, Package } from 'lucide-react';

interface SalesOverviewCardProps {
  data: SalesData[];
}

export function SalesOverviewCard({ data }: SalesOverviewCardProps) {
  const [viewType, setViewType] = useState<'revenue' | 'units'>('revenue');
  
  // Generate realistic chart data for the past 30 days
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const baseRevenue = 4000;
    const trend = i * 50; // Slight upward trend
    const randomVariation = (Math.random() - 0.5) * 1000;
    const revenue = Math.max(2000, baseRevenue + trend + randomVariation);
    
    return {
      day: i + 1,
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.round(revenue),
      units: Math.round(revenue / 55), // Average price around $55
      orders: Math.round(revenue / 110) // Average order value around $110
    };
  });
  
  const currentMonth = data.find(d => d.period === 'This Month') || data[0];
  
  const formatTooltipValue = (value: any, name: string) => {
    if (value === undefined || value === null) return ['N/A', name];
    
    if (name === 'revenue') return [formatCurrency(Number(value)), 'Revenue'];
    if (name === 'units') return [Number(value).toLocaleString(), 'Units Sold'];
    return [Number(value).toLocaleString(), name];
  };
  
  return (
    <Card className="animate-slide-up" style={{ '--delay': '200ms' } as React.CSSProperties}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Sales Overview
          </CardTitle>
          <div className="flex gap-2">
            <button
              onClick={() => setViewType('revenue')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === 'revenue' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setViewType('units')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === 'units' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Units
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.map((period) => (
              <div key={period.period} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border">
                <div className="text-sm text-gray-600 mb-1 font-medium">{period.period}</div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(period.revenue)}</div>
                <div className="text-sm text-gray-500 mb-1">{period.units.toLocaleString()} units</div>
                <div className={`text-xs font-medium ${period.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {period.growth >= 0 ? '+' : ''}{period.growth}%
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="h-80">
          <ChartContainer config={{
            revenue: { label: "Revenue", color: "#3b82f6" },
            units: { label: "Units", color: "#10b981" }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              {viewType === 'revenue' ? (
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    interval={Math.floor(chartData.length / 6)}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent formatter={formatTooltipValue} />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    interval={Math.floor(chartData.length / 6)}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent formatter={formatTooltipValue} />} />
                  <Bar 
                    dataKey="units" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <span className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Last 30 days performance
          </span>
          <span className="flex items-center gap-1 font-medium">
            <ShoppingCart className="h-4 w-4" />
            AOV: {formatCurrency(currentMonth.avgOrderValue)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
