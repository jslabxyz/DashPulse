
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { Product, formatCurrency, formatPercentage, formatNumber, getStatusColor, getStatusLabel } from '@/utils/productsApi';
import { cn } from '@/lib/utils';

interface ProductsTableProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

type SortField = keyof Product;
type SortDirection = 'asc' | 'desc';

export function ProductsTable({ products, onProductClick }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.asin.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Product Performance</CardTitle>
        
        <div className="flex gap-4 items-center mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products, SKUs, ASINs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'profitable' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('profitable')}
            >
              Profitable
            </Button>
            <Button
              variant={statusFilter === 'attention' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('attention')}
            >
              Attention
            </Button>
            <Button
              variant={statusFilter === 'low-stock' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('low-stock')}
            >
              Low Stock
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="min-w-[300px]">Product</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('revenue')}>
                  <div className="flex items-center gap-1">
                    Revenue <SortIcon field="revenue" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('sessions')}>
                  <div className="flex items-center gap-1">
                    Sessions <SortIcon field="sessions" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('conversionRate')}>
                  <div className="flex items-center gap-1">
                    Conv. Rate <SortIcon field="conversionRate" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('inventory')}>
                  <div className="flex items-center gap-1">
                    Inventory <SortIcon field="inventory" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('unitsSold')}>
                  <div className="flex items-center gap-1">
                    Units Sold <SortIcon field="unitsSold" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('profit')}>
                  <div className="flex items-center gap-1">
                    Profit <SortIcon field="profit" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('acos')}>
                  <div className="flex items-center gap-1">
                    ACOS <SortIcon field="acos" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow 
                  key={product.id} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => onProductClick?.(product)}
                >
                  <TableCell>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm leading-tight">{product.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        SKU: {product.sku} | ASIN: {product.asin}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(product.revenue)}</TableCell>
                  <TableCell>{formatNumber(product.sessions)}</TableCell>
                  <TableCell>{formatPercentage(product.conversionRate)}</TableCell>
                  <TableCell>
                    <span className={cn(
                      product.inventory === 0 ? 'text-red-600' :
                      product.inventory < 50 ? 'text-orange-600' : 'text-green-600'
                    )}>
                      {formatNumber(product.inventory)}
                    </span>
                  </TableCell>
                  <TableCell>{formatNumber(product.unitsSold)}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency(product.profit)}
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      product.acos > 30 ? 'text-red-600' :
                      product.acos > 20 ? 'text-orange-600' : 'text-green-600'
                    )}>
                      {formatPercentage(product.acos)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('text-xs', getStatusColor(product.status))}>
                      {getStatusLabel(product.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {sortedProducts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No products found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
