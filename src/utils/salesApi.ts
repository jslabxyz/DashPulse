export interface SalesData {
  date: string;
  revenue: number;
  unitsSold: number;
  orders: number;
  conversionRate: number;
  averageOrderValue: number;
  profitMargin: number;
  returns: number;
  refunds: number;
}

export interface ProductSalesData {
  asin: string;
  productName: string;
  category: string;
  revenue: number;
  unitsSold: number;
  orders: number;
  profitMargin: number;
  returnRate: number;
}

export interface SalesAnalytics {
  dailySales: SalesData[];
  weeklySales: SalesData[];
  monthlySales: SalesData[];
  productBreakdown: ProductSalesData[];
  totalRevenue: number;
  totalOrders: number;
  totalUnits: number;
  averageOrderValue: number;
  conversionRate: number;
  profitMargin: number;
}

// Generate mock sales data
export const generateMockSalesData = (days: number = 30): SalesData[] => {
  const data: SalesData[] = [];
  const baseRevenue = 5000;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const dailyVariation = (Math.random() - 0.5) * 0.4;
    const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;
    
    const revenue = baseRevenue * (1 + dailyVariation) * weekendFactor;
    const unitsSold = Math.floor(revenue / 45 + (Math.random() - 0.5) * 20);
    const orders = Math.floor(unitsSold * (0.6 + Math.random() * 0.3));
    const conversionRate = (orders / (orders * (8 + Math.random() * 4))) * 100;
    const averageOrderValue = revenue / orders;
    const profitMargin = 20 + (Math.random() - 0.5) * 10;
    const returns = Math.floor(unitsSold * (0.02 + Math.random() * 0.03));
    const refunds = returns * averageOrderValue * 0.8;
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(revenue * 100) / 100,
      unitsSold,
      orders,
      conversionRate: Math.round(conversionRate * 100) / 100,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
      returns,
      refunds: Math.round(refunds * 100) / 100
    });
  }
  
  return data;
};

export const generateMockProductSales = (): ProductSalesData[] => {
  const products = [
    { asin: 'B08N5WRWNW', name: 'Wireless Bluetooth Headphones', category: 'Electronics' },
    { asin: 'B07FZ8S74R', name: 'Stainless Steel Water Bottle', category: 'Home & Kitchen' },
    { asin: 'B085RXZKM7', name: 'USB-C Charging Cable', category: 'Electronics' },
    { asin: 'B09JNVJ8K3', name: 'Yoga Mat Premium', category: 'Sports & Outdoors' },
    { asin: 'B07QXMNF1X', name: 'LED Desk Lamp', category: 'Home & Kitchen' }
  ];
  
  return products.map(product => ({
    asin: product.asin,
    productName: product.name,
    category: product.category,
    revenue: Math.round((5000 + Math.random() * 15000) * 100) / 100,
    unitsSold: Math.floor(50 + Math.random() * 300),
    orders: Math.floor(30 + Math.random() * 200),
    profitMargin: Math.round((15 + Math.random() * 20) * 100) / 100,
    returnRate: Math.round((1 + Math.random() * 4) * 100) / 100
  }));
};

export const mockSalesAnalytics: SalesAnalytics = {
  dailySales: generateMockSalesData(30),
  weeklySales: generateMockSalesData(12).map((data, index) => ({
    ...data,
    date: `Week ${index + 1}`
  })),
  monthlySales: generateMockSalesData(6).map((data, index) => ({
    ...data,
    date: new Date(2024, index, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  })),
  productBreakdown: generateMockProductSales(),
  totalRevenue: 125000,
  totalOrders: 2850,
  totalUnits: 4200,
  averageOrderValue: 43.86,
  conversionRate: 12.5,
  profitMargin: 22.3
};

// CSV parsing utilities
export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }
  
  return data;
};

export const validateSalesCSV = (data: any[]): boolean => {
  if (!data.length) return false;
  
  const requiredFields = ['date', 'revenue'];
  const firstRow = data[0];
  
  return requiredFields.every(field => 
    Object.keys(firstRow).some(key => 
      key.toLowerCase().includes(field.toLowerCase())
    )
  );
};

export const validateInventoryCSV = (data: any[]): boolean => {
  if (!data.length) return false;
  const requiredFields = ['sku', 'product', 'stock', 'status', 'inbound', 'velocity'];
  const firstRow = data[0];
  return requiredFields.every(field =>
    Object.keys(firstRow).some(key =>
      key.toLowerCase().includes(field.toLowerCase())
    )
  );
};

export const validateProductCSV = (data: any[]): boolean => {
  if (!data.length) return false;
  const requiredFields = ['name', 'sku', 'asin', 'revenue', 'sessions', 'conversionRate', 'inventory', 'unitsSold', 'profit', 'acos', 'status'];
  const firstRow = data[0];
  return requiredFields.every(field =>
    Object.keys(firstRow).some(key =>
      key.toLowerCase().includes(field.toLowerCase())
    )
  );
};

export const validatePPCCampaignCSV = (data: any[]): boolean => {
  if (!data.length) return false;
  const requiredFields = ['campaignName', 'campaignType', 'totalOrders', 'totalSales', 'tacos', 'spend', 'sales', 'acos', 'roas', 'impressions', 'clicks', 'cpc', 'cvr', 'ctr', 'ppcOrders', 'status'];
  const firstRow = data[0];
  return requiredFields.every(field =>
    Object.keys(firstRow).some(key =>
      key.toLowerCase().includes(field.toLowerCase())
    )
  );
};
