import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PPCSummary } from '@/components/ppc/PPCSummary';
import { PPCTable } from '@/components/ppc/PPCTable';
import { CSVImport } from '@/components/sales/CSVImport';
import { mockCampaigns, PPCCampaign } from '@/utils/ppcApi';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Upload } from 'lucide-react';
import { parseCSV, validatePPCCampaignCSV } from '@/utils/salesApi';

const Markets = () => {
  const [campaigns, setCampaigns] = useState<PPCCampaign[]>(mockCampaigns);
  const [showImport, setShowImport] = useState(false);

  const handleCampaignClick = (campaign: PPCCampaign) => {
    console.log('Campaign clicked:', campaign);
    // TODO: Navigate to campaign detail page or show modal
  };

  const handleDataImport = (importedData: any[]) => {
    if (!validatePPCCampaignCSV(importedData)) {
      alert('Invalid PPC campaign CSV format.');
      return;
    }
    setCampaigns(importedData);
    setShowImport(false);
    alert('PPC campaign data imported successfully!');
  };

  const handleExportData = () => {
    const csvContent = [
      ['Campaign Name', 'Campaign Type', 'Total Orders', 'Total Sales', 'TACoS', 'Spend', 'Sales', 'ACoS', 'ROAS', 'Impressions', 'Clicks', 'CPC', 'CVR', 'CTR', 'PPC Orders', 'Status'].join(','),
      ...campaigns.map(campaign => [
        `"${campaign.campaignName}"`,
        campaign.campaignType,
        campaign.totalOrders,
        campaign.totalSales,
        campaign.tacos,
        campaign.spend,
        campaign.sales,
        campaign.acos,
        campaign.roas,
        campaign.impressions,
        campaign.clicks,
        campaign.cpc,
        campaign.cvr,
        campaign.ctr,
        campaign.ppcOrders,
        campaign.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ppc-campaigns-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    console.log('Refreshing PPC data...');
    // In a real app, this would fetch fresh data from your API
  };

  return (
    <PageLayout title="PPC Campaigns">
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button onClick={() => setShowImport(!showImport)} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV Data
            </Button>
            <Button onClick={handleExportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* CSV Import */}
        {showImport && (
          <CSVImport onDataImport={handleDataImport} validateCSV={validatePPCCampaignCSV} templateHeaders={['campaignName','campaignType','totalOrders','totalSales','tacos','spend','sales','acos','roas','impressions','clicks','cpc','cvr','ctr','ppcOrders','status']} />
        )}

        <PPCSummary campaigns={campaigns} />
        <PPCTable campaigns={campaigns} onCampaignClick={handleCampaignClick} />
      </div>
    </PageLayout>
  );
};

export default Markets;
