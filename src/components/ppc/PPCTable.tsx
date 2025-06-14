
import React, { useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PPCCampaign, formatCurrency, formatPercentage, formatNumber, getStatusColor, getAcosColor } from '@/utils/ppcApi';
import { cn } from '@/lib/utils';

interface PPCTableProps {
  campaigns: PPCCampaign[];
  onCampaignClick?: (campaign: PPCCampaign) => void;
}

type SortField = keyof PPCCampaign;
type SortDirection = 'asc' | 'desc';

export function PPCTable({ campaigns, onCampaignClick }: PPCTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('totalSales');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedCampaigns = campaigns
    .filter(campaign =>
      campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.campaignType.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
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

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <CardTitle>PPC Campaigns</CardTitle>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="campaignName">Campaign Name</SortableHeader>
                <SortableHeader field="totalOrders">Total Orders</SortableHeader>
                <SortableHeader field="totalSales">Total Sales</SortableHeader>
                <SortableHeader field="tacos">TACoS</SortableHeader>
                <SortableHeader field="spend">Spend</SortableHeader>
                <SortableHeader field="sales">Sales</SortableHeader>
                <SortableHeader field="acos">ACoS</SortableHeader>
                <SortableHeader field="roas">ROAS</SortableHeader>
                <SortableHeader field="impressions">Impressions</SortableHeader>
                <SortableHeader field="clicks">Clicks</SortableHeader>
                <SortableHeader field="cpc">CPC</SortableHeader>
                <SortableHeader field="cvr">CVR</SortableHeader>
                <SortableHeader field="ctr">CTR</SortableHeader>
                <SortableHeader field="ppcOrders">PPC Orders</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCampaigns.map((campaign) => (
                <TableRow 
                  key={campaign.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onCampaignClick?.(campaign)}
                >
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold text-gray-900">{campaign.campaignName}</div>
                      <div className="text-xs text-gray-500">{campaign.campaignType}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">{formatNumber(campaign.totalOrders)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(campaign.totalSales)}</TableCell>
                  <TableCell className="text-right">
                    <span className={getAcosColor(campaign.tacos)}>
                      {formatPercentage(campaign.tacos)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-red-600">{formatCurrency(campaign.spend)}</TableCell>
                  <TableCell className="text-right text-green-600">{formatCurrency(campaign.sales)}</TableCell>
                  <TableCell className="text-right">
                    <span className={getAcosColor(campaign.acos)}>
                      {formatPercentage(campaign.acos)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">{campaign.roas.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{formatNumber(campaign.impressions)}</TableCell>
                  <TableCell className="text-right">{formatNumber(campaign.clicks)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(campaign.cpc)}</TableCell>
                  <TableCell className="text-right">{formatPercentage(campaign.cvr)}</TableCell>
                  <TableCell className="text-right">{formatPercentage(campaign.ctr)}</TableCell>
                  <TableCell className="text-center">{formatNumber(campaign.ppcOrders)}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      getStatusColor(campaign.status)
                    )}>
                      {campaign.status}
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
