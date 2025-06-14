
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AdPerformance, formatCurrency, formatPercentage } from '@/utils/amazonApi';
import { Target, TrendingUp, MousePointer, Eye } from 'lucide-react';

interface AdPerformanceCardProps {
  data: AdPerformance[];
}

export function AdPerformanceCard({ data }: AdPerformanceCardProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'products' | 'brands' | 'display'>('overview');
  
  const totalSpend = data.reduce((sum, ad) => sum + ad.spend, 0);
  const totalSales = data.reduce((sum, ad) => sum + ad.sales, 0);
  const overallAcos = (totalSpend / totalSales) * 100;
  const overallRoas = totalSales / totalSpend;
  
  // Generate realistic ACOS trend data for the past 7 days
  const acosChartData = Array.from({ length: 7 }, (_, i) => {
    const baseAcos = 18;
    const randomVariation = (Math.random() - 0.5) * 4;
    const acos = Math.max(12, Math.min(25, baseAcos + randomVariation));
    
    return {
      day: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      acos: parseFloat(acos.toFixed(1))
    };
  });
  
  const sponsoredData = {
    products: {
      impressions: 125680,
      clicks: 3234,
      ctr: 2.57,
      conversions: 189,
      acos: 15.2,
      roas: 6.7
    },
    brands: {
      impressions: 78650,
      clicks: 1874,
      ctr: 2.39,
      conversions: 134,
      acos: 19.1,
      roas: 5.3
    },
    display: {
      impressions: 45230,
      clicks: 567,
      ctr: 1.25,
      conversions: 67,
      acos: 32.4,
      roas: 3.1
    }
  };
  
  const formatTooltipValue = (value: any, name: string) => {
    if (value === undefined || value === null) return ['N/A', 'ACOS'];
    return [`${Number(value).toFixed(1)}%`, 'ACOS'];
  };
  
  return (
    <Card className="animate-slide-up" style={{ '--delay': '300ms' } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          ACOS / ROAS Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-xs text-purple-600 mb-1 font-medium">Total Spend</div>
            <div className="text-lg font-bold text-purple-800">{formatCurrency(totalSpend)}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-xs text-green-600 mb-1 font-medium">Total Sales</div>
            <div className="text-lg font-bold text-green-800">{formatCurrency(totalSales)}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-600 mb-1 font-medium">Overall ACOS</div>
            <div className="text-lg font-bold text-blue-800">{overallAcos.toFixed(1)}%</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="text-xs text-orange-600 mb-1 font-medium">Overall ROAS</div>
            <div className="text-lg font-bold text-orange-800">{overallRoas.toFixed(1)}x</div>
          </div>
        </div>
        
        {/* ACOS Trend Chart */}
        <div className="mb-6">
          <div className="text-sm font-medium mb-3 text-gray-700">ACOS Trend (Last 7 Days)</div>
          <div className="h-48">
            <ChartContainer config={{
              acos: { label: "ACOS %", color: "#3b82f6" }
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={acosChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                    domain={[10, 25]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent formatter={formatTooltipValue} />} />
                  <Line 
                    type="monotone" 
                    dataKey="acos" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
        
        {/* Campaign Type Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'products', label: 'Products' },
            { key: 'brands', label: 'Brands' },
            { key: 'display', label: 'Display' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors font-medium ${
                selectedTab === tab.key 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Campaign Details */}
        {selectedTab === 'overview' && (
          <div className="space-y-3">
            {Object.entries(sponsoredData).map(([type, metrics]) => (
              <div key={type} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                <div className="flex-1">
                  <div className="font-semibold text-sm capitalize text-gray-800">{type}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {metrics.impressions.toLocaleString()} impressions • {metrics.clicks.toLocaleString()} clicks
                  </div>
                </div>
                <div className="flex gap-6 text-xs">
                  <div className="text-center">
                    <div className="text-gray-600 font-medium">CTR</div>
                    <div className="font-bold text-gray-800">{metrics.ctr}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 font-medium">ACOS</div>
                    <div className={`font-bold ${
                      metrics.acos <= 20 ? 'text-green-600' : 
                      metrics.acos <= 30 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {metrics.acos}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 font-medium">ROAS</div>
                    <div className="font-bold text-blue-600">{metrics.roas.toFixed(1)}x</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {selectedTab !== 'overview' && (
          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{sponsoredData[selectedTab as keyof typeof sponsoredData].impressions.toLocaleString()}</div>
                <div className="text-sm text-gray-600 font-medium">Impressions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{sponsoredData[selectedTab as keyof typeof sponsoredData].clicks.toLocaleString()}</div>
                <div className="text-sm text-gray-600 font-medium">Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{sponsoredData[selectedTab as keyof typeof sponsoredData].conversions}</div>
                <div className="text-sm text-gray-600 font-medium">Conversions</div>
              </div>
            </div>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-sm text-gray-600 font-medium">ACOS</div>
                <div className={`text-2xl font-bold ${
                  sponsoredData[selectedTab as keyof typeof sponsoredData].acos <= 20 ? 'text-green-600' : 
                  sponsoredData[selectedTab as keyof typeof sponsoredData].acos <= 30 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {sponsoredData[selectedTab as keyof typeof sponsoredData].acos}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 font-medium">ROAS</div>
                <div className="text-2xl font-bold text-blue-600">
                  {sponsoredData[selectedTab as keyof typeof sponsoredData].roas.toFixed(1)}x
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
