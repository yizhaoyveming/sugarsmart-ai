import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Heart,
  Crown,
  Target,
  FileText,
  Bell,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { UserGrowthChart } from '../components/UserGrowthChart';
import { UserUsageChart } from '../components/UserUsageChart';

export const Dashboard: React.FC = () => {
  const [showActivityPanel, setShowActivityPanel] = useState(true);

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">控制台</h1>
        <p className="text-sm text-gray-500 mt-1">实时监控系统运行状态</p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
          <FileText size={18} />
          <span>生成日报</span>
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
          <Bell size={18} />
          <span>发送通知</span>
        </button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
          <AlertCircle size={18} />
          <span>查看异常</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          value="1,284"
          label="总用户数"
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          icon={Activity}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          value="892"
          label="活跃用户"
          trend="+8%"
          trendUp={true}
        />
        <StatCard
          icon={TrendingUp}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          value="2,456"
          label="今日饮食计划"
          trend="+24%"
          trendUp={true}
        />
        <StatCard
          icon={Heart}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          value="5.8"
          label="平均血糖 (mmol/L)"
          trend="-3%"
          trendUp={true}
        />
        <StatCard
          icon={Crown}
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
          value="156"
          label="VIP用户"
          trend="+16%"
          trendUp={true}
        />
        <StatCard
          icon={Target}
          iconBg="bg-cyan-100"
          iconColor="text-cyan-600"
          value="87"
          label="健康分"
          trend="+5%"
          trendUp={true}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart 1: User Growth */}
        <UserGrowthChart />

        {/* Chart 2: User Usage */}
        <UserUsageChart />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">最近活动</h3>
          <button
            onClick={() => setShowActivityPanel(!showActivityPanel)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {showActivityPanel ? '收起' : '展开'}
            <ChevronRight
              size={16}
              className={`transition-transform ${showActivityPanel ? 'rotate-90' : ''}`}
            />
          </button>
        </div>

        {showActivityPanel && (
          <div className="space-y-3">
            {[
              { user: '张三', action: '完成今日饮食计划', time: '2分钟前', type: 'success' },
              { user: '李四', action: '血糖达标连续7天', time: '15分钟前', type: 'success' },
              { user: '王五', action: '开通VIP会员', time: '1小时前', type: 'info' },
              { user: '赵六', action: '记录血糖数据', time: '2小时前', type: 'normal' },
              { user: '孙七', action: '查看健康报告', time: '3小时前', type: 'normal' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className={`
                  w-2 h-2 rounded-full
                  ${activity.type === 'success' ? 'bg-green-500' : 
                    activity.type === 'info' ? 'bg-blue-500' : 'bg-gray-400'}
                `} />
                <div className="flex-1">
                  <div className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>
                    {' '}
                    {activity.action}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
