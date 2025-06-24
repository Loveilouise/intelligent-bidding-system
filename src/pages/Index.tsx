
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import BidSettings from './BidSettings';

const Index = () => {
  const [activeModule, setActiveModule] = useState('chat');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      
      <div className="flex-1 flex flex-col">
        {activeModule === 'chat' && <ChatWindow />}
        {activeModule === 'bid-settings' && <BidSettings />}
        {activeModule !== 'chat' && activeModule !== 'bid-settings' && (
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
    'industry-knowledge': '行业知识库',
    'bid-settings': '生标设置'
  };
  return titles[module] || '未知模块';
}

export default Index;
