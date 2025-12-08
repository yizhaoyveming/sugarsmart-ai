import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight, 
  User, 
  Users, 
  Activity,
  UtensilsCrossed,
  AlertTriangle,
  Clock,
  FileText,
  Check,
  X
} from 'lucide-react';
import { Gender, DiabetesType, UserProfile } from '@sugarsmart/shared';

interface EditProfilePageProps {
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onLogout: () => void;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ 
  userProfile, 
  onSave,
  onLogout 
}) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  
  // 弹窗状态
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showDiabetesDropdown, setShowDiabetesDropdown] = useState(false);
  const [showStapleFoodModal, setShowStapleFoodModal] = useState(false);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [showMealTimesModal, setShowMealTimesModal] = useState(false);
  const [showSpecialRequestsModal, setShowSpecialRequestsModal] = useState(false);
  
  // 临时编辑状态
  const [tempAge, setTempAge] = useState(profile.age);
  const [tempStapleFood, setTempStapleFood] = useState<string[]>(profile.stapleFood);
  const [tempAllergies, setTempAllergies] = useState<string[]>(profile.allergies);
  const [tempMealsPerDay, setTempMealsPerDay] = useState(profile.mealsPerDay);
  const [tempSpecialRequests, setTempSpecialRequests] = useState(profile.specialRequests);
  
  const [newStapleFoodInput, setNewStapleFoodInput] = useState('');
  const [newAllergyInput, setNewAllergyInput] = useState('');

  const handleSave = () => {
    onSave(profile);
    navigate(-1);
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      onLogout();
    }
  };

  // 年龄滚轮选择器（简化版）
  const AgePickerModal = () => (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setShowAgeModal(false)}>
      <div className="w-full bg-white rounded-t-3xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="text-center text-lg font-medium mb-4">选择年龄</div>
        <div className="max-h-60 overflow-y-auto">
          {Array.from({ length: 83 }, (_, i) => i + 18).map((age) => (
            <div
              key={age}
              className={`py-3 text-center cursor-pointer ${
                age === tempAge ? 'text-green-600 font-bold text-xl' : 'text-gray-600'
              }`}
              onClick={() => setTempAge(age)}
            >
              {age}岁
            </div>
          ))}
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => setShowAgeModal(false)}
            className="flex-1 py-3 border border-gray-300 rounded-lg"
          >
            取消
          </button>
          <button
            onClick={() => {
              setProfile({ ...profile, age: tempAge });
              setShowAgeModal(false);
            }}
            className="flex-1 py-3 bg-green-600 text-white rounded-lg"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );

  // 性别下拉框
  const GenderDropdown = () => (
    <div className="fixed inset-0 z-50" onClick={() => setShowGenderDropdown(false)}>
      <div 
        className="absolute right-4 top-32 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {[Gender.Male, Gender.Female].map((gender) => (
          <div
            key={gender}
            className={`px-6 py-3 cursor-pointer hover:bg-gray-50 ${
              profile.gender === gender ? 'bg-green-50 text-green-600' : ''
            }`}
            onClick={() => {
              setProfile({ ...profile, gender });
              setShowGenderDropdown(false);
            }}
          >
            {gender === Gender.Male ? '男' : '女'}
          </div>
        ))}
      </div>
    </div>
  );

  // 糖尿病类型下拉框
  const DiabetesDropdown = () => (
    <div className="fixed inset-0 z-50" onClick={() => setShowDiabetesDropdown(false)}>
      <div 
        className="absolute right-4 top-44 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {[DiabetesType.Type1, DiabetesType.Type2, DiabetesType.Prediabetes, DiabetesType.Gestational].map((type) => (
          <div
            key={type}
            className={`px-6 py-3 cursor-pointer hover:bg-gray-50 whitespace-nowrap ${
              profile.diabetesType === type ? 'bg-green-50 text-green-600' : ''
            }`}
            onClick={() => {
              setProfile({ ...profile, diabetesType: type });
              setShowDiabetesDropdown(false);
            }}
          >
            {type}
          </div>
        ))}
      </div>
    </div>
  );

  // 主食偏好全屏弹窗
  const StapleFoodModal = () => {
    const recommendedFoods = ['米饭', '面条', '馒头', '全麦面包', '燕麦', '荞麦面', '糙米', '玉米'];
    
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="flex items-center p-4 border-b">
          <button onClick={() => setShowStapleFoodModal(false)}>
            <ArrowLeft size={24} />
          </button>
          <h2 className="flex-1 text-center text-lg font-medium">主食偏好</h2>
          <div className="w-6"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm text-gray-600 mb-3">推荐选项</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {recommendedFoods.map((food) => (
              <button
                key={food}
                onClick={() => {
                  if (tempStapleFood.includes(food)) {
                    setTempStapleFood(tempStapleFood.filter(f => f !== food));
                  } else {
                    setTempStapleFood([...tempStapleFood, food]);
                  }
                }}
                className={`px-4 py-2 rounded-full border ${
                  tempStapleFood.includes(food)
                    ? 'bg-green-100 border-green-600 text-green-600'
                    : 'border-gray-300'
                }`}
              >
                {food}
              </button>
            ))}
          </div>
          
          <h3 className="text-sm text-gray-600 mb-3">自定义添加</h3>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newStapleFoodInput}
              onChange={(e) => setNewStapleFoodInput(e.target.value)}
              placeholder="输入主食名称"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={() => {
                if (newStapleFoodInput.trim() && !tempStapleFood.includes(newStapleFoodInput.trim())) {
                  setTempStapleFood([...tempStapleFood, newStapleFoodInput.trim()]);
                  setNewStapleFoodInput('');
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              添加
            </button>
          </div>
          
          {tempStapleFood.filter(f => !recommendedFoods.includes(f)).length > 0 && (
            <>
              <h3 className="text-sm text-gray-600 mb-3">已添加</h3>
              <div className="flex flex-wrap gap-2">
                {tempStapleFood.filter(f => !recommendedFoods.includes(f)).map((food) => (
                  <div
                    key={food}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full"
                  >
                    <span>{food}</span>
                    <button onClick={() => setTempStapleFood(tempStapleFood.filter(f => f !== food))}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={() => {
              setProfile({ ...profile, stapleFood: tempStapleFood });
              setShowStapleFoodModal(false);
            }}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium"
          >
            完成
          </button>
        </div>
      </div>
    );
  };

  // 过敏食物全屏弹窗
  const AllergyModal = () => {
    const commonAllergens = ['海鲜', '牛奶', '鸡蛋', '坚果', '花生', '小麦', '大豆', '芝麻'];
    
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="flex items-center p-4 border-b">
          <button onClick={() => setShowAllergyModal(false)}>
            <ArrowLeft size={24} />
          </button>
          <h2 className="flex-1 text-center text-lg font-medium">过敏食物</h2>
          <div className="w-6"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm text-gray-600 mb-3">常见过敏原</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {commonAllergens.map((allergen) => (
              <button
                key={allergen}
                onClick={() => {
                  if (tempAllergies.includes(allergen)) {
                    setTempAllergies(tempAllergies.filter(a => a !== allergen));
                  } else {
                    setTempAllergies([...tempAllergies, allergen]);
                  }
                }}
                className={`px-4 py-2 rounded-full border ${
                  tempAllergies.includes(allergen)
                    ? 'bg-red-100 border-red-600 text-red-600'
                    : 'border-gray-300'
                }`}
              >
                {allergen}
              </button>
            ))}
          </div>
          
          <h3 className="text-sm text-gray-600 mb-3">添加其他</h3>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newAllergyInput}
              onChange={(e) => setNewAllergyInput(e.target.value)}
              placeholder="输入过敏食物"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={() => {
                if (newAllergyInput.trim() && !tempAllergies.includes(newAllergyInput.trim())) {
                  setTempAllergies([...tempAllergies, newAllergyInput.trim()]);
                  setNewAllergyInput('');
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              添加
            </button>
          </div>
          
          {tempAllergies.length > 0 && (
            <>
              <h3 className="text-sm text-gray-600 mb-3">已选择</h3>
              <div className="flex flex-wrap gap-2">
                {tempAllergies.map((allergen) => (
                  <div
                    key={allergen}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-full"
                  >
                    <span>{allergen}</span>
                    <button onClick={() => setTempAllergies(tempAllergies.filter(a => a !== allergen))}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={() => {
              setProfile({ ...profile, allergies: tempAllergies });
              setShowAllergyModal(false);
            }}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium"
          >
            完成
          </button>
        </div>
      </div>
    );
  };

  // 每日餐数弹窗
  const MealTimesModal = () => (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setShowMealTimesModal(false)}>
      <div className="w-full bg-white rounded-t-3xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="text-center text-lg font-medium mb-4">每日餐数</div>
        <div className="flex justify-center space-x-4 mb-6">
          {[2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setTempMealsPerDay(num)}
              className={`w-16 h-16 rounded-full border-2 ${
                tempMealsPerDay === num
                  ? 'border-green-600 bg-green-50 text-green-600'
                  : 'border-gray-300'
              }`}
            >
              {num}餐
            </button>
          ))}
        </div>
        <div className="text-center text-sm text-gray-500 mb-4">
          💡 建议糖尿病患者少食多餐，每天3-5餐为宜
        </div>
        <button
          onClick={() => {
            setProfile({ ...profile, mealsPerDay: tempMealsPerDay });
            setShowMealTimesModal(false);
          }}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-medium"
        >
          确定
        </button>
      </div>
    </div>
  );

  // 其他要求全屏弹窗
  const SpecialRequestsModal = () => (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center p-4 border-b">
        <button onClick={() => setShowSpecialRequestsModal(false)}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="flex-1 text-center text-lg font-medium">其他要求</h2>
        <div className="w-6"></div>
      </div>
      
      <div className="flex-1 p-4">
        <textarea
          value={tempSpecialRequests}
          onChange={(e) => setTempSpecialRequests(e.target.value)}
          placeholder="告诉我们您的饮食习惯、口味偏好等特殊需求..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none"
        />
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">💡 提示</div>
          <div className="text-xs text-blue-600 mt-2">
            • 告诉我们您的口味偏好（如偏清淡、不吃辣等）<br />
            • 特殊饮食习惯（如素食、清真等）<br />
            • 其他健康相关的要求
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <button
          onClick={() => {
            setProfile({ ...profile, specialRequests: tempSpecialRequests });
            setShowSpecialRequestsModal(false);
          }}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-medium"
        >
          保存
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center p-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="flex-1 text-center text-lg font-medium">个人信息</h1>
          <button onClick={handleSave} className="text-green-600 font-medium">
            保存
          </button>
        </div>
      </div>

      {/* 头像区域 */}
      <div className="bg-white p-6 flex justify-center items-center border-b">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
            {profile.gender === Gender.Male ? '👨' : '👩'}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100">
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* 表单列表 */}
      <div className="mt-4 bg-white">
        <ProfileItem
          icon={<User size={18} />}
          label="年龄"
          value={`${profile.age}岁`}
          onClick={() => setShowAgeModal(true)}
        />
        <ProfileItem
          icon={<Users size={18} />}
          label="性别"
          value={profile.gender === Gender.Male ? '男' : '女'}
          onClick={() => setShowGenderDropdown(true)}
        />
        <ProfileItem
          icon={<Activity size={18} />}
          label="糖尿病类型"
          value={profile.diabetesType}
          onClick={() => setShowDiabetesDropdown(true)}
        />
      </div>

      <div className="mt-4 bg-white">
        <ProfileItem
          icon={<UtensilsCrossed size={18} />}
          label="主食偏好"
          value={profile.stapleFood.slice(0, 2).join('、') + (profile.stapleFood.length > 2 ? '...' : '')}
          onClick={() => {
            setTempStapleFood(profile.stapleFood);
            setShowStapleFoodModal(true);
          }}
        />
        <ProfileItem
          icon={<AlertTriangle size={18} />}
          label="过敏食物"
          value={profile.allergies.length > 0 ? profile.allergies.join('、') : '无'}
          onClick={() => {
            setTempAllergies(profile.allergies);
            setShowAllergyModal(true);
          }}
        />
        <ProfileItem
          icon={<Clock size={18} />}
          label="每日餐数"
          value={`${profile.mealsPerDay}餐`}
          onClick={() => {
            setTempMealsPerDay(profile.mealsPerDay);
            setShowMealTimesModal(true);
          }}
        />
        <ProfileItem
          icon={<FileText size={18} />}
          label="其他要求"
          value={profile.specialRequests || '未填写'}
          onClick={() => {
            setTempSpecialRequests(profile.specialRequests);
            setShowSpecialRequestsModal(true);
          }}
        />
      </div>

      {/* 退出登录按钮 */}
      <div className="mt-8 p-4">
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
        >
          退出登录
        </button>
      </div>

      {/* 弹窗组件 */}
      {showAgeModal && <AgePickerModal />}
      {showGenderDropdown && <GenderDropdown />}
      {showDiabetesDropdown && <DiabetesDropdown />}
      {showStapleFoodModal && <StapleFoodModal />}
      {showAllergyModal && <AllergyModal />}
      {showMealTimesModal && <MealTimesModal />}
      {showSpecialRequestsModal && <SpecialRequestsModal />}
    </div>
  );
};

// 表单项组件
interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, label, value, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
  >
    <div className="flex items-center space-x-3">
      <div className="text-gray-600">{icon}</div>
      <span className="text-gray-800">{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-gray-500 text-sm">{value}</span>
      <ChevronRight size={18} className="text-gray-400" />
    </div>
  </button>
);

export default EditProfilePage;
