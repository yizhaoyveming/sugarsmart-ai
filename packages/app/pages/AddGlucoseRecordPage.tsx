import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, AlertCircle, Check } from 'lucide-react';
import { BloodGlucoseRecord } from '@sugarsmart/shared';

interface AddGlucoseRecordPageProps {
  onAddRecord: (record: Omit<BloodGlucoseRecord, 'id'>) => void;
}

// 🎯 全新设计的滚轮选择器 - 使用transform而不是scrollTop
const ScrollPicker: React.FC<{
  value: number;
  onChange: (value: number) => void;
  options: number[];
  formatValue?: (val: number) => string;
}> = ({ value, onChange, options, formatValue = (v) => v.toString() }) => {
  const ITEM_HEIGHT = 44; // 增大高度以显示完整数字
  const VISIBLE_ITEMS = 3; // 只显示3个项目
  const containerRef = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // 当前选中项的索引
  const currentIndex = Math.max(0, options.indexOf(value));
  
  // 计算偏移量：让选中项居中
  const getOffset = (index: number) => {
    return (VISIBLE_ITEMS - 1) / 2 * ITEM_HEIGHT - index * ITEM_HEIGHT;
  };
  
  const [offset, setOffset] = useState(getOffset(currentIndex));
  
  // 同步value变化
  useEffect(() => {
    if (!isDragging) {
      const index = options.indexOf(value);
      if (index >= 0) {
        setOffset(getOffset(index));
      }
    }
  }, [value, options, isDragging]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0].clientY;
    setCurrentY(touch);
    const deltaY = touch - startY;
    setOffset(getOffset(currentIndex) + deltaY);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // 计算应该停在哪个项目
    const deltaY = currentY - startY;
    const movedItems = Math.round(-deltaY / ITEM_HEIGHT);
    let newIndex = currentIndex + movedItems;
    
    // 限制范围
    newIndex = Math.max(0, Math.min(options.length - 1, newIndex));
    
    // 更新值
    if (newIndex !== currentIndex) {
      onChange(options[newIndex]);
    } else {
      // 没变化也要对齐
      setOffset(getOffset(currentIndex));
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ 
        height: `${ITEM_HEIGHT * VISIBLE_ITEMS}px`,
        touchAction: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 遮罩层 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
      </div>
      
      {/* 选中指示线 */}
      <div 
        className="absolute left-0 right-0 border-y-2 border-gray-200 pointer-events-none"
        style={{ 
          top: `${(VISIBLE_ITEMS - 1) / 2 * ITEM_HEIGHT}px`,
          height: `${ITEM_HEIGHT}px`
        }}
      />
      
      {/* 滚动内容 */}
      <div
        style={{
          transform: `translateY(${offset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {options.map((option, index) => {
          // 计算该项目距离中心线的实际距离（单位：项）
          const centerPosition = (VISIBLE_ITEMS - 1) / 2 * ITEM_HEIGHT;
          const itemPosition = index * ITEM_HEIGHT + offset;
          const distanceFromCenter = Math.abs(itemPosition - centerPosition) / ITEM_HEIGHT;
          
          // 使用平滑的三次贝塞尔曲线计算渐变效果（超级柔和）
          // 限制最大距离为2（避免过远的项影响计算）
          const normalizedDistance = Math.min(distanceFromCenter, 2);
          
          // 透明度：使用缓动函数实现平滑渐变 (1.0 → 0.5)
          // easeOutCubic: 开始快，结束慢
          const t = normalizedDistance / 2; // 归一化到 0-1
          const easedT = 1 - Math.pow(1 - t, 3); // 三次缓动
          const opacity = 1 - easedT * 0.5; // 从1.0渐变到0.5
          
          // 字体大小：微妙的变化 (20 → 19)
          // 使用平滑插值，不会有突兀感
          const fontSizeRange = 1; // 只变化1px
          const baseFontSize = 20;
          const fontSize = baseFontSize - easedT * fontSizeRange;
          
          // 字重：更平滑的过渡
          // 在中心附近(距离<0.3)使用600，其他使用normal
          const fontWeight = distanceFromCenter < 0.3 ? 600 : 'normal';
          
          return (
            <div
              key={option}
              className="flex items-center justify-center"
              style={{
                height: `${ITEM_HEIGHT}px`,
                fontSize: `${fontSize}px`,
                fontWeight,
                color: `rgba(0, 0, 0, ${opacity})`,
                transition: isDragging ? 'none' : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {formatValue(option)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AddGlucoseRecordPage: React.FC<AddGlucoseRecordPageProps> = ({ onAddRecord }) => {
  const navigate = useNavigate();
  const [saveState, setSaveState] = useState<'idle' | 'success'>('idle');
  const [savedRecordInfo, setSavedRecordInfo] = useState<{
    value: number;
    status: string;
    date: string;
    time: string;
    type: string;
  } | null>(null);
  
  const now = new Date();
  const [newRecord, setNewRecord] = useState({
    value: '',
    type: 'fasting' as 'fasting' | 'postprandial' | 'before-meal' | 'bedtime',
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    note: ''
  });
  const [validationError, setValidationError] = useState('');
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const typeLabels = {
    'fasting': '空腹',
    'before-meal': '餐前',
    'postprandial': '餐后',
    'bedtime': '睡前'
  };

  // 生成选项列表（限制未来时间）
  const generateYearOptions = () => {
    const currentYear = now.getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 4 + i).filter(y => y <= currentYear);
  };

  const generateMonthOptions = () => {
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (newRecord.year === currentYear) {
      return Array.from({ length: currentMonth }, (_, i) => i + 1);
    }
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const generateDayOptions = () => {
    const daysInMonth = new Date(newRecord.year, newRecord.month, 0).getDate();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    
    if (newRecord.year === currentYear && newRecord.month === currentMonth) {
      return Array.from({ length: currentDay }, (_, i) => i + 1);
    }
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const generateHourOptions = () => {
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const currentHour = now.getHours();
    
    if (newRecord.year === currentYear && newRecord.month === currentMonth && newRecord.day === currentDay) {
      return Array.from({ length: currentHour + 1 }, (_, i) => i);
    }
    return Array.from({ length: 24 }, (_, i) => i);
  };

  const generateMinuteOptions = () => {
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    if (newRecord.year === currentYear && newRecord.month === currentMonth && 
        newRecord.day === currentDay && newRecord.hour === currentHour) {
      return Array.from({ length: currentMinute + 1 }, (_, i) => i);
    }
    return Array.from({ length: 60 }, (_, i) => i);
  };

  // 判断血糖状态
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

  const getStatusText = (status: 'normal' | 'low' | 'high') => {
    if (status === 'normal') return '正常';
    if (status === 'low') return '偏低';
    return '偏高';
  };

  // 实时计算血糖状态
  const getCurrentStatus = () => {
    const value = parseFloat(newRecord.value);
    if (isNaN(value) || value <= 0) return null;
    return getGlucoseStatus(value, newRecord.type);
  };

  const currentStatus = getCurrentStatus();

  // 格式化日期显示
  const formatDateDisplay = () => {
    const date = new Date(newRecord.year, newRecord.month - 1, newRecord.day);
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekDay = weekDays[date.getDay()];
    return `${newRecord.month}月${newRecord.day}日 星期${weekDay}`;
  };

  const handleSave = () => {
    // 验证
    const value = parseFloat(newRecord.value);
    if (isNaN(value) || value <= 0) {
      setValidationError('请输入有效的血糖值（大于0）');
      return;
    }
    if (value > 30) {
      setValidationError('血糖值过高，请确认输入');
      return;
    }

    const status = getGlucoseStatus(value, newRecord.type);
    
    // 构建日期和时间字符串
    const date = `${newRecord.year}-${String(newRecord.month).padStart(2, '0')}-${String(newRecord.day).padStart(2, '0')}`;
    const time = `${String(newRecord.hour).padStart(2, '0')}:${String(newRecord.minute).padStart(2, '0')}`;
    
    // 保存记录
    const recordToSave = {
      date,
      time,
      type: newRecord.type,
      value,
      note: newRecord.note || undefined
    };
    
    onAddRecord(recordToSave);

    // 保存成功信息并显示弹窗
    setSavedRecordInfo({
      value,
      status: getStatusText(status),
      date: formatDateDisplay(),
      time,
      type: typeLabels[newRecord.type]
    });
    setSaveState('success');
  };

  const handleCloseSuccess = () => {
    setSaveState('idle');
    navigate('/data');
  };

  // 如果显示成功弹窗
  if (saveState === 'success' && savedRecordInfo) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl p-5 m-4 max-w-xs w-full shadow-xl">
          {/* 成功图标 */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={36} className="text-green-600" strokeWidth={3} />
          </div>
          
          {/* 标题 */}
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">保存成功！</h2>
          
          {/* 数据卡片 */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
            <div className="flex items-center justify-between py-1.5 border-b border-gray-200">
              <span className="text-xs text-gray-600">血糖值</span>
              <span className="text-xl font-bold text-gray-800">
                {savedRecordInfo.value.toFixed(1)} 
                <span className="text-xs font-normal text-gray-500 ml-1">mmol/L</span>
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-gray-200">
              <span className="text-xs text-gray-600">状态</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                savedRecordInfo.status === '正常' ? 'bg-green-100 text-green-700' :
                savedRecordInfo.status === '偏低' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {savedRecordInfo.status}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-gray-200">
              <span className="text-xs text-gray-600">日期</span>
              <span className="text-xs font-medium text-gray-800">{savedRecordInfo.date}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-gray-200">
              <span className="text-xs text-gray-600">时间</span>
              <span className="text-xs font-medium text-gray-800">{savedRecordInfo.time}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-gray-600">测量时机</span>
              <span className="text-xs font-medium text-gray-800">{savedRecordInfo.type}</span>
            </div>
          </div>

          {/* 确认按钮 */}
          <button
            onClick={handleCloseSuccess}
            className="w-full bg-brand-green text-white py-3 rounded-xl font-medium text-base shadow-md hover:bg-green-700 transition-all active:scale-98"
          >
            我知道了
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm sticky top-0 z-10 px-4 py-4">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/data')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-800 ml-2">记录血糖</h1>
        </div>
      </div>

      {/* 表单内容 */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* 测量时间选择 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm relative">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            测量时间
          </label>
          <button
            type="button"
            onClick={() => setShowTypeSelector(!showTypeSelector)}
            className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none text-gray-800 font-medium bg-white text-left hover:border-brand-green hover:shadow-sm transition-all relative"
          >
            <span>{typeLabels[newRecord.type]}</span>
            <svg 
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${showTypeSelector ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 下拉选项列表 */}
          {showTypeSelector && (
            <>
              {/* 遮罩层 - 点击关闭 */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowTypeSelector(false)}
              />
              
              {/* 下拉菜单 */}
              <div className="absolute left-6 right-6 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                {Object.entries(typeLabels).map(([key, label], index) => (
                  <button
                    key={key}
                    onClick={() => {
                      setNewRecord({ ...newRecord, type: key as any });
                      setShowTypeSelector(false);
                    }}
                    className={`w-full px-5 py-4 text-left font-medium transition-all flex items-center justify-between ${
                      newRecord.type === key
                        ? 'bg-brand-green text-white'
                        : 'bg-white text-gray-800 hover:bg-gray-50'
                    } ${index !== 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    <span className="text-base">{label}</span>
                    {newRecord.type === key && (
                      <Check size={18} strokeWidth={3} />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 血糖值输入 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            血糖值 (mmol/L)
          </label>
          <input
            type="number"
            step="0.1"
            value={newRecord.value}
            onChange={(e) => {
              setNewRecord({ ...newRecord, value: e.target.value });
              setValidationError('');
            }}
            placeholder="例如：6.5"
            className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none text-center text-3xl font-bold transition-all ${
              validationError ? 'border-red-300 animate-shake bg-red-50' : 'border-gray-200'
            }`}
            autoFocus
          />
          {validationError && (
            <div className="flex items-center gap-2 mt-3 text-red-600 text-sm animate-fadeIn">
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}

          {/* 实时血糖状态预览 */}
          {currentStatus && (
            <div className={`mt-4 p-4 rounded-xl text-center font-medium animate-fadeIn ${
              currentStatus === 'normal' ? 'bg-green-50 text-green-700 border-2 border-green-200' :
              currentStatus === 'low' ? 'bg-yellow-50 text-yellow-700 border-2 border-yellow-200' :
              'bg-red-50 text-red-700 border-2 border-red-200'
            }`}>
              <div className="flex items-center justify-center gap-2 text-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  {currentStatus === 'normal' ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  )}
                </svg>
                <span>
                  {getStatusText(currentStatus)} - {parseFloat(newRecord.value).toFixed(1)} mmol/L
                </span>
              </div>
              <div className="text-sm mt-2 opacity-90">
                {currentStatus === 'normal' && '血糖值在正常范围内'}
                {currentStatus === 'low' && '血糖值偏低，建议补充糖分'}
                {currentStatus === 'high' && '血糖值偏高，请注意控制'}
              </div>
            </div>
          )}
        </div>

        {/* 测量时间 - 滚轮选择器 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            日期&时间
          </label>
          
          {/* 滚轮选择器 */}
          <div className="grid grid-cols-5 gap-1">
            {/* 年份 */}
            <div>
              <div className="text-xs text-center text-gray-500 mb-1">年</div>
              <ScrollPicker
                value={newRecord.year}
                onChange={(v) => setNewRecord({ ...newRecord, year: v })}
                options={generateYearOptions()}
              />
            </div>
            
            {/* 月 */}
            <div>
              <div className="text-xs text-center text-gray-500 mb-1">月</div>
              <ScrollPicker
                value={newRecord.month}
                onChange={(v) => setNewRecord({ ...newRecord, month: v })}
                options={generateMonthOptions()}
                formatValue={(v) => String(v).padStart(2, '0')}
              />
            </div>
            
            {/* 日 */}
            <div>
              <div className="text-xs text-center text-gray-500 mb-1">日</div>
              <ScrollPicker
                value={newRecord.day}
                onChange={(v) => setNewRecord({ ...newRecord, day: v })}
                options={generateDayOptions()}
                formatValue={(v) => String(v).padStart(2, '0')}
              />
            </div>
            
            {/* 时 */}
            <div>
              <div className="text-xs text-center text-gray-500 mb-1">时</div>
              <ScrollPicker
                value={newRecord.hour}
                onChange={(v) => setNewRecord({ ...newRecord, hour: v })}
                options={generateHourOptions()}
                formatValue={(v) => String(v).padStart(2, '0')}
              />
            </div>
            
            {/* 分 */}
            <div>
              <div className="text-xs text-center text-gray-500 mb-1">分</div>
              <ScrollPicker
                value={newRecord.minute}
                onChange={(v) => setNewRecord({ ...newRecord, minute: v })}
                options={generateMinuteOptions()}
                formatValue={(v) => String(v).padStart(2, '0')}
              />
            </div>
          </div>
        </div>

        {/* 备注 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            备注（可选）
          </label>
          <textarea
            value={newRecord.note}
            onChange={(e) => setNewRecord({ ...newRecord, note: e.target.value })}
            placeholder="例如：餐后2小时"
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* 底部保存按钮 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 shadow-lg">
        <button
          onClick={handleSave}
          disabled={!newRecord.value}
          className="w-full bg-brand-green text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          保存记录
        </button>
      </div>
    </div>
  );
};

export default AddGlucoseRecordPage;
