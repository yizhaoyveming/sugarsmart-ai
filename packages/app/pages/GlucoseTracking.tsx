import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BloodGlucoseRecord, GlucoseStats } from '@sugarsmart/shared';
import { ChevronLeft, Plus, TrendingUp, TrendingDown, Droplets, Calendar } from 'lucide-react';

interface GlucoseTrackingProps {
  records: BloodGlucoseRecord[];
  onAddRecord: (record: Omit<BloodGlucoseRecord, 'id'>) => void;
  onDeleteRecord: (id: string) => void;
}

export const GlucoseTracking: React.FC<GlucoseTrackingProps> = ({ records, onAddRecord, onDeleteRecord }) => {
  const navigate = useNavigate();
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [period, setPeriod] = useState<'7days' | '30days'>('7days');
  
  // 新记录表单状态
  const [newRecord, setNewRecord] = useState({
    value: '',
    type: 'fasting' as 'fasting' | 'postprandial' | 'before-meal' | 'bedtime',
    note: ''
  });

  // 计算统计数据
  const calculateStats = (days: number): GlucoseStats | null => {
    const now = new Date();
    const periodStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    const periodRecords = records.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= periodStart;
    });

    if (periodRecords.length === 0) return null;

    const values = periodRecords.map(r => r.value);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const maxRecord = periodRecords.reduce((max, r) => r.value > max.value ? r : max);
    const minRecord = periodRecords.reduce((min, r) => r.value < min.value ? r : min);
    
    // 达标范围：4.0-7.0 mmol/L (空腹), 4.0-10.0 mmol/L (餐后)
    const inRange = periodRecords.filter(r => {
      if (r.type === 'fasting' || r.type === 'before-meal') {
        return r.value >= 4.0 && r.value <= 7.0;
      } else {
        return r.value >= 4.0 && r.value <= 10.0;
      }
    }).length;

    return {
      period: days === 7 ? '7days' : '30days',
      average: parseFloat(average.toFixed(1)),
      highest: { value: maxRecord.value, date: maxRecord.date },
      lowest: { value: minRecord.value, date: minRecord.date },
      inRange,
      total: periodRecords.length,
      trend: 'stable' // 简化版不计算趋势
    };
  };

  const stats = calculateStats(period === '7days' ? 7 : 30);

  const handleAddRecord = () => {
    const value = parseFloat(newRecord.value);
    if (isNaN(value) || value <= 0) {
      alert('请输入有效的血糖值');
      return;
    }

    const now = new Date();
    onAddRecord({
      date: now.toISOString().split('T')[0],
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      type: newRecord.type,
      value,
      note: newRecord.note || undefined
    });

    // 重置表单
    setNewRecord({ value: '', type: 'fasting', note: '' });
    setIsAddingRecord(false);
  };

  const getStatusColor = (value: number, type: string) => {
    if (type === 'fasting' || type === 'before-meal') {
      if (value < 4.0) return 'text-yellow-600 bg-yellow-50';
      if (value <= 7.0) return 'text-green-600 bg-green-50';
      return 'text-red-600 bg-red-50';
    } else {
      if (value < 4.0) return 'text-yellow-600 bg-yellow-50';
      if (value <= 10.0) return 'text-green-600 bg-green-50';
      return 'text-red-600 bg-red-50';
    }
  };

  const getStatusText = (value: number, type: string) => {
    if (type === 'fasting' || type === 'before-meal') {
      if (value < 4.0) return '偏低';
      if (value <= 7.0) return '正常';
      return '偏高';
    } else {
      if (value < 4.0) return '偏低';
      if (value <= 10.0) return '正常';
      return '偏高';
    }
  };

  const typeLabels = {
    'fasting': '空腹',
    'before-meal': '餐前',
    'postprandial': '餐后',
    'bedtime': '睡前'
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-brand-green text-white p-6 pb-8">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">血糖记录</h1>
        <p className="text-brand-light text-sm mt-1">追踪您的血糖变化</p>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        {/* 统计卡片 */}
        {stats && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">统计概览</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPeriod('7days')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    period === '7days' ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  7天
                </button>
                <button
                  onClick={() => setPeriod('30days')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    period === '30days' ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  30天
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{stats.average}</div>
                <div className="text-xs text-gray-500 mt-1">平均值</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.highest.value}</div>
                <div className="text-xs text-gray-500 mt-1">最高值</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.lowest.value}</div>
                <div className="text-xs text-gray-500 mt-1">最低值</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-600">达标率</span>
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold text-brand-green">
                  {((stats.inRange / stats.total) * 100).toFixed(0)}%
                </div>
                <span className="text-xs text-gray-400">({stats.inRange}/{stats.total})</span>
              </div>
            </div>
          </div>
        )}

        {/* 快速记录按钮 */}
        {!isAddingRecord && (
          <button
            onClick={() => setIsAddingRecord(true)}
            className="w-full bg-brand-orange text-white py-4 rounded-xl font-semibold shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span>快速记录血糖</span>
          </button>
        )}

        {/* 添加记录表单 */}
        {isAddingRecord && (
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">记录血糖</h3>
              <button onClick={() => setIsAddingRecord(false)} className="text-gray-400">
                取消
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">血糖值 (mmol/L)</label>
              <input
                type="number"
                step="0.1"
                value={newRecord.value}
                onChange={(e) => setNewRecord({ ...newRecord, value: e.target.value })}
                placeholder="例如：6.5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none text-center text-2xl font-bold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">测量时机</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(typeLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setNewRecord({ ...newRecord, type: key as any })}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      newRecord.type === key
                        ? 'border-brand-green bg-brand-light text-brand-green'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">备注（可选）</label>
              <input
                type="text"
                value={newRecord.note}
                onChange={(e) => setNewRecord({ ...newRecord, note: e.target.value })}
                placeholder="例如：餐后2小时"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
              />
            </div>

            <button
              onClick={handleAddRecord}
              className="w-full bg-brand-green text-white py-3 rounded-lg font-semibold"
            >
              保存记录
            </button>
          </div>
        )}

        {/* 记录列表 */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Calendar size={18} className="text-brand-green" />
            历史记录
          </h3>

          {records.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <Droplets size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">还没有血糖记录</p>
              <p className="text-sm text-gray-400 mt-1">开始记录您的血糖数据吧</p>
            </div>
          ) : (
            <div className="space-y-2">
              {records.slice().reverse().slice(0, 20).map((record) => (
                <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-800">{record.value}</span>
                      <span className="text-xs text-gray-400">mmol/L</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.value, record.type)}`}>
                        {getStatusText(record.value, record.type)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{record.date} {record.time}</span>
                      <span>•</span>
                      <span>{typeLabels[record.type]}</span>
                    </div>
                    {record.note && (
                      <p className="text-xs text-gray-400 mt-1">{record.note}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onDeleteRecord(record.id)}
                    className="text-gray-400 hover:text-red-500 text-xs"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlucoseTracking;
