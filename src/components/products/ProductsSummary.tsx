
import React from 'react';
import { StatsCard } from '@/components/ui/StatsCard';
import { DollarSign, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { Product, formatCurrency, formatPercentage } from '@/utils/productsApi';

interface ProductsSummaryProps {
  products: Product[];
}

export function ProductsSummary({ products }: ProductsSummaryProps) {
  const totalRevenue = products.reduce((sum, product) => sum + product.revenue, 0);
  const totalProfit = products.reduce((sum, product) => sum + product.profit, 0);
  const totalUnitsSold = products.reduce((sum, product) => sum + product.unitsSold, 0);
  const overallProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  const lowStockProducts = products.filter(p => p.inventory < 50 && p.inventory > 0).length;
  const outOfStockProducts = products.filter(p => p.inventory === 0).length;
  const attentionProducts = products.filter(p => p.status === 'attention').length;
  
  const alertCount = lowStockProducts + outOfStockProducts + attentionProducts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        description="Last 30 days"
        icon={<DollarSign className="h-5 w-5" />}
        trend={12.5}
        trendLabel="vs last month"
        className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
      />
      
      <StatsCard
        title="Total Profit"
        value={formatCurrency(totalProfit)}
        description={`${formatPercentage(overallProfitMargin)} margin`}
        icon={<TrendingUp className="h-5 w-5" />}
        trend={8.3}
        trendLabel="vs last month"
        className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
      />
      
      <StatsCard
        title="Units Sold"
        value={totalUnitsSold.toLocaleString()}
        description="Total units"
        icon={<Package className="h-5 w-5" />}
        trend={5.7}
        trendLabel="vs last month"
        className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
      />
      
      <StatsCard
        title="Inventory Alerts"
        value={alertCount}
        description={`${outOfStockProducts} out of stock, ${lowStockProducts} low stock`}
        icon={<AlertTriangle className="h-5 w-5" />}
        trend={alertCount > 5 ? -15.2 : 2.1}
        trendLabel="alerts this week"
        className={`bg-gradient-to-br ${
          alertCount > 5 
            ? 'from-red-50 to-red-100 border-red-200' 
            : 'from-orange-50 to-orange-100 border-orange-200'
        }`}
      />
    </div>
  );
}
