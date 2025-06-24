
import React from 'react';
import { Image, FileText, Table, Palette, Code, Brain } from 'lucide-react';

const FeatureButtons: React.FC = () => {
  const features = [
    {
      id: 'ai-image',
      name: 'AI生图',
      icon: <Image className="w-6 h-6" />,
      description: '智能图片生成',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'ai-writing',
      name: 'AI写作',
      icon: <FileText className="w-6 h-6" />,
      description: '智能文本创作',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'ai-table',
      name: 'AI表格',
      icon: <Table className="w-6 h-6" />,
      description: '智能表格处理',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'ai-design',
      name: 'AI设计',
      icon: <Palette className="w-6 h-6" />,
      description: '智能设计助手',
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'ai-code',
      name: 'AI编程',
      icon: <Code className="w-6 h-6" />,
      description: '智能代码生成',
      color: 'from-orange-500 to-amber-500'
    },
    {
      id: 'ai-analysis',
      name: 'AI分析',
      icon: <Brain className="w-6 h-6" />,
      description: '智能数据分析',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const handleFeatureClick = (featureId: string) => {
    console.log(`点击了功能: ${featureId}`);
    // 这里可以添加具体的功能处理逻辑
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">AI功能助手</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => handleFeatureClick(feature.id)}
            className="group flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-200`}>
              {feature.icon}
            </div>
            <span className="font-medium text-gray-800 text-sm mb-1">{feature.name}</span>
            <span className="text-xs text-gray-500 text-center">{feature.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeatureButtons;
