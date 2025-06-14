
import { BusinessIntelligence } from './unifiedAnalytics';

export interface PDFExportOptions {
  title?: string;
  includeCharts?: boolean;
  includeTable?: boolean;
  dateRange?: string;
}

// Temporary implementation - exports data as downloadable text report
export const exportAnalyticsToPDF = async (
  analytics: BusinessIntelligence,
  options: PDFExportOptions = {}
): Promise<void> => {
  const {
    title = 'Business Intelligence Report',
    dateRange = '30 days'
  } = options;

  // Generate text report
  const reportContent = `
${title}
Generated on ${new Date().toLocaleDateString()} | Period: ${dateRange}
${'='.repeat(60)}

EXECUTIVE SUMMARY
${'='.repeat(60)}
• Total Revenue: $${analytics.totalRevenue.toLocaleString()}
• Total PPC Spend: $${analytics.totalPPCSpend.toLocaleString()}
• Total Profit: $${analytics.totalProfit.toLocaleString()}
• Overall ROI: ${analytics.overallROI.toFixed(1)}%
• Average ACOS: ${analytics.averageACOS.toFixed(1)}%
• Inventory Value: $${analytics.inventoryValue.toLocaleString()}
• Products Analyzed: ${analytics.productsAnalyzed}

PERFORMANCE HIGHLIGHTS
${'='.repeat(60)}
Top Performer: ${analytics.topPerformer.name} (${analytics.topPerformer.asin})
Profit: $${analytics.topPerformer.profitability.toLocaleString()} | ROI: ${analytics.topPerformer.roi}%

Needs Attention: ${analytics.worstPerformer.name} (${analytics.worstPerformer.asin})
Profit: $${analytics.worstPerformer.profitability.toLocaleString()} | ROI: ${analytics.worstPerformer.roi}%

CATEGORY PERFORMANCE
${'='.repeat(60)}
${analytics.categoryPerformance.map(category => 
  `${category.category}: Revenue: $${category.revenue.toLocaleString()} | Spend: $${category.spend.toLocaleString()} | ROI: ${category.roi.toFixed(1)}%`
).join('\n')}

PRODUCT PERFORMANCE DETAILS
${'='.repeat(60)}
${analytics.unifiedProducts.map(product => 
  `${product.name} (${product.asin})
  Revenue: $${product.revenue.toLocaleString()} | PPC Spend: $${product.ppcSpend.toLocaleString()}
  ACOS: ${product.acos.toFixed(1)}% | ROI: ${product.roi.toFixed(1)}%
  Stock: ${product.currentStock} | Status: ${product.stockStatus.replace('_', ' ')}
  ${'─'.repeat(40)}`
).join('\n')}

End of Report
  `;

  // Create and download the text file
  const blob = new Blob([reportContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `business-intelligence-report-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('Report exported successfully as text file');
};

// Quick export functions for different report types
export const exportExecutiveSummary = (analytics: BusinessIntelligence) => {
  return exportAnalyticsToPDF(analytics, {
    title: 'Executive Summary Report',
    includeCharts: false,
    includeTable: false
  });
};

export const exportDetailedAnalysis = (analytics: BusinessIntelligence) => {
  return exportAnalyticsToPDF(analytics, {
    title: 'Detailed Business Analysis',
    includeCharts: true,
    includeTable: true
  });
};

export const exportPerformanceReport = (analytics: BusinessIntelligence) => {
  return exportAnalyticsToPDF(analytics, {
    title: 'Product Performance Report',
    includeCharts: false,
    includeTable: true
  });
};
