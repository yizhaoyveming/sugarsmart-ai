import React from 'react';
import { SubTab } from '../config/navigation';

interface SubTabsProps {
  tabs: SubTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const SubTabs: React.FC<SubTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex gap-1 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                px-4 py-3 text-sm font-medium
                border-b-2 transition-colors
                flex items-center gap-2
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {Icon && <Icon size={16} />}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
