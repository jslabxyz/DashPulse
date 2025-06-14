
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock PPC data
const ppcData = [
  { campaign: 'Brand Defense', spend: 245, sales: 1850, acos: 13.2, roas: 7.55 },
  { campaign: 'Auto Campaign', spend: 380, sales: 1920, acos: 19.8, roas: 5.05 },
  { campaign: 'Exact Match', spend: 150, sales: 980, acos: 15.3, roas: 6.53 },
  { campaign: 'Broad Match', spend: 290, sales: 1240, acos: 23.4, roas: 4.28 }
];

export function SimplePPCMetrics() {
  const totalSpend = ppcData.reduce((sum, campaign) => sum + campaign.spend, 0);
  const totalSales = ppcData.reduce((sum, campaign) => sum + campaign.sales, 0);
  const overallAcos = (totalSpend / totalSales) * 100;
  const overallRoas = totalSales / totalSpend;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">PPC Performance</CardTitle>
        <p className="text-sm text-muted-foreground">Campaign performance overview</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Ad Spend</p>
            <p className="text-xl font-bold text-blue-600">${totalSpend.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Ad Sales</p>
            <p className="text-xl font-bold text-green-600">${totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Overall ACOS</p>
            <p className="text-xl font-bold text-purple-600">{overallAcos.toFixed(1)}%</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Overall ROAS</p>
            <p className="text-xl font-bold text-orange-600">{overallRoas.toFixed(2)}x</p>
          </div>
        </div>
        
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ppcData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="campaign" angle={-45} textAnchor="end" height={60} fontSize={12} />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'spend') return [`$${Number(value).toFixed(2)}`, 'Spend'];
                  if (name === 'sales') return [`$${Number(value).toFixed(2)}`, 'Sales'];
                  return [value, name];
                }}
              />
              <Bar dataKey="spend" fill="#ef4444" name="spend" />
              <Bar dataKey="sales" fill="#22c55e" name="sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
