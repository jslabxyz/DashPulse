
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ReviewData } from '@/utils/amazonApi';
import { Star, TrendingUp, MessageCircle } from 'lucide-react';

interface ReviewMonitoringCardProps {
  data: ReviewData;
}

export function ReviewMonitoringCard({ data }: ReviewMonitoringCardProps) {
  const trendData = data.averageRatingTrend.map((rating, index) => ({
    day: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    rating: parseFloat(rating.toFixed(1))
  }));
  
  const StarBar = ({ stars, percentage, color }: { stars: number; percentage: number; color: string }) => (
    <div className="flex items-center gap-3 mb-2">
      <div className="flex items-center gap-1 w-14">
        <span className="text-sm font-medium">{stars}</span>
        <Star className="h-3 w-3 fill-current text-yellow-400" />
      </div>
      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
        <div 
          className="h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm text-gray-600 w-10 text-right font-medium">{percentage}%</span>
    </div>
  );
  
  const formatTooltipValue = (value: any, name: string) => {
    if (value === undefined || value === null) return ['N/A', 'Rating'];
    return [Number(value).toFixed(1), 'Rating'];
  };
  
  return (
    <Card className="animate-slide-up" style={{ '--delay': '500ms' } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Review Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="text-4xl font-bold text-gray-800">{data.rating.toFixed(1)}</div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-6 w-6 ${
                    star <= Math.floor(data.rating) 
                      ? 'fill-current text-yellow-400' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600 font-medium mb-2">
            {data.totalReviews.toLocaleString()} total reviews
          </div>
          <div className="flex items-center justify-center gap-1">
            <MessageCircle className="h-4 w-4 text-blue-600" />
            <span className="text-blue-600 font-semibold">{data.newReviews} new this week</span>
          </div>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <StarBar stars={5} percentage={data.fiveStarPercent} color="#10b981" />
          <StarBar stars={4} percentage={data.fourStarPercent} color="#84cc16" />
          <StarBar stars={3} percentage={data.threeStarPercent} color="#f59e0b" />
          <StarBar stars={2} percentage={data.twoStarPercent} color="#f97316" />
          <StarBar stars={1} percentage={data.oneStarPercent} color="#ef4444" />
        </div>
        
        <div className="h-40">
          <div className="text-sm font-medium mb-3 text-gray-700">Rating Trend (Last 7 Days)</div>
          <ChartContainer config={{
            rating: { label: "Average Rating", color: "#3b82f6" }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  domain={[3.5, 5]}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <ChartTooltip content={<ChartTooltipContent formatter={formatTooltipValue} />} />
                <Line 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
