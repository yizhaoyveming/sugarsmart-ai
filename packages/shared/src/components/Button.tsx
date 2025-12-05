import React from 'react';

export interface ButtonProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  variant = 'primary', 
  className = '', 
  children, 
  disabled, 
  type = 'button' 
}) => {
  const baseStyle = "w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2";
  const variants = {
    primary: "bg-brand-orange text-white hover:bg-orange-600 disabled:bg-orange-300",
    secondary: "bg-brand-green text-white hover:bg-green-700 disabled:bg-green-300",
    outline: "border-2 border-brand-green text-brand-green hover:bg-brand-light",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};
