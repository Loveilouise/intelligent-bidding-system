
import React, { useState } from 'react';
import { 
  Database,
  FolderOpen,
  Archive
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  const menuItems: MenuItem[] = [
    {
      id: 'history-bid-management',
      title: '我的标书',
      icon: <Archive className="w-5 h-5" />
    },
    {
      id: 'template-management',
      title: '模板库',
      icon: <FolderOpen className="w-5 h-5" />
    },
    {
      id: 'personal-knowledge',
      title: '素材库',
      icon: <Database className="w-5 h-5" />
    }
  ];

  const renderMenuItem = (item: MenuItem) => {
    const isActive = activeModule === item.id;

    return (
      <div key={item.id}>
        <div
          className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 ${
            isActive 
              ? 'bg-primary/10 border-r-4 border-primary text-primary' 
              : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
          }`}
          onClick={() => setActiveModule(item.id)}
        >
          <div className="mr-3">{item.icon}</div>
          <span className="font-medium text-sm">{item.title}</span>
        </div>
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
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
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
