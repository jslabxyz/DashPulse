// CSV Security and Validation Utilities

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CSVConfig {
  maxFileSize: number; // in bytes
  maxRows: number;
  maxColumns: number;
  allowedExtensions: string[];
  requiredColumns: string[];
}

// Default configuration
export const DEFAULT_CSV_CONFIG: CSVConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxRows: 10000,
  maxColumns: 50,
  allowedExtensions: ['.csv', '.txt'],
  requiredColumns: []
};

// Malicious patterns to detect
const MALICIOUS_PATTERNS = [
  /^[=+\-@]/, // Formula injection
  /javascript:/i,
  /<script/i,
  /data:text\/html/i,
  /vbscript:/i,
  /onload=/i,
  /onerror=/i
];

/**
 * Sanitizes CSV content by removing potentially malicious patterns
 */
export const sanitizeCSVContent = (content: string): string => {
  return content
    .split('\n')
    .map(line => {
      return line
        .split(',')
        .map(cell => {
          let sanitized = cell.trim().replace(/^["']|["']$/g, ''); // Remove quotes
          
          // Check for formula injection
          if (MALICIOUS_PATTERNS.some(pattern => pattern.test(sanitized))) {
            sanitized = `'${sanitized}`; // Prefix with single quote to neutralize
          }
          
          // Remove potentially dangerous characters
          sanitized = sanitized
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Control characters
            .replace(/<[^>]*>/g, ''); // HTML tags
          
          return sanitized;
        })
        .join(',');
    })
    .join('\n');
};

/**
 * Validates CSV file before processing
 */
export const validateCSVFile = (
  file: File, 
  config: Partial<CSVConfig> = {}
): ValidationResult => {
  const finalConfig = { ...DEFAULT_CSV_CONFIG, ...config };
  const errors: string[] = [];
  const warnings: string[] = [];

  // File size validation
  if (file.size > finalConfig.maxFileSize) {
    errors.push(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(finalConfig.maxFileSize / 1024 / 1024).toFixed(2)}MB)`);
  }

  // File extension validation
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!finalConfig.allowedExtensions.includes(fileExtension)) {
    errors.push(`File type "${fileExtension}" is not allowed. Allowed types: ${finalConfig.allowedExtensions.join(', ')}`);
  }

  // File name validation
  if (file.name.length > 255) {
    errors.push('File name is too long (maximum 255 characters)');
  }

  // Check for suspicious file names
  if (/[<>:"|?*\x00-\x1f]/.test(file.name)) {
    errors.push('File name contains invalid characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validates CSV content structure and data
 */
export const validateCSVContent = (
  content: string,
  config: Partial<CSVConfig> = {}
): ValidationResult => {
  const finalConfig = { ...DEFAULT_CSV_CONFIG, ...config };
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      errors.push('CSV file is empty');
      return { isValid: false, errors, warnings };
    }

    // Row count validation
    if (lines.length > finalConfig.maxRows) {
      errors.push(`Too many rows (${lines.length}). Maximum allowed: ${finalConfig.maxRows}`);
    }

    // Header validation
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    
    if (headers.length > finalConfig.maxColumns) {
      errors.push(`Too many columns (${headers.length}). Maximum allowed: ${finalConfig.maxColumns}`);
    }

    // Check for required columns
    if (finalConfig.requiredColumns.length > 0) {
      const missingColumns = finalConfig.requiredColumns.filter(
        required => !headers.some(header => 
          header.toLowerCase().includes(required.toLowerCase())
        )
      );
      
      if (missingColumns.length > 0) {
        errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
      }
    }

    // Check for duplicate headers
    const duplicateHeaders = headers.filter((header, index) => 
      headers.indexOf(header) !== index
    );
    if (duplicateHeaders.length > 0) {
      warnings.push(`Duplicate column headers found: ${duplicateHeaders.join(', ')}`);
    }

    // Validate data rows
    for (let i = 1; i < Math.min(lines.length, 100); i++) { // Check first 100 rows
      const cells = lines[i].split(',');
      
      if (cells.length !== headers.length) {
        warnings.push(`Row ${i + 1} has ${cells.length} columns, expected ${headers.length}`);
      }

      // Check for malicious content
      for (const cell of cells) {
        if (MALICIOUS_PATTERNS.some(pattern => pattern.test(cell.trim()))) {
          errors.push(`Potentially malicious content detected in row ${i + 1}`);
          break;
        }
      }
    }

  } catch (error) {
    errors.push(`Failed to parse CSV content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Safely parses CSV content with validation and sanitization
 */
export const safeParseCSV = (
  content: string,
  config: Partial<CSVConfig> = {}
): { data: any[]; validation: ValidationResult } => {
  // First validate the content
  const validation = validateCSVContent(content, config);
  
  if (!validation.isValid) {
    return { data: [], validation };
  }

  // Sanitize the content
  const sanitizedContent = sanitizeCSVContent(content);
  
  try {
    const lines = sanitizedContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }

    return { data, validation };
  } catch (error) {
    return {
      data: [],
      validation: {
        isValid: false,
        errors: [`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: validation.warnings
      }
    };
  }
};