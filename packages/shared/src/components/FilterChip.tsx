import React from 'react';

export interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      selected 
        ? 'bg-brand-green text-white' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);
