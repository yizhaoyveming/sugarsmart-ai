
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { UserProfile, Gender, DiabetesType, MealPlan, Recipe, BloodGlucoseRecord, calculateBMI, getBMIStatus, calculateCalorieData, RecipeCard } from '@sugarsmart/shared';
import { api } from './services/apiClient';
import DataPage from './pages/DataPage';
import AuthPage from './pages/AuthPage';
import EditProfilePage from './pages/EditProfilePage';
import AddGlucoseRecordPage from './pages/AddGlucoseRecordPage';
import { 
  ChefHat, 
  Activity, 
  Utensils, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Home, 
  User, 
  ArrowRight,
  Info,
  Heart,
  Share2,
  AlertCircle,
  Droplets,
  Scale,
  Calendar,
  Trash2,
  Plus,
  PenTool,
  Sparkles,
  X,
  Edit2,
  HelpCircle,
  FileText,
  BarChart3
} from 'lucide-react';

// Import new components
import HelpCenter from './components/HelpCenter';
import ShareModal from './components/ShareModal';

// Import UI Components
import { 
  ErrorBoundary,
  useToast
} from './components/UIComponents';

// --- Translation Mappings ---
const TRANSLATIONS = {
  gender: {
    'Male': '男',
    'Female': '女'
  },
  stapleFood: {
    'Rice': '米饭',
    'Bread': '面包',
    'Noodles': '面条',
    'Oats': '燕麦',
    'Potato': '土豆'
  },
  allergies: {
    'Peanuts': '花生',
    'Seafood': '海鲜',
    'Dairy': '乳制品',
    'Gluten': '麸质',
    'Eggs': '鸡蛋'
  },
  diabetesType: {
    'Type 1': '1型',
    'Type 2': '2型',
    'Pre-diabetes': '糖尿病前期',
    'Gestational': '妊娠期'
  },
  nutrition: {
    'Calories': '卡路里',
    'Carbs': '碳水',
    'Protein': '蛋白质',
    'Fat': '脂肪'
  }
};

// --- Context ---

interface AppContextType {
  // 认证相关
  isAuthenticated: boolean;
  currentUser: {
    id: string;
    username: string;
    nickname: string;
  } | null;
  token: string | null;
  login: (userId: string, username: string, nickname: string, token: string) => void;
  logout: () => void;
  
  // 用户档案
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  
  // 饮食计划
  mealPlan: MealPlan | null;
  setMealPlan: (plan: MealPlan) => void;
  savedRecipes: Recipe[];
  toggleSaveRecipe: (recipe: Recipe) => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
  addRecipeToPlan: (recipe: Recipe) => void;
  updateRecipeInPlan: (updatedRecipe: Recipe) => void;
  removeRecipeFromPlan: (recipeId: string) => void;
  
  // 血糖记录
  glucoseRecords: BloodGlucoseRecord[];
  addGlucoseRecord: (record: Omit<BloodGlucoseRecord, 'id'>) => void;
  deleteGlucoseRecord: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

// --- Helper Components ---

const Button: React.FC<{ 
  onClick?: () => void, 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost', 
  className?: string,
  children: React.ReactNode,
  disabled?: boolean,
  type?: 'button' | 'submit' | 'reset'
}> = ({ onClick, variant = 'primary', className = '', children, disabled, type = 'button' }) => {
  const baseStyle = "w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2";
  const variants = {
    primary: "bg-brand-orange text-white hover:bg-orange-600 disabled:bg-orange-300",
    secondary: "bg-brand-green text-white hover:bg-green-700 disabled:bg-green-300",
    outline: "border-2 border-brand-green text-brand-green hover:bg-brand-light",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const InputRange: React.FC<{ label: string, value: number, min: number, max: number, unit: string, onChange: (val: number) => void }> = ({ label, value, min, max, unit, onChange }) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="text-gray-700 font-medium">{label}</span>
      <span className="text-brand-green font-bold">{value} <span className="text-xs text-gray-500 font-normal">{unit}</span></span>
    </div>
    <input 
      type="range" min={min} max={max} value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
    />
  </div>
);

const FilterChip: React.FC<{ label: string, selected: boolean, onClick: () => void }> = ({ label, selected, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selected ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
  >
    {label}
  </button>
);

const NavLink: React.FC<{ to: string, icon: React.ReactNode, label: string, active: boolean }> = ({ to, icon, label, active }) => (
  <Link to={to} className={`flex flex-col items-center space-y-1 ${active ? 'text-brand-green' : 'text-gray-400'}`}>
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

const NutritionItem: React.FC<{ value: number, unit: string, label: string }> = ({ value, unit, label }) => (
  <div>
    <div className="font-bold text-gray-800 text-lg">{value}<span className="text-xs font-normal text-gray-400">{unit}</span></div>
    <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
  </div>
);

const MenuButton: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
  <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50">
    <div className="flex items-center space-x-3 text-gray-700">
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
    <ChevronRight size={16} className="text-gray-400" />
  </button>
);

// --- Layout ---

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { userProfile } = useAppContext();
  const showNav = ['/home', '/result', '/data', '/mine'].includes(location.pathname) || (location.pathname === '/' && !!userProfile);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full bg-white min-h-screen shadow-xl relative flex flex-col">
        <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
          {children}
        </main>
        
        {showNav && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] flex justify-around py-3 px-1 z-50" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
            <NavLink to="/" icon={<Home size={22} />} label="首页" active={location.pathname === '/'} />
            <NavLink to="/result" icon={<Calendar size={22} />} label="计划" active={location.pathname.startsWith('/result')} />
            <NavLink to="/data" icon={<BarChart3 size={22} />} label="数据" active={location.pathname === '/data'} />
            <NavLink to="/mine" icon={<User size={22} />} label="我的" active={location.pathname === '/mine'} />
          </nav>
        )}
      </div>
    </div>
  );
};

// --- Pages ---

