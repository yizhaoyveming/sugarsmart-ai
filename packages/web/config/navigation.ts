import { 
  LayoutDashboard, 
  TestTube, 
  Users, 
  FileEdit,
  Settings,
  BarChart3,
  Activity,
  TrendingUp,
  Zap,
  LucideIcon
} from 'lucide-react';

export interface SubTab {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  badge?: string | null;
  subTabs?: SubTab[];
}

export const mainNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: '控制台',
    icon: LayoutDashboard,
    color: 'blue',
    badge: null,
    // 无二级导航，单页面融合所有功能
  },
  {
    id: 'testing',
    label: '测试工具',
    icon: TestTube,
    color: 'green',
    badge: null,
    subTabs: [
      { id: 'function', label: '功能测试', icon: TestTube },
      { id: 'abtest', label: 'A/B测试', icon: TrendingUp },
    ]
  },
  {
    id: 'users',
    label: '用户洞察',
    icon: Users,
    color: 'purple',
    badge: '1,284',
    // 无二级导航，单页面融合所有功能
  },
  {
    id: 'content',
    label: '内容运营',
    icon: FileEdit,
    color: 'orange',
    badge: null,
    subTabs: [
      { id: 'recipes', label: '食谱库', icon: FileEdit },
      { id: 'articles', label: '健康知识', icon: FileEdit },
      { id: 'push', label: '推送管理', icon: Activity },
      { id: 'ai', label: 'AI配置', icon: Settings },
    ]
  },
];

export const bottomNavigation: NavigationItem[] = [
  {
    id: 'settings',
    label: '系统设置',
    icon: Settings,
    color: 'gray',
  },
];
