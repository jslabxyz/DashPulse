
import React from 'react';
import { StatsCard } from '@/components/ui/StatsCard';
import { DollarSign, Target, TrendingUp, Zap } from 'lucide-react';
import { PPCCampaign, formatCurrency, formatPercentage } from '@/utils/ppcApi';

interface PPCSummaryProps {
  campaigns: PPCCampaign[];
}

export function PPCSummary({ campaigns }: PPCSummaryProps) {
  const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);
  const totalSales = campaigns.reduce((sum, campaign) => sum + campaign.sales, 0);
  const totalOrders = campaigns.reduce((sum, campaign) => sum + campaign.totalOrders, 0);
  const overallAcos = totalSales > 0 ? (totalSpend / totalSales) * 100 : 0;
  const overallRoas = totalSpend > 0 ? totalSales / totalSpend : 0;
  
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const highAcosCampaigns = campaigns.filter(c => c.acos > 30).length;
  const lowPerformingCampaigns = campaigns.filter(c => c.roas < 3).length;
  
  const alertCount = highAcosCampaigns + lowPerformingCampaigns;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatsCard
        title="Total Ad Spend"
        value={formatCurrency(totalSpend)}
        description="Last 30 days"
        icon={<DollarSign className="h-5 w-5" />}
        trend={-8.2}
        trendLabel="vs last month"
        className="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
      />
      
      <StatsCard
        title="PPC Sales"
        value={formatCurrency(totalSales)}
        description={`${formatPercentage(overallAcos)} ACoS`}
        icon={<TrendingUp className="h-5 w-5" />}
        trend={15.7}
        trendLabel="vs last month"
        className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
      />
      
      <StatsCard
        title="Total Orders"
        value={totalOrders.toLocaleString()}
        description={`ROAS: ${overallRoas.toFixed(2)}`}
        icon={<Target className="h-5 w-5" />}
        trend={12.3}
        trendLabel="vs last month"
        className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
      />
      
      <StatsCard
        title="Campaign Alerts"
        value={alertCount}
        description={`${activeCampaigns} active campaigns`}
        icon={<Zap className="h-5 w-5" />}
        trend={alertCount > 3 ? -25.1 : 8.4}
        trendLabel="alerts this week"
        className={`bg-gradient-to-br ${
          alertCount > 3 
            ? 'from-orange-50 to-orange-100 border-orange-200' 
            : 'from-purple-50 to-purple-100 border-purple-200'
        }`}
      />
    </div>
  );
}
