
export interface Product {
  id: string;
  image: string;
  name: string;
  sku: string;
  asin: string;
  revenue: number;
  sessions: number;
  conversionRate: number;
  inventory: number;
  unitsSold: number;
  profit: number;
  profitMargin: number;
  acos: number;
  roas: number;
  clicks: number;
  adSpend: number;
  status: 'profitable' | 'attention' | 'low-stock' | 'out-of-stock';
  category: string;
  lastUpdated: Date;
}

// Mock product data matching the detailed structure from the image
export const mockProducts: Product[] = [
  {
    id: '1',
    image: '/placeholder.svg',
    name: 'Premium Wireless Bluetooth Headphones with Noise Cancellation',
    sku: 'WBH-NC-001',
    asin: 'B08XYZ1234',
    revenue: 15420.50,
    sessions: 3240,
    conversionRate: 12.8,
    inventory: 156,
    unitsSold: 127,
    profit: 4626.15,
    profitMargin: 30.0,
    acos: 18.5,
    roas: 5.4,
    clicks: 892,
    adSpend: 2853.79,
    status: 'profitable',
    category: 'Electronics',
    lastUpdated: new Date('2024-06-13')
  },
  {
    id: '2',
    image: '/placeholder.svg',
    name: 'Organic Cotton Bath Towel Set - Ultra Soft 6-Piece Collection',
    sku: 'OCT-US-006',
    asin: 'B08ABC5678',
    revenue: 8930.25,
    sessions: 2180,
    conversionRate: 9.2,
    inventory: 23,
    unitsSold: 201,
    profit: 2679.08,
    profitMargin: 30.0,
    acos: 25.3,
    roas: 3.95,
    clicks: 654,
    adSpend: 2259.75,
    status: 'low-stock',
    category: 'Home & Kitchen',
    lastUpdated: new Date('2024-06-13')
  },
  {
    id: '3',
    image: '/placeholder.svg',
    name: 'Stainless Steel Water Bottle with Temperature Display - 32oz',
    sku: 'SSW-TD-032',
    asin: 'B08DEF9012',
    revenue: 6745.80,
    sessions: 1890,
    conversionRate: 15.6,
    inventory: 89,
    unitsSold: 295,
    profit: 1348.16,
    profitMargin: 20.0,
    acos: 32.1,
    roas: 3.11,
    clicks: 421,
    adSpend: 2165.42,
    status: 'attention',
    category: 'Sports & Outdoors',
    lastUpdated: new Date('2024-06-13')
  },
  {
    id: '4',
    image: '/placeholder.svg',
    name: 'LED Desk Lamp with Wireless Charging Base and USB Ports',
    sku: 'LED-WC-USB',
    asin: 'B08GHI3456',
    revenue: 12680.90,
    sessions: 2940,
    conversionRate: 11.3,
    inventory: 0,
    unitsSold: 332,
    profit: 3804.27,
    profitMargin: 30.0,
    acos: 22.8,
    roas: 4.38,
    clicks: 758,
    adSpend: 2891.25,
    status: 'out-of-stock',
    category: 'Electronics',
    lastUpdated: new Date('2024-06-12')
  },
  {
    id: '5',
    image: '/placeholder.svg',
    name: 'Memory Foam Pillow with Cooling Gel Layer - Queen Size',
    sku: 'MFP-CG-QS',
    asin: 'B08JKL7890',
    revenue: 9856.40,
    sessions: 2450,
    conversionRate: 8.9,
    inventory: 67,
    unitsSold: 218,
    profit: 2957.92,
    profitMargin: 30.0,
    acos: 19.7,
    roas: 5.08,
    clicks: 567,
    adSpend: 1941.61,
    status: 'profitable',
    category: 'Home & Kitchen',
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

export const getStatusColor = (status: Product['status']): string => {
  switch (status) {
    case 'profitable':
      return 'text-green-600 bg-green-50';
    case 'attention':
      return 'text-orange-600 bg-orange-50';
    case 'low-stock':
      return 'text-yellow-600 bg-yellow-50';
    case 'out-of-stock':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getStatusLabel = (status: Product['status']): string => {
  switch (status) {
    case 'profitable':
      return 'Profitable';
    case 'attention':
      return 'Needs Attention';
    case 'low-stock':
      return 'Low Stock';
    case 'out-of-stock':
      return 'Out of Stock';
    default:
      return 'Unknown';
  }
};
