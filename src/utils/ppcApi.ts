
export interface PPCCampaign {
  id: string;
  campaignName: string;
  totalOrders: number;
  totalSales: number;
  tacos: number; // Total Advertising Cost of Sales
  spend: number;
  sales: number;
  acos: number; // Advertising Cost of Sales
  roas: number; // Return on Ad Spend
  impressions: number;
  clicks: number;
  cpc: number; // Cost Per Click
  cvr: number; // Conversion Rate
  ctr: number; // Click Through Rate
  ppcOrders: number;
  campaignType: 'Sponsored Products' | 'Sponsored Brands' | 'Sponsored Display';
  status: 'Active' | 'Paused' | 'Targeting' | 'Archived';
  lastUpdated: Date;
}

// Mock PPC campaign data
export const mockCampaigns: PPCCampaign[] = [
  {
    id: '1',
    campaignName: 'Brand Defense - Exact Match',
    totalOrders: 156,
    totalSales: 18420.50,
    tacos: 15.2,
    spend: 2803.92,
    sales: 16240.30,
    acos: 17.3,
    roas: 5.8,
    impressions: 45230,
    clicks: 892,
    cpc: 3.14,
    cvr: 17.5,
    ctr: 1.97,
    ppcOrders: 142,
    campaignType: 'Sponsored Products',
    status: 'Active',
    lastUpdated: new Date('2024-06-13')
  },
  {
    id: '2',
    campaignName: 'Auto Campaign - High Performance',
    totalOrders: 89,
    totalSales: 12680.90,
    tacos: 22.8,
    spend: 2891.25,
    sales: 11245.75,
    acos: 25.7,
    roas: 3.9,
    impressions: 38450,
    clicks: 758,
    cpc: 3.81,
    cvr: 11.7,
    ctr: 1.97,
    ppcOrders: 76,
    campaignType: 'Sponsored Products',
    status: 'Active',
    lastUpdated: new Date('2024-06-13')
  },
  {
    id: '3',
    campaignName: 'Broad Match - Category Targeting',
    totalOrders: 67,
    totalSales: 9856.40,
    tacos: 19.7,
    spend: 1941.61,
    sales: 8920.15,
    acos: 21.8,
    roas: 4.6,
    impressions: 28340,
    clicks: 567,
    cpc: 3.42,
    cvr: 11.8,
    ctr: 2.00,
    ppcOrders: 58,
    campaignType: 'Sponsored Products',
    status: 'Active',
    lastUpdated: new Date('2024-06-13')
  },
  {
    id: '4',
    campaignName: 'Sponsored Brand - Video Campaign',
    totalOrders: 45,
    totalSales: 7245.80,
    tacos: 32.1,
    spend: 2325.42,
    sales: 6890.25,
    acos: 33.7,
    roas: 2.97,
    impressions: 52180,
    clicks: 421,
    cpc: 5.52,
    cvr: 10.7,
    ctr: 0.81,
    ppcOrders: 39,
    campaignType: 'Sponsored Brands',
    status: 'Targeting',
    lastUpdated: new Date('2024-06-12')
  },
  {
    id: '5',
    campaignName: 'Exact Match - Competitor Keywords',
    totalOrders: 123,
    totalSales: 15670.30,
    tacos: 18.5,
    spend: 2899.15,
    sales: 14230.85,
    acos: 20.4,
    roas: 4.9,
    impressions: 35670,
    clicks: 634,
    cpc: 4.57,
    cvr: 19.4,
    ctr: 1.78,
    ppcOrders: 108,
    campaignType: 'Sponsored Products',
    status: 'Active',
    lastUpdated: new Date('2024-06-13')
  }
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const getStatusColor = (status: PPCCampaign['status']): string => {
  switch (status) {
    case 'Active':
      return 'text-green-600 bg-green-50';
    case 'Targeting':
      return 'text-blue-600 bg-blue-50';
    case 'Paused':
      return 'text-yellow-600 bg-yellow-50';
    case 'Archived':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getAcosColor = (acos: number): string => {
  if (acos < 20) return 'text-green-600';
  if (acos < 30) return 'text-yellow-600';
  return 'text-red-600';
};
