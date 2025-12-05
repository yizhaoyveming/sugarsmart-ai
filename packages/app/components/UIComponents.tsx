import React from 'react';
import { AlertCircle, RefreshCw, Utensils, FileText, Heart } from 'lucide-react';

/**
 * Loading Skeleton Components
 * 用于显示内容加载状态的骨架屏组件
 */

// 骨架屏基础组件
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`skeleton ${className}`} />;
};

// Dashboard骨架屏
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="skeleton-dashboard p-4 space-y-4">
      {/* 热量卡片骨架 */}
      <div className="skeleton-card">
        <div className="skeleton skeleton-text-lg w-32 mb-4" />
        <div className="skeleton skeleton-circle w-32 h-32 mx-auto mb-4" />
        <div className="space-y-2">
          <div className="skeleton skeleton-text w-full" />
          <div className="skeleton skeleton-text w-3/4" />
        </div>
      </div>

      {/* 今日计划骨架 */}
      <div className="skeleton-card">
        <div className="skeleton skeleton-text-lg w-40 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton skeleton-rect h-20" />
          ))}
        </div>
      </div>
    </div>
  );
};

// 食谱卡片骨架
export const RecipeCardSkeleton: React.FC = () => {
  return (
    <div className="skeleton-recipe-card">
      <div className="skeleton h-40 rounded-t-2xl" />
      <div className="p-4 space-y-2">
        <div className="skeleton skeleton-text-lg w-3/4" />
        <div className="skeleton skeleton-text w-1/2" />
        <div className="flex gap-2 mt-3">
          <div className="skeleton w-16 h-6 rounded-full" />
          <div className="skeleton w-16 h-6 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// 食谱列表骨架
export const RecipeListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * Loading Spinner Components
 * 旋转加载指示器
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClass = {
    sm: 'loading-spinner-sm',
    md: '',
    lg: 'loading-spinner-lg'
  }[size];

  return (
    <div className={`loading-spinner ${sizeClass} ${className}`} />
  );
};

// 全屏加载遮罩
export const LoadingOverlay: React.FC<{ message?: string }> = ({ message = '加载中...' }) => {
  return (
    <div className="loading-overlay">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

/**
 * Empty State Components
 * 空状态提示组件
 */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || <FileText size={80} />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {action && (
        <div className="empty-state-action">
          <button
            onClick={action.onClick}
            className="btn-primary"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
};

// 无饮食计划空状态
export const NoMealPlanEmpty: React.FC<{ onCreatePlan: () => void }> = ({ onCreatePlan }) => {
  return (
    <EmptyState
      icon={<Utensils size={80} />}
      title="暂无饮食计划"
      description="创建您的个性化饮食计划，开始健康管理之旅"
      action={{
        label: '创建计划',
        onClick: onCreatePlan
      }}
    />
  );
};

// 无收藏空状态
export const NoFavoritesEmpty: React.FC = () => {
  return (
    <EmptyState
      icon={<Heart size={80} />}
      title="暂无收藏"
      description="收藏您喜欢的食谱，方便随时查看"
    />
  );
};

// 无数据空状态
export const NoDataEmpty: React.FC<{ message?: string }> = ({ message = '暂无数据' }) => {
  return (
    <EmptyState
      icon={<FileText size={80} />}
      title={message}
      description="当前没有可显示的内容"
    />
  );
};

/**
 * Error Components
 * 错误提示和错误边界组件
 */

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = '出错了',
  message,
  onRetry,
  onDismiss
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <AlertCircle className="text-red-500 mr-3 flex-shrink-0" size={24} />
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold mb-1">{title}</h3>
          <p className="text-red-700 text-sm">{message}</p>
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex gap-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-sm font-medium text-red-700 hover:text-red-800 flex items-center gap-1"
                >
                  <RefreshCw size={14} />
                  重试
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  关闭
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 错误边界组件
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">
              <AlertCircle size={80} />
            </div>
            <h1 className="error-title">应用出现错误</h1>
            <p className="error-message">
              {this.state.error?.message || '抱歉，应用遇到了一些问题'}
            </p>
            <div className="error-actions">
              <button
                onClick={this.handleReset}
                className="btn-primary flex items-center gap-2"
              >
                <RefreshCw size={18} />
                重新加载
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Toast Notification Component
 * Toast通知组件
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  type, 
  message, 
  duration = 3000,
  onClose 
}) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeClass = {
    success: 'toast-success',
    error: 'toast-error',
    warning: 'toast-warning',
    info: ''
  }[type];

  return (
    <div className={`toast ${typeClass}`}>
      {message}
    </div>
  );
};

// Toast管理Hook
export const useToast = () => {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    type: ToastType;
    message: string;
  }>>([]);

  const showToast = React.useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const ToastContainer = React.useMemo(() => {
    return () => (
      <>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </>
    );
  }, [toasts, removeToast]);

  return {
    showToast,
    ToastContainer,
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
    warning: (message: string) => showToast('warning', message),
    info: (message: string) => showToast('info', message)
  };
};

/**
 * Button with Ripple Effect
 * 带涟漪效果的按钮
 */

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = React.useState<Array<{
    x: number;
    y: number;
    id: number;
  }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipples(prev => [...prev, { x, y, id: Date.now() }]);
    
    setTimeout(() => {
      setRipples(prev => prev.slice(1));
    }, 600);

    onClick?.(e);
  };

  const variantClass = {
    primary: 'btn-primary',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white'
  }[variant];

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`relative overflow-hidden ${variantClass} ${className}`}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y
          }}
        />
      ))}
    </button>
  );
};

/**
 * Form Input with Validation
 * 带验证的表单输入
 */

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`form-input w-full px-4 py-2 rounded-lg ${error ? 'error' : ''} ${className}`}
      />
      {error && (
        <div className="form-error-message">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
      {helperText && !error && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};
