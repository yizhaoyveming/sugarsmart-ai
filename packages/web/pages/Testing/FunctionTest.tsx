import React, { useState } from 'react';
import { Smartphone, RotateCw, Users, Zap, PlayCircle, StopCircle, RefreshCw } from 'lucide-react';

export const FunctionTest: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<'iphone' | 'android'>('iphone');
  const [testAccount, setTestAccount] = useState('测试账号1');
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[10:52:04] App 已加载',
    '[10:52:05] 用户登录: 测试账号1',
    '[10:52:06] 加载首页数据...',
    '[10:52:07] ✓ 饮食计划加载成功',
  ]);

  const testAccounts = [
    '测试账号1 - 普通用户',
    '测试账号2 - VIP用户',
    '测试账号3 - 新用户',
    '测试账号4 - 糖尿病患者'
  ];

  const handleStartTest = () => {
    setIsTestRunning(true);
    const newLog = `[${new Date().toLocaleTimeString()}] 开始自动化测试...`;
    setLogs([...logs, newLog]);
  };

  const handleStopTest = () => {
    setIsTestRunning(false);
    const newLog = `[${new Date().toLocaleTimeString()}] 测试已停止`;
    setLogs([...logs, newLog]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="h-full bg-gradient-to-br from-green-50 to-gray-50 flex">
      {/* Left: Phone Simulator */}
      <div className="flex-shrink-0 w-96 bg-white border-r border-gray-200 flex flex-col items-center justify-center p-8">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setSelectedDevice('iphone')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedDevice === 'iphone'
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            iPhone
          </button>
          <button
            onClick={() => setSelectedDevice('android')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedDevice === 'android'
                ? 'bg-green-600 text-white shadow-lg'
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <div className="text-center">
                <Smartphone className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600 text-sm font-medium">正在加载 App...</p>
                <p className="text-gray-400 text-xs mt-2">http://localhost:3001</p>
                <p className="text-gray-300 text-xs mt-1">
                  {selectedDevice === 'iphone' ? 'iPhone 14 Pro' : 'Android Pixel 8'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2"
          >
            <RefreshCw size={16} />
            <span>刷新</span>
          </button>
        </div>
      </div>

      {/* Right: Test Tools Panel */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">功能测试</h1>
            <p className="text-sm text-gray-500 mt-1">手机模拟器 + 测试工具面板</p>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleStartTest}
                disabled={isTestRunning}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${isTestRunning
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                  }
                `}
              >
                <PlayCircle size={18} />
                <span>开始测试</span>
              </button>
              <button
                onClick={handleStopTest}
                disabled={!isTestRunning}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${!isTestRunning
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                  }
                `}
              >
                <StopCircle size={18} />
                <span>停止测试</span>
              </button>
              <button
                onClick={handleClearLogs}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <RotateCw size={18} />
                <span>清空日志</span>
              </button>
            </div>

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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                {testAccounts.map((account) => (
                  <option key={account} value={account}>
                    {account}
                  </option>
                ))}
              </select>
              
              <button className="mt-3 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                <RotateCw size={16} />
                <span>切换账号并重新加载</span>
              </button>
            </div>

            {/* Feature Toggles */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">功能开关</h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm text-gray-700">AI 饮食推荐</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-green-500 rounded" />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm text-gray-700">血糖预测功能</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-green-500 rounded" />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm text-gray-700">社区分享功能</span>
                  <input type="checkbox" className="w-5 h-5 text-green-500 rounded" />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm text-gray-700">首页横幅广告</span>
                  <input type="checkbox" className="w-5 h-5 text-green-500 rounded" />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm text-gray-700">VIP升级弹窗</span>
                  <input type="checkbox" className="w-5 h-5 text-green-500 rounded" />
                </label>
              </div>
            </div>

            {/* Test Scenarios */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">快速测试场景</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 border-2 border-green-200 hover:border-green-400 rounded-lg text-left transition-colors">
                  <div className="font-medium text-gray-800">新用户注册流程</div>
                  <div className="text-xs text-gray-500 mt-1">测试注册 → 填写资料 → 首次登录</div>
                </button>

                <button className="p-4 border-2 border-green-200 hover:border-green-400 rounded-lg text-left transition-colors">
                  <div className="font-medium text-gray-800">血糖记录流程</div>
                  <div className="text-xs text-gray-500 mt-1">输入数据 → 保存 → 查看图表</div>
                </button>

                <button className="p-4 border-2 border-green-200 hover:border-green-400 rounded-lg text-left transition-colors">
                  <div className="font-medium text-gray-800">AI 推荐测试</div>
                  <div className="text-xs text-gray-500 mt-1">触发推荐 → 查看结果 → 反馈</div>
                </button>

                <button className="p-4 border-2 border-green-200 hover:border-green-400 rounded-lg text-left transition-colors">
                  <div className="font-medium text-gray-800">VIP购买流程</div>
                  <div className="text-xs text-gray-500 mt-1">选择套餐 → 支付 → 开通成功</div>
                </button>
              </div>
            </div>

            {/* Debug Console */}
            <div className="bg-gray-900 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">调试日志</h2>
                {isTestRunning && (
                  <span className="flex items-center gap-2 text-green-400 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    测试运行中
                  </span>
                )}
              </div>
              <div className="bg-gray-950 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs">
                {logs.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">暂无日志</div>
                ) : (
                  logs.map((log, index) => (
                    <div
                      key={index}
                      className={`
                        ${log.includes('✓') ? 'text-green-400' : ''}
                        ${log.includes('⚠️') ? 'text-yellow-400' : ''}
                        ${log.includes('❌') ? 'text-red-400' : ''}
                        ${!log.includes('✓') && !log.includes('⚠️') && !log.includes('❌') ? 'text-gray-400' : ''}
                      `}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
