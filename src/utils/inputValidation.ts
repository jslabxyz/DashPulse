// Input Validation and Sanitization Utilities

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData: Record<string, any>;
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
  decimal: /^\d+(\.\d{1,2})?$/,
  asin: /^[A-Z0-9]{10}$/,
  sku: /^[A-Z0-9\-_]{3,50}$/,
  currency: /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/,
  percentage: /^\d{1,3}(\.\d{1,2})?%?$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  url: /^https?:\/\/.+/
};

// Dangerous patterns to sanitize
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /onload\s*=/gi,
  /onerror\s*=/gi,
  /onclick\s*=/gi,
  /onmouseover\s*=/gi,
  /<iframe\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
  /<link\b[^>]*>/gi,
  /<meta\b[^>]*>/gi
];

/**
 * Sanitizes input by removing potentially dangerous content
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return String(input);
  }

  let sanitized = input;

  // Remove dangerous patterns
  DANGEROUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
};

/**
 * Sanitizes numeric input and converts to number
 */
export const sanitizeNumber = (input: any): number | null => {
  if (typeof input === 'number') {
    return isFinite(input) ? input : null;
  }

  const sanitized = sanitizeInput(String(input));
  const cleaned = sanitized.replace(/[^\d.-]/g, '');
  const number = parseFloat(cleaned);

  return isFinite(number) ? number : null;
};

/**
 * Sanitizes currency input and converts to number
 */
export const sanitizeCurrency = (input: any): number | null => {
  const sanitized = sanitizeInput(String(input));
  const cleaned = sanitized.replace(/[$,\s]/g, '');
  return sanitizeNumber(cleaned);
};

/**
 * Sanitizes percentage input and converts to number
 */
export const sanitizePercentage = (input: any): number | null => {
  const sanitized = sanitizeInput(String(input));
  const cleaned = sanitized.replace(/[%\s]/g, '');
  const number = sanitizeNumber(cleaned);
  
  if (number === null) return null;
  
  // If the original input had a % sign, treat as percentage, otherwise as decimal
  if (sanitized.includes('%')) {
    return number;
  } else if (number <= 1) {
    return number * 100; // Convert decimal to percentage
  }
  
  return number;
};

/**
 * Validates a single field against a rule
 */
export const validateField = (value: any, rule: ValidationRule, fieldName: string): string | null => {
  // Required validation
  if (rule.required && (value === null || value === undefined || value === '')) {
    return `${fieldName} is required`;
  }

  // Skip other validations if value is empty and not required
  if (!rule.required && (value === null || value === undefined || value === '')) {
    return null;
  }

  const stringValue = String(value);

  // Length validations
  if (rule.minLength && stringValue.length < rule.minLength) {
    return `${fieldName} must be at least ${rule.minLength} characters`;
  }

  if (rule.maxLength && stringValue.length > rule.maxLength) {
    return `${fieldName} must not exceed ${rule.maxLength} characters`;
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(stringValue)) {
    return `${fieldName} format is invalid`;
  }

  // Numeric range validations
  const numericValue = sanitizeNumber(value);
  if (rule.min !== undefined && (numericValue === null || numericValue < rule.min)) {
    return `${fieldName} must be at least ${rule.min}`;
  }

  if (rule.max !== undefined && (numericValue === null || numericValue > rule.max)) {
    return `${fieldName} must not exceed ${rule.max}`;
  }

  // Custom validation
  if (rule.custom) {
    const customError = rule.custom(value);
    if (customError) {
      return customError;
    }
  }

  return null;
};

/**
 * Validates an object against a schema
 */