const LandingView: React.FC = () => {
  const navigate = useNavigate();
  const [basicInfo, setBasicInfo] = useState({
    gender: Gender.Male,
    age: 50,
    height: 170,
    weight: 70
  });

  const handleNext = () => {
    navigate('/input', { state: { basicInfo } });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-brand-green to-emerald-700 text-white p-8 pb-16 rounded-b-[40px] shadow-lg relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
          <ChefHat size={180} />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold mb-2">智糖管家 AI</h1>
          <p className="text-brand-light text-lg">您的专属糖尿病营养师</p>
        </div>
      </div>

      {/* Basic Information Form */}
      <div className="px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-800 text-center mb-4">让我们开始吧</h2>
          
          <div className="space-y-4">
            <div>
              <span className="text-gray-700 font-medium block mb-2">性别</span>
              <div className="flex space-x-3">
                {Object.values(Gender).map(g => (
                  <button
                    key={g}
                    onClick={() => setBasicInfo(prev => ({ ...prev, gender: g }))}
                    className={`flex-1 py-3 rounded-lg border text-sm font-semibold transition-colors ${basicInfo.gender === g ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600'}`}
                  >
                    {TRANSLATIONS.gender[g as keyof typeof TRANSLATIONS.gender]}
                  </button>
                ))}
              </div>
            </div>

            <InputRange label="年龄" value={basicInfo.age} min={18} max={90} unit="岁" onChange={v => setBasicInfo(prev => ({ ...prev, age: v }))} />
            <InputRange label="身高" value={basicInfo.height} min={140} max={220} unit="cm" onChange={v => setBasicInfo(prev => ({ ...prev, height: v }))} />
            <InputRange label="体重" value={basicInfo.weight} min={40} max={150} unit="kg" onChange={v => setBasicInfo(prev => ({ ...prev, weight: v }))} />
          </div>

          <div className="pt-2">
            <Button onClick={handleNext}>
              <span>下一步：健康详情</span>
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 px-6 text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
             <Activity size={16} className="text-brand-green" />
             <span>临床认证算法</span>
          </div>
          <p className="text-xs text-gray-400">© 2024 智糖管家 AI. 隐私政策</p>
      </div>
    </div>
  );
};

