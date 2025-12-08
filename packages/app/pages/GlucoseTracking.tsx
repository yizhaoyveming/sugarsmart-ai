import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BloodGlucoseRecord } from '@sugarsmart/shared';
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface GlucoseTrackingProps {
  records: BloodGlucoseRecord[];
  onAddRecord: (record: Omit<BloodGlucoseRecord, 'id'>) => void;
  onDeleteRecord: (id: string) => void;
}

export const GlucoseTracking: React.FC<GlucoseTrackingProps> = ({ records, onAddRecord, onDeleteRecord }) => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 计算当前周期的统计数据
  const getFilteredRecords = () => {
    const now = selectedDate;
    let startDate: Date;
    
    if (period === 'day') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      const day = now.getDay();
      startDate = new Date(now.getTime() - (day === 0 ? 6 : day - 1) * 24 * 60 * 60 * 1000);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    return records.filter(r => new Date(r.date) >= startDate);
  };

  const filteredRecords = getFilteredRecords();
  
  // 辅助函数：判断血糖状态
  const getGlucoseStatus = (value: number, type: string): 'normal' | 'low' | 'high' => {
    if (type === 'fasting' || type === 'before-meal') {
      if (value < 4.0) return 'low';
      if (value <= 7.0) return 'normal';
      return 'high';
    } else {
      if (value < 4.0) return 'low';
      if (value <= 10.0) return 'normal';
      return 'high';
    }
  };

  const getStatusColor = (status: 'normal' | 'low' | 'high') => {
    if (status === 'normal') return 'text-green-600 bg-green-50';
    if (status === 'low') return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusText = (status: 'normal' | 'low' | 'high') => {
    if (status === 'normal') return '正常';
    if (status === 'low') return '偏低';
    return '偏高';
  };
  
  // 计算统计值
  const calculateStats = () => {
    if (filteredRecords.length === 0) {
      return {
        latest: 0,
        average: 0,
        highest: 0,
        lowest: 0,
        abnormalCount: 0,
        normalCount: 0,
        lowCount: 0,
        highCount: 0
      };
    }

    const values = filteredRecords.map(r => r.value);
    const latest = filteredRecords[filteredRecords.length - 1]?.value || 0;
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const highest = Math.max(...values);
    const lowest = Math.min(...values);
    
    let normalCount = 0;
    let lowCount = 0;
    let highCount = 0;
    
    filteredRecords.forEach(r => {
      const status = getGlucoseStatus(r.value, r.type);
      if (status === 'normal') normalCount++;
      else if (status === 'low') lowCount++;
      else if (status === 'high') highCount++;
    });
    
    const abnormalCount = lowCount + highCount;
    
    return {
      latest,
      average: parseFloat(average.toFixed(1)),
      highest,
      lowest,
      abnormalCount,
      normalCount,
      lowCount,
      highCount
    };
  };

  const stats = calculateStats();

  // 准备图表数据
  const getChartData = () => {
    if (period === 'day') {
      // 按时间排序
      return filteredRecords
        .sort((a, b) => a.time.localeCompare(b.time))
        .map(r => ({
          time: r.time,
          value: r.value,
          type: r.type
        }));
    } else {
      // 按日期分组
      const grouped = filteredRecords.reduce((acc, r) => {
        const date = r.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(r.value);
        return acc;
      }, {} as Record<string, number[]>);
      
      return Object.entries(grouped).map(([date, values]) => ({
        time: new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        value: parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1))
      }));
    }
  };

  const chartData = getChartData();

  const typeLabels = {
    'fasting': '空腹',
    'before-meal': '餐前',
    'postprandial': '餐后',
    'bedtime': '睡前'
  };

  const changeDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (period === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (period === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  const formatDateDisplay = () => {
    if (period === 'day') {
      return selectedDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
    } else if (period === 'week') {
      const start = new Date(selectedDate);
      const day = start.getDay();
      start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`;
    } else {
      return selectedDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
    }
  };

  return (
    <div className="space-y-4">
      {/* 周期切换 */}
      <div className="flex justify-center gap-2 bg-white rounded-xl p-2 shadow-sm">
        {(['day', 'week', 'month'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === p 
                ? 'bg-brand-green text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {p === 'day' ? '日' : p === 'week' ? '周' : '月'}
          </button>
        ))}
      </div>

      {/* 日期选择器 */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
        <button onClick={() => changeDate('prev')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800">{formatDateDisplay()}</div>
        </div>
        <button onClick={() => changeDate('next')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* 血糖值卡片 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 shadow-sm border border-blue-100">
          <div className="text-xs text-gray-500 mb-1">最近</div>
          <div className="text-3xl font-bold text-gray-800">
            {stats.latest.toFixed(1)}
            <span className="text-sm font-normal text-gray-400 ml-1">mmol/L</span>
          </div>
          {filteredRecords.length > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              {filteredRecords[filteredRecords.length - 1].date} {filteredRecords[filteredRecords.length - 1].time}
            </div>
          )}
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 shadow-sm border border-green-100">
          <div className="text-xs text-gray-500 mb-1">平均（全部）</div>
          <div className="text-3xl font-bold text-gray-800">
            {stats.average.toFixed(1)}
            <span className="text-sm font-normal text-gray-400 ml-1">mmol/L</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            最小值: {stats.lowest.toFixed(1)} - 最大值: {stats.highest.toFixed(1)}
          </div>
        </div>
      </div>

      {/* 折线图 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-3">血糖趋势</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 11, fill: '#666' }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 15]}
                ticks={[0, 5, 10, 15]}
                tick={{ fontSize: 11, fill: '#666' }}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value.toFixed(1)} mmol/L`, '血糖']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2E7D32" 
                strokeWidth={2}
                dot={{ fill: '#2E7D32', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
            暂无数据
          </div>
        )}
      </div>

      {/* 增加按钮 - 跳转到新页面 */}
      <button
        onClick={() => navigate('/data/add-glucose')}
        className="w-full bg-brand-orange text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-orange-200 flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-98"
      >
        <Plus size={24} strokeWidth={3} />
        <span>增加</span>
      </button>

      {/* 血糖总览 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-brand-green pl-2">
          血糖总览
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.highest.toFixed(1)}</div>
            <div className="text-xs text-gray-400 mt-1">mmol/L</div>
            <div className="text-xs text-gray-500 mt-1">最高值</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.lowest.toFixed(1)}</div>
            <div className="text-xs text-gray-400 mt-1">mmol/L</div>
            <div className="text-xs text-gray-500 mt-1">最低值</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.abnormalCount}</div>
            <div className="text-xs text-gray-400 mt-1">次</div>
            <div className="text-xs text-gray-500 mt-1">异常次数</div>
          </div>
        </div>
      </div>

      {/* 血糖状态占比 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-brand-green pl-2">
          血糖状态占比
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">正常</span>
            </div>
            <div className="text-sm font-bold text-gray-800">
              {filteredRecords.length > 0 
                ? ((stats.normalCount / filteredRecords.length) * 100).toFixed(1) 
                : '0.0'}%
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">偏低</span>
            </div>
            <div className="text-sm font-bold text-gray-800">
              {filteredRecords.length > 0 
                ? ((stats.lowCount / filteredRecords.length) * 100).toFixed(1) 
                : '0.0'}%
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-700">偏高</span>
            </div>
            <div className="text-sm font-bold text-gray-800">
              {filteredRecords.length > 0 
                ? ((stats.highCount / filteredRecords.length) * 100).toFixed(1) 
                : '0.0'}%
            </div>
          </div>
        </div>
      </div>

      {/* 历史记录 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">历史详情</h3>
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <div className="text-gray-400 mb-2">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">还没有血糖记录</p>
            <p className="text-gray-400 text-xs mt-1">点击上方"增加"按钮开始记录</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredRecords.slice().reverse().map((record) => {
              const status = getGlucoseStatus(record.value, record.type);
              return (
                <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-4 ${
                      status === 'normal' ? 'bg-green-50 border-green-200 text-green-700' :
                      status === 'low' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                      'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      {record.value.toFixed(1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </span>
                        <span className="text-xs text-gray-500">• {typeLabels[record.type]}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {record.date} {record.time}
                      </div>
                      {record.note && (
                        <div className="text-xs text-gray-500 mt-1">{record.note}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteRecord(record.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlucoseTracking;
