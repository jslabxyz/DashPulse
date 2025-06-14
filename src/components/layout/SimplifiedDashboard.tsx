
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatsCard } from '@/components/ui/StatsCard';
import { SimpleSalesChart } from '@/components/amazon/SimpleSalesChart';
import { SimplePPCMetrics } from '@/components/amazon/SimplePPCMetrics';
import { 
  DollarSign,
  Target,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

// Mock data with proper fallbacks
const mockDashboardData = {
  todayRevenue: 4250.75,
  todayUnits: 38,
  revenueGrowth: 12.5,
  overallAcos: 18.2,
  profitMargin: 24.8,
  inventoryAlerts: 3
};

export function SimplifiedDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
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
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">DashPulse Dashboard</h1>
              <p className="text-gray-600 text-lg">Monitor your Amazon performance</p>
            </div>
            
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                title="Today's Revenue" 
                value={`$${mockDashboardData.todayRevenue.toFixed(2)}`}
                trend={mockDashboardData.revenueGrowth}
                trendLabel={`${mockDashboardData.todayUnits} units sold`}
                icon={<DollarSign className="h-5 w-5" />}
                className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300"
              />
              <StatsCard 
                title="Overall ACOS" 
                value={`${mockDashboardData.overallAcos.toFixed(1)}%`}
                description="Advertising cost of sales"
                icon={<Target className="h-5 w-5" />}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300"
              />
              <StatsCard 
                title="Profit Margin" 
                value={`${mockDashboardData.profitMargin.toFixed(1)}%`}
                description="This month"
                icon={<TrendingUp className="h-5 w-5" />}
                className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300"
              />
              <StatsCard 
                title="Inventory Alerts" 
                value={mockDashboardData.inventoryAlerts}
                description="Items need attention"
                icon={<AlertTriangle className="h-5 w-5" />}
                className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300"
              />
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SimpleSalesChart />
              <SimplePPCMetrics />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
