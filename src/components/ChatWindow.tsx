
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import ModelSelector from './ModelSelector';
import FeatureButtons from './FeatureButtons';

const ChatWindow: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: number, text: string, isUser: boolean}>>([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        isUser: true
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: "您好！我是智能标书系统助手，很高兴为您服务。请问有什么可以帮助您的吗？",
          isUser: false
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* 主对话区域 - 占据大部分空间 */}
      <div className="flex-1 flex flex-col min-h-0">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center text-gray-500">
            <div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">AI</span>
              </div>
              <h3 className="text-lg font-medium mb-2">欢迎使用智能标书系统</h3>
              <p>请输入您的问题或需求，我将为您提供专业的帮助</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-4">
            <div className="space-y-4 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.isUser
                        ? 'bg-gradient-to-r from-purple-400 to-indigo-400 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 - 固定在底部 */}
      <div className="border-t border-gray-200 pt-4 mt-auto">
        <div className="flex items-center space-x-2 mb-3">
          <ModelSelector />
        </div>
        
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题..."
              className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-300 focus:border-transparent outline-none"
              rows={1}
            />
          </div>
          <button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white p-3 rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 功能按钮区域 - 紧贴输入框下方 */}
      <div className="mt-4">
        <FeatureButtons />
      </div>
    </div>
  );
};

export default ChatWindow;
