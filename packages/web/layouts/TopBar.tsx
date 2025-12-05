import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索用户、食谱..."
            className="
              w-full pl-10 pr-4 py-2 
              bg-gray-50 border border-gray-200 rounded-lg
              text-sm text-gray-900 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            "
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="
            absolute top-1 right-1 
            w-2 h-2 bg-red-500 rounded-full
            ring-2 ring-white
          "></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 cursor-pointer transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">Y</span>
          </div>
          <span className="text-sm font-medium text-gray-700">yizhaoyveming</span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
};
