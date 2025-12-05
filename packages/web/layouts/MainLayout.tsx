import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { SubTabs } from '../components/SubTabs';
import { mainNavigation } from '../config/navigation';

interface MainLayoutProps {
  activeNav: string;
  activeSubTab: string;
  onNavChange: (navId: string) => void;
  onSubTabChange: (subTabId: string) => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  activeNav,
  activeSubTab,
  onNavChange,
  onSubTabChange,
  children 
}) => {
  // Find current navigation item
  const currentNav = mainNavigation.find(nav => nav.id === activeNav);
  const hasSubTabs = currentNav?.subTabs && currentNav.subTabs.length > 0;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavChange={onNavChange} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopBar */}
        <TopBar />

        {/* SubTabs (if exists) */}
        {hasSubTabs && currentNav?.subTabs && (
          <SubTabs
            tabs={currentNav.subTabs}
            activeTab={activeSubTab}
            onTabChange={onSubTabChange}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
