import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50"
  >
    <div className="flex items-center space-x-3 text-gray-700">
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
    <ChevronRight size={16} className="text-gray-400" />
  </button>
);
