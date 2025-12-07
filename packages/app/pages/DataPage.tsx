import React, { useState } from 'react';
import { Activity, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import GlucoseTracking from './GlucoseTracking';
import HealthProfile from '../components/HealthProfile';
import WeeklyReport from '../components/WeeklyReport';
import { BloodGlucoseRecord } from '@sugarsmart/shared';

interface DataPageProps {
  // 血糖相关
  glucoseRecords: BloodGlucoseRecord[];
  onAddGlucoseRecord: (record: Omit<BloodGlucoseRecord, 'id'>) => void;
  onDeleteGlucoseRecord: (id: string) => void;
}

const DataPage: React.FC<DataPageProps> = ({
  glucoseRecords,
  onAddGlucoseRecord,
  onDeleteGlucoseRecord
}) => {
  const [activeTab, setActiveTab] = useState<'glucose' | 'health' | 'report'>('glucose');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部标题栏 */}
      <div className="bg-brand-green text-white p-6 pb-8 rounded-b-[30px] shadow-md relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">数据中心</h1>
            <p className="text-brand-light text-sm">健康数据，一目了然</p>
          </div>
          <BarChart3 size={32} className="opacity-80" />
        </div>
      </div>

      {/* Tab 切换栏 */}
      <div className="px-4 -mt-4 mb-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-md p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('glucose')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'glucose'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Activity size={18} />
            <span className="text-sm">血糖追踪</span>
          </button>
          
          <button
            onClick={() => setActiveTab('health')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'health'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText size={18} />
            <span className="text-sm">健康档案</span>
          </button>
          
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'report'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <TrendingUp size={18} />
            <span className="text-sm">AI周报</span>
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="animate-fadeIn">
        {activeTab === 'glucose' && (
          <div className="px-4 pb-24">
            <GlucoseTracking
              records={glucoseRecords}
              onAddRecord={onAddGlucoseRecord}
              onDeleteRecord={onDeleteGlucoseRecord}
            />
          </div>
        )}
        
        {activeTab === 'health' && (
          <HealthProfile onBack={() => {}} />
        )}
        
        {activeTab === 'report' && (
          <WeeklyReport onBack={() => {}} />
        )}
      </div>
    </div>
  );
};

export default DataPage;
