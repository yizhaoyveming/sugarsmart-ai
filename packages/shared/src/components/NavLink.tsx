import React from 'react';
import { Link } from 'react-router-dom';

export interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center space-y-1 ${
      active ? 'text-brand-green' : 'text-gray-400'
    }`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </Link>
);
