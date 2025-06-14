
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { ProfitabilityData, formatCurrency } from '@/utils/amazonApi';
import { DollarSign, TrendingUp } from 'lucide-react';

interface ProfitabilityCardProps {
  data: ProfitabilityData;
}

export function ProfitabilityCard({ data }: ProfitabilityCardProps) {
  const pieData = [
    { name: 'Net Profit', value: data.netProfit, color: '#10b981', percentage: ((data.netProfit / data.revenue) * 100).toFixed(1) },
    { name: 'COGS', value: data.cogs, color: '#f59e0b', percentage: ((data.cogs / data.revenue) * 100).toFixed(1) },
    { name: 'Amazon Fees', value: data.amazonFees, color: '#ef4444', percentage: ((data.amazonFees / data.revenue) * 100).toFixed(1) },
    { name: 'Ad Spend', value: data.adSpend, color: '#8b5cf6', percentage: ((data.adSpend / data.revenue) * 100).toFixed(1) },
    { name: 'Returns', value: data.returns, color: '#6b7280', percentage: ((data.returns / data.revenue) * 100).toFixed(1) }
  ];
  
  const formatTooltipValue = (value: any, name: string) => {
    if (value === undefined || value === null) return ['N/A', name];
    
    const item = pieData.find(d => d.name === name);
    return [formatCurrency(Number(value)), `${name} (${item?.percentage || '0'}%)`];
  };
  
  return (
    <Card className="animate-slide-up" style={{ '--delay': '400ms' } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Profitability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-green-600">{formatCurrency(data.netProfit)}</div>
          <div className="text-sm text-gray-600 font-medium">Net Profit This Month</div>
          <div className="flex items-center justify-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-semibold">{data.margin.toFixed(1)}% margin</span>
          </div>
        </div>
        
        <div className="h-56 mb-6">
          <ChartContainer config={{
            profit: { label: "Net Profit", color: "#10b981" },
            cogs: { label: "COGS", color: "#f59e0b" },
            fees: { label: "Amazon Fees", color: "#ef4444" },
            ads: { label: "Ad Spend", color: "#8b5cf6" },
            returns: { label: "Returns", color: "#6b7280" }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent formatter={formatTooltipValue} />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="space-y-3">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm p-2 rounded-lg bg-gray-50 border">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-800">{formatCurrency(item.value)}</span>
                <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
