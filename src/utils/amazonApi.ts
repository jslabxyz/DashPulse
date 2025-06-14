
import { useState, useEffect } from 'react';

export interface SalesData {
  period: string;
  units: number;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  growth: number;
}

export interface AdPerformance {
  campaignType: 'Sponsored Products' | 'Sponsored Brands' | 'Sponsored Display';
  impressions: number;
  clicks: number;
  spend: number;
  sales: number;
  acos: number;
  roas: number;
  ctr: number;
  conversions: number;
}

export interface InventoryItem {
  sku: string;
  asin: string;
  title: string;
  unitsAvailable: number;
  unitsReserved: number;
  reorderPoint: number;
  fulfillmentType: 'FBA' | 'FBM';
  daysOfSupply: number;
  status: 'healthy' | 'low' | 'critical' | 'out_of_stock';
  lastRestocked: Date;
}

export interface KeywordRanking {
  keyword: string;
  currentRank: number;
  previousRank: number;
  searchVolume: number;
  bid: number;
  conversions: number;
  category: string;
}

export interface ProfitabilityData {
  revenue: number;
  cogs: number;
  amazonFees: number;
  adSpend: number;
  returns: number;
  netProfit: number;
  margin: number;
}

export interface ReviewData {
  rating: number;
  totalReviews: number;
  newReviews: number;
  fiveStarPercent: number;
  fourStarPercent: number;
  threeStarPercent: number;
  twoStarPercent: number;
  oneStarPercent: number;
  averageRatingTrend: number[];
}

export interface CompetitorData {
  competitorName: string;
  marketShare: number;
  pricePoint: number;
  reviewScore: number;
  trend: number;
}

// Enhanced mock data for Amazon US marketplace
export const mockSalesData: SalesData[] = [
  { period: 'Today', units: 287, revenue: 15840, orders: 156, avgOrderValue: 101.54, growth: 18.7 },
  { period: 'Yesterday', units: 243, revenue: 13560, orders: 134, avgOrderValue: 101.19, growth: -4.2 },
  { period: 'This Week', units: 1847, revenue: 102450, orders: 923, avgOrderValue: 110.98, growth: 22.1 },
  { period: 'This Month', units: 8234, revenue: 456780, orders: 4567, avgOrderValue: 100.04, growth: 28.4 }
];

export const mockAdPerformance: AdPerformance[] = [
  {
    campaignType: 'Sponsored Products',
    impressions: 125680,
    clicks: 3234,
    spend: 4850,
    sales: 32250,
    acos: 15.0,
    roas: 6.65,
    ctr: 2.57,
    conversions: 189
  },
  {
    campaignType: 'Sponsored Brands',
    impressions: 78450,
    clicks: 1876,
    spend: 3240,
    sales: 18900,
    acos: 17.1,
    roas: 5.83,
    ctr: 2.39,
    conversions: 134
  },
  {
    campaignType: 'Sponsored Display',
    impressions: 45230,
    clicks: 567,
    spend: 1890,
    sales: 8450,
    acos: 22.4,
    roas: 4.47,
    ctr: 1.25,
    conversions: 67
  }
];

export const mockInventory: InventoryItem[] = [
  {
    sku: 'WH-001-BLK',
    asin: 'B08XQJH9K2',
    title: 'Premium Noise-Cancelling Wireless Headphones - Black',
    unitsAvailable: 234,
    unitsReserved: 45,
    reorderPoint: 150,
    fulfillmentType: 'FBA',
    daysOfSupply: 28,
    status: 'healthy',
    lastRestocked: new Date(Date.now() - 86400000 * 8)
  },
  {
    sku: 'PC-005-CLR',
    asin: 'B09M7K8L3N',
    title: 'Protective Clear Phone Case for iPhone 14 Pro Max',
    unitsAvailable: 89,
    unitsReserved: 23,
    reorderPoint: 100,
    fulfillmentType: 'FBA',
    daysOfSupply: 12,
    status: 'low',
    lastRestocked: new Date(Date.now() - 86400000 * 18)
  },
  {
    sku: 'BT-SPK-003',
    asin: 'B07H9R4T6X',
    title: 'Waterproof Bluetooth Speaker with RGB Lighting',
    unitsAvailable: 15,
    unitsReserved: 8,
    reorderPoint: 50,
    fulfillmentType: 'FBA',
    daysOfSupply: 4,
    status: 'critical',
    lastRestocked: new Date(Date.now() - 86400000 * 35)
  },
  {
    sku: 'CB-USB-C01',
    asin: 'B08K9P2M4L',
    title: 'Fast Charging USB-C Cable 6ft - White (3-Pack)',
    unitsAvailable: 456,
    unitsReserved: 67,
    reorderPoint: 200,
    fulfillmentType: 'FBA',
    daysOfSupply: 45,
    status: 'healthy',
    lastRestocked: new Date(Date.now() - 86400000 * 5)
  },
  {
    sku: 'SM-WTC-007',
    asin: 'B09XY1Z8K4',
    title: 'Smart Fitness Watch with Heart Rate Monitor',
    unitsAvailable: 0,
    unitsReserved: 0,
    reorderPoint: 75,
    fulfillmentType: 'FBA',
    daysOfSupply: 0,
    status: 'out_of_stock',
    lastRestocked: new Date(Date.now() - 86400000 * 67)
  },
  {
    sku: 'LED-STRIP-5M',
    asin: 'B08T7G6H5R',
    title: 'Smart RGB LED Strip Lights 16.4ft with App Control',
    unitsAvailable: 178,
    unitsReserved: 34,
    reorderPoint: 125,
    fulfillmentType: 'FBM',
    daysOfSupply: 22,
    status: 'healthy',
    lastRestocked: new Date(Date.now() - 86400000 * 12)
  }
];

