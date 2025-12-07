import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, AlertCircle, Loader2, Heart } from 'lucide-react';
import { api } from '../services/apiClient';

interface AuthPageProps {
  onAuthSuccess: (userId: string, username: string, nickname: string, token: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // 账号验证
    if (!formData.username.trim()) {
      newErrors.username = '请输入账号';
    } else if (formData.username.length < 3) {
      newErrors.username = '账号至少3个字符';
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6个字符';
    }

    // 注册模式额外验证
    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '两次密码输入不一致';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        // 登录
        const response = await api.login({
          username: formData.username,
          password: formData.password
        });

        if (response.success && response.data) {
          onAuthSuccess(
            response.data.user.id,
            response.data.user.username,
            response.data.user.nickname,
            response.data.token
          );
        } else {
          setApiError(response.error?.message || '登录失败，请重试');
        }
      } else {
        // 注册（使用账号作为昵称）
        const response = await api.register({
          username: formData.username,
          password: formData.password,
          nickname: formData.username
        });

        if (response.success && response.data) {
          onAuthSuccess(
            response.data.user.id,
            response.data.user.username,
            response.data.user.nickname,
            response.data.token
          );
        } else {
          setApiError(response.error?.message || '注册失败，请重试');
        }
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : '网络错误，请检查连接');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // 清除API错误
    if (apiError) {
      setApiError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-green rounded-full mb-4">
            <Heart className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">智糖管家 AI</h1>
          <p className="text-gray-500">您的专属糖尿病营养师</p>
        </div>

        {/* 表单卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 切换按钮 */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrors({});
                setApiError('');
              }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-white text-brand-green shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrors({});
                setApiError('');
              }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-white text-brand-green shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              注册
            </button>
          </div>

          {/* API错误提示 */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <span className="ml-2 text-sm text-red-700">{apiError}</span>
            </div>
          )}

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 账号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                账号
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => updateField('username', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-green outline-none transition-colors ${
                  errors.username
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 focus:border-brand-green'
                }`}
                placeholder="请输入账号"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-green outline-none transition-colors ${
                  errors.password
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 focus:border-brand-green'
                }`}
                placeholder="请输入密码"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* 确认密码（仅注册） */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  确认密码
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-green outline-none transition-colors ${
                    errors.confirmPassword
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 focus:border-brand-green'
                  }`}
                  placeholder="请再次输入密码"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-brand-green text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 shadow-lg shadow-green-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{mode === 'login' ? '登录中...' : '注册中...'}</span>
                </>
              ) : (
                <>
                  {mode === 'login' ? (
                    <>
                      <LogIn size={20} />
                      <span>登录</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      <span>注册</span>
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* 底部提示 */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <p>
                还没有账号？
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-brand-green font-semibold hover:underline ml-1"
                  disabled={isLoading}
                >
                  立即注册
                </button>
              </p>
            ) : (
              <p>
                已有账号？
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-brand-green font-semibold hover:underline ml-1"
                  disabled={isLoading}
                >
                  返回登录
                </button>
              </p>
            )}
          </div>
        </div>

        {/* 版权信息 */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2024 智糖管家 AI. 保护您的健康数据
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
