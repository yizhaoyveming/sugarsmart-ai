import React, { useState } from 'react';
import { ChevronLeft, TrendingUp, TrendingDown, Minus, Calendar, Activity, Utensils, Dumbbell, Award, Target, Sparkles } from 'lucide-react';
import { WeeklyReport as WeeklyReportType } from '@sugarsmart/shared';

interface WeeklyReportProps {
  onBack: () => void;
}

const WeeklyReport: React.FC<WeeklyReportProps> = ({ onBack }) => {
  const [selectedReportId, setSelectedReportId] = useState<string>('current');

  // Mock数据 - 当前周报
  const currentReport: WeeklyReportType = {
    id: 'current',
    weekStart: '2025-11-24',
    weekEnd: '2025-11-30',
    bloodGlucoseSummary: {
      avgFasting: 5.9,
      avgPostprandial: 7.2,
      stabilityScore: 85,
      targetAchievement: true
    },
    dietSummary: {
      lowGIPercentage: 65,
      avgCalories: 1850,
      carbIntakeBalance: 'medium',
      topFoods: ['燕麦', '鸡胸肉', '西兰花', '鸡蛋', '牛奶']
    },
    exerciseSummary: {
      daysExercised: 5,
      totalCaloriesBurned: 875,
      favoriteActivities: ['散步', '瑜伽', '力量训练']
    },
    overallScore: 88,
    highlights: [
      '连续7天血糖达标，继续保持！',
      '低GI食物占比提升10%，进步明显',
      '坚持每天运动30分钟，值得表扬'
    ],
    nextWeekGoals: [
      '将高GI食物摄入降低至20%以下',
      '每天运动30分钟,保持5天/周',
      '记录3次餐后血糖数据'
    ],
    aiInsights: '本周血糖控制表现优秀！您的空腹血糖平均值5.9 mmol/L处于理想范围。建议继续保持低GI饮食习惯,并在晚餐后增加15分钟散步,可进一步优化餐后血糖水平。',
    generatedAt: '2025-12-01 08:00:00'
  };

  // Mock历史周报
  const historyReports: WeeklyReportType[] = [
    {
      id: 'week1',
      weekStart: '2025-11-17',
      weekEnd: '2025-11-23',
      bloodGlucoseSummary: {
        avgFasting: 6.2,
        avgPostprandial: 7.8,
        stabilityScore: 78,
        targetAchievement: true
      },
      dietSummary: {
        lowGIPercentage: 55,
        avgCalories: 1920,
        carbIntakeBalance: 'high',
        topFoods: ['米饭', '面条', '鸡肉', '青菜', '苹果']
      },
      exerciseSummary: {
        daysExercised: 4,
        totalCaloriesBurned: 650,
        favoriteActivities: ['散步', '游泳']
      },
      overallScore: 82,
      highlights: ['血糖稳定性良好', '运动频率达标'],
      nextWeekGoals: ['增加低GI食物', '保持运动习惯'],
      aiInsights: '本周整体表现良好,建议增加低GI食物摄入。',
      generatedAt: '2025-11-24 08:00:00'
    }
  ];

  const selectedReport = selectedReportId === 'current' ? currentReport : historyReports.find(r => r.id === selectedReportId) || currentReport;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 85) return 'from-green-50 to-green-100';
    if (score >= 70) return 'from-yellow-50 to-yellow-100';
    return 'from-red-50 to-red-100';
  };

  const getTrendIcon = (current: number, target: number) => {
    if (current < target) return <TrendingDown className="w-4 h-4 text-green-600" />;
    if (current > target) return <TrendingUp className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">AI健康周报</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* 周报选择 */}
      <div className="bg-white px-4 py-3 mb-4">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedReportId('current')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              selectedReportId === 'current'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            本周报告
          </button>
          {historyReports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReportId(report.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                selectedReportId === report.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {report.weekStart} ~ {report.weekEnd}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4 pb-8">
        {/* 综合评分卡片 */}
        <div className={`bg-gradient-to-br ${getScoreGradient(selectedReport.overallScore)} rounded-2xl shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">综合健康评分</h2>
            <Calendar className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(selectedReport.overallScore)} mb-2`}>
              {selectedReport.overallScore}
            </div>
            <p className="text-sm text-gray-600">
              {selectedReport.weekStart} ~ {selectedReport.weekEnd}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
              <Award className="w-4 h-4" />
              <span>
                {selectedReport.overallScore >= 85 ? '优秀' : selectedReport.overallScore >= 70 ? '良好' : '需改进'}
              </span>
            </div>
          </div>
        </div>

        {/* 本周亮点 */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            本周亮点
          </h3>
          <div className="space-y-2">
            {selectedReport.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-3">
                <span className="text-lg">🎉</span>
                <p className="text-gray-700 flex-1">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 血糖总览 */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            血糖管理
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">平均空腹血糖</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
                  {selectedReport.bloodGlucoseSummary.avgFasting}
                </span>
                {getTrendIcon(selectedReport.bloodGlucoseSummary.avgFasting, 6.1)}
              </div>
              <div className="text-xs text-gray-500 mt-1">mmol/L</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">平均餐后血糖</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  {selectedReport.bloodGlucoseSummary.avgPostprandial}
                </span>
                {getTrendIcon(selectedReport.bloodGlucoseSummary.avgPostprandial, 7.8)}
              </div>
              <div className="text-xs text-gray-500 mt-1">mmol/L</div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">血糖稳定性</span>
              <span className="text-lg font-semibold text-gray-800">
                {selectedReport.bloodGlucoseSummary.stabilityScore}分
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${selectedReport.bloodGlucoseSummary.stabilityScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* 饮食分析 */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-orange-600" />
            饮食分析
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">低GI食物占比</span>
                <span className="text-lg font-semibold text-orange-600">
                  {selectedReport.dietSummary.lowGIPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${selectedReport.dietSummary.lowGIPercentage}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-xl p-3">
                <div className="text-sm text-gray-600 mb-1">平均热量</div>
                <div className="text-xl font-bold text-orange-600">
                  {selectedReport.dietSummary.avgCalories}
                </div>
                <div className="text-xs text-gray-500">千卡/天</div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3">
                <div className="text-sm text-gray-600 mb-1">碳水平衡度</div>
                <div className="text-xl font-bold text-yellow-600">
                  {selectedReport.dietSummary.carbIntakeBalance === 'low' ? '偏低' : 
                   selectedReport.dietSummary.carbIntakeBalance === 'medium' ? '适中' : '偏高'}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">本周最常吃的食物</div>
              <div className="flex flex-wrap gap-2">
                {selectedReport.dietSummary.topFoods.map((food, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    {food}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 运动总结 */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-blue-600" />
            运动总结
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">运动天数</div>
              <div className="text-2xl font-bold text-blue-600">
                {selectedReport.exerciseSummary.daysExercised}
              </div>
              <div className="text-xs text-gray-500">天</div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">总消耗</div>
              <div className="text-2xl font-bold text-indigo-600">
                {selectedReport.exerciseSummary.totalCaloriesBurned}
              </div>
              <div className="text-xs text-gray-500">千卡</div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">最爱的运动</div>
            <div className="flex flex-wrap gap-2">
              {selectedReport.exerciseSummary.favoriteActivities.map((activity, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI智能分析 */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            AI智能分析
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {selectedReport.aiInsights}
          </p>
          <div className="bg-white rounded-xl p-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">💡 专业建议</div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 继续保持低GI饮食习惯</li>
              <li>• 建议晚餐后增加15分钟散步</li>
              <li>• 每周记录至少3次餐后血糖</li>
            </ul>
          </div>
        </div>

        {/* 下周目标 */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            下周目标
          </h3>
          <div className="space-y-3">
            {selectedReport.nextWeekGoals.map((goal, index) => (
              <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-semibold">{index + 1}</span>
                </div>
                <p className="text-gray-700 flex-1">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
