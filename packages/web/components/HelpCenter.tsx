import React, { useState } from 'react';
import { ChevronLeft, Search, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';
import { FAQ } from '../types';

interface HelpCenterProps {
  onBack: () => void;
}

// FAQ数据
const FAQ_DATA: FAQ[] = [
  // 饮食管理分类
  {
    id: '1',
    category: 'diet',
    question: '什么是GI值？如何选择低GI食物？',
    answer: 'GI值（升糖指数）是衡量食物对血糖影响的指标。低GI食物（GI<55）如燕麦、全麦面包、豆类等，消化吸收慢，血糖上升平缓；高GI食物（GI>70）如白米饭、白面包等，会导致血糖快速上升。糖尿病患者应优先选择低GI食物，配合蔬菜和蛋白质食用。'
  },
  {
    id: '2',
    category: 'diet',
    question: '如何使用AI生成每日饮食计划？',
    answer: '进入"创建计划"页面，填写您的个人信息（年龄、身高、体重、糖尿病类型等）和饮食偏好。我们的AI会根据您的血糖控制需求，自动生成低GI、营养均衡的三餐计划，包含详细的食材清单和烹饪步骤。'
  },
  {
    id: '3',
    category: 'diet',
    question: '食物拍照识别不准确怎么办？',
    answer: '确保拍照时光线充足，食物清晰可见。如果识别结果不准确，您可以点击"手动编辑"按钮，修改食物名称和分量。我们会不断优化AI识别算法，提升准确率。'
  },
  
  // 血糖监测分类
  {
    id: '4',
    category: 'glucose',
    question: '如何记录血糖数据？',
    answer: '在"健康档案"页面点击"添加血糖记录"，选择测量类型（空腹/餐后/睡前等），输入血糖值（mmol/L）。系统会自动生成趋势图，帮助您直观了解血糖变化。'
  },
  {
    id: '5',
    category: 'glucose',
    question: '血糖趋势图怎么看？',
    answer: '趋势图显示您最近7天、30天或90天的血糖变化。绿色区域代表目标范围（空腹3.9-6.1 mmol/L，餐后<7.8 mmol/L）。如果数值持续偏高或波动较大，建议咨询医生调整治疗方案。'
  },
  {
    id: '6',
    category: 'glucose',
    question: '什么时候应该测血糖？',
    answer: '建议测量时间：①空腹（早餐前）②餐后2小时 ③睡前。具体频率请遵医嘱。如出现低血糖症状（心慌、出汗、饥饿感），应立即测量并及时补糖。'
  },
  
  // 账户管理分类
  {
    id: '7',
    category: 'account',
    question: '如何修改个人资料？',
    answer: '进入"我的"页面，点击"编辑资料"按钮。您可以修改年龄、身高、体重、糖尿病类型、用药信息等。修改后系统会重新为您生成个性化的饮食建议。'
  },
  {
    id: '8',
    category: 'account',
    question: '如何导出健康数据？',
    answer: '在"健康档案"页面，点击右上角"导出"按钮，选择导出时间范围（最近7天/30天/全部）。数据将以Excel或PDF格式保存，方便您打印或分享给医生。'
  },
  {
    id: '9',
    category: 'account',
    question: '忘记密码怎么办？',
    answer: '在登录页面点击"忘记密码"，输入注册时的手机号或邮箱，我们会发送验证码帮助您重置密码。如仍无法登录，请联系客服QQ或微信寻求帮助。'
  },
  
  // 技术支持分类
  {
    id: '10',
    category: 'technical',
    question: 'App闪退或卡顿怎么办？',
    answer: '请尝试：①清理App缓存 ②检查网络连接 ③更新到最新版本 ④重启手机。如问题仍未解决，请联系客服并提供手机型号和系统版本信息。'
  },
  {
    id: '11',
    category: 'technical',
    question: '数据同步失败怎么办？',
    answer: '确保手机已连接网络。数据会自动保存在本地，联网后会自动同步到云端。如多次同步失败，请检查账号登录状态或联系客服处理。'
  },
];

const CATEGORY_NAMES = {
  diet: '饮食管理',
  glucose: '血糖监测',
  account: '账户问题',
  technical: '技术支持'
};

const HelpCenter: React.FC<HelpCenterProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 过滤FAQ
  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 按分类分组
  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">帮助中心</h1>
          <div className="w-10"></div> {/* 占位保持居中 */}
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索常见问题..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* 分类标签 */}
      <div className="bg-white px-4 py-3 mb-4">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              selectedCategory === null
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {Object.entries(CATEGORY_NAMES).map(([key, name]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                selectedCategory === key
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ列表 */}
      <div className="px-4 pb-4 space-y-4">
        {Object.entries(groupedFAQs).map(([category, faqs]) => (
          <div key={category} className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]}
            </h2>
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-4 py-4 flex items-start justify-between hover:bg-gray-50 transition"
                >
                  <span className="text-left font-medium text-gray-800 flex-1">
                    {faq.question}
                  </span>
                  {expandedId === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
                  )}
                </button>
                {expandedId === faq.id && (
                  <div className="px-4 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>没有找到相关问题</p>
            <p className="text-sm mt-2">试试其他关键词或联系客服</p>
          </div>
        )}
      </div>

      {/* 联系客服区域 */}
      <div className="bg-white mx-4 mb-6 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">还有问题？联系我们</h3>
        <div className="space-y-3">
          {/* QQ客服 */}
          <a
            href="mqqwpa://im/chat?chat_type=wpa&uin=123456789&version=1&src_type=web"
            className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-800">QQ客服</div>
                <div className="text-sm text-gray-600">点击咨询</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">→</div>
          </a>

          {/* 微信客服 */}
          <button
            onClick={() => {
              // 复制微信号到剪贴板
              navigator.clipboard.writeText('sugarsmart_ai');
              alert('微信号已复制：sugarsmart_ai\n请打开微信添加好友');
            }}
            className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">微信客服</div>
                <div className="text-sm text-gray-600">sugarsmart_ai</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">复制</div>
          </button>

          {/* 邮箱支持 */}
          <a
            href="mailto:support@sugarsmart.ai"
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-800">邮箱支持</div>
                <div className="text-sm text-gray-600">support@sugarsmart.ai</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">→</div>
          </a>
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">
          工作时间：周一至周五 9:00-18:00
        </p>
      </div>
    </div>
  );
};

export default HelpCenter;
