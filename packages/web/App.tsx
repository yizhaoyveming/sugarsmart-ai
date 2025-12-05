import React, { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { FunctionTest } from './pages/Testing/FunctionTest';
import { ABTest } from './pages/Testing/ABTest';
import { TestTube, Users, FileEdit, Settings, TrendingUp } from 'lucide-react';
import { mainNavigation } from './config/navigation';

/**
 * Web 端主应用 - 新版IKunCode风格
 * 
 * 架构：
 * - 左侧导航：4个核心业务模块
 * - 顶部栏：搜索 + 通知 + 用户
 * - 二级导航：部分模块有Tab切换
 * - 主内容区：业务页面
 * 
 * 模块：
 * 1. 控制台 - 系统概览（单页面，融合所有数据）
 * 2. 测试工具 - 功能测试 + A/B测试
 * 3. 用户洞察 - 用户列表 + 数据分析（单页面）
 * 4. 内容运营 - 食谱 + 文章 + AI配置 + 推送
 * 
 * 旧版双模式代码备份在: modes/ 文件夹
 */
const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('');

  // 当导航切换时，设置默认的子Tab
  useEffect(() => {
    const currentNav = mainNavigation.find(nav => nav.id === activeNav);
    if (currentNav?.subTabs && currentNav.subTabs.length > 0) {
      setActiveSubTab(currentNav.subTabs[0].id);
    } else {
      setActiveSubTab('');
    }
  }, [activeNav]);

  // 根据导航状态渲染不同页面
  const renderContent = () => {
    // 控制台 - 无子Tab
    if (activeNav === 'dashboard') {
      return <Dashboard />;
    }

    // 测试工具 - 有子Tab
    if (activeNav === 'testing') {
      if (activeSubTab === 'function') {
        return <FunctionTest />;
      }
      if (activeSubTab === 'abtest') {
        return <ABTest />;
      }
    }

    // 用户洞察 - 无子Tab
    if (activeNav === 'users') {
      return (
        <PlaceholderPage
          icon={Users}
          title="用户洞察"
          description="用户列表、数据分析和画像功能正在开发中"
        />
      );
    }

    // 内容运营 - 有子Tab
    if (activeNav === 'content') {
      const titles: Record<string, string> = {
        recipes: '食谱库',
        articles: '健康知识',
        push: '推送管理',
        ai: 'AI配置',
      };
      const descriptions: Record<string, string> = {
        recipes: '食谱管理和GI值标注功能正在开发中',
        articles: '健康文章管理功能正在开发中',
        push: '推送通知管理功能正在开发中',
        ai: 'AI提示词配置功能正在开发中',
      };
      return (
        <PlaceholderPage
          icon={FileEdit}
          title={titles[activeSubTab] || '内容运营'}
          description={descriptions[activeSubTab] || '内容管理功能正在开发中'}
        />
      );
    }

    // 系统设置
    if (activeNav === 'settings') {
      return (
        <PlaceholderPage
          icon={Settings}
          title="系统设置"
          description="系统配置功能正在开发中"
        />
      );
    }

    // 默认返回控制台
    return <Dashboard />;
  };

  return (
    <MainLayout
      activeNav={activeNav}
      activeSubTab={activeSubTab}
      onNavChange={setActiveNav}
      onSubTabChange={setActiveSubTab}
    >
      {renderContent()}
    </MainLayout>
  );
};

export default App;
