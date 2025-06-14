
import { mockProducts, Product } from './productsApi';
import { mockCampaigns, PPCCampaign } from './ppcApi';
import { mockSalesAnalytics, SalesAnalytics, ProductSalesData } from './salesApi';

// Shared product identifiers to ensure data consistency
export const SHARED_PRODUCTS = [
  { asin: 'B08N5WRWNW', sku: 'SKU-001', name: 'Wireless Bluetooth Headphones', category: 'Electronics' },
  { asin: 'B07FZ8S74R', sku: 'SKU-002', name: 'Stainless Steel Water Bottle', category: 'Home & Kitchen' },
  { asin: 'B085RXZKM7', sku: 'SKU-003', name: 'USB-C Charging Cable', category: 'Electronics' },
  { asin: 'B09JNVJ8K3', sku: 'SKU-004', name: 'Yoga Mat Premium', category: 'Sports & Outdoors' },
  { asin: 'B07QXMNF1X', sku: 'SKU-005', name: 'LED Desk Lamp', category: 'Home & Kitchen' }
];

export interface UnifiedProductData {
  asin: string;
  sku: string;
  name: string;
  category: string;
  // Sales data
  revenue: number;
  unitsSold: number;
  profitMargin: number;
  // PPC data
  ppcSpend: number;
  ppcRevenue: number;
  acos: number;
  impressions: number;
  clicks: number;
  // Inventory data
  currentStock: number;
  stockStatus: 'healthy' | 'low' | 'critical' | 'out_of_stock';
  velocity: number;
  // Performance metrics
  roi: number;
  profitability: number;
  efficiency: number;
}

export interface BusinessIntelligence {
  totalRevenue: number;
  totalPPCSpend: number;
  totalProfit: number;
  overallROI: number;
  averageACOS: number;
  inventoryValue: number;
  productsAnalyzed: number;
  topPerformer: UnifiedProductData;
  worstPerformer: UnifiedProductData;
  unifiedProducts: UnifiedProductData[];
  salesTrends: Array<{ date: string; revenue: number; ppcSpend: number; profit: number }>;
  categoryPerformance: Array<{ category: string; revenue: number; spend: number; roi: number }>;
}

// Generate unified analytics data
export const generateUnifiedAnalytics = (): BusinessIntelligence => {
  const unifiedProducts: UnifiedProductData[] = SHARED_PRODUCTS.map((product, index) => {
    const salesData = mockSalesAnalytics.productBreakdown[index] || mockSalesAnalytics.productBreakdown[0];
    const ppcData = mockCampaigns[index] || mockCampaigns[0];
    
    const ppcSpend = ppcData.spend;
    const ppcRevenue = ppcData.sales; // Using 'sales' property instead of 'revenue'
    const acos = (ppcSpend / ppcRevenue) * 100;
    const profit = salesData.revenue * (salesData.profitMargin / 100) - ppcSpend;
    const roi = ((profit) / ppcSpend) * 100;
    
    // Mock inventory data
    const stockLevels = [120, 5, 25, 80, 0];
    const stockStatuses = ['healthy', 'critical', 'low', 'healthy', 'out_of_stock'] as const;
    const velocities = [6, 12, 15, 10, 8];
    
    return {
      asin: product.asin,
      sku: product.sku,
      name: product.name,
      category: product.category,
      revenue: salesData.revenue,
      unitsSold: salesData.unitsSold,
      profitMargin: salesData.profitMargin,
      ppcSpend,
      ppcRevenue,
      acos: Math.round(acos * 100) / 100,
      impressions: ppcData.impressions,
      clicks: ppcData.clicks,
      currentStock: stockLevels[index],
      stockStatus: stockStatuses[index],
      velocity: velocities[index],
      roi: Math.round(roi * 100) / 100,
      profitability: Math.round(profit),
      efficiency: Math.round(((salesData.revenue / ppcSpend) * 100) * 100) / 100
    };
  });

  const totalRevenue = unifiedProducts.reduce((sum, p) => sum + p.revenue, 0);
  const totalPPCSpend = unifiedProducts.reduce((sum, p) => sum + p.ppcSpend, 0);
  const totalProfit = unifiedProducts.reduce((sum, p) => sum + p.profitability, 0);
  const overallROI = ((totalProfit) / totalPPCSpend) * 100;
  const averageACOS = unifiedProducts.reduce((sum, p) => sum + p.acos, 0) / unifiedProducts.length;
  const inventoryValue = unifiedProducts.reduce((sum, p) => sum + (p.currentStock * 25), 0); // Assuming $25 avg value

  // Sort by profitability to find top/worst performers
  const sortedByProfitability = [...unifiedProducts].sort((a, b) => b.profitability - a.profitability);

  // Generate sales trends for the last 30 days
  const salesTrends = mockSalesAnalytics.dailySales.map(day => ({
    date: day.date,
    revenue: day.revenue,
    ppcSpend: day.revenue * 0.25, // Assume 25% of revenue as PPC spend
    profit: day.revenue * (day.profitMargin / 100) - (day.revenue * 0.25)
  }));

  // Category performance
  const categories = [...new Set(unifiedProducts.map(p => p.category))];
  const categoryPerformance = categories.map(category => {
    const categoryProducts = unifiedProducts.filter(p => p.category === category);
    const revenue = categoryProducts.reduce((sum, p) => sum + p.revenue, 0);
    const spend = categoryProducts.reduce((sum, p) => sum + p.ppcSpend, 0);
    const profit = categoryProducts.reduce((sum, p) => sum + p.profitability, 0);
    const roi = spend > 0 ? (profit / spend) * 100 : 0;
    
    return {
      category,
      revenue: Math.round(revenue),
      spend: Math.round(spend),
      roi: Math.round(roi * 100) / 100
    };
  });

  return {
    totalRevenue: Math.round(totalRevenue),
    totalPPCSpend: Math.round(totalPPCSpend),
    totalProfit: Math.round(totalProfit),
    overallROI: Math.round(overallROI * 100) / 100,
    averageACOS: Math.round(averageACOS * 100) / 100,
    inventoryValue,
    productsAnalyzed: unifiedProducts.length,
    topPerformer: sortedByProfitability[0],
    worstPerformer: sortedByProfitability[sortedByProfitability.length - 1],
    unifiedProducts,
    salesTrends,
    categoryPerformance
  };
};

export const mockUnifiedAnalytics = generateUnifiedAnalytics();

// Correlation analysis functions
export const calculatePPCEfficiency = (product: UnifiedProductData): number => {
  return product.ppcRevenue / product.ppcSpend;
};

export const calculateInventoryTurnover = (product: UnifiedProductData): number => {
  if (product.currentStock === 0) return 0;
  return (product.unitsSold / product.currentStock) * 30; // Monthly turnover
};

export const getReorderRecommendations = (products: UnifiedProductData[]): UnifiedProductData[] => {
  return products.filter(p => {
    const daysOfStock = p.velocity > 0 ? p.currentStock / p.velocity : 0;
    return daysOfStock < 14 || p.stockStatus === 'critical' || p.stockStatus === 'out_of_stock';
  });
};

export const getTopPerformingCampaigns = (products: UnifiedProductData[]): UnifiedProductData[] => {
  return products
    .filter(p => p.acos < 30 && p.roi > 100) // Good ACOS and ROI
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 5);
};