const DashboardView: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const navigate = useNavigate();
  const { savedRecipes, mealPlan } = useAppContext();
  
  // Calculate BMI using utility function
  const bmi = calculateBMI(profile.height, profile.weight);
  const { status: bmiStatus, color: bmiColor } = getBMIStatus(bmi);
  
  // Calculate calorie data dynamically
  const { target, consumed, remaining } = calculateCalorieData(profile, mealPlan);

  const tips = [
    { icon: <Droplets className="text-blue-500" size={20} />, text: "保持水分充足！今天至少喝 8 杯水。" },
    { icon: <Activity className="text-brand-green" size={20} />, text: "午餐后尝试散步 15 分钟，有助于降低血糖。" },
    { icon: <Utensils className="text-brand-orange" size={20} />, text: `记得在晚餐中加入富含纤维的食物。` }
  ];

  const tipIndex = profile.age % tips.length;
  const dailyTip = tips[tipIndex];

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-8">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 pb-12 rounded-b-[30px] shadow-lg relative overflow-hidden">
        {/* 装饰背景元素 */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-6">
           {/* Left: Title Only (隐藏logo) */}
           <div className="flex items-center space-x-2.5">
              {/* 标题 */}
              <h1 className="text-xl font-bold tracking-wide">智糖管家</h1>
           </div>
           
           {/* Right: Share Button */}
           <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Share2 size={18} />
           </div>
        </div>

        <div className="relative z-10 flex justify-around text-center">
           <div>
              <div className="text-brand-light text-xs uppercase tracking-wider mb-1">今日已摄入</div>
              <div className="text-xl font-bold">{consumed} <span className="text-xs font-normal">千卡</span></div>
           </div>
           <div className="w-[1px] bg-white/20 h-10"></div>
           <div>
              <div className="text-brand-light text-xs uppercase tracking-wider mb-1">还能吃</div>
              <div className="text-xl font-bold">{remaining} <span className="text-xs font-normal">千卡</span></div>
           </div>
           <div className="w-[1px] bg-white/20 h-10"></div>
           <div>
              <div className="text-brand-light text-xs uppercase tracking-wider mb-1">今日目标</div>
              <div className="text-xl font-bold">{target} <span className="text-xs font-normal">千卡</span></div>
           </div>
        </div>
      </div>

      {/* Health Status Cards */}
      <div className="px-6 -mt-8 grid grid-cols-2 gap-4 mb-6">
         <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] opacity-5">
              <Scale size={80} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium">BMI 指数</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{bmi.toFixed(1)}</h3>
            </div>
            <div className={`self-start px-2 py-1 rounded-full text-xs font-bold ${bmiColor}`}>
               {bmiStatus}
            </div>
         </div>
         <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] opacity-5">
              <Activity size={80} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium">空腹血糖</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{profile.fastingGlucose || '--'}</h3>
            </div>
            <div className="self-start px-2 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
               最近记录
            </div>
         </div>
      </div>

      {/* Recent Changes / Suggestions */}
      <div className="px-6 space-y-6">
        <div>
           <h3 className="font-bold text-gray-800 mb-3 flex items-center">
             <AlertCircle className="mr-2 text-brand-green" size={18} /> 每日建议
           </h3>
           <div className="bg-gradient-to-r from-brand-light to-white p-5 rounded-xl border border-green-100 flex items-start space-x-4 shadow-sm">
              <div className="bg-white p-2 rounded-full shadow-sm text-brand-green">
                {dailyTip.icon}
              </div>
              <div>
                 <p className="text-sm text-gray-700 font-medium leading-relaxed">
                   "{dailyTip.text}"
                 </p>
                 <p className="text-xs text-gray-400 mt-2">基于您的健康数据</p>
              </div>
           </div>
        </div>
        
        {/* Favorites Section on Home */}
        <div>
          <div className="flex justify-between items-center mb-3">
             <h3 className="font-bold text-gray-800 flex items-center">
               <Heart className="mr-2 text-red-500" size={18} /> 我的收藏
             </h3>
             {savedRecipes.length > 0 && (
               <span className="text-xs text-brand-green font-medium cursor-pointer" onClick={() => navigate('/mine')}>查看全部</span>
             )}
          </div>
          
          {savedRecipes.length > 0 ? (
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {savedRecipes.slice(0, 5).map((recipe, idx) => (
                <div key={idx} onClick={() => navigate('/detail', { state: { recipe } })} className="min-w-[140px] w-[140px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all transform hover:scale-105">
                  <div className="h-24 w-full bg-gray-200">
                     <img src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.mealType + recipe.name.length}/200/200`} className="w-full h-full object-cover" alt={recipe.name} />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-gray-800 text-xs line-clamp-2 h-8">{recipe.name}</h4>
                    <div className="flex items-center mt-2 space-x-1">
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{recipe.nutrition.giLevel} GI</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl border border-dashed border-red-200 p-6 text-center animate-fadeIn">
              <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3">
                <Heart className="text-red-400" size={24} />
              </div>
              <p className="text-sm text-gray-600 font-medium mb-1">还没有收藏的食谱</p>
              <p className="text-xs text-gray-400 mb-3">开始探索并收藏您喜欢的健康食谱</p>
              <Button variant="outline" className="mt-2 text-xs py-2" onClick={() => navigate('/result')}>
                <Sparkles size={14} />
                <span>探索食谱</span>
              </Button>
            </div>
          )}
        </div>

        <Button onClick={() => navigate('/result')} className="shadow-lg shadow-orange-200">查看今日饮食计划</Button>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { userProfile } = useAppContext();
  return userProfile ? <DashboardView profile={userProfile} /> : <LandingView />;
};

const InputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserProfile, setIsGenerating, setMealPlan, userProfile } = useAppContext();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Merge basic info from location state or existing profile, or fallback to defaults
  const basicInfo = location.state?.basicInfo || {
    gender: userProfile?.gender || Gender.Male,
    age: userProfile?.age || 50,
    height: userProfile?.height || 170,
    weight: userProfile?.weight || 70,  };

  const [formData, setFormData] = useState<UserProfile>({
    ...basicInfo,
    diabetesType: userProfile?.diabetesType || DiabetesType.Type2,
    fastingGlucose: userProfile?.fastingGlucose || '',
    medication: userProfile?.medication || '',
    stapleFood: userProfile?.stapleFood || [],
    allergies: userProfile?.allergies || [],
    mealsPerDay: userProfile?.mealsPerDay || 3,
    specialRequests: userProfile?.specialRequests || ''
  });

  const updateField = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleArrayItem = (field: 'stapleFood' | 'allergies', value: string) => {
    setFormData(prev => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value]
      };
    });
  };

  const validateStep1 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate fasting glucose if provided
    if (formData.fastingGlucose && formData.fastingGlucose.trim() !== '') {
      const glucose = parseFloat(formData.fastingGlucose);
      if (isNaN(glucose)) {
        newErrors.fastingGlucose = '请输入有效的数字';
      } else if (glucose < 3.0 || glucose > 15.0) {
        newErrors.fastingGlucose = '血糖值应在 3.0-15.0 mmol/L 之间';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate at least one staple food is selected
    if (formData.stapleFood.length === 0) {
      newErrors.stapleFood = '请至少选择一种主食偏好';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      return;
    }

    setUserProfile(formData);
    setIsGenerating(true);
    navigate('/result'); 
    
    try {
      // 使用API客户端调用后端生成饮食计划
      const response = await api.generateMealPlan(formData);
      if (response.success && response.data) {
        setMealPlan(response.data);
      } else {
        throw new Error(response.error?.message || '生成饮食计划失败');
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "生成饮食计划失败，请重试");
      navigate('/input');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/')} className="p-2 text-gray-600">
          <ChevronLeft />
        </button>
        <div className="flex space-x-2">
          {[1, 2].map(i => (
            <div key={i} className={`h-2 w-8 rounded-full transition-colors ${step >= i ? 'bg-brand-green' : 'bg-gray-200'}`} />
          ))}
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {step === 1 && "糖尿病档案"}
          {step === 2 && "饮食偏好"}
        </h2>

        {/* Step 1: Diabetes */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
             <div className="bg-white p-5 rounded-xl shadow-sm space-y-4">
               <label className="block">
                  <span className="text-gray-700 font-medium mb-2 block">糖尿病类型</span>
                  <select 
                    value={formData.diabetesType}
                    onChange={(e) => updateField('diabetesType', e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                  >
                    {Object.values(DiabetesType).map(t => (
                      <option key={t} value={t}>{TRANSLATIONS.diabetesType[t as keyof typeof TRANSLATIONS.diabetesType]}</option>
                    ))}
                  </select>
               </label>

               <label className="block">
                 <span className="text-gray-700 font-medium mb-2 block">近期空腹血糖 (mmol/L)</span>
                 <input 
                    type="text" 
                    placeholder="例如：5.5"
                    className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition-colors ${
                      errors.fastingGlucose 
                        ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                        : 'border-gray-300 focus:ring-brand-green'
                    }`}
                    value={formData.fastingGlucose}
                    onChange={(e) => updateField('fastingGlucose', e.target.value)}
                 />
                 {errors.fastingGlucose && (
                   <div className="flex items-center mt-2 text-red-600 text-sm">
                     <AlertCircle size={14} className="mr-1" />
                     <span>{errors.fastingGlucose}</span>
                   </div>
                 )}
               </label>

               <label className="block">
                 <span className="text-gray-700 font-medium mb-2 block">当前用药（可选）</span>
                 <input 
                    type="text" 
                    placeholder="例如：二甲双胍"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                    value={formData.medication}
                    onChange={(e) => updateField('medication', e.target.value)}
                 />
               </label>
             </div>
          </div>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
             <div className="bg-white p-5 rounded-xl shadow-sm space-y-6">
                <div>
                   <span className="text-gray-700 font-medium mb-3 block">主食偏好</span>
                   <div className="flex flex-wrap gap-2">
                      {['Rice', 'Bread', 'Noodles', 'Oats', 'Potato'].map(food => (
                        <FilterChip 
                          key={food} 
                          label={TRANSLATIONS.stapleFood[food as keyof typeof TRANSLATIONS.stapleFood]} 
                          selected={formData.stapleFood.includes(food)} 
                          onClick={() => toggleArrayItem('stapleFood', food)} 
                        />
                      ))}
                   </div>
                   {errors.stapleFood && (
                     <div className="flex items-center mt-2 text-red-600 text-sm">
                       <AlertCircle size={14} className="mr-1" />
                       <span>{errors.stapleFood}</span>
                     </div>
                   )}
                </div>

                <div>
                   <span className="text-gray-700 font-medium mb-3 block">过敏/忌口</span>
                   <div className="flex flex-wrap gap-2">
                      {['Peanuts', 'Seafood', 'Dairy', 'Gluten', 'Eggs'].map(food => (
                        <FilterChip 
                          key={food} 
                          label={TRANSLATIONS.allergies[food as keyof typeof TRANSLATIONS.allergies]} 
                          selected={formData.allergies.includes(food)} 
                          onClick={() => toggleArrayItem('allergies', food)} 
                        />
                      ))}
                   </div>
                </div>

                <label className="block">
                 <span className="text-gray-700 font-medium mb-2 block">特殊要求？</span>
                 <textarea 
                    placeholder="例如：我更喜欢素食早餐..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none h-24 resize-none"
                    value={formData.specialRequests}
                    onChange={(e) => updateField('specialRequests', e.target.value)}
                 />
               </label>
             </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-8">
        {step < 2 ? (
          <Button onClick={handleNext}>下一步</Button>
        ) : (
          <Button onClick={handleSubmit} variant="primary">生成饮食计划</Button>
        )}
      </div>
    </div>
  );
};

// --- Modal Component ---

const PRESET_FOODS = [
  { name: '燕麦莓果碗', calories: 150 },
  { name: '希腊酸奶杯', calories: 180 },
  { name: '水煮蛋吐司', calories: 220 },
  { name: '烤鸡肉沙拉', calories: 350 },
  { name: '藜麦碗', calories: 320 },
  { name: '蔬菜炒杂菜', calories: 280 },
  { name: '烤三文鱼配芦笋', calories: 450 },
  { name: '苹果片', calories: 80 },
  { name: '坚果一小把', calories: 160 },
  { name: '绿色果蔬汁', calories: 120 }
];

const AddOrEditItemModal: React.FC<{
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: Recipe;
  onClose: () => void;
  onAutoGenerate?: (time: string) => void;
  onManualSubmit: (name: string, calories: number, time: string) => void;
}> = ({ isOpen, mode, initialData, onClose, onAutoGenerate, onManualSubmit }) => {
  const [view, setView] = useState<'choice' | 'time' | 'food'>('choice');
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [selectedFood, setSelectedFood] = useState<typeof PRESET_FOODS[0] | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setView('time'); // Skip choice for edit
        setSelectedTime(initialData.time);
        setSelectedFood({ name: initialData.name, calories: initialData.nutrition.calories });
      } else {
        setView('choice');
        setSelectedTime('08:00');
        setSelectedFood(null);
      }
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (view === 'time') setView('food');
    else if (view === 'food' && selectedFood) {
      onManualSubmit(selectedFood.name, selectedFood.calories, selectedTime);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl relative animate-slideUp">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {mode === 'edit' ? '编辑项目' : '添加到计划'}
        </h3>
        
        {view === 'choice' && (
           <>
             <p className="text-gray-500 text-sm mb-6">您想如何添加此项目？</p>
             <div className="space-y-3">
              <button
                onClick={() => setView('time')}
                className="w-full flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all group"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm text-gray-700 group-hover:text-brand-green mr-4">
                  <PenTool size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">手动添加</div>
                  <div className="text-xs text-gray-500">从常见食物中选择</div>
                </div>
                <ChevronRight className="ml-auto text-gray-300" />
              </button>

              <button
                onClick={() => {
                   if (onAutoGenerate) {
                     onAutoGenerate('12:00'); // Default time for auto, user can edit later
                     onClose();
                   }
                }}
                className="w-full flex items-center p-4 bg-brand-light/50 hover:bg-brand-light rounded-xl border border-green-100 transition-all group"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm text-brand-green mr-4">
                  <Sparkles size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">一键 AI</div>
                  <div className="text-xs text-gray-500">让 AI 为您推荐健康选项</div>
                </div>
                <ChevronRight className="ml-auto text-green-300" />
              </button>
            </div>
           </>
        )}

        {view === 'time' && (
          <div className="space-y-6">
            <p className="text-gray-500 text-sm">您计划什么时候吃？</p>
            <div className="flex justify-center">
              <input 
                type="time" 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="text-4xl font-bold text-brand-green bg-gray-50 p-4 rounded-xl border-2 border-brand-green/20 focus:border-brand-green outline-none"
              />
            </div>
            <Button onClick={handleNext}>下一步：选择食物</Button>
          </div>
        )}

        {view === 'food' && (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">选择食物：</p>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {PRESET_FOODS.map((food, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFood(food)}
                  className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${
                    selectedFood?.name === food.name 
                    ? 'border-brand-green bg-brand-light text-brand-green' 
                    : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{food.name}</span>
                  <span className="text-xs text-gray-400">{food.calories} kcal</span>
                </button>
              ))}
            </div>
             <div className="pt-2 flex gap-3">
              <Button variant="ghost" onClick={() => setView('time')} className="w-1/3">返回</Button>
              <Button 
                disabled={!selectedFood} 
                onClick={handleNext} 
                className="w-2/3"
              >
                {mode === 'edit' ? '保存更改' : '添加项目'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ResultPage: React.FC = () => {
  const { isGenerating, mealPlan, setMealPlan, userProfile, setIsGenerating, addRecipeToPlan, updateRecipeInPlan, removeRecipeFromPlan } = useAppContext();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);

  const handleManualSubmit = (name: string, calories: number, time: string) => {
    if (editRecipe) {
      // Edit Mode
      updateRecipeInPlan({
        ...editRecipe,
        name,
        time,
        nutrition: { ...editRecipe.nutrition, calories }
      });
      setEditRecipe(null);
    } else {
      // Add Mode
      const manualRecipe: Recipe = {
        id: Date.now().toString(),
        name: name,
        mealType: 'Snack', // Default, logic can infer from time
        time: time,
        description: 'Manually added item',
        ingredients: [],
        steps: ['Enjoy your meal!'],
        nutrition: {
          calories: calories,
          carbs: 0,
          protein: 0,
          fat: 0,
          giLevel: 'Medium'
        },
        tips: 'Remember to track your portion sizes.'
      };
      addRecipeToPlan(manualRecipe);
    }
    setIsModalOpen(false);
  };

  const handleAutoGenerate = async () => {
    if (!userProfile) return;
    try {
      const result = await api.generateSingleRecipe(userProfile, 'Snack');
      if (result.success && result.data) {
        const recipe = result.data;
        const now = new Date();
        recipe.time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        addRecipeToPlan(recipe);
      } else {
        alert('生成失败，请重试');
      }
    } catch(e) {
      console.error(e);
      alert('生成失败，请重试');
    }
  };

  const openEdit = (recipe: Recipe) => {
    setEditRecipe(recipe);
    setIsModalOpen(true);
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-white px-8 text-center space-y-8 animate-fadeIn">
        <div className="relative">
          {/* Outer pulse ring */}
          <div className="absolute inset-0 w-32 h-32 -left-4 -top-4">
            <div className="w-full h-full border-4 border-brand-green/20 rounded-full animate-ping"></div>
          </div>
          
          {/* Main spinner */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-brand-light rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-green rounded-full border-t-transparent animate-spin"></div>
            <ChefHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-brand-green animate-pulse" size={32} />
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-pulse">分析档案中...</h2>
          <p className="text-gray-600 max-w-sm leading-relaxed">我们的 AI 正在平衡您的血糖指数和营养需求，为您打造完美的饮食计划。</p>
          
          {/* Loading steps */}
          <div className="mt-6 space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2 animate-fadeIn">
              <Loader2 className="animate-spin" size={14} />
              <span>分析健康数据...</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  if (!mealPlan || mealPlan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-gray-50 to-white animate-fadeIn">
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-sm">
           <div className="mb-6">
             <div className="w-20 h-20 mx-auto bg-brand-light rounded-full flex items-center justify-center mb-4">
               <Calendar size={40} className="text-brand-green" />
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-2">还没有饮食计划</h3>
             <p className="text-gray-500 text-sm leading-relaxed">
               让我们根据您的健康状况，为您创建个性化的营养计划吧！
             </p>
           </div>
           
           <div className="space-y-3 mb-6">
             <div className="flex items-center text-left space-x-3 p-3 bg-gray-50 rounded-lg">
               <Activity className="text-brand-green flex-shrink-0" size={20} />
               <span className="text-sm text-gray-600">基于您的糖尿病类型定制</span>
             </div>
             <div className="flex items-center text-left space-x-3 p-3 bg-gray-50 rounded-lg">
               <Utensils className="text-brand-orange flex-shrink-0" size={20} />
               <span className="text-sm text-gray-600">营养均衡的美味食谱</span>
             </div>
           </div>
           
           <Button onClick={async () => {
             if (userProfile) {
               // 有资料：直接生成
               setIsGenerating(true);
               try {
                 const result = await api.generateMealPlan(userProfile);
                 if (result.success && result.data) {
                   setMealPlan(result.data);
                 } else {
                   alert('生成失败，请重试');
                 }
               } catch (error) {
                 console.error(error);
                 alert("生成失败，请重试");
               } finally {
                 setIsGenerating(false);
               }
             } else {
               // 无资料：跳转填写
               navigate('/input');
             }
           }} className="w-full shadow-md">
             <Sparkles size={18} />
             <span>开始创建计划</span>
           </Button>
         </div>
      </div>
    );
  }

  // Smart Sort: Sort by Time
  const sortedPlan = [...mealPlan].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800">今日食谱</h2>
        <p className="text-sm text-gray-500">{new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Timeline Content */}
      <div className="p-6 space-y-0 relative">
        {/* Vertical Line */}
        <div className="absolute left-[88px] top-6 bottom-0 w-[2px] bg-gray-200 z-0 hidden sm:block"></div>

        {sortedPlan.map((recipe, index) => (
          <div key={recipe.id || index} className="relative z-10 flex flex-col sm:flex-row gap-4 mb-8 animate-fadeIn">
            
            {/* Time Column */}
            <div className="sm:w-24 flex-shrink-0 flex items-center sm:flex-col sm:items-end">
               <div className="flex items-center text-gray-800 font-bold text-lg">
                  {recipe.time}
               </div>
            </div>

            {/* Content Column */}
            <div className="flex-1">
                 <RecipeCard 
                  recipe={recipe} 
                  onDelete={() => removeRecipeFromPlan(recipe.id)}
                  onEdit={() => openEdit(recipe)}
                 />
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <div className="absolute bottom-24 right-6 z-40">
        <button 
          onClick={() => { setEditRecipe(null); setIsModalOpen(true); }}
          className="w-14 h-14 bg-brand-orange text-white rounded-full shadow-lg shadow-orange-200 flex items-center justify-center hover:bg-orange-600 transition-colors"
        >
          <Plus size={28} />
        </button>
      </div>

      {/* Modal for adding/editing items */}
      <AddOrEditItemModal 
        isOpen={isModalOpen}
        mode={editRecipe ? 'edit' : 'add'}
        initialData={editRecipe || undefined}
        onClose={() => setIsModalOpen(false)}
        onAutoGenerate={handleAutoGenerate}
        onManualSubmit={handleManualSubmit}
      />
    </div>
  );
};

const DetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe as Recipe;
  const { toggleSaveRecipe, savedRecipes } = useAppContext();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  if (!recipe) return <div className="p-10 text-center">未找到食谱。<Link to="/" className="text-brand-green underline">返回首页</Link></div>;

  const isSaved = savedRecipes.some(r => r.name === recipe.name);
  
  const recipeImageUrl = recipe.imageUrl || `https://picsum.photos/seed/${recipe.mealType + recipe.name.length}/600/400`;
  
  const shareContent = {
    title: `${recipe.name} - 智糖管家AI`,
    description: `${recipe.description || '健康美味的糖尿病友好食谱'} | GI: ${recipe.nutrition.giLevel} | ${recipe.nutrition.calories}千卡`,
    imageUrl: recipeImageUrl
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Image */}
      <div className="relative h-64 w-full">
        <img src={recipeImageUrl} className="w-full h-full object-cover" alt={recipe.name} />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/50">
          <ChevronLeft size={24} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
          <h1 className="text-2xl font-bold text-white mb-1">{recipe.name}</h1>
          <div className="flex items-center space-x-3 text-white/90 text-sm">
             <span className="bg-brand-green px-2 py-0.5 rounded text-xs">{recipe.nutrition.giLevel} GI</span>
             <span>•</span>
             <span>{recipe.time}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-8">
        
        {/* Nutrition Bar */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between text-center">
           <NutritionItem value={recipe.nutrition.calories} unit="kcal" label={TRANSLATIONS.nutrition['Calories']} />
           <div className="w-[1px] bg-gray-200"></div>
           <NutritionItem value={recipe.nutrition.carbs} unit="g" label={TRANSLATIONS.nutrition['Carbs']} />
           <div className="w-[1px] bg-gray-200"></div>
           <NutritionItem value={recipe.nutrition.protein} unit="g" label={TRANSLATIONS.nutrition['Protein']} />
           <div className="w-[1px] bg-gray-200"></div>
           <NutritionItem value={recipe.nutrition.fat} unit="g" label={TRANSLATIONS.nutrition['Fat']} />
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Utensils size={18} className="mr-2 text-brand-green" /> 食材
          </h3>
          {recipe.ingredients.length > 0 ? (
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                  <span className="text-gray-700">{ing.name}</span>
                  <span className="font-semibold text-gray-500">{ing.amount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic text-sm">暂无食材列表</p>
          )}
        </div>

        {/* Steps */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <ChefHat size={18} className="mr-2 text-brand-green" /> 步骤
          </h3>
          <div className="space-y-6">
            {recipe.steps.length > 0 ? (
              recipe.steps.map((step, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-light text-brand-green flex items-center justify-center font-bold text-xs mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{step}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic text-sm">暂无步骤说明</p>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
           <h4 className="font-bold text-blue-800 mb-1 flex items-center text-sm"><Info size={14} className="mr-1"/> 糖尿病小贴士</h4>
           <p className="text-sm text-blue-700">{recipe.tips}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button variant="outline" onClick={() => toggleSaveRecipe(recipe)}>
            <Heart size={18} className={`mr-2 ${isSaved ? "fill-brand-green" : ""}`} /> 
            {isSaved ? "已收藏" : "收藏"}
          </Button>
          <Button onClick={() => setIsShareModalOpen(true)}>
             <Share2 size={18} className="mr-2" /> 分享
          </Button>
        </div>
      </div>
      
      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareContent={shareContent}
      />
    </div>
  );
};

const MinePage: React.FC = () => {
  const { userProfile, savedRecipes, toggleSaveRecipe, currentUser, logout, setUserProfile } = useAppContext();
  const navigate = useNavigate();

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    // TODO: 调用API保存到后端
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
       {/* User Profile Header - 可点击区域 */}
       <div className="bg-white p-6 pb-10 rounded-b-[30px] shadow-sm">
         <button 
           onClick={() => navigate('/edit-profile')}
           className="w-full flex items-center space-x-4 text-left hover:bg-gray-50 -m-2 p-2 rounded-xl transition-colors"
         >
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-green flex-shrink-0">
              <User size={32} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-800">
                {currentUser ? currentUser.nickname : '我的资料'}
              </h2>
              <p className="text-sm text-gray-500">
                {currentUser ? '尚未绑定手机号' : '点击完善个人信息'}
              </p>
            </div>
            <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
         </button>
       </div>

       <div className="p-6 space-y-6">
          {/* Favorites Section - Full Display */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
              <Heart size={20} className="mr-2 text-red-500" /> 收藏的食谱
              <span className="ml-2 text-sm font-normal text-gray-400">({savedRecipes.length})</span>
            </h3>
            {savedRecipes.length > 0 ? (
              <div className="space-y-3">
                {savedRecipes.map((recipe, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => navigate('/detail', { state: { recipe } })}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex">
                      {/* Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.mealType + recipe.name.length}/200/200`} 
                          className="w-full h-full object-cover" 
                          alt={recipe.name} 
                        />
                      </div>
                      {/* Content */}
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{recipe.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              recipe.nutrition.giLevel === 'Low' ? 'bg-green-100 text-green-700' :
                              recipe.nutrition.giLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {recipe.nutrition.giLevel === 'Low' ? '低' : recipe.nutrition.giLevel === 'Medium' ? '中' : '高'} GI
                            </span>
                            <span className="text-[10px] text-gray-500">{recipe.nutrition.calories} 千卡</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              toggleSaveRecipe(recipe); 
                            }} 
                            className="text-red-500 hover:text-red-600 flex items-center space-x-1"
                          >
                            <Heart size={14} className="fill-red-500" />
                            <span className="text-xs">取消收藏</span>
                          </button>
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-3">
                  <Heart className="text-red-400" size={24} />
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1">还没有收藏的食谱</p>
                <p className="text-xs text-gray-400">在食谱详情页点击收藏按钮即可添加</p>
              </div>
            )}
          </div>

          {/* Other Section */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
              <Info size={20} className="mr-2 text-brand-green" /> 其他
            </h3>
            <div className="space-y-2">
               <button onClick={() => navigate('/help-center')} className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50">
                 <div className="flex items-center space-x-3 text-gray-700">
                   <HelpCircle size={18} />
                   <span className="font-medium text-sm">帮助中心</span>
                 </div>
                 <ChevronRight size={16} className="text-gray-400" />
               </button>
               <MenuButton icon={<FileText size={18} />} label="关于糖尿病饮食" />
               <MenuButton icon={<Share2 size={18} />} label="分享应用" />
            </div>
          </div>
       </div>
    </div>
  );
};

// --- App Root ---

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize toast system
  const { ToastContainer } = useToast();
  
  // Storage version control
  const STORAGE_VERSION = '1.0.0';
  const STORAGE_KEYS = {
    VERSION: 'sugarsmart_version',
    AUTH_TOKEN: 'sugarsmart_auth_token',
    CURRENT_USER: 'sugarsmart_current_user',
    USER_PROFILE: 'sugarsmart_user_profile_cache',
    MEAL_PLAN: 'sugarsmart_meal_plan_cache',
    SAVED_RECIPES: 'sugarsmart_saved_recipes_cache',
    GLUCOSE_RECORDS: 'sugarsmart_glucose_records_cache'
  };

  // Check and migrate storage if version mismatch
  const checkStorageVersion = () => {
    try {
      const currentVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
      if (currentVersion !== STORAGE_VERSION) {
        console.log(`Storage version mismatch. Migrating from ${currentVersion || 'unknown'} to ${STORAGE_VERSION}`);
        // Clear old data on version mismatch to prevent type errors
        Object.values(STORAGE_KEYS).forEach(key => {
          if (key !== STORAGE_KEYS.VERSION) {
            localStorage.removeItem(key);
          }
        });
        localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
        return true; // Indicates data was cleared
      }
      return false; // No migration needed
    } catch (error) {
      console.error('Error checking storage version:', error);
      return false;
    }
  };

  // Run version check on initialization
  useEffect(() => {
    const wasCleared = checkStorageVersion();
    if (wasCleared) {
      console.log('Storage cleared due to version upgrade');
    }
  }, []);

  // Safe data loader with validation
  const loadFromStorage = <T,>(key: string, defaultValue: T, validator?: (data: any) => boolean): T => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultValue;
      
      const parsed = JSON.parse(saved);
      
      // Optional validation
      if (validator && !validator(parsed)) {
        console.warn(`Invalid data format for ${key}, using default`);
        return defaultValue;
      }
      
      return parsed as T;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return defaultValue;
    }
  };

  // 认证状态初始化
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  });

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    username: string;
    nickname: string;
  } | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  });

  // Initialize state from localStorage with validation
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    return loadFromStorage<UserProfile | null>(
      STORAGE_KEYS.USER_PROFILE,
      null,
      (data) => data && typeof data.age === 'number' && typeof data.weight === 'number'
    );
  });

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(() => {
    return loadFromStorage<MealPlan | null>(
      STORAGE_KEYS.MEAL_PLAN,
      null,
      (data) => Array.isArray(data)
    );
  });

  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    return loadFromStorage<Recipe[]>(
      STORAGE_KEYS.SAVED_RECIPES,
      [],
      (data) => Array.isArray(data)
    );
  });

  const [glucoseRecords, setGlucoseRecords] = useState<BloodGlucoseRecord[]>(() => {
    return loadFromStorage<BloodGlucoseRecord[]>(
      STORAGE_KEYS.GLUCOSE_RECORDS,
      [],
      (data) => Array.isArray(data)
    );
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Safe save to localStorage with error boundaries
  const saveToStorage = (key: string, data: any) => {
    try {
      if (data === null || data === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded. Clearing old data...');
        // Clear saved recipes to free up space
        localStorage.removeItem(STORAGE_KEYS.SAVED_RECIPES);
        setSavedRecipes([]);
        // Retry save
        try {
          localStorage.setItem(key, JSON.stringify(data));
        } catch (retryError) {
          console.error('Failed to save even after clearing:', retryError);
        }
      } else {
        console.error(`Error saving ${key}:`, error);
      }
    }
  };

  // Save to localStorage whenever userProfile changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER_PROFILE, userProfile);
  }, [userProfile]);

  // Save to localStorage whenever mealPlan changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MEAL_PLAN, mealPlan);
  }, [mealPlan]);

  // Save to localStorage whenever savedRecipes changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SAVED_RECIPES, savedRecipes);
  }, [savedRecipes]);

  // Save to localStorage whenever glucoseRecords changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GLUCOSE_RECORDS, glucoseRecords);
  }, [glucoseRecords]);

  const toggleSaveRecipe = (recipe: Recipe) => {
    setSavedRecipes(prev => {
      const exists = prev.find(r => r.name === recipe.name);
      if (exists) return prev.filter(r => r.name !== recipe.name);
      return [...prev, recipe];
    });
  };

  const addRecipeToPlan = (recipe: Recipe) => {
    setMealPlan(prev => {
      const current = prev || [];
      return [...current, recipe];
    });
  };

  const updateRecipeInPlan = (updatedRecipe: Recipe) => {
    setMealPlan(prev => {
      if (!prev) return prev;
      return prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r);
    });
  };

  const removeRecipeFromPlan = (recipeId: string) => {
    setMealPlan(prev => {
      if (!prev) return prev;
      return prev.filter(r => r.id !== recipeId);
    });
  };

  const addGlucoseRecord = (record: Omit<BloodGlucoseRecord, 'id'>) => {
    const newRecord: BloodGlucoseRecord = {
      ...record,
      id: Date.now().toString()
    };
    setGlucoseRecords(prev => [...prev, newRecord]);
  };

  const deleteGlucoseRecord = (id: string) => {
    setGlucoseRecords(prev => prev.filter(r => r.id !== id));
  };

  // 数据加载方法：登录后加载用户数据
  const loadUserData = async (userId: string) => {
    // 加载用户档案（404是正常的，新用户还没有档案）
    try {
      const profile = await api.getUserProfile(userId);
      if (profile.success && profile.data) {
        setUserProfile(profile.data);
        console.log('✓ 用户档案加载成功');
      }
    } catch (error: any) {
      // 404是正常情况：新用户还没有创建档案
      if (error?.response?.status === 404 || error?.message?.includes('404')) {
        console.log('ℹ 用户档案未找到（新用户），将引导创建档案');
      } else {
        console.error('加载用户档案失败:', error);
      }
    }
    
    // 加载饮食计划（404是正常的，用户可能还没有生成计划）
    try {
      const plan = await api.getMealPlan(userId, new Date().toISOString().split('T')[0]);
      if (plan.success && plan.data) {
        setMealPlan(plan.data);
        console.log('✓ 饮食计划加载成功');
      }
    } catch (error: any) {
      // 404是正常情况：用户还没有生成今天的计划
      if (error?.response?.status === 404 || error?.message?.includes('404')) {
        console.log('ℹ 饮食计划未找到，用户可以稍后生成');
      } else {
        console.error('加载饮食计划失败:', error);
      }
    }
    
    // 加载收藏的食谱（注意：API返回的是食谱ID数组，这里暂时跳过）
    // TODO: 需要根据ID数组加载完整的Recipe对象
    // const favorites = await api.getFavorites();
    
    // 加载血糖记录
    // TODO: 等待后端API实现血糖记录端点
    // const now = new Date();
    // const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    // const endDate = now.toISOString();
    // const glucose = await api.getBloodGlucoseRecords(userId, startDate, endDate);
    // if (glucose.data) {
    //   setGlucoseRecords(glucose.data);
    // }
  };

  // 认证方法：登录
  const login = (userId: string, username: string, nickname: string, authToken: string) => {
    setCurrentUser({ id: userId, username, nickname });
    setToken(authToken);
    setIsAuthenticated(true);
    
    // 保存到localStorage
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ id: userId, username, nickname }));
    
    // 登录后加载用户数据
    loadUserData(userId);
  };

  // 认证方法：登出
  const logout = async () => {
    try {
      // 调用后端登出API
      await api.logout();
    } catch (error) {
      console.error('登出API调用失败:', error);
    }
    
    // 清除认证状态
    setCurrentUser(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // 清除所有缓存
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.MEAL_PLAN);
    localStorage.removeItem(STORAGE_KEYS.SAVED_RECIPES);
    localStorage.removeItem(STORAGE_KEYS.GLUCOSE_RECORDS);
    
    // 重置状态
    setUserProfile(null);
    setMealPlan(null);
    setSavedRecipes([]);
    setGlucoseRecords([]);
  };

  return (
    <AppContext.Provider value={{
      // 认证相关
      isAuthenticated,
      currentUser,
      token,
      login,
      logout,
      // 用户档案
      userProfile, 
      setUserProfile,
      // 饮食计划
      mealPlan, 
      setMealPlan,
      savedRecipes, 
      toggleSaveRecipe,
      isGenerating, 
      setIsGenerating,
      addRecipeToPlan, 
      updateRecipeInPlan, 
      removeRecipeFromPlan,
      // 血糖记录
      glucoseRecords,
      addGlucoseRecord,
      deleteGlucoseRecord
    }}>
      {children}
      
      {/* Toast notifications container */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        <ToastContainer />
      </div>
    </AppContext.Provider>
  );
};

