
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { mockUnifiedAnalytics } from '@/utils/unifiedAnalytics';
import { exportDetailedAnalysis, exportExecutiveSummary, exportPerformanceReport } from '@/utils/pdfExport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, BarChart3 } from 'lucide-react';

const Analysis = () => {
  const [analytics] = useState(mockUnifiedAnalytics);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportDetailedAnalysis(analytics);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExecutiveSummary = async () => {
    setIsExporting(true);
    try {
      await exportExecutiveSummary(analytics);
    } catch (error) {
      console.error('Error exporting executive summary:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPerformanceReport = async () => {
    setIsExporting(true);
    try {
      await exportPerformanceReport(analytics);
    } catch (error) {
      console.error('Error exporting performance report:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <PageLayout title="Business Intelligence">
      <div className="space-y-6">
        {/* Quick Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Export Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                onClick={handleExportExecutiveSummary}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Executive Summary
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportPerformanceReport}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Performance Report
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Complete Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Analytics Dashboard */}
        <AnalyticsDashboard 
          analytics={analytics} 
          onExportPDF={handleExportPDF}
        />
      </div>
    </PageLayout>
  );
};

export default Analysis;
