
import React from 'react';
import { Card } from '../ui/Card';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendLabel, colorClass }) => {
  return (
    <Card className="shadow-neo-sm dark:shadow-dark-neo-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-dark-content/70 truncate">{title}</p>
          <p className="text-3xl font-bold text-neutral dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-md ${colorClass}`}>
          {icon}
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center space-x-1 text-sm">
          {trend >= 0 ? 
            <ArrowUpIcon className="h-4 w-4 text-green-500" /> : 
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          }
          <span className={`${trend >= 0 ? 'text-green-600' : 'text-red-600'} font-semibold`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-gray-500 dark:text-dark-content/70">{trendLabel || 'vs last month'}</span>
        </div>
      )}
    </Card>
  );
};