// Wrapper components to access context
const DataPageRoute: React.FC = () => {
  const { glucoseRecords, addGlucoseRecord, deleteGlucoseRecord } = useAppContext();
  return (
    <DataPage
      glucoseRecords={glucoseRecords}
      onAddGlucoseRecord={addGlucoseRecord}
      onDeleteGlucoseRecord={deleteGlucoseRecord}
    />
  );
};

const EditProfilePageWrapper: React.FC = () => {
  const { userProfile, setUserProfile, logout } = useAppContext();
  
  if (!userProfile) {
    // 如果没有用户档案，跳转到引导页
    const navigate = useNavigate();
    useEffect(() => {
      navigate('/input');
    }, [navigate]);
    return null;
  }
  
  return (
    <EditProfilePage
      userProfile={userProfile}
      onSave={setUserProfile}
      onLogout={logout}
    />
  );
};

const AddGlucoseRecordPageWrapper: React.FC = () => {
  const { addGlucoseRecord } = useAppContext();
  return <AddGlucoseRecordPage onAddRecord={addGlucoseRecord} />;
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, login } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleAuthSuccess = (userId: string, username: string, nickname: string, token: string) => {
    login(userId, username, nickname, token);
    // 登录成功后跳转到首页
    navigate('/');
  };

  if (!isAuthenticated) {
    // 保存当前路径，登录后可以跳转回来
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return <>{children}</>;
};

