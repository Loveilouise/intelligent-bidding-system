
import React from 'react';

const FeatureButtons: React.FC = () => {
  const features = [
    { id: 'ai-image', name: 'AI生图' },
    { id: 'ai-writing', name: 'AI写作' },
    { id: 'ai-table', name: 'AI表格' },
    { id: 'ai-design', name: 'AI设计' },
    { id: 'ai-code', name: 'AI编程' },
    { id: 'ai-analysis', name: 'AI分析' }
  ];

  const handleFeatureClick = (featureId: string) => {
    console.log(`点击了功能: ${featureId}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {features.map((feature) => (
        <button
          key={feature.id}
          onClick={() => handleFeatureClick(feature.id)}
          className="px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors duration-200"
        >
          {feature.name}
        </button>
      ))}
    </div>
  );
};

export default FeatureButtons;
