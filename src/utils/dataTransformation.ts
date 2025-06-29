// Data Transformation and Sanitization Utilities

import { sanitizeInput, sanitizeNumber, sanitizeCurrency, sanitizePercentage } from './inputValidation';

export interface TransformationRule {
  type: 'string' | 'number' | 'currency' | 'percentage' | 'date' | 'boolean' | 'array';
  required?: boolean;
  defaultValue?: any;
  transform?: (value: any) => any;
}

export interface TransformationSchema {
  [key: string]: TransformationRule;
}

/**
 * Transforms and sanitizes data according to a schema
 */
export const transformData = (
  data: Record<string, any>, 
  schema: TransformationSchema
): Record<string, any> => {
  const transformed: Record<string, any> = {};

  Object.keys(schema).forEach(key => {
    const rule = schema[key];
    let value = data[key];

    // Handle missing values
    if (value === undefined || value === null || value === '') {
      if (rule.required) {
        throw new Error(`Required field '${key}' is missing`);
      }
      value = rule.defaultValue;
    }

    // Skip transformation if value is still null/undefined
    if (value === undefined || value === null) {
      transformed[key] = value;
      return;
    }

    // Apply custom transformation first
    if (rule.transform) {
      value = rule.transform(value);
    }

    // Apply type-specific transformations
    switch (rule.type) {
      case 'string':
        transformed[key] = sanitizeInput(String(value));
        break;

      case 'number':
        transformed[key] = sanitizeNumber(value);
        break;

      case 'currency':
        transformed[key] = sanitizeCurrency(value);
        break;

      case 'percentage':
        transformed[key] = sanitizePercentage(value);
        break;

      case 'date':
        transformed[key] = transformDate(value);
        break;

      case 'boolean':
        transformed[key] = transformBoolean(value);
        break;

      case 'array':
        transformed[key] = transformArray(value);
        break;

      default:
        transformed[key] = value;
    }
  });

  return transformed;
};

/**
 * Transforms date input to ISO string
 */
const transformDate = (value: any): string | null => {
  if (!value) return null;

  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  } catch {
    return null;
  }
};

/**
 * Transforms boolean input
 */
const transformBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return lower === 'true' || lower === '1' || lower === 'yes' || lower === 'on';
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return Boolean(value);
};

/**
 * Transforms array input
 */
const transformArray = (value: any): any[] => {
  if (Array.isArray(value)) {
    return value.map(item => sanitizeInput(String(item)));
  }
  if (typeof value === 'string') {
    // Split by comma and sanitize each item
    return value.split(',').map(item => sanitizeInput(item.trim())).filter(Boolean);
  }
  return [];
};

// Pre-defined transformation schemas
export const TRANSFORMATION_SCHEMAS = {
  product: {
    name: { type: 'string', required: true },
    sku: { type: 'string', required: true },
    asin: { type: 'string', required: true },
    price: { type: 'currency', required: true },
    inventory: { type: 'number', required: true },
    description: { type: 'string', defaultValue: '' },
    category: { type: 'string', defaultValue: 'Uncategorized' },
    isActive: { type: 'boolean', defaultValue: true },
    tags: { type: 'array', defaultValue: [] }
  } as TransformationSchema,

  campaign: {
    campaignName: { type: 'string', required: true },
    budget: { type: 'currency', required: true },
    targetAcos: { type: 'percentage', defaultValue: 0 },
    startDate: { type: 'date', required: true },
    endDate: { type: 'date' },
    isActive: { type: 'boolean', defaultValue: true },
    keywords: { type: 'array', defaultValue: [] }
  } as TransformationSchema,

  salesData: {
    date: { type: 'date', required: true },
    revenue: { type: 'currency', required: true },
    unitsSold: { type: 'number', required: true },
    orders: { type: 'number', required: true },
    conversionRate: { type: 'percentage', defaultValue: 0 },
    averageOrderValue: { type: 'currency', defaultValue: 0 },
    profitMargin: { type: 'percentage', defaultValue: 0 }
  } as TransformationSchema,

  inventoryData: {
    sku: { type: 'string', required: true },
    product: { type: 'string', required: true },
    stock: { type: 'number', required: true },
    inbound: { type: 'number', defaultValue: 0 },
    velocity: { type: 'number', defaultValue: 0 },
    status: { 
      type: 'string', 
      defaultValue: 'healthy',
      transform: (value: string) => {
        const validStatuses = ['healthy', 'low', 'critical', 'out_of_stock'];
        return validStatuses.includes(value) ? value : 'healthy';
      }
    }
  } as TransformationSchema,

  ppcCampaign: {
    campaignName: { type: 'string', required: true },
    campaignType: { type: 'string', required: true },
    totalOrders: { type: 'number', defaultValue: 0 },
    totalSales: { type: 'currency', defaultValue: 0 },
    tacos: { type: 'percentage', defaultValue: 0 },
    spend: { type: 'currency', defaultValue: 0 },
    sales: { type: 'currency', defaultValue: 0 },
    acos: { type: 'percentage', defaultValue: 0 },
    roas: { type: 'number', defaultValue: 0 },
    impressions: { type: 'number', defaultValue: 0 },
    clicks: { type: 'number', defaultValue: 0 },
    cpc: { type: 'currency', defaultValue: 0 },
    cvr: { type: 'percentage', defaultValue: 0 },
    ctr: { type: 'percentage', defaultValue: 0 },
    ppcOrders: { type: 'number', defaultValue: 0 },
    status: { 
      type: 'string', 
      defaultValue: 'Active',
      transform: (value: string) => {
        const validStatuses = ['Active', 'Paused', 'Targeting', 'Archived'];
        return validStatuses.includes(value) ? value : 'Active';
      }
    }
  } as TransformationSchema
};

/**
 * Batch transforms multiple records
 */
export const transformBatch = (
  records: Record<string, any>[],
  schema: TransformationSchema
): Record<string, any>[] => {
  return records.map((record, index) => {
    try {
      return transformData(record, schema);
    } catch (error) {
      throw new Error(`Error transforming record ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
};

/**
 * Validates transformed data integrity
 */
export const validateTransformedData = (
  original: Record<string, any>[],
  transformed: Record<string, any>[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (original.length !== transformed.length) {
    errors.push(`Record count mismatch: original ${original.length}, transformed ${transformed.length}`);
  }

  // Check for data loss in transformation
  transformed.forEach((record, index) => {
    Object.keys(record).forEach(key => {
      if (record[key] === null && original[index] && original[index][key] !== null && original[index][key] !== undefined) {
        errors.push(`Data loss detected in record ${index + 1}, field '${key}'`);
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};