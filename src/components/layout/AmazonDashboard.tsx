
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SalesOverviewCard } from '@/components/amazon/SalesOverviewCard';
import { AdPerformanceCard } from '@/components/amazon/AdPerformanceCard';
import { InventoryStatusCard } from '@/components/amazon/InventoryStatusCard';
import { KeywordRankingsCard } from '@/components/amazon/KeywordRankingsCard';
import { ProfitabilityCard } from '@/components/amazon/ProfitabilityCard';
import { ReviewMonitoringCard } from '@/components/amazon/ReviewMonitoringCard';
import { StatsCard } from '@/components/ui/StatsCard';
import { 
  mockSalesData, 
  mockAdPerformance, 
  mockInventory, 
  mockKeywords, 
  mockProfitability, 
  mockReviewData,
  formatCurrency,
  formatPercentage
} from '@/utils/amazonApi';
import { 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  Star,
  DollarSign,
  Target,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

export function AmazonDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const todaySales = mockSalesData[0];
  const totalAdSpend = mockAdPerformance.reduce((sum, ad) => sum + ad.spend, 0);
  const totalAdSales = mockAdPerformance.reduce((sum, ad) => sum + ad.sales, 0);
  const overallAcos = (totalAdSpend / totalAdSales) * 100;
  const criticalInventory = mockInventory.filter(item => item.status === 'critical' || item.status === 'out_of_stock').length;
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        
        <main className="flex-1 transition-all duration-300 ease-in-out overflow-auto">
          <div className="max-w-full p-6 space-y-6">
            {/* Header Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">DashPulse - Amazon Seller Dashboard</h1>
              <p className="text-gray-600 text-lg">Monitor your marketplace performance and optimize your business</p>
            </div>
            
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                title="Today's Revenue" 
                value={formatCurrency(todaySales.revenue)}
                trend={todaySales.growth}
                trendLabel={`${todaySales.units} units sold`}
                icon={<DollarSign className="h-5 w-5" />}
                className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300"
              />
              <StatsCard 
                title="Overall ACOS" 
                value={`${overallAcos.toFixed(1)}%`}
                description="Advertising cost of sales"
                icon={<Target className="h-5 w-5" />}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300"
              />
              <StatsCard 
                title="Net Profit Margin" 
                value={`${mockProfitability.margin.toFixed(1)}%`}
                description="This month"
                icon={<TrendingUp className="h-5 w-5" />}
                className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300"
              />
              <StatsCard 
                title="Inventory Alerts" 
                value={criticalInventory}
                description="Items need attention"
                icon={<AlertTriangle className="h-5 w-5" />}
                className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300"
              />
            </div>
            
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Primary Content - Left Side */}
              <div className="xl:col-span-8 space-y-6">
                <SalesOverviewCard data={mockSalesData} />
                <AdPerformanceCard data={mockAdPerformance} />
                <KeywordRankingsCard data={mockKeywords} />
              </div>
              
              {/* Secondary Content - Right Side */}
              <div className="xl:col-span-4 space-y-6">
                <ProfitabilityCard data={mockProfitability} />
                <ReviewMonitoringCard data={mockReviewData} />
                <InventoryStatusCard data={mockInventory} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
