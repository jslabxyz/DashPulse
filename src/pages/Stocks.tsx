import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProductsTable } from '@/components/products/ProductsTable';
import { ProductsSummary } from '@/components/products/ProductsSummary';
import { CSVImport } from '@/components/sales/CSVImport';
import { mockProducts, Product } from '@/utils/productsApi';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Upload } from 'lucide-react';
import { parseCSV, validateProductCSV } from '@/utils/salesApi';

const Stocks = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showImport, setShowImport] = useState(false);

  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product);
    // TODO: Navigate to product detail page or show modal
  };

  const handleDataImport = (importedData: any[]) => {
    if (!validateProductCSV(importedData)) {
      alert('Invalid product CSV format.');
      return;
    }
    // Map and sanitize data
    const sanitized = importedData.map(row => ({
      ...row,
      revenue: Number(row.revenue) || 0,
      sessions: Number(row.sessions) || 0,
      conversionRate: Number(row.conversionRate) || 0,
      inventory: Number(row.inventory) || 0,
      unitsSold: Number(row.unitsSold) || 0,
      acos: Number(row.acos) || 0,
      profit: (row.profit !== undefined && row.profit !== "") ? Number(row.profit) : (Number(row.revenue) - Number(row.acos || 0)),
      status: row.status || "profitable",
    }));
    setProducts(sanitized);
    setShowImport(false);
    alert('Product data imported successfully!');
  };

  const handleExportData = () => {
    const csvContent = [
      ['Name', 'SKU', 'ASIN', 'Revenue', 'Sessions', 'Conversion Rate', 'Inventory', 'Units Sold', 'Profit', 'ACOS', 'Status'].join(','),
      ...products.map(product => [
        `"${product.name}"`,
        product.sku,
        product.asin,
        product.revenue,
        product.sessions,
        product.conversionRate,
        product.inventory,
        product.unitsSold,
        product.profit,
        product.acos,
        product.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    console.log('Refreshing products data...');
    // In a real app, this would fetch fresh data from your API
  };

  return (
    <PageLayout title="Products">
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
            <Button onClick={() => setProducts([])} variant="outline" color="destructive">
              Clear Data
            </Button>
            <Button onClick={() => setProducts(mockProducts)} variant="outline">
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
              Required columns: name, sku, asin, revenue, sessions, conversionRate, inventory, unitsSold, acos
            </div>
            <CSVImport onDataImport={handleDataImport} validateCSV={validateProductCSV} templateHeaders={['name','sku','asin','revenue','sessions','conversionRate','inventory','unitsSold','acos']} templateName="Product" />
          </>
        )}

        <ProductsSummary products={products} />
        <ProductsTable products={products} onProductClick={handleProductClick} />
      </div>
    </PageLayout>
  );
};

export default Stocks;
