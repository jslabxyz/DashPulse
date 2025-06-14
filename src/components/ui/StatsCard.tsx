
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
  valueClassName?: string;
  onClick?: () => void;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
  className,
  valueClassName,
  onClick,
}: StatsCardProps) {
  const formattedTrend = trend !== undefined ? (trend > 0 ? `+${trend.toFixed(1)}%` : `${trend.toFixed(1)}%`) : null;
  const isTrendPositive = trend !== undefined ? trend > 0 : null;
  
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg border-0 shadow-sm",
        onClick ? "cursor-pointer hover:scale-[1.02]" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-5 w-5 text-gray-500 opacity-80">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-3xl font-bold tracking-tight text-gray-900">
          <span className={cn("", valueClassName)}>{value}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          {trend !== undefined && (
            <div className={cn(
              "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
              isTrendPositive 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            )}>
              {isTrendPositive ? (
                <ArrowUpIcon className="h-3 w-3" />
              ) : (
                <ArrowDownIcon className="h-3 w-3" />
              )}
              <span>{formattedTrend}</span>
            </div>
          )}
          {trendLabel && (
            <span className="text-gray-600 text-xs">
              {trendLabel}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-gray-500 mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
