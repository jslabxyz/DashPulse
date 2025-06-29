import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseCSV, validateSalesCSV } from '@/utils/salesApi';
import { 
  validateCSVFile, 
  safeParseCSV, 
  DEFAULT_CSV_CONFIG,
  type CSVConfig 
} from '@/utils/csvSecurity';
import { handleError, handleSecurityError, handleValidationError } from '@/utils/errorHandler';
import { cn } from '@/lib/utils';

interface CSVImportProps {
  onDataImport: (data: any[], timeFrame: string) => void;
  validateCSV?: (data: any[]) => boolean;
  templateHeaders?: string[];
  templateName?: string;
  className?: string;
  csvConfig?: Partial<CSVConfig>;
}

export function CSVImport({ 
  onDataImport, 
  validateCSV, 
  templateHeaders, 
  templateName, 
  className,
  csvConfig = {}
}: CSVImportProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [warningMessages, setWarningMessages] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [timeFrame, setTimeFrame] = useState('');
  const [timeFrameError, setTimeFrameError] = useState('');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const finalConfig = {
    ...DEFAULT_CSV_CONFIG,
    requiredColumns: templateHeaders || [],
    ...csvConfig
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const csvFile = files[0];
    if (!csvFile) {
      setImportStatus('error');
      setErrorMessage('Please select a file');
      return;
    }

    // Validate file before processing
    const fileValidation = validateCSVFile(csvFile, finalConfig);
    if (!fileValidation.isValid) {
      setImportStatus('error');
      setErrorMessage(fileValidation.errors.join('. '));
      handleSecurityError(
        new Error(`File validation failed: ${fileValidation.errors.join(', ')}`),
        'CSVImport',
        'fileValidation'
      );
      return;
    }

    if (fileValidation.warnings.length > 0) {
      setWarningMessages(fileValidation.warnings);
    }
    setIsProcessing(true);
    setImportStatus('idle');
    setErrorMessage('');
    setWarningMessages([]);

    try {
      const text = await csvFile.text();
      
      // Use secure CSV parsing
      const { data, validation } = safeParseCSV(text, finalConfig);
      
      if (!validation.isValid) {
        setImportStatus('error');
        setErrorMessage(validation.errors.join('. '));
        handleValidationError(
          new Error(`CSV validation failed: ${validation.errors.join(', ')}`),
          'csvContent',
          'CSVImport'
        );
        return;
      }

      if (validation.warnings.length > 0) {
        setWarningMessages(prev => [...prev, ...validation.warnings]);
      }

      // Additional custom validation if provided
      if (validateCSV && !validateCSV(data)) {
        setImportStatus('error');
        setErrorMessage('Data validation failed. Please check your file format and try again.');
        handleValidationError(
          new Error('Custom validation failed'),
          'customValidation',
          'CSVImport'
        );
        return;
      }

      setPreviewData(data.slice(0, 5)); // Show first 5 rows
      setShowPreview(true);
      setImportStatus('success');
    } catch (error) {
      setImportStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Failed to parse CSV file';
      setErrorMessage(errorMsg);
      handleError(
        error instanceof Error ? error : new Error(errorMsg),
        { component: 'CSVImport', action: 'parseFile' },
        'medium',
        'validation'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmImport = () => {
    if (!timeFrame) {
      setTimeFrameError('Please select a time frame.');
      return;
    }
    if (timeFrame === 'custom' && (!customStart || !customEnd)) {
      setTimeFrameError('Please select a start and end date.');
      return;
    }
    
    if (new Date(customStart) > new Date(customEnd)) {
      setTimeFrameError('Start date must be before end date.');
      return;
    }
    
    setTimeFrameError('');
    const timeFrameValue = timeFrame === 'custom'
      ? { type: 'custom', start: customStart, end: customEnd }
      : timeFrame;
    
    onDataImport(previewData, timeFrameValue);
    setShowPreview(false);
    setPreviewData([]);
    setTimeFrame('');
    setCustomStart('');
    setCustomEnd('');
    setWarningMessages([]);
  };

  const cancelImport = () => {
    setShowPreview(false);
    setPreviewData([]);
    setImportStatus('idle');
    setWarningMessages([]);
  };

  const handleDownloadTemplate = () => {
    const headers = (templateHeaders && templateHeaders.length > 0) ? templateHeaders : ['date','revenue'];
    const name = templateName ? templateName.toLowerCase().replace(/\s+/g, '-') + '-template.csv' : 'template.csv';
    const csvContent = headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Sales Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" onClick={handleDownloadTemplate} className="mb-2">
          Download {templateName ? templateName : 'CSV'} Template
        </Button>
        
        {/* File size and format info */}
        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
          <p>Maximum file size: {(finalConfig.maxFileSize / 1024 / 1024).toFixed(1)}MB</p>
          <p>Maximum rows: {finalConfig.maxRows.toLocaleString()}</p>
          {finalConfig.requiredColumns.length > 0 && (
            <p>Required columns: {finalConfig.requiredColumns.join(', ')}</p>
          )}
        </div>
        
        {!showPreview ? (
          <>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-gray-300",
                "hover:border-primary hover:bg-primary/5"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">
                Drop your CSV file here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse files
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Select File'}
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Preview Data</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelImport}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Show warnings if any */}
            {warningMessages.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Warnings</span>
                </div>
                <ul className="text-xs text-yellow-700 space-y-1">
                  {warningMessages.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {previewData[0] && Object.keys(previewData[0]).map(key => (
                        <th key={key} className="px-4 py-2 text-left font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-t">
                        {Object.values(row).map((value: any, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Time Frame <span className="text-red-500">*</span></label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={timeFrame}
                onChange={e => setTimeFrame(e.target.value)}
              >
                <option value="">Select time frame</option>
                <option value="7days">Last 7 Days</option>
                <option value="lastweek">Last Week</option>
                <option value="thismonth">This Month</option>
                <option value="lastmonth">Last Month</option>
                <option value="thisyear">This Year</option>
                <option value="custom">Custom</option>
              </select>
              {timeFrame === 'custom' && (
                <div className="flex gap-2 mt-2">
                  <input 
                    type="date" 
                    className="border rounded px-2 py-1" 
                    value={customStart} 
                    onChange={e => setCustomStart(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <span className="self-center">to</span>
                  <input 
                    type="date" 
                    className="border rounded px-2 py-1" 
                    value={customEnd} 
                    onChange={e => setCustomEnd(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    min={customStart}
                  />
                </div>
              )}
              {timeFrameError && <div className="text-xs text-red-500 mt-1">{timeFrameError}</div>}
            </div>

            <div className="flex gap-2">
              <Button onClick={confirmImport} className="flex-1">
                Import Data
              </Button>
              <Button variant="outline" onClick={cancelImport}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {importStatus === 'success' && !showPreview && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span>Data imported successfully!</span>
          </div>
        )}

        {importStatus === 'error' && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p className="mb-1">Supported format: CSV files with date and revenue columns</p>
          <p>Common Amazon reports: Business Reports, Settlement Reports</p>
          <p className="text-red-500">⚠️ Files are automatically scanned for security threats</p>
        </div>
      </CardContent>
    </Card>
  );
}