// Auth Route Component (redirect if already authenticated)
const AuthRoute: React.FC = () => {
  const { isAuthenticated, login } = useAppContext();
  const navigate = useNavigate();

  const handleAuthSuccess = (userId: string, username: string, nickname: string, token: string) => {
    login(userId, username, nickname, token);
    navigate('/');
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return <AuthPage onAuthSuccess={handleAuthSuccess} />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <HashRouter>
          <Layout>
            <Routes>
              {/* 公开路由 */}
              <Route path="/auth" element={<AuthRoute />} />
              
              {/* 受保护的路由 */}
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/input" element={<ProtectedRoute><InputPage /></ProtectedRoute>} />
              <Route path="/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
              <Route path="/detail" element={<ProtectedRoute><DetailPage /></ProtectedRoute>} />
              <Route path="/data" element={<ProtectedRoute><DataPageRoute /></ProtectedRoute>} />
              <Route path="/data/add-glucose" element={
                <ProtectedRoute>
                  <AddGlucoseRecordPageWrapper />
                </ProtectedRoute>
              } />
              <Route path="/mine" element={<ProtectedRoute><MinePage /></ProtectedRoute>} />
              <Route path="/edit-profile" element={
                <ProtectedRoute>
                  <EditProfilePageWrapper />
                </ProtectedRoute>
              } />
              <Route path="/help-center" element={<ProtectedRoute><HelpCenter onBack={() => window.history.back()} /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </HashRouter>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
