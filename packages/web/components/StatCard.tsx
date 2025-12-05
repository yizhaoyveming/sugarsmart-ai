import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
  trend?: string;
  trendUp?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  trend,
  trendUp,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Top: Icon + Trend */}
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center`}>
          <Icon className={iconColor} size={24} />
        </div>
        {trend && (
          <span
            className={`
              text-sm font-medium px-2 py-1 rounded-full
              ${trendUp 
                ? 'bg-green-50 text-green-600' 
                : 'bg-red-50 text-red-600'
              }
            `}
          >
            {trend}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>

      {/* Label */}
      <div className="text-sm text-gray-500">{label}</div>

      {/* Mini Chart Placeholder */}
      <div className="mt-4 h-12">
        <svg viewBox="0 0 100 30" className="w-full h-full">
          <path
            d="M0,20 Q25,10 50,15 T100,5"
            stroke={iconColor.replace('text-', '#')}
            strokeWidth="2"
            fill="none"
            className={iconColor.replace('text-', 'stroke-')}
          />
        </svg>
      </div>
    </div>
  );
};
