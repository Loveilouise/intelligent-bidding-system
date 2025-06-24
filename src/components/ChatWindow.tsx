
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
      
      // 模拟AI回复
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: "您好！我是AI助手，很高兴为您服务。请问有什么可以帮助您的吗？",
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
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6">
      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-violet-400 to-purple-400 text-white p-4">
          <h2 className="text-xl font-semibold">AI智能助手</h2>
          <p className="text-violet-100 text-sm">为您提供专业的AI服务</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">AI</span>
              </div>
              <h3 className="text-lg font-medium mb-2">欢迎使用AI助手</h3>
              <p>请输入您的问题或需求，我将为您提供专业的帮助</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.isUser
                        ? 'bg-gradient-to-r from-violet-400 to-purple-400 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-violet-300 focus:border-transparent outline-none"
                rows={1}
              />
            </div>
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-violet-400 to-purple-400 text-white p-3 rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all duration-200 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Model Selector */}
          <div className="mt-4 flex justify-start">
            <ModelSelector />
          </div>
        </div>
      </div>

      {/* Feature Buttons */}
      <div className="mt-4">
        <FeatureButtons />
      </div>
    </div>
  );
};

export default ChatWindow;
