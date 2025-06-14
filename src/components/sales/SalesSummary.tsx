
import React from 'react';
import { DollarSign, ShoppingCart, Package, TrendingUp, Percent, RotateCcw } from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { SalesAnalytics } from '@/utils/salesApi';

interface SalesSummaryProps {
  analytics: SalesAnalytics;
}

export function SalesSummary({ analytics }: SalesSummaryProps) {
  const calculateTrend = (data: any[], key: string) => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1][key];
    const previous = data[data.length - 2][key];
    return ((current - previous) / previous) * 100;
  };

  const revenueTrend = calculateTrend(analytics.dailySales, 'revenue');
  const ordersTrend = calculateTrend(analytics.dailySales, 'orders');
  const unitsTrend = calculateTrend(analytics.dailySales, 'unitsSold');
  const aovTrend = calculateTrend(analytics.dailySales, 'averageOrderValue');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <StatsCard
        title="Total Revenue"
        value={`$${analytics.totalRevenue.toLocaleString()}`}
        icon={<DollarSign />}
        trend={revenueTrend}
        trendLabel="vs yesterday"
        className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
        valueClassName="text-green-600"
      />
      
      <StatsCard
        title="Total Orders"
        value={analytics.totalOrders.toLocaleString()}
        icon={<ShoppingCart />}
        trend={ordersTrend}
        trendLabel="vs yesterday"
        className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
        valueClassName="text-blue-600"
      />
      
      <StatsCard
        title="Units Sold"
        value={analytics.totalUnits.toLocaleString()}
        icon={<Package />}
        trend={unitsTrend}
        trendLabel="vs yesterday"
        className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200"
        valueClassName="text-purple-600"
      />
      
      <StatsCard
        title="Avg Order Value"
        value={`$${analytics.averageOrderValue.toFixed(2)}`}
        icon={<TrendingUp />}
        trend={aovTrend}
        trendLabel="vs yesterday"
        className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"
        valueClassName="text-orange-600"
      />
      
      <StatsCard
        title="Conversion Rate"
        value={`${analytics.conversionRate.toFixed(1)}%`}
        icon={<Percent />}
        trend={2.3}
        trendLabel="vs yesterday"
        className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200"
        valueClassName="text-teal-600"
      />
      
      <StatsCard
        title="Profit Margin"
        value={`${analytics.profitMargin.toFixed(1)}%`}
        icon={<RotateCcw />}
        trend={-0.8}
        trendLabel="vs yesterday"
        className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200"
        valueClassName="text-rose-600"
      />
    </div>
  );
}
