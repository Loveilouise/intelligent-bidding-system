
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile';
import WordCounter from '../components/WordCounter';
import LoginForm from '../components/LoginForm';
import HistoryBidManagement from './HistoryBidManagement';
import TemplateManagement from './TemplateManagement';
import PersonalKnowledge from './PersonalKnowledge';
import PersonalCenter from './PersonalCenter';
import CreateBidFlow from '../components/CreateBidFlow';

const Index = () => {
  const [activeModule, setActiveModule] = useState('history-bid-management');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPersonalCenter, setShowPersonalCenter] = useState(false);
  const [showCreateBid, setShowCreateBid] = useState(false);
  const [activePersonalTab, setActivePersonalTab] = useState('account');

  const handleLogin = (username: string, password: string) => {
    if (username && password) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowPersonalCenter(false);
    setShowCreateBid(false);
  };

  const handlePersonalCenter = () => {
    setShowPersonalCenter(true);
    setShowCreateBid(false);
  };

  const handleWorkspaceManagement = () => {
    setShowPersonalCenter(true);
    setShowCreateBid(false);
    setActivePersonalTab('workspace');
  };

  const handleBackToMain = () => {
    setShowPersonalCenter(false);
    setShowCreateBid(false);
  };

  const handleCreateBid = () => {
    setShowCreateBid(true);
    setShowPersonalCenter(false);
  };

  const handleBackFromCreateBid = () => {
    setShowCreateBid(false);
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // 如果在创建标书流程中，显示创建标书页面（无侧边栏）
  if (showCreateBid) {
    return <CreateBidFlow onBack={handleBackFromCreateBid} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/10 to-primary/20 flex">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white/80 backdrop-blur-sm border-b border-primary/10 px-4 py-2 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            {getModuleTitle(activeModule)}
          </h1>
          <div className="flex items-center space-x-4">
            <WordCounter />
            <UserProfile 
              onLogout={handleLogout} 
              onPersonalCenter={handlePersonalCenter}
              onWorkspaceManagement={handleWorkspaceManagement}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {showPersonalCenter ? (
            <PersonalCenter onBack={handleBackToMain} activeTab={activePersonalTab} />
          ) : (
            <>
              {activeModule === 'history-bid-management' && <HistoryBidManagement onCreateBid={handleCreateBid} />}
              {activeModule === 'template-management' && <TemplateManagement />}
              {activeModule === 'personal-knowledge' && <PersonalKnowledge />}
              {!['history-bid-management', 'template-management', 'personal-knowledge'].includes(activeModule) && (
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
    'history-bid-management': '我的标书',
    'template-management': '模板库',
    'personal-knowledge': '素材库'
  };
  return titles[module] || '未知模块';
}

export default Index;
