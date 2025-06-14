
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { CSVImport } from '@/components/sales/CSVImport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package, TrendingDown, TrendingUp, Download, RefreshCw, Upload } from 'lucide-react';

// Mock inventory data
const initialInventoryData = [
  { 
    sku: 'SKU-001', 
    product: 'Wireless Bluetooth Headphones', 
    stock: 5, 
    status: 'critical',
    inbound: 50,
    velocity: 12
  },
  { 
    sku: 'SKU-002', 
    product: 'Phone Case - Clear', 
    stock: 0, 
    status: 'out_of_stock',
    inbound: 100,
    velocity: 8
  },
  { 
    sku: 'SKU-003', 
    product: 'USB-C Cable', 
    stock: 25, 
    status: 'low',
    inbound: 0,
    velocity: 15
  },
  { 
    sku: 'SKU-004', 
    product: 'Laptop Stand', 
    stock: 120, 
    status: 'healthy',
    inbound: 0,
    velocity: 6
  },
  { 
    sku: 'SKU-005', 
    product: 'Wireless Charger', 
    stock: 80, 
    status: 'healthy',
    inbound: 30,
    velocity: 10
  }
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    critical: { label: 'Critical', variant: 'destructive' as const, icon: AlertTriangle },
    out_of_stock: { label: 'Out of Stock', variant: 'destructive' as const, icon: AlertTriangle },
    low: { label: 'Low Stock', variant: 'secondary' as const, icon: TrendingDown },
    healthy: { label: 'Healthy', variant: 'default' as const, icon: TrendingUp }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState(initialInventoryData);
  const [showImport, setShowImport] = useState(false);

  const criticalItems = inventoryData.filter(item => item.status === 'critical' || item.status === 'out_of_stock');
  const totalValue = inventoryData.reduce((sum, item) => sum + (item.stock * 25), 0); // Assuming $25 avg value

  const handleDataImport = (importedData: any[]) => {
    console.log('Imported inventory data:', importedData);
    // In a real app, you would process and merge the imported data
    setShowImport(false);
  };

  const handleExportData = () => {
    const csvContent = [
      ['SKU', 'Product', 'Stock', 'Status', 'Inbound', 'Velocity/Day'].join(','),
      ...inventoryData.map(item => [
        item.sku,
        `"${item.product}"`,
        item.stock,
        item.status,
        item.inbound,
        item.velocity
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    console.log('Refreshing inventory data...');
    // In a real app, this would fetch fresh data from your API
  };

  return (
    <PageLayout title="Inventory Management">
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button onClick={() => setShowImport(!showImport)} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
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
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* CSV Import */}
        {showImport && (
          <CSVImport onDataImport={handleDataImport} />
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total SKUs</p>
                  <p className="text-2xl font-bold">{inventoryData.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Items</p>
                  <p className="text-2xl font-bold text-red-600">{criticalItems.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Units</p>
                  <p className="text-2xl font-bold">{inventoryData.reduce((sum, item) => sum + item.stock, 0)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inventory Value</p>
                  <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">SKU</th>
                    <th className="text-left py-3 px-4 font-medium">Product</th>
                    <th className="text-right py-3 px-4 font-medium">Stock</th>
                    <th className="text-right py-3 px-4 font-medium">Inbound</th>
                    <th className="text-right py-3 px-4 font-medium">Velocity/Day</th>
                    <th className="text-center py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.map((item) => (
                    <tr key={item.sku} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{item.sku}</td>
                      <td className="py-3 px-4">{item.product}</td>
                      <td className="py-3 px-4 text-right font-medium">{item.stock}</td>
                      <td className="py-3 px-4 text-right">{item.inbound}</td>
                      <td className="py-3 px-4 text-right">{item.velocity}</td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Inventory;
