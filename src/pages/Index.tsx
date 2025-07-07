
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';
import HistoryBidManagement from './HistoryBidManagement';
import TemplateManagement from './TemplateManagement';
import AIBidGeneration from './AIBidGeneration';
import KnowledgeSettings from './KnowledgeSettings';
import PersonalKnowledge from './PersonalKnowledge';
import IndustryKnowledge from './IndustryKnowledge';
import TenderAnnouncements from './TenderAnnouncements';
import IntentionProjects from './IntentionProjects';
import AIRecommendations from './AIRecommendations';
import PersonalCenter from './PersonalCenter';

const Index = () => {
  const [activeModule, setActiveModule] = useState('chat');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPersonalCenter, setShowPersonalCenter] = useState(false);

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
  };

  const handleBackToMain = () => {
    setShowPersonalCenter(false);
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (showPersonalCenter) {
    return <PersonalCenter onBack={handleBackToMain} />;
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
          {activeModule === 'chat' && <ChatWindow />}
          {activeModule === 'history-bid-management' && <HistoryBidManagement />}
          {activeModule === 'template-management' && <TemplateManagement />}
          {activeModule === 'ai-bid-generation' && <AIBidGeneration />}
          {activeModule === 'knowledge-settings' && <KnowledgeSettings />}
          {activeModule === 'personal-knowledge' && <PersonalKnowledge />}
          {activeModule === 'industry-knowledge' && <IndustryKnowledge />}
          {activeModule === 'tender-announcements' && <TenderAnnouncements />}
          {activeModule === 'intention-projects' && <IntentionProjects />}
          {activeModule === 'ai-recommendations' && <AIRecommendations />}
          {!['chat', 'history-bid-management', 'template-management', 'ai-bid-generation', 'knowledge-settings', 'personal-knowledge', 'industry-knowledge', 'tender-announcements', 'intention-projects', 'ai-recommendations'].includes(activeModule) && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  {getModuleTitle(activeModule)}
                </h2>
                <p className="text-gray-500">功能开发中，敬请期待...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function getModuleTitle(module: string): string {
  const titles: Record<string, string> = {
    'bid-management': 'AI生标管理',
    'writing-management': 'AI帮写管理',
    'bid-screening': 'AI筛标',
    'knowledge-base': '知识库管理',
    'ai-bid-generation': 'AI生标',
    'history-bid-management': '历史生标管理',
    'template-management': '投标方案模板管理',
    'tender-announcements': '招标公告',
    'intention-projects': '意向项目',
    'ai-recommendations': 'AI推荐',
    'ai-writing': 'AI帮写',
    'document-download': '标书下载',
    'history-writing-management': '历史帮写管理',
    'knowledge-settings': '知识库设置',
    'enterprise-knowledge': '企业知识库',
    'personal-knowledge': '个人知识库',
    'industry-knowledge': '行业知识库'
  };
  return titles[module] || '未知模块';
}

export default Index;
