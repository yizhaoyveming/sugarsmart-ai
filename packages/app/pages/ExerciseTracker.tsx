import React, { useState, useMemo } from 'react';
import { 
  Dumbbell, 
  Plus, 
  Trophy, 
  TrendingUp,
  Flame,
  Clock,
  Target,
  Award,
  X,
  Check
} from 'lucide-react';
import { ExerciseRecord, ExerciseStats } from '@sugarsmart/shared';

interface ExerciseTrackerProps {
  onBack: () => void;
}

// Mock数据 - 实际应用中从localStorage或Context获取
const mockExerciseRecords: ExerciseRecord[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    type: 'walking',
    duration: 30,
    caloriesBurned: 150,
    steps: 5000,
    intensity: 'medium'
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // 昨天
    type: 'yoga',
    duration: 45,
    caloriesBurned: 120,
    intensity: 'low'
  }
];

const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({ onBack }) => {
  const [exerciseRecords] = useState<ExerciseRecord[]>(mockExerciseRecords);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({
    type: 'walking' as ExerciseRecord['type'],
    duration: 30,
    intensity: 'medium' as ExerciseRecord['intensity']
  });

  // 计算运动统计
  const stats: ExerciseStats = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const weekRecords = exerciseRecords.filter(r => 
      new Date(r.date) >= weekStart
    );
    
    const monthRecords = exerciseRecords.filter(r => 
      new Date(r.date) >= monthStart
    );

    // 计算连续打卡天数
    const sortedDates = [...new Set(exerciseRecords.map(r => r.date))].sort().reverse();
    let streak = 0;
    let checkDate = new Date();
    
    for (const date of sortedDates) {
      const recordDate = new Date(date);
      const dayDiff = Math.floor((checkDate.getTime() - recordDate.getTime()) / 86400000);
      
      if (dayDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return {
      weeklyDays: new Set(weekRecords.map(r => r.date)).size,
      weeklyCalories: weekRecords.reduce((sum, r) => sum + r.caloriesBurned, 0),
      monthlyDays: new Set(monthRecords.map(r => r.date)).size,
      totalDays: new Set(exerciseRecords.map(r => r.date)).size,
      streak
    };
  }, [exerciseRecords]);

  // 生成日历数据（过去7天）
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const hasExercise = exerciseRecords.some(r => r.date === dateStr);
      
      days.push({
        date: dateStr,
        dayOfWeek: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
        dayOfMonth: date.getDate(),
        hasExercise,
        isToday: dateStr === today.toISOString().split('T')[0]
      });
    }
    
    return days;
  }, [exerciseRecords]);

  // 运动类型配置
  const exerciseTypes = [
    { value: 'walking', label: '散步', icon: '🚶', calories: 5 },
    { value: 'running', label: '跑步', icon: '🏃', calories: 10 },
    { value: 'yoga', label: '瑜伽', icon: '🧘', calories: 3 },
    { value: 'swimming', label: '游泳', icon: '🏊', calories: 8 },
    { value: 'cycling', label: '骑行', icon: '🚴', calories: 7 },
    { value: 'strength', label: '力量训练', icon: '💪', calories: 6 },
    { value: 'other', label: '其他', icon: '🏋️', calories: 5 }
  ];

  const getExerciseInfo = (type: string) => {
    return exerciseTypes.find(t => t.value === type) || exerciseTypes[0];
  };

  // 计算预估消耗卡路里
  const estimatedCalories = useMemo(() => {
    const info = getExerciseInfo(newExercise.type);
    const base = info.calories * newExercise.duration;
    const multiplier = newExercise.intensity === 'high' ? 1.3 : 
                      newExercise.intensity === 'low' ? 0.7 : 1.0;
    return Math.round(base * multiplier);
  }, [newExercise]);

  const handleAddExercise = () => {
    // TODO: 实际实现时应该通过Context添加到记录中
    console.log('添加运动记录:', {
      ...newExercise,
      caloriesBurned: estimatedCalories,
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddModalOpen(false);
    // 重置表单
    setNewExercise({
      type: 'walking',
      duration: 30,
      intensity: 'medium'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部标题 */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 pb-8 rounded-b-[30px] shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">运动打卡</h1>
            <p className="text-blue-100 text-sm">坚持运动，健康生活</p>
          </div>
          <Dumbbell size={32} className="opacity-80" />
        </div>

        {/* 连续打卡天数 */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                <Flame size={24} className="text-orange-300" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.streak} 天</div>
                <div className="text-xs text-blue-100">连续打卡</div>
              </div>
            </div>
            <Trophy size={32} className="text-yellow-300 opacity-80" />
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 -mt-4">
        {/* 本周打卡日历 */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target size={18} className="text-brand-green" />
            本周打卡日历
          </h3>
          
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => (
              <div
                key={day.date}
                className="flex flex-col items-center"
              >
                <span className="text-xs text-gray-500 mb-1">
                  {day.dayOfWeek}
                </span>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    day.hasExercise
                      ? 'bg-brand-green text-white shadow-md'
                      : day.isToday
                      ? 'border-2 border-brand-green text-brand-green'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {day.hasExercise ? <Check size={16} /> : day.dayOfMonth}
                </div>
              </div>
            ))}
          </div>

          {stats.weeklyDays >= 5 && (
            <div className="mt-4 bg-green-50 rounded-lg p-3 text-sm text-green-700 flex items-center gap-2">
              <Award size={16} />
              <span>本周已运动{stats.weeklyDays}天，太棒了！🎉</span>
            </div>
          )}
        </div>

        {/* 运动统计 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">本周运动</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.weeklyDays}</div>
            <div className="text-xs text-gray-500">天</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-gray-600">本周消耗</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.weeklyCalories}</div>
            <div className="text-xs text-gray-500">千卡</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-gray-600">本月运动</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.monthlyDays}</div>
            <div className="text-xs text-gray-500">天</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">累计运动</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.totalDays}</div>
            <div className="text-xs text-gray-500">天</div>
          </div>
        </div>

        {/* 最近运动记录 */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Clock size={18} className="text-gray-600" />
            最近记录
          </h3>

          {exerciseRecords.length > 0 ? (
            exerciseRecords.slice(0, 10).map((record) => {
              const info = getExerciseInfo(record.type);
              return (
                <div key={record.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-800">{info.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          record.intensity === 'high' ? 'bg-red-100 text-red-700' :
                          record.intensity === 'low' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {record.intensity === 'high' ? '高强度' : 
                           record.intensity === 'low' ? '低强度' : '中强度'}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {record.duration}分钟
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame size={12} />
                          {record.caloriesBurned}千卡
                        </span>
                        {record.steps && (
                          <span>🚶 {record.steps}步</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(record.date).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
              <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">还没有运动记录</p>
              <p className="text-sm text-gray-400">点击下方按钮开始记录</p>
            </div>
          )}
        </div>

        {/* 运动建议 */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            💡 运动建议
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 建议每周运动5天，每次30分钟以上</li>
            <li>• 餐后1-2小时运动效果最佳</li>
            <li>• 运动前后记得测血糖，确保安全</li>
            {stats.streak === 0 && <li>• 今天开始运动，建立健康习惯！</li>}
            {stats.streak >= 7 && <li>• 已连续打卡{stats.streak}天，保持住！</li>}
          </ul>
        </div>
      </div>

      {/* 浮动添加按钮 */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-brand-green text-white rounded-full shadow-lg hover:shadow-xl hover:bg-green-600 transition-all flex items-center justify-center z-40"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      {/* 添加运动Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">快速打卡</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 运动类型选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  运动类型
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {exerciseTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setNewExercise(prev => ({ ...prev, type: type.value as ExerciseRecord['type'] }))}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        newExercise.type === type.value
                          ? 'border-brand-green bg-brand-light'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-xs font-medium text-gray-700">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 运动时长 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  运动时长：{newExercise.duration} 分钟
                </label>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={newExercise.duration}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10分</span>
                  <span>120分</span>
                </div>
              </div>

              {/* 运动强度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  运动强度
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'low', label: '轻松', color: 'blue' },
                    { value: 'medium', label: '适中', color: 'yellow' },
                    { value: 'high', label: '激烈', color: 'red' }
                  ].map((intensity) => (
                    <button
                      key={intensity.value}
                      onClick={() => setNewExercise(prev => ({ ...prev, intensity: intensity.value as ExerciseRecord['intensity'] }))}
                      className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        newExercise.intensity === intensity.value
                          ? `border-${intensity.color}-500 bg-${intensity.color}-50 text-${intensity.color}-700`
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {intensity.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 预估消耗 */}
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">预估消耗</div>
                <div className="text-3xl font-bold text-orange-600">{estimatedCalories}</div>
                <div className="text-xs text-gray-500">千卡</div>
              </div>

              {/* 提交按钮 */}
              <button
                onClick={handleAddExercise}
                className="w-full bg-brand-green text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
              >
                <Check size={20} className="inline mr-2" />
                完成打卡
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 补充导入Calendar组件
const Calendar = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default ExerciseTracker;
