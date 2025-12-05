import React from 'react';

export interface InputRangeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (val: number) => void;
}

export const InputRange: React.FC<InputRangeProps> = ({ 
  label, 
  value, 
  min, 
  max, 
  unit, 
  onChange 
}) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="text-gray-700 font-medium">{label}</span>
      <span className="text-brand-green font-bold">
        {value} <span className="text-xs text-gray-500 font-normal">{unit}</span>
      </span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
    />
  </div>
);
