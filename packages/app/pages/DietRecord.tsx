import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Utensils, 
  Plus, 
  TrendingUp, 
  Calendar,
  PieChart,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Sun,
  Moon,
  Apple
} from 'lucide-react';
import { DietRecord as DietRecordType, MealPlan } from '@sugarsmart/shared';

interface DietRecordProps {
  mealPlan: MealPlan | null;
  onBack: () => void;
}

const DietRecord: React.FC<DietRecordProps> = ({ mealPlan, onBack }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 从饮食计划转换为饮食记录
  const todayRecords = useMemo(() => {
    if (!mealPlan) return [];
    
    const today = new Date().toISOString().split('T')[0];
    const selected = selectedDate.toISOString().split('T')[0];
    
    // 仅显示今天的记录
    if (today !== selected) return [];
    
    return mealPlan.map((recipe) => {
      const mealTypeMap: { [key: string]: 'breakfast' | 'lunch' | 'dinner' | 'snack' } = {
        'Breakfast': 'breakfast',
        'Lunch': 'lunch',
        'Dinner': 'dinner',
        'Snack': 'snack'
      };

      return {
        id: recipe.id,
        date: today,
        time: recipe.time,
        mealType: mealTypeMap[recipe.mealType] || 'snack',
        foods: [{
          name: recipe.name,
          calories: recipe.nutrition.calories,
          carbs: recipe.nutrition.carbs,
          protein: recipe.nutrition.protein,
          fat: recipe.nutrition.fat,
          giLevel: recipe.nutrition.giLevel,
        }],
        totalCalories: recipe.nutrition.calories,
        totalCarbs: recipe.nutrition.carbs,
        totalProtein: recipe.nutrition.protein,
        totalFat: recipe.nutrition.fat,
        imageUrl: recipe.imageUrl
      } as DietRecordType;
    });
  }, [mealPlan, selectedDate]);

  // 计算营养统计
  const nutritionStats = useMemo(() => {
    const total = todayRecords.reduce((acc, record) => ({
      calories: acc.calories + record.totalCalories,
      carbs: acc.carbs + record.totalCarbs,
      protein: acc.protein + record.totalProtein,
      fat: acc.fat + record.totalFat
    }), { calories: 0, carbs: 0, protein: 0, fat: 0 });

    // 目标值（可从用户档案获取）
    const target = { calories: 1800, carbs: 225, protein: 90, fat: 60 };

    return {
      ...total,
      target,
      caloriesPercent: Math.min((total.calories / target.calories) * 100, 100)
    };
  }, [todayRecords]);

  // 计算GI分布
  const giDistribution = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0 };
    todayRecords.forEach(record => {
      record.foods.forEach(food => {
        counts[food.giLevel]++;
      });
    });
    const total = counts.Low + counts.Medium + counts.High || 1;
    return {
      low: Math.round((counts.Low / total) * 100),
      medium: Math.round((counts.Medium / total) * 100),
      high: Math.round((counts.High / total) * 100)
    };
  }, [todayRecords]);

  // 日期导航
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // 餐食图标
  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return <Coffee size={18} className="text-yellow-600" />;
      case 'lunch': return <Sun size={18} className="text-orange-600" />;
      case 'dinner': return <Moon size={18} className="text-indigo-600" />;
      case 'snack': return <Apple size={18} className="text-green-600" />;
      default: return <Utensils size={18} />;
    }
  };

  const getMealLabel = (type: string) => {
    const labels = {
      'breakfast': '早餐',
      'lunch': '午餐',
      'dinner': '晚餐',
      'snack': '加餐'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部日期选择 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">饮食记录</h1>
          <div className="w-10" />
        </div>

        {/* 日期导航 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-brand-green" />
            <span className="font-medium">
              {selectedDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
            </span>
            {isToday && (
              <span className="px-2 py-0.5 bg-brand-green text-white text-xs rounded-full">
                今天
              </span>
            )}
          </div>

          <button
            onClick={() => changeDate(1)}
            disabled={isToday}
            className={`p-2 rounded-lg ${isToday ? 'opacity-30' : 'hover:bg-gray-100'}`}
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 卡路里进度环 */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">今日摄入</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-orange-600">
                  {nutritionStats.calories}
                </span>
                <span className="text-sm text-gray-500">/ {nutritionStats.target.calories} 千卡</span>
              </div>
            </div>
            <div className="relative w-20 h-20">
              <svg className="transform -rotate-90 w-20 h-20">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#f97316"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - nutritionStats.caloriesPercent / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-orange-600">
                  {Math.round(nutritionStats.caloriesPercent)}%
                </span>
              </div>
            </div>
          </div>

          {/* 营养素分布 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">碳水</div>
              <div className="text-lg font-bold text-yellow-600">{nutritionStats.carbs}g</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">蛋白质</div>
              <div className="text-lg font-bold text-blue-600">{nutritionStats.protein}g</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">脂肪</div>
              <div className="text-lg font-bold text-purple-600">{nutritionStats.fat}g</div>
            </div>
          </div>
        </div>

        {/* GI分布 */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={18} className="text-brand-green" />
            <h3 className="font-semibold">GI指数分布</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600 font-medium">低GI</span>
                <span className="text-gray-600">{giDistribution.low}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${giDistribution.low}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-yellow-600 font-medium">中GI</span>
                <span className="text-gray-600">{giDistribution.medium}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{ width: `${giDistribution.medium}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-600 font-medium">高GI</span>
                <span className="text-gray-600">{giDistribution.high}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${giDistribution.high}%` }}
                />
              </div>
            </div>
          </div>

          {giDistribution.low >= 70 && (
            <div className="mt-4 bg-green-50 rounded-lg p-3 text-sm text-green-700">
              <TrendingUp size={14} className="inline mr-1" />
              棒！低GI食物占比很高，继续保持！
            </div>
          )}
        </div>

        {/* 餐食记录列表 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">今日餐食</h3>
            {isToday && (
              <button
                onClick={() => navigate('/result')}
                className="flex items-center gap-1 text-brand-green text-sm font-medium"
              >
                <Plus size={16} />
                添加
              </button>
            )}
          </div>

          {todayRecords.length > 0 ? (
            todayRecords.sort((a, b) => a.time.localeCompare(b.time)).map((record) => (
              <div key={record.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* 时间和类型 */}
                    <div className="flex flex-col items-center min-w-[60px]">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-1">
                        {getMealIcon(record.mealType)}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        {getMealLabel(record.mealType)}
                      </span>
                      <span className="text-xs text-gray-400">{record.time}</span>
                    </div>

                    {/* 内容 */}
                    <div className="flex-1">
                      {record.foods.map((food, idx) => (
                        <div key={idx} className="mb-2 last:mb-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-800">{food.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              food.giLevel === 'Low' ? 'bg-green-100 text-green-700' :
                              food.giLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {food.giLevel === 'Low' ? '低' : food.giLevel === 'Medium' ? '中' : '高'} GI
                            </span>
                          </div>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span>{food.calories} 千卡</span>
                            <span>碳水 {food.carbs}g</span>
                            <span>蛋白 {food.protein}g</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
              <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">
                {isToday ? '今天还没有饮食记录' : '该日期没有饮食记录'}
              </p>
              {isToday && (
                <button
                  onClick={() => navigate('/result')}
                  className="text-brand-green text-sm font-medium hover:underline"
                >
                  去添加饮食计划 →
                </button>
              )}
            </div>
          )}
        </div>

        {/* 健康建议 */}
        {isToday && todayRecords.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              💡 今日建议
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {nutritionStats.caloriesPercent < 80 && (
                <li>• 今日热量摄入偏低，注意补充营养</li>
              )}
              {giDistribution.high > 30 && (
                <li>• 高GI食物占比较高，建议增加低GI食物</li>
              )}
              {nutritionStats.protein < nutritionStats.target.protein * 0.8 && (
                <li>• 蛋白质摄入不足，可以增加鸡蛋、豆制品</li>
              )}
              {nutritionStats.caloriesPercent >= 80 && giDistribution.low >= 60 && (
                <li>• 今日饮食均衡合理，继续保持！</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietRecord;
