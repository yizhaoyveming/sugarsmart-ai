import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  Settings,
  BarChart3,
  FileText,
  Shield,
  Bell
} from 'lucide-react';

export const AdminMode: React.FC = () => {
  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">智糖管家</h1>
          <p className="text-sm text-gray-500 mt-1">管理后台</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg bg-purple-50 text-purple-600 font-medium">
            <BarChart3 size={20} />
            <span>概览</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-gray-50">
            <Users size={20} />
            <span>用户管理</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-gray-50">
            <Activity size={20} />
            <span>数据分析</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-gray-50">
            <FileText size={20} />
            <span>内容管理</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-gray-50">
            <Bell size={20} />
            <span>通知推送</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-gray-50">
            <Settings size={20} />
            <span>系统设置</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">管理员</div>
              <div className="text-xs text-gray-500">admin@sugarsmart.ai</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">系统概览</h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs text-green-600 font-medium">+12%</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">1,284</div>
              <div className="text-sm text-gray-500">总用户数</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs text-green-600 font-medium">+8%</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">892</div>
              <div className="text-sm text-gray-500">活跃用户</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs text-green-600 font-medium">+24%</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">2,456</div>
              <div className="text-sm text-gray-500">今日饮食计划</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs text-green-600 font-medium">+16%</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">156</div>
              <div className="text-sm text-gray-500">VIP 用户</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">用户增长趋势</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-400">
                  <BarChart3 className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">图表占位</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">用户活跃度</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-400">
                  <Activity className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">图表占位</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">最近注册用户</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      注册时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: '张三', type: '1型糖尿病', time: '2小时前', status: '活跃' },
                    { name: '李四', type: '2型糖尿病', time: '5小时前', status: '活跃' },
                    { name: '王五', type: '糖尿病前期', time: '1天前', status: 'VIP' },
                    { name: '赵六', type: '2型糖尿病', time: '2天前', status: '活跃' },
                    { name: '孙七', type: '1型糖尿病', time: '3天前', status: '离线' },
                  ].map((user, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'VIP' ? 'bg-purple-100 text-purple-800' :
                          user.status === '活跃' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
