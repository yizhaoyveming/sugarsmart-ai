import React, { useState } from 'react';
import { Smartphone, RotateCw, Users, Zap } from 'lucide-react';

export const TestMode: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<'iphone' | 'android'>('iphone');
  const [testAccount, setTestAccount] = useState('测试账号1');

  const testAccounts = [
    '测试账号1 - 普通用户',
    '测试账号2 - VIP用户',
    '测试账号3 - 新用户',
    '测试账号4 - 糖尿病患者'
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex">
      {/* Left: Phone Simulator */}
      <div className="flex-shrink-0 w-96 bg-white border-r border-gray-200 flex flex-col items-center justify-center p-8">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setSelectedDevice('iphone')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedDevice === 'iphone'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            iPhone
          </button>
          <button
            onClick={() => setSelectedDevice('android')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedDevice === 'android'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Android
          </button>
        </div>

        {/* Phone Frame */}
        <div className={`relative ${
          selectedDevice === 'iphone' 
            ? 'w-80 h-[650px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl' 
            : 'w-80 h-[650px] bg-gray-800 rounded-3xl p-2 shadow-2xl'
        }`}>
          {/* Notch (iPhone) */}
          {selectedDevice === 'iphone' && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-10"></div>
          )}
          
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
            <iframe
              src="http://localhost:3001"
              className="w-full h-full border-0"
              title="App Preview"
            />
            
            {/* Loading Placeholder */}
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-400 text-sm">正在加载 App...</p>
                <p className="text-gray-300 text-xs mt-2">http://localhost:3001</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {selectedDevice === 'iphone' ? 'iPhone 14 Pro' : 'Android Pixel'}
          </p>
        </div>
      </div>

      {/* Right: Test Tools Panel */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">运营测试工具</h1>

        <div className="space-y-6">
          {/* Account Switcher */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">测试账号</h2>
            </div>
            
            <select
              value={testAccount}
              onChange={(e) => setTestAccount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {testAccounts.map((account) => (
                <option key={account} value={account}>
                  {account}
                </option>
              ))}
            </select>
            
            <button className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
              <RotateCw size={16} />
              <span>切换账号</span>
            </button>
          </div>

          {/* Ad Testing */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">广告测试</h2>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <span className="text-sm text-gray-700">首页横幅广告</span>
                <input type="checkbox" className="w-5 h-5 text-blue-500" />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <span className="text-sm text-gray-700">食谱详情页广告</span>
                <input type="checkbox" className="w-5 h-5 text-blue-500" />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <span className="text-sm text-gray-700">VIP升级弹窗</span>
                <input type="checkbox" className="w-5 h-5 text-blue-500" />
              </label>
            </div>
          </div>

          {/* A/B Testing */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">A/B 测试</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  按钮颜色方案
                </label>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg text-sm">
                    方案 A (橙色)
                  </button>
                  <button className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg text-sm">
                    方案 B (绿色)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  首页布局
                </label>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-4 border-2 border-blue-500 text-blue-500 rounded-lg text-sm">
                    卡片布局
                  </button>
                  <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-600 rounded-lg text-sm">
                    列表布局
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Console */}
          <div className="bg-gray-900 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-4">调试日志</h2>
            <div className="bg-gray-950 rounded-lg p-4 h-48 overflow-y-auto font-mono text-xs text-green-400">
              <div>[10:52:04] App 已加载</div>
              <div>[10:52:05] 用户登录: 测试账号1</div>
              <div>[10:52:06] 加载首页数据...</div>
              <div>[10:52:07] ✓ 饮食计划加载成功</div>
              <div className="text-yellow-400">[10:52:08] ⚠️ 广告加载延迟 2.3s</div>
              <div>[10:52:09] 用户浏览食谱卡片</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
