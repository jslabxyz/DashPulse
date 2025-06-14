
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ProductSalesData } from '@/utils/salesApi';

interface ProductPerformanceTableProps {
  products: ProductSalesData[];
}

type SortField = keyof ProductSalesData;
type SortDirection = 'asc' | 'desc';

export function ProductPerformanceTable({ products }: ProductPerformanceTableProps) {
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('asin')}
                    className="h-auto p-0 font-medium"
                  >
                    ASIN <SortIcon field="asin" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('productName')}
                    className="h-auto p-0 font-medium"
                  >
                    Product Name <SortIcon field="productName" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('category')}
                    className="h-auto p-0 font-medium"
                  >
                    Category <SortIcon field="category" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('revenue')}
                    className="h-auto p-0 font-medium"
                  >
                    Revenue <SortIcon field="revenue" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('unitsSold')}
                    className="h-auto p-0 font-medium"
                  >
                    Units Sold <SortIcon field="unitsSold" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('orders')}
                    className="h-auto p-0 font-medium"
                  >
                    Orders <SortIcon field="orders" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('profitMargin')}
                    className="h-auto p-0 font-medium"
                  >
                    Profit Margin <SortIcon field="profitMargin" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('returnRate')}
                    className="h-auto p-0 font-medium"
                  >
                    Return Rate <SortIcon field="returnRate" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product.asin} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{product.asin}</TableCell>
                  <TableCell className="font-medium">{product.productName}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${product.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{product.unitsSold.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{product.orders.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className={`font-medium ${
                      product.profitMargin >= 20 ? 'text-green-600' : 
                      product.profitMargin >= 10 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.profitMargin.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-medium ${
                      product.returnRate <= 2 ? 'text-green-600' : 
                      product.returnRate <= 5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.returnRate.toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
