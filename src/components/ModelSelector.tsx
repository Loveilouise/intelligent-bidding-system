
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ModelSelector: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('自研模型');
  const [isOpen, setIsOpen] = useState(false);

  const models = [
    { id: 'custom', name: '自研模型', description: '专业定制AI模型' },
    { id: 'general', name: '通用模型', description: '通用智能AI模型' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <span className="text-sm text-gray-700">模型: {selectedModel}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-sm border border-gray-100 z-10">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                setSelectedModel(model.name);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-violet-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
            >
              <div className="font-medium text-gray-800">{model.name}</div>
              <div className="text-xs text-gray-500">{model.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