export const mockKeywords: KeywordRanking[] = [
  {
    keyword: 'wireless headphones noise cancelling',
    currentRank: 12,
    previousRank: 18,
    searchVolume: 89500,
    bid: 2.85,
    conversions: 47,
    category: 'Electronics'
  },
  {
    keyword: 'bluetooth speaker waterproof',
    currentRank: 7,
    previousRank: 9,
    searchVolume: 67200,
    bid: 1.95,
    conversions: 32,
    category: 'Electronics'
  },
  {
    keyword: 'iphone 14 pro max case clear',
    currentRank: 23,
    previousRank: 19,
    searchVolume: 45800,
    bid: 1.25,
    conversions: 78,
    category: 'Accessories'
  },
  {
    keyword: 'usb c cable fast charging',
    currentRank: 5,
    previousRank: 6,
    searchVolume: 123000,
    bid: 0.85,
    conversions: 156,
    category: 'Electronics'
  },
  {
    keyword: 'smart watch fitness tracker',
    currentRank: 34,
    previousRank: 28,
    searchVolume: 78900,
    bid: 3.45,
    conversions: 23,
    category: 'Wearables'
  },
  {
    keyword: 'led strip lights rgb smart',
    currentRank: 15,
    previousRank: 17,
    searchVolume: 34500,
    bid: 1.65,
    conversions: 41,
    category: 'Home & Garden'
  }
];

export const mockProfitability: ProfitabilityData = {
  revenue: 456780,
  cogs: 182712, // 40% of revenue
  amazonFees: 68517,  // 15% of revenue (referral + FBA fees)
  adSpend: 9980,      // Total ad spend from campaigns above
  returns: 13703,     // 3% of revenue
  netProfit: 182868,  // Revenue - all costs
  margin: 40.0        // Net profit margin
};

export const mockReviewData: ReviewData = {
  rating: 4.6,
  totalReviews: 2847,
  newReviews: 47,
  fiveStarPercent: 68,
  fourStarPercent: 21,
  threeStarPercent: 7,
  twoStarPercent: 3,
  oneStarPercent: 1,
  averageRatingTrend: [4.2, 4.3, 4.4, 4.5, 4.5, 4.6, 4.6]
};

export const mockCompetitors: CompetitorData[] = [
  { competitorName: 'SoundCore by Anker', marketShare: 22.5, pricePoint: 79.99, reviewScore: 4.4, trend: -1.2 },
  { competitorName: 'JBL Audio', marketShare: 18.7, pricePoint: 89.99, reviewScore: 4.3, trend: 0.8 },
  { competitorName: 'Beats by Dre', marketShare: 15.3, pricePoint: 199.99, reviewScore: 4.1, trend: -0.5 },
  { competitorName: 'Sony Electronics', marketShare: 14.2, pricePoint: 149.99, reviewScore: 4.5, trend: 1.1 }
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercentage(num: number, decimals: number = 1): string {
  return `${num > 0 ? '+' : ''}${num.toFixed(decimals)}%`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'healthy': return 'text-green-600';
    case 'low': return 'text-yellow-600';
    case 'critical': return 'text-red-600';
    case 'out_of_stock': return 'text-red-800';
    default: return 'text-gray-600';
  }
}

export function getRankingTrend(current: number, previous: number): { direction: 'up' | 'down' | 'same', change: number } {
  if (current < previous) return { direction: 'up', change: previous - current };
  if (current > previous) return { direction: 'down', change: current - previous };
  return { direction: 'same', change: 0 };
}
