
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';
import HistoryBidManagement from './HistoryBidManagement';
import TemplateManagement from './TemplateManagement';
import AIBidGeneration from './AIBidGeneration';
import KnowledgeSettings from './KnowledgeSettings';
import PersonalKnowledge from './PersonalKnowledge';
import IndustryKnowledge from './IndustryKnowledge';
import PersonalCenter from './PersonalCenter';

const Index = () => {
  const [activeModule, setActiveModule] = useState('ai-bid-generation');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPersonalCenter, setShowPersonalCenter] = useState(false);
  const [activePersonalTab, setActivePersonalTab] = useState('account');

  const handleLogin = (username: string, password: string) => {
    // 简单的登录验证（实际项目中应该调用API）
    if (username && password) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowPersonalCenter(false);
  };

  const handlePersonalCenter = () => {
    setShowPersonalCenter(true);
  };

  const handleWorkspaceManagement = () => {
    setShowPersonalCenter(true);
    setActivePersonalTab('workspace');
  };

  const handleBackToMain = () => {
    setShowPersonalCenter(false);
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-end">
          <UserProfile 
            onLogout={handleLogout} 
            onPersonalCenter={handlePersonalCenter}
            onWorkspaceManagement={handleWorkspaceManagement}
          />
        </div>
        
        <div className="flex-1">
          {showPersonalCenter ? (
            <PersonalCenter onBack={handleBackToMain} activeTab={activePersonalTab} />
          ) : (
            <>
              {activeModule === 'history-bid-management' && <HistoryBidManagement />}
              {activeModule === 'template-management' && <TemplateManagement />}
              {activeModule === 'ai-bid-generation' && <AIBidGeneration />}
              {activeModule === 'knowledge-settings' && <KnowledgeSettings />}
              {activeModule === 'personal-knowledge' && <PersonalKnowledge />}
              {activeModule === 'industry-knowledge' && <IndustryKnowledge />}
              {!['history-bid-management', 'template-management', 'ai-bid-generation', 'knowledge-settings', 'personal-knowledge', 'industry-knowledge'].includes(activeModule) && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                      {getModuleTitle(activeModule)}
                    </h2>
                    <p className="text-gray-500">功能开发中，敬请期待...</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function getModuleTitle(module: string): string {
  const titles: Record<string, string> = {
    'bid-management': 'AI生标管理',
    'ai-bid-generation': 'AI生标',
    'history-bid-management': '历史生标管理',
    'template-management': '投标方案模板管理',
    'knowledge-settings': '知识库设置',
    'enterprise-knowledge': '企业知识库',
    'personal-knowledge': '个人知识库',
    'industry-knowledge': '行业知识库'
  };
  return titles[module] || '未知模块';
}

export default Index;
