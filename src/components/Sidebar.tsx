
import React, { useState } from 'react';
import { 
  FileText, 
  Database,
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
          className={`flex items-center px-3 py-3 cursor-pointer transition-all duration-200 ${
            isActive 
              ? 'bg-sky-50 border-r-4 border-sky-500 text-sky-700' 
              : 'text-gray-700 hover:bg-sky-50'
          } ${depth > 0 ? 'pl-10' : ''}`}
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
          {item.icon && <div className="mr-2">{item.icon}</div>}
          <span className="font-medium text-sm">{item.title}</span>
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
    <div className="w-56 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/66bc4a96-4c4e-4093-a308-07b2fcdda06d.png" 
            alt="智能标书系统" 
            className="w-8 h-8"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent">
            智能标书系统
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {menuItems.map(item => renderMenuItem(item))}
      </div>
    </div>
  );
};

export default Sidebar;
