import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock数据生成
const generateMockData = (days: number, metric: string) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const baseValue = metric === 'total' ? 1000 : metric === 'new' ? 50 : 700;
    const randomValue = Math.floor(baseValue + Math.random() * 200 - 50);
    
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      value: randomValue,
    });
  }
  
  return data;
};

const metrics = [
  { id: 'total', label: '总用户数', color: '#3B82F6' },
  { id: 'new', label: '新增用户', color: '#10B981' },
  { id: 'active', label: '活跃用户', color: '#8B5CF6' },
  { id: 'vip', label: 'VIP用户', color: '#EC4899' },
  { id: 'retention', label: '留存率 (%)', color: '#F59E0B' },
];

const timeRanges = [
  { id: 'today', label: '今日', days: 1 },
  { id: '7days', label: '7天', days: 7 },
  { id: '30days', label: '30天', days: 30 },
  { id: '90days', label: '90天', days: 90 },
];

export const UserGrowthChart: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('total');
  const [selectedTime, setSelectedTime] = useState('7days');
  
  const currentMetric = metrics.find(m => m.id === selectedMetric)!;
  const currentTime = timeRanges.find(t => t.id === selectedTime)!;
  const data = generateMockData(currentTime.days, selectedMetric);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">用户增长趋势</h3>
      
      {/* 指标选择器 */}
      <div className="mb-4 space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">指标</label>
          <div className="flex flex-wrap gap-2">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedMetric === metric.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* 时间范围选择器 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">时间范围</label>
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setSelectedTime(range.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedTime === range.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 图表 */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              name={currentMetric.label}
              stroke={currentMetric.color}
              strokeWidth={2}
              dot={{ fill: currentMetric.color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
