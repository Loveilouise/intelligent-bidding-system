import React, { useState } from 'react';
import { 
  FileText, 
  Edit, 
  Filter, 
  Database,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['bid-management']);

  const menuItems: MenuItem[] = [
    {
      id: 'bid-management',
      title: 'AI生标管理',
      icon: <FileText className="w-5 h-5" />,
      children: [
        { id: 'ai-bid-generation', title: 'AI生标', icon: null },
        { id: 'history-bid-management', title: '历史生标管理', icon: null },
        { id: 'template-management', title: '投标方案模板管理', icon: null }
      ]
    },
    {
      id: 'writing-management',
      title: 'AI帮写管理',
      icon: <Edit className="w-5 h-5" />,
      children: [
        { id: 'ai-writing', title: 'AI帮写', icon: null },
        { id: 'document-download', title: '标书下载', icon: null },
        { id: 'history-writing-management', title: '历史帮写管理', icon: null }
      ]
    },
    {
      id: 'bid-screening',
      title: 'AI筛标',
      icon: <Filter className="w-5 h-5" />,
      children: [
        { id: 'tender-announcements', title: '招标公告', icon: null },
        { id: 'intention-projects', title: '意向项目', icon: null },
        { id: 'ai-recommendations', title: 'AI推荐', icon: null }
      ]
    },
    {
      id: 'knowledge-base',
      title: '知识库管理',
      icon: <Database className="w-5 h-5" />,
      children: [
        { id: 'knowledge-settings', title: '知识库设置', icon: null },
        { id: 'enterprise-knowledge', title: '企业知识库', icon: null },
        { id: 'personal-knowledge', title: '个人知识库', icon: null },
        { id: 'industry-knowledge', title: '行业知识库', icon: null }
      ]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeModule === item.id;

    return (
      <div key={item.id}>
        <div
          className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 ${
            isActive 
              ? 'bg-purple-100 border-r-4 border-purple-500 text-purple-700' 
              : 'text-gray-700 hover:bg-purple-50'
          } ${depth > 0 ? 'pl-12' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              setActiveModule(item.id);
            }
          }}
        >
          {hasChildren && (
            <div className="mr-2">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
          {item.icon && <div className="mr-3">{item.icon}</div>}
          <span className="font-medium">{item.title}</span>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="bg-gray-50">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          智能标书系统
        </h1>
      </div>

      <div 
        className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 border-b border-gray-100 ${
          activeModule === 'chat' 
            ? 'bg-purple-100 border-r-4 border-purple-500 text-purple-700' 
            : 'text-gray-700 hover:bg-purple-50'
        }`}
        onClick={() => setActiveModule('chat')}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white text-sm font-bold">AI</span>
        </div>
        <span className="font-medium">AI对话</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {menuItems.map(item => renderMenuItem(item))}
      </div>
    </div>
  );
};

export default Sidebar;