export const validateData = (data: Record<string, any>, schema: ValidationSchema): ValidationResult => {
  const errors: Record<string, string> = {};
  const sanitizedData: Record<string, any> = {};

  // Validate each field in the schema
  Object.keys(schema).forEach(fieldName => {
    const rule = schema[fieldName];
    const value = data[fieldName];

    // Sanitize the input first
    let sanitizedValue = value;
    if (typeof value === 'string') {
      sanitizedValue = sanitizeInput(value);
    }

    // Validate the sanitized value
    const error = validateField(sanitizedValue, rule, fieldName);
    if (error) {
      errors[fieldName] = error;
    }

    sanitizedData[fieldName] = sanitizedValue;
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
};

// Pre-defined validation schemas for common use cases
export const VALIDATION_SCHEMAS = {
  product: {
    name: {
      required: true,
      minLength: 1,
      maxLength: 200,
      custom: (value: string) => {
        if (/<[^>]*>/.test(value)) {
          return 'Product name cannot contain HTML tags';
        }
        return null;
      }
    },
    sku: {
      required: true,
      pattern: VALIDATION_PATTERNS.sku,
      maxLength: 50
    },
    asin: {
      required: true,
      pattern: VALIDATION_PATTERNS.asin
    },
    price: {
      required: true,
      min: 0,
      max: 999999.99,
      custom: (value: any) => {
        const num = sanitizeNumber(value);
        if (num === null) {
          return 'Price must be a valid number';
        }
        return null;
      }
    },
    inventory: {
      required: true,
      min: 0,
      max: 999999,
      custom: (value: any) => {
        const num = sanitizeNumber(value);
        if (num === null || !Number.isInteger(num)) {
          return 'Inventory must be a whole number';
        }
        return null;
      }
    }
  },

  campaign: {
    campaignName: {
      required: true,
      minLength: 1,
      maxLength: 100,
      custom: (value: string) => {
        if (/<[^>]*>/.test(value)) {
          return 'Campaign name cannot contain HTML tags';
        }
        return null;
      }
    },
    budget: {
      required: true,
      min: 1,
      max: 999999.99,
      custom: (value: any) => {
        const num = sanitizeNumber(value);
        if (num === null) {
          return 'Budget must be a valid number';
        }
        return null;
      }
    },
    targetAcos: {
      min: 0,
      max: 100,
      custom: (value: any) => {
        const num = sanitizePercentage(value);
        if (num !== null && (num < 0 || num > 100)) {
          return 'Target ACOS must be between 0% and 100%';
        }
        return null;
      }
    }
  },

  user: {
    email: {
      required: true,
      pattern: VALIDATION_PATTERNS.email,
      maxLength: 254
    },
    firstName: {
      required: true,
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/
    },
    lastName: {
      required: true,
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/
    },
    phone: {
      pattern: VALIDATION_PATTERNS.phone,
      maxLength: 20
    }
  },

  csvImport: {
    timeFrame: {
      required: true,
      custom: (value: string) => {
        const validTimeFrames = ['7days', 'lastweek', 'thismonth', 'lastmonth', 'thisyear', 'custom'];
        if (!validTimeFrames.includes(value)) {
          return 'Invalid time frame selected';
        }
        return null;
      }
    },
    startDate: {
      pattern: VALIDATION_PATTERNS.date,
      custom: (value: string) => {
        if (value && new Date(value) > new Date()) {
          return 'Start date cannot be in the future';
        }
        return null;
      }
    },
    endDate: {
      pattern: VALIDATION_PATTERNS.date,
      custom: (value: string) => {
        if (value && new Date(value) > new Date()) {
          return 'End date cannot be in the future';
        }
        return null;
      }
    }
  }
};

/**
 * React hook for form validation
 */
export const useFormValidation = (schema: ValidationSchema) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isValid, setIsValid] = React.useState(false);

  const validate = (data: Record<string, any>) => {
    const result = validateData(data, schema);
    setErrors(result.errors);
    setIsValid(result.isValid);
    return result;
  };

  const validateField = (fieldName: string, value: any) => {
    if (schema[fieldName]) {
      const error = validateField(value, schema[fieldName], fieldName);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || ''
      }));
    }
  };

  const clearErrors = () => {
    setErrors({});
    setIsValid(false);
  };

  return {
    errors,
    isValid,
    validate,
    validateField,
    clearErrors
  };
};