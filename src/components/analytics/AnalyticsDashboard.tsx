
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Package, 
  AlertTriangle,
  Download,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { BusinessIntelligence, UnifiedProductData } from '@/utils/unifiedAnalytics';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface AnalyticsDashboardProps {
  analytics: BusinessIntelligence;
  onExportPDF: () => void;
}

export function AnalyticsDashboard({ analytics, onExportPDF }: AnalyticsDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      healthy: { label: 'Healthy', variant: 'default' as const, color: 'text-green-600' },
      low: { label: 'Low Stock', variant: 'secondary' as const, color: 'text-yellow-600' },
      critical: { label: 'Critical', variant: 'destructive' as const, color: 'text-red-600' },
      out_of_stock: { label: 'Out of Stock', variant: 'destructive' as const, color: 'text-red-600' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6" id="analytics-dashboard">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Business Intelligence Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive analysis across Sales, PPC, Products & Inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSelectedTimeframe('7d')}>7 Days</Button>
          <Button variant="outline" onClick={() => setSelectedTimeframe('30d')}>30 Days</Button>
          <Button variant="outline" onClick={() => setSelectedTimeframe('90d')}>90 Days</Button>
          <Button onClick={onExportPDF} className="ml-4">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${analytics.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">+12.5% vs last period</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PPC Spend</p>
                <p className="text-2xl font-bold text-blue-600">${analytics.totalPPCSpend.toLocaleString()}</p>
                <p className="text-xs text-blue-600">ACOS: {analytics.averageACOS.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className="text-2xl font-bold text-purple-600">${analytics.totalProfit.toLocaleString()}</p>
                <p className="text-xs text-purple-600">ROI: {analytics.overallROI.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold text-orange-600">${analytics.inventoryValue.toLocaleString()}</p>
                <p className="text-xs text-orange-600">{analytics.productsAnalyzed} products</p>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Revenue vs PPC Spend Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={analytics.salesTrends.slice(-30)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                <Line type="monotone" dataKey="ppcSpend" stroke="#82ca9d" name="PPC Spend" />
                <Line type="monotone" dataKey="profit" stroke="#ffc658" name="Profit" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Performance & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={analytics.categoryPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, revenue }) => `${category}: $${revenue.toLocaleString()}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {analytics.categoryPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top & Bottom Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-800">Top Performer</h4>
                    <p className="text-sm text-green-600">{analytics.topPerformer.name}</p>
                    <p className="text-xs text-green-600">ASIN: {analytics.topPerformer.asin}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${analytics.topPerformer.profitability.toLocaleString()}</p>
                    <p className="text-xs text-green-600">ROI: {analytics.topPerformer.roi}%</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-800">Needs Attention</h4>
                    <p className="text-sm text-red-600">{analytics.worstPerformer.name}</p>
                    <p className="text-xs text-red-600">ASIN: {analytics.worstPerformer.asin}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">${analytics.worstPerformer.profitability.toLocaleString()}</p>
                    <p className="text-xs text-red-600">ROI: {analytics.worstPerformer.roi}%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Product Performance Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                  <th className="text-right py-3 px-4">PPC Spend</th>
                  <th className="text-right py-3 px-4">ACOS</th>
                  <th className="text-right py-3 px-4">ROI</th>
                  <th className="text-right py-3 px-4">Stock</th>
                  <th className="text-center py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.unifiedProducts.map((product) => (
                  <tr key={product.asin} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.asin}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">${product.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">${product.ppcSpend.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={product.acos < 25 ? 'text-green-600' : product.acos < 50 ? 'text-yellow-600' : 'text-red-600'}>
                        {product.acos.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={product.roi > 100 ? 'text-green-600' : product.roi > 50 ? 'text-yellow-600' : 'text-red-600'}>
                        {product.roi.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">{product.currentStock}</td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(product.stockStatus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
