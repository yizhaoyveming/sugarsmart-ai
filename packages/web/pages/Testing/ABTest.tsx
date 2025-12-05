import React, { useState } from 'react';
import { TrendingUp, Users, BarChart3, Eye, MousePointer, DollarSign } from 'lucide-react';

interface ABTestData {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'draft';
  variantA: {
    name: string;
    users: number;
    conversions: number;
    conversionRate: number;
  };
  variantB: {
    name: string;
    users: number;
    conversions: number;
    conversionRate: number;
  };
  startDate: string;
  endDate: string;
}

export const ABTest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'running' | 'completed'>('running');

  const runningTests: ABTestData[] = [
    {
      id: '1',
      name: '首页按钮颜色测试',
      status: 'running',
      variantA: { name: '橙色按钮', users: 2140, conversions: 432, conversionRate: 20.2 },
      variantB: { name: '绿色按钮', users: 2156, conversions: 518, conversionRate: 24.0 },
      startDate: '2025-12-01',
      endDate: '2025-12-15'
    },
    {
      id: '2',
      name: 'VIP升级弹窗文案',
      status: 'running',
      variantA: { name: '标准文案', users: 1580, conversions: 189, conversionRate: 12.0 },
      variantB: { name: '紧迫文案', users: 1624, conversions: 244, conversionRate: 15.0 },
      startDate: '2025-12-03',
      endDate: '2025-12-17'
    }
  ];

  const completedTests: ABTestData[] = [
    {
      id: '3',
      name: '食谱卡片布局',
      status: 'completed',
      variantA: { name: '大图模式', users: 4250, conversions: 1062, conversionRate: 25.0 },
      variantB: { name: '列表模式', users: 4180, conversions: 877, conversionRate: 21.0 },
      startDate: '2025-11-15',
      endDate: '2025-11-30'
    }
  ];

  const renderTestCard = (test: ABTestData) => {
    const winner = test.variantB.conversionRate > test.variantA.conversionRate ? 'B' : 'A';
    const improvement = Math.abs(
      ((test.variantB.conversionRate - test.variantA.conversionRate) / test.variantA.conversionRate) * 100
    );

    return (
      <div key={test.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {test.startDate} - {test.endDate}
            </p>
          </div>
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${test.status === 'running' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
          `}>
            {test.status === 'running' ? '进行中' : '已完成'}
          </span>
        </div>

        {/* Variants Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Variant A */}
          <div className={`
            p-4 rounded-lg border-2 transition-colors
            ${winner === 'A' && test.status === 'completed' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}
          `}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">方案 A</span>
              {winner === 'A' && test.status === 'completed' && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">优胜</span>
              )}
            </div>
            <div className="text-xl font-bold text-gray-900 mb-2">
              {test.variantA.conversionRate}%
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <Users size={12} />
                <span>{test.variantA.users.toLocaleString()} 用户</span>
              </div>
              <div className="flex items-center gap-2">
                <MousePointer size={12} />
                <span>{test.variantA.conversions.toLocaleString()} 转化</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">{test.variantA.name}</p>
            </div>
          </div>

          {/* Variant B */}
          <div className={`
            p-4 rounded-lg border-2 transition-colors
            ${winner === 'B' && test.status === 'completed' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}
          `}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">方案 B</span>
              {winner === 'B' && test.status === 'completed' && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">优胜</span>
              )}
            </div>
            <div className="text-xl font-bold text-gray-900 mb-2">
              {test.variantB.conversionRate}%
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <Users size={12} />
                <span>{test.variantB.users.toLocaleString()} 用户</span>
              </div>
              <div className="flex items-center gap-2">
                <MousePointer size={12} />
                <span>{test.variantB.conversions.toLocaleString()} 转化</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">{test.variantB.name}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="text-sm text-gray-700">转化率提升</span>
          <span className={`font-semibold ${improvement > 0 ? 'text-green-600' : 'text-gray-600'}`}>
            +{improvement.toFixed(1)}%
          </span>
        </div>

        {/* Actions */}
        {test.status === 'running' && (
          <div className="flex gap-2 mt-4">
            <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              暂停测试
            </button>
            <button className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
              结束并应用
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">A/B 测试</h1>
        <p className="text-sm text-gray-500 mt-1">数据驱动的功能优化决策</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-xs text-gray-500">进行中的测试</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">24.0%</div>
              <div className="text-xs text-gray-500">最高转化率</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">7,500</div>
              <div className="text-xs text-gray-500">测试用户总数</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">+18.5%</div>
              <div className="text-xs text-gray-500">平均提升率</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('running')}
          className={`
            px-6 py-2 rounded-lg font-medium transition-colors
            ${activeTab === 'running'
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
            }
          `}
        >
          进行中 ({runningTests.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`
            px-6 py-2 rounded-lg font-medium transition-colors
            ${activeTab === 'completed'
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
            }
          `}
        >
          已完成 ({completedTests.length})
        </button>
        <div className="flex-1"></div>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
          + 创建新测试
        </button>
      </div>

      {/* Test List */}
      <div className="space-y-4">
        {activeTab === 'running' && runningTests.map(renderTestCard)}
        {activeTab === 'completed' && completedTests.map(renderTestCard)}
      </div>

      {/* Empty State */}
      {((activeTab === 'running' && runningTests.length === 0) ||
        (activeTab === 'completed' && completedTests.length === 0)) && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无{activeTab === 'running' ? '进行中' : '已完成'}的测试</p>
        </div>
      )}
    </div>
  );
};
