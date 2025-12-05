import React from 'react';

export interface NutritionItemProps {
  value: number;
  unit: string;
  label: string;
}

export const NutritionItem: React.FC<NutritionItemProps> = ({ value, unit, label }) => (
  <div>
    <div className="font-bold text-gray-800 text-lg">
      {value}<span className="text-xs font-normal text-gray-400">{unit}</span>
    </div>
    <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
  </div>
);
