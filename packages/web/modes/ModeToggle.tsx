import React from 'react';
import { Monitor, BarChart3 } from 'lucide-react';

export type Mode = 'test' | 'admin';

interface ModeToggleProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex gap-1">
      <button
        onClick={() => onModeChange('test')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentMode === 'test'
            ? 'bg-blue-500 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Monitor size={18} />
        <span>测试模式</span>
      </button>
      
      <button
        onClick={() => onModeChange('admin')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentMode === 'admin'
            ? 'bg-purple-500 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <BarChart3 size={18} />
        <span>管理模式</span>
      </button>
    </div>
  );
};
