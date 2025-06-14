
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeywordRanking, getRankingTrend } from '@/utils/amazonApi';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KeywordRankingsCardProps {
  data: KeywordRanking[];
}

export function KeywordRankingsCard({ data }: KeywordRankingsCardProps) {
  return (
    <Card className="animate-slide-up" style={{ '--delay': '400ms' } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Search className="h-5 w-5 text-indigo-600" />
          Keyword Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-sm font-medium text-gray-600">Keyword</th>
                <th className="text-center py-2 text-sm font-medium text-gray-600">Current Rank</th>
                <th className="text-center py-2 text-sm font-medium text-gray-600">Change</th>
                <th className="text-right py-2 text-sm font-medium text-gray-600">Search Volume</th>
                <th className="text-right py-2 text-sm font-medium text-gray-600">Bid</th>
              </tr>
            </thead>
            <tbody>
              {data.map((keyword) => {
                const trend = getRankingTrend(keyword.currentRank, keyword.previousRank);
                return (
                  <tr key={keyword.keyword} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div>
                        <div className="font-medium text-sm">{keyword.keyword}</div>
                        <div className="text-xs text-gray-500">{keyword.category}</div>
                      </div>
                    </td>
                    <td className="text-center py-3">
                      <span className="font-semibold">#{keyword.currentRank}</span>
                    </td>
                    <td className="text-center py-3">
                      <div className="flex items-center justify-center gap-1">
                        {trend.direction === 'up' && (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 text-sm">+{trend.change}</span>
                          </>
                        )}
                        {trend.direction === 'down' && (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                            <span className="text-red-600 text-sm">-{trend.change}</span>
                          </>
                        )}
                        {trend.direction === 'same' && (
                          <>
                            <Minus className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400 text-sm">0</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="text-right py-3 text-sm">{keyword.searchVolume.toLocaleString()}</td>
                    <td className="text-right py-3 text-sm">${keyword.bid}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
