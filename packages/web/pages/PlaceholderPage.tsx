import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="p-8 h-full flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <Icon className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-6">{description}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span>即将上线</span>
        </div>
      </div>
    </div>
  );
};
