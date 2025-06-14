import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseCSV, validateSalesCSV } from '@/utils/salesApi';
import { cn } from '@/lib/utils';

interface CSVImportProps {
  onDataImport: (data: any[], timeFrame: string) => void;
  validateCSV?: (data: any[]) => boolean;
  templateHeaders?: string[];
  templateName?: string;
  className?: string;
}

export function CSVImport({ onDataImport, validateCSV, templateHeaders, templateName, className }: CSVImportProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [timeFrame, setTimeFrame] = useState('');
  const [timeFrameError, setTimeFrameError] = useState('');

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
    const csvFile = files.find(file => file.name.endsWith('.csv'));
    if (!csvFile) {
      setImportStatus('error');
      setErrorMessage('Please select a CSV file');
      return;
    }

    setIsProcessing(true);
    setImportStatus('idle');

    try {
      const text = await csvFile.text();
      const data = parseCSV(text);
      const validator = validateCSV || validateSalesCSV;
      if (!validator(data)) {
        setImportStatus('error');
        setErrorMessage('Invalid CSV format. Please ensure your file contains the required columns.');
        return;
      }

      setPreviewData(data.slice(0, 5)); // Show first 5 rows
      setShowPreview(true);
      setImportStatus('success');
    } catch (error) {
      setImportStatus('error');
      setErrorMessage('Failed to parse CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmImport = () => {
    if (!timeFrame) {
      setTimeFrameError('Please select a time frame.');
      return;
    }
    setTimeFrameError('');
    onDataImport(previewData, timeFrame);
    setShowPreview(false);
    setPreviewData([]);
    setTimeFrame('');
  };

  const cancelImport = () => {
    setShowPreview(false);
    setPreviewData([]);
    setImportStatus('idle');
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
              accept=".csv"
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
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
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
        </div>
      </CardContent>
    </Card>
  );
}
