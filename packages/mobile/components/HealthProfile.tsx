import React, { useState } from 'react';
import { ChevronLeft, Plus, TrendingUp, Activity, Pill, Calendar, Heart, Download } from 'lucide-react';
import { BloodGlucoseRecord, MedicationRecord, BodyMetrics } from '@sugarsmart/shared';

interface HealthProfileProps {
  onBack: () => void;
}

const HealthProfile: React.FC<HealthProfileProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'glucose' | 'medication' | 'metrics'>('glucose');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Mock数据 - 实际应用中从localStorage或API获取
  const [glucoseRecords] = useState<BloodGlucoseRecord[]>([
    {
      id: '1',
      date: '2025-11-30',
      time: '07:30',
      type: 'fasting',
      value: 5.8,
      note: '空腹血糖正常'
    },
    {
      id: '2',
      date: '2025-11-30',
      time: '12:00',
      type: 'postprandial',
      value: 7.2,
      note: '午餐后2小时'
    },
    {
      id: '3',
      date: '2025-11-29',
      time: '07:15',
      type: 'fasting',
      value: 6.1,
      note: ''
    }
  ]);

  const [medications] = useState<MedicationRecord[]>([
    {
      id: '1',
      name: '二甲双胍',
      dosage: '500mg',
      frequency: '每日2次',
      time: ['08:00', '20:00'],
      startDate: '2025-11-01',
      note: '饭后服用'
    },
    {
      id: '2',
      name: '阿卡波糖',
      dosage: '50mg',
      frequency: '每日3次',
      time: ['08:00', '12:00', '18:00'],
      startDate: '2025-11-15',
      note: '餐前服用'
    }
  ]);

  const [bodyMetrics] = useState<BodyMetrics[]>([
    {
      id: '1',
      date: '2025-11-30',
      weight: 68.5,
      bmi: 23.8,
      bloodPressure: {
        systolic: 125,
        diastolic: 82
      },
      hba1c: 6.5
    }
  ]);

  // 计算血糖统计
  const getGlucoseStats = () => {
    const fastingRecords = glucoseRecords.filter(r => r.type === 'fasting');
    const postprandialRecords = glucoseRecords.filter(r => r.type === 'postprandial');
    
    const avgFasting = fastingRecords.length > 0
      ? (fastingRecords.reduce((sum, r) => sum + r.value, 0) / fastingRecords.length).toFixed(1)
      : '--';
    
    const avgPostprandial = postprandialRecords.length > 0
      ? (postprandialRecords.reduce((sum, r) => sum + r.value, 0) / postprandialRecords.length).toFixed(1)
      : '--';

    return { avgFasting, avgPostprandial };
  };

  const stats = getGlucoseStats();

  const getGlucoseColor = (value: number, type: string) => {
    if (type === 'fasting') {
      if (value >= 3.9 && value <= 6.1) return 'text-green-600';
      if (value > 6.1 && value <= 7.0) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (value < 7.8) return 'text-green-600';
      if (value >= 7.8 && value < 10.0) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'fasting': '空腹',
      'postprandial': '餐后',
      'before-meal': '餐前',
      'bedtime': '睡前'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">健康档案</h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="bg-white px-4 py-2 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('glucose')}
            className={`flex-1 py-3 rounded-lg font-medium transition ${
              activeTab === 'glucose'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Activity className="w-5 h-5 inline-block mr-1" />
            血糖记录
          </button>
          <button
            onClick={() => setActiveTab('medication')}
            className={`flex-1 py-3 rounded-lg font-medium transition ${
              activeTab === 'medication'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Pill className="w-5 h-5 inline-block mr-1" />
            用药管理
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex-1 py-3 rounded-lg font-medium transition ${
              activeTab === 'metrics'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Heart className="w-5 h-5 inline-block mr-1" />
            身体指标
          </button>
        </div>
      </div>

      {/* 血糖记录Tab */}
      {activeTab === 'glucose' && (
        <div className="px-4 space-y-4">
          {/* 血糖概览卡片 */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              本周血糖概览
            </h3>
            
            {/* 时间范围选择 */}
            <div className="flex gap-2 mb-4">
              {[
                { value: '7d', label: '7天' },
                { value: '30d', label: '30天' },
                { value: '90d', label: '90天' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setTimeRange(option.value as any)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    timeRange === option.value
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">平均空腹血糖</div>
                <div className="text-2xl font-bold text-green-600">{stats.avgFasting}</div>
                <div className="text-xs text-gray-500">mmol/L</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">平均餐后血糖</div>
                <div className="text-2xl font-bold text-blue-600">{stats.avgPostprandial}</div>
                <div className="text-xs text-gray-500">mmol/L</div>
              </div>
            </div>

            {/* 简化的趋势图占位 */}
            <div className="bg-white rounded-xl p-4 h-40 flex items-center justify-center">
              <div className="text-gray-400 text-sm">
                <Calendar className="w-8 h-8 mx-auto mb-2" />
                血糖趋势图（需集成图表库）
              </div>
            </div>
          </div>

          {/* 血糖记录列表 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold">最近记录</h3>
              <button className="text-green-600 text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" />
                添加记录
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {glucoseRecords.map(record => (
                <div key={record.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {getTypeLabel(record.type)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {record.date} {record.time}
                      </span>
                    </div>
                    <span className={`text-xl font-bold ${getGlucoseColor(record.value, record.type)}`}>
                      {record.value} mmol/L
                    </span>
                  </div>
                  {record.note && (
                    <p className="text-sm text-gray-500">{record.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 用药管理Tab */}
      {activeTab === 'medication' && (
        <div className="px-4 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold">当前用药</h3>
              <button className="text-green-600 text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" />
                添加用药
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {medications.map(med => (
                <div key={med.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{med.name}</h4>
                      <p className="text-sm text-gray-600">{med.dosage} · {med.frequency}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      进行中
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {med.time.map((t, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                  {med.note && (
                    <p className="text-sm text-gray-500 mt-2">💡 {med.note}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    开始日期：{med.startDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 身体指标Tab */}
      {activeTab === 'metrics' && (
        <div className="px-4 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold">最新指标</h3>
              <button className="text-green-600 text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" />
                添加记录
              </button>
            </div>
            {bodyMetrics.map(metric => (
              <div key={metric.id} className="p-4 space-y-4">
                {/* 体重和BMI */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">体重</div>
                    <div className="text-2xl font-bold text-blue-600">{metric.weight}</div>
                    <div className="text-xs text-gray-500">kg</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">BMI</div>
                    <div className="text-2xl font-bold text-green-600">{metric.bmi}</div>
                    <div className="text-xs text-gray-500">正常</div>
                  </div>
                </div>

                {/* 血压 */}
                {metric.bloodPressure && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-2">血压</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-purple-600">
                        {metric.bloodPressure.systolic}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {metric.bloodPressure.diastolic}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">mmHg</span>
                    </div>
                  </div>
                )}

                {/* 糖化血红蛋白 */}
                {metric.hba1c && (
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">糖化血红蛋白 (HbA1c)</div>
                    <div className="text-2xl font-bold text-orange-600">{metric.hba1c}%</div>
                    <div className="text-xs text-gray-500">目标: &lt; 7.0%</div>
                  </div>
                )}

                <p className="text-xs text-gray-400 text-center">
                  记录日期：{metric.date}
                </p>
              </div>
            ))}
          </div>

          {/* 健康提示 */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              💡 健康建议
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 建议每3个月检测一次糖化血红蛋白</li>
              <li>• 保持规律的血压监测，每周至少2次</li>
              <li>• 控制体重在正常BMI范围（18.5-23.9）</li>
            </ul>
          </div>
        </div>
      )}

      {/* 底部安全区域 */}
      <div className="h-20" />
    </div>
  );
};

export default HealthProfile;
