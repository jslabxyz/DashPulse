import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { SalesSummary } from '@/components/sales/SalesSummary';
import { SalesChart } from '@/components/sales/SalesChart';
import { ProductPerformanceTable } from '@/components/sales/ProductPerformanceTable';
import { CSVImport } from '@/components/sales/CSVImport';
import { mockSalesAnalytics, SalesAnalytics, parseCSV, validateSalesCSV } from '@/utils/salesApi';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Performance = () => {
  const [salesData, setSalesData] = useState<SalesAnalytics>(mockSalesAnalytics);
  const [showImport, setShowImport] = useState(false);

  const handleDataImport = (importedData: any[]) => {
    if (!validateSalesCSV(importedData)) {
      alert('Invalid sales CSV format.');
      return;
    }
    // Map and sanitize data
    const sanitized = importedData.map(row => ({
      ...row,
      revenue: Number(row.revenue) || 0,
      unitsSold: Number(row.unitsSold) || 0,
      orders: Number(row.orders) || 0,
      conversionRate: Number(row.conversionRate) || 0,
      averageOrderValue: Number(row.averageOrderValue) || 0,
      profitMargin: row.profitMargin !== undefined && row.profitMargin !== "" ? Number(row.profitMargin) : 0,
      returns: Number(row.returns) || 0,
      refunds: Number(row.refunds) || 0,
    }));
    setSalesData((prev) => ({
      ...prev,
      dailySales: sanitized
    }));
    setShowImport(false);
    alert('Sales data imported successfully!');
  };

  const handleExportData = () => {
    // Create CSV content
    const csvContent = [
      ['Date', 'Revenue', 'Units Sold', 'Orders', 'AOV', 'Conversion Rate', 'Profit Margin'].join(','),
      ...salesData.dailySales.map(day => [
        day.date,
        day.revenue,
        day.unitsSold,
        day.orders,
        day.averageOrderValue,
        day.conversionRate,
        day.profitMargin
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    // In a real app, this would fetch fresh data from your API
    console.log('Refreshing sales data...');
  };

  return (
    <PageLayout title="Sales Analytics">
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button onClick={() => setShowImport(!showImport)} variant="outline">
              Import CSV Data
            </Button>
            <Button onClick={handleExportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setSalesData((prev) => ({ ...prev, dailySales: [] }))} variant="outline" color="destructive">
              Clear Data
            </Button>
            <Button onClick={() => setSalesData(mockSalesAnalytics)} variant="outline">
              Restore Dummy Data
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* CSV Import */}
        {showImport && (
          <>
            <div className="mb-2 text-sm text-muted-foreground">
              Required columns: date, revenue, unitsSold, orders, conversionRate, averageOrderValue
            </div>
            <CSVImport onDataImport={handleDataImport} validateCSV={validateSalesCSV} templateHeaders={['date','revenue','unitsSold','orders','conversionRate','averageOrderValue']} templateName="Sales" />
          </>
        )}

        {/* Sales Summary */}
        <SalesSummary analytics={salesData} />

        {/* Sales Chart */}
        <SalesChart 
          dailySales={salesData.dailySales}
          weeklySales={salesData.weeklySales}
          monthlySales={salesData.monthlySales}
        />

        {/* Product Performance Table */}
        <ProductPerformanceTable products={salesData.productBreakdown} />

        {/* Additional Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Electronics', 'Home & Kitchen', 'Sports & Outdoors'].map((category, index) => {
                  const revenue = [45000, 32000, 28000][index];
                  const percentage = [36, 25.6, 22.4][index];
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{category}</span>
                        <span>${revenue.toLocaleString()} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${percentage * 2.8}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Revenue Growth</span>
                  <span className="text-green-600 font-medium">+12.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Order Volume</span>
                  <span className="text-blue-600 font-medium">+8.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Customer Return Rate</span>
                  <span className="text-red-600 font-medium">-2.1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Profit Margin</span>
                  <span className="text-green-600 font-medium">+1.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Performance;
