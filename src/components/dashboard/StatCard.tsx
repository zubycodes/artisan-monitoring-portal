
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className 
}: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden hover-lift", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between cursor-pointer ">
          <div className="space-y-1">
            <p className="text-sm font-medium">{title}</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl font-semibold font-serif">{value}</h3>
              {trend && (
                <span 
                  className={cn(
                    "text-xs font-medium flex items-center",
                    trend.isPositive ? "text-green-800" : "text-red-500"
                  )}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs">{description}</p>
            )}
          </div>
          <div className="rounded-full p-2.5 bg-secondary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
