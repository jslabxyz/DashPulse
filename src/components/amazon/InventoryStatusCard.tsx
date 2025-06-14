
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { InventoryItem, getStatusColor } from '@/utils/amazonApi';
import { Package, AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface InventoryStatusCardProps {
  data: InventoryItem[];
}

export function InventoryStatusCard({ data }: InventoryStatusCardProps) {
  const statusCounts = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Generate realistic inventory trend data for the past 7 days
  const inventoryTrendData = Array.from({ length: 7 }, (_, i) => {
    const baseLevel = 82;
    const trendVariation = (Math.random() - 0.5) * 6;
    const level = Math.max(75, Math.min(95, baseLevel + trendVariation));
    
    return {
      day: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      level: parseFloat(level.toFixed(1))
    };
  });
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'low': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'out_of_stock': return <XCircle className="h-4 w-4 text-red-800" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };
  
  const criticalItems = data.filter(item => item.status === 'critical' || item.status === 'out_of_stock');
  
  const formatTooltipValue = (value: any, name: string) => {
    if (value === undefined || value === null) return ['N/A', 'Inventory Level'];
    return [`${Number(value).toFixed(0)}%`, 'Inventory Level'];
  };
  
  return (
    <Card className="animate-slide-up" style={{ '--delay': '500ms' } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Package className="h-5 w-5 text-green-600" />
          Inventory Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Status Summary Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-xs text-green-600 mb-1 font-medium">Healthy</div>
            <div className="text-xl font-bold text-green-700">{statusCounts.healthy || 0}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
            <div className="text-xs text-yellow-600 mb-1 font-medium">Low Stock</div>
            <div className="text-xl font-bold text-yellow-700">{statusCounts.low || 0}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
            <div className="text-xs text-red-600 mb-1 font-medium">Critical</div>
            <div className="text-xl font-bold text-red-700">{statusCounts.critical || 0}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-lg border border-red-300">
            <div className="text-xs text-red-800 mb-1 font-medium">Out of Stock</div>
            <div className="text-xl font-bold text-red-900">{statusCounts.out_of_stock || 0}</div>
          </div>
        </div>
        
        {/* Inventory Trend Chart */}
        <div className="mb-6">
          <div className="text-sm font-medium mb-3 text-gray-700">Inventory Level Trend (Last 7 Days)</div>
          <div className="h-40">
            <ChartContainer config={{
              level: { label: "Inventory Level", color: "#10b981" }
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inventoryTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    domain={[70, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent formatter={formatTooltipValue} />} />
                  <Line 
                    type="monotone" 
                    dataKey="level" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
        
        {/* Critical Items List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-semibold text-gray-700">Items Needing Attention</span>
          </div>
          
          {criticalItems.slice(0, 4).map((item) => (
            <div key={item.sku} className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(item.status)}
                  <span className="font-medium text-sm truncate text-gray-800">{item.title}</span>
                </div>
                <div className="text-xs text-gray-600">
                  SKU: {item.sku}
                </div>
              </div>
              <div className="text-right ml-3">
                <div className="font-bold text-sm text-red-700">{item.unitsAvailable}</div>
                <div className="text-xs text-red-600 font-medium">{item.daysOfSupply}d left</div>
              </div>
            </div>
          ))}
          
          {criticalItems.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-sm font-medium">All products have healthy inventory levels</div>
            </div>
          )}
        </div>
        
        {criticalItems.length > 4 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
              View all {criticalItems.length} critical items →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
