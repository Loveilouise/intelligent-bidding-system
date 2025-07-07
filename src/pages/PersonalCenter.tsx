import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Building2 } from 'lucide-react';
import AccountManagement from '@/components/AccountManagement';
import WorkspaceManagement from '@/components/WorkspaceManagement';

interface PersonalCenterProps {
  onBack: () => void;
}

const PersonalCenter: React.FC<PersonalCenterProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: '账号管理', icon: User },
    { id: 'workspace', label: '工作空间管理', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* 侧边导航 */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-4 border-b border-border">
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full justify-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回主页
          </Button>
        </div>
        
        <nav className="p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 p-6">
        {activeTab === 'account' && <AccountManagement />}
        {activeTab === 'workspace' && <WorkspaceManagement />}
      </div>
    </div>
  );
};

export default PersonalCenter;