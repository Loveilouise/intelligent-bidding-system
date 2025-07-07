import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Tab {
  id: string;
  title: string;
}

interface ProgressIndicatorProps {
  tabs: Tab[];
  activeTab: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ tabs, activeTab }) => {
  return (
    <div className="flex items-center space-x-6">
      {tabs.map((tab, index) => (
        <div key={tab.id} className="flex items-center">
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              activeTab === tab.id 
                ? 'bg-purple-600 text-white' 
                : tabs.findIndex(t => t.id === activeTab) > index
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
            }`}>
              {tabs.findIndex(t => t.id === activeTab) > index ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                index + 1
              )}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              activeTab === tab.id ? 'text-purple-600' : 'text-gray-500'
            }`}>
              {tab.title}
            </span>
          </div>
          {index < tabs.length - 1 && (
            <div className={`w-8 h-0.5 mx-3 ${
              tabs.findIndex(t => t.id === activeTab) > index ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;