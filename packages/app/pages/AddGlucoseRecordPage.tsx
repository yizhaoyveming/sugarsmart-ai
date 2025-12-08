import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertCircle, Check } from 'lucide-react';
import { BloodGlucoseRecord } from '@sugarsmart/shared';

interface AddGlucoseRecordPageProps {
  onAddRecord: (record: Omit<BloodGlucoseRecord, 'id'>) => void;
}

// 滚轮选择器组件 - 带平滑滚动动画
const ScrollPicker: React.FC<{
  value: number;
  onChange: (value: number) => void;
  options: number[];
  formatValue?: (val: number) => string;
}> = ({ value, onChange, options, formatValue = (v) => v.toString() }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ITEM_HEIGHT = 40; // 每个项目的高度
  const currentIndex = options.indexOf(value);
  
  // 初始化为当前项的位置
  const [scrollOffset, setScrollOffset] = useState(-currentIndex * ITEM_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);
  const touchStartOffset = useRef(0);
  const velocityRef = useRef(0);
  const lastTouchY = useRef(0);
  const lastTouchTime = useRef(0);

  // 计算应该滚动到的位置
  const targetScrollOffset = -currentIndex * ITEM_HEIGHT;

  // 鼠标滚轮
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(options.length - 1, currentIndex + direction));
    if (newIndex !== currentIndex) {
      onChange(options[newIndex]);
    }
  };

  // 触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    touchStartY.current = e.touches[0].clientY;
    touchStartOffset.current = scrollOffset;
    lastTouchY.current = e.touches[0].clientY;
    lastTouchTime.current = Date.now();
    velocityRef.current = 0;
  };

  // 触摸滑动
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY.current;
    const newOffset = touchStartOffset.current + deltaY;
    
    // 计算速度
    const now = Date.now();
    const timeDelta = now - lastTouchTime.current;
    if (timeDelta > 0) {
      velocityRef.current = (touchY - lastTouchY.current) / timeDelta;
    }
    lastTouchY.current = touchY;
    lastTouchTime.current = now;
    
    // 限制滚动范围（允许轻微超出）
    const minOffset = -(options.length - 1) * ITEM_HEIGHT - 20;
    const maxOffset = 20;
    const clampedOffset = Math.max(minOffset, Math.min(maxOffset, newOffset));
    
    setScrollOffset(clampedOffset);
  };

  // 触摸结束
  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // 惯性滚动
    let currentOffset = scrollOffset;
    let currentVelocity = velocityRef.current * 10; // 放大速度
    const minOffset = -(options.length - 1) * ITEM_HEIGHT;
    const maxOffset = 0;
    
    const momentum = () => {
      if (Math.abs(currentVelocity) < 0.5) {
        // 速度很小，对齐到最近的项
        snapToNearest(currentOffset);
        return;
      }
      
      currentOffset += currentVelocity;
      currentVelocity *= 0.92; // 衰减
      
      // 限制范围
      currentOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
      
      setScrollOffset(currentOffset);
      requestAnimationFrame(momentum);
    };
    
    if (Math.abs(currentVelocity) > 0.5) {
      requestAnimationFrame(momentum);
    } else {
      // 立即对齐
      snapToNearest(currentOffset);
    }
  };

  // 对齐到最近的项
  const snapToNearest = (offset: number) => {
    const index = Math.round(-offset / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(options.length - 1, index));
    onChange(options[clampedIndex]);
  };

  // 初始化和值变化时更新位置
  React.useEffect(() => {
    if (!isDragging && currentIndex >= 0) {
      setScrollOffset(-currentIndex * ITEM_HEIGHT);
    }
  }, [currentIndex, isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative h-32 flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ touchAction: 'none' }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
      </div>
      
      {/* 滚动容器 */}
      <div
        style={{
          transform: `translateY(${scrollOffset + 56}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
        className="flex flex-col"
      >
        {options.map((option, index) => {
          const distance = Math.abs(index - currentIndex);
          const opacity = Math.max(0.3, 1 - distance * 0.3);
          const scale = Math.max(0.8, 1 - distance * 0.15);
          const isCurrent = index === currentIndex && !isDragging;
          
          return (
            <div
              key={option}
              className="flex items-center justify-center transition-all"
              style={{
                height: `${ITEM_HEIGHT}px`,
                opacity,
                transform: `scale(${isCurrent ? 1 : scale})`,
                fontSize: isCurrent ? '24px' : '18px',
                fontWeight: isCurrent ? 'bold' : 'normal',
                color: isCurrent ? '#1f2937' : '#9ca3af'
              }}
            >
              {formatValue(option)}
            </div>
          );
        })}
      </div>
      
      {/* 中间选中线 */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 border-y-2 border-gray-200 pointer-events-none" />
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
      <div className="bg-white shadow-sm px-4 py-4 flex items-center sticky top-0 z-10">
        <button 
          onClick={() => navigate('/data')}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800 ml-2">记录血糖</h1>
      </div>

      {/* 表单内容 */}
      <div className="flex-1 px-6 py-6 space-y-6">
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
            className={`w-full p-5 border-2 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none text-center text-5xl font-bold transition-all ${
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

        {/* 测量时机 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            测量时机
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(typeLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setNewRecord({ ...newRecord, type: key as any })}
                className={`p-4 rounded-xl text-base font-medium transition-all border-2 ${
                  newRecord.type === key
                    ? 'border-brand-green bg-brand-light text-brand-green shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
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
                onChange={(v) => {
                  setNewRecord({ ...newRecord, year: v });
                }}
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
