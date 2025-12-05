import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { mainNavigation, bottomNavigation, NavigationItem } from '../config/navigation';

interface SidebarProps {
  activeNav: string;
  onNavChange: (navId: string) => void;
}

const NavItem: React.FC<{
  item: NavigationItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}> = ({ item, active, collapsed, onClick }) => {
  const Icon = item.icon;
  
  const colorClasses = {
    blue: active ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50',
    green: active ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-50',
    purple: active ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-50',
    orange: active ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-50',
    gray: active ? 'bg-gray-500 text-white' : 'text-gray-600 hover:bg-gray-50',
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
        font-medium text-sm transition-all
        ${colorClasses[item.color as keyof typeof colorClasses]}
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <Icon size={20} />
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
              {item.badge}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, onNavChange }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        bg-white border-r border-gray-200
        flex flex-col h-screen
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <div className="text-2xl">🍬</div>
        {!collapsed && (
          <div className="ml-3 flex-1">
            <div className="font-bold text-gray-900">智糖管家</div>
            <div className="text-xs text-gray-500">SugarSmart AI</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-100 rounded transition-colors ml-auto"
        >
          {collapsed ? (
            <ChevronRight size={18} className="text-gray-600" />
          ) : (
            <ChevronLeft size={18} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {mainNavigation.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={activeNav === item.id}
            collapsed={collapsed}
            onClick={() => onNavChange(item.id)}
          />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1 border-t border-gray-200">
        {bottomNavigation.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={activeNav === item.id}
            collapsed={collapsed}
            onClick={() => onNavChange(item.id)}
          />
        ))}
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield size={16} className="text-purple-600" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 truncate">管理员</div>
              <div className="text-xs text-gray-500 truncate">admin@sugarsmart.ai</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
