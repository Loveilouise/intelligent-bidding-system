import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressIndicator from './ProgressIndicator';

interface Tab {
  id: string;
  title: string;
}

interface FullTextGenerationLoaderProps {
  tabs: Tab[];
  activeTab: string;
  onPrevStep: () => void;
}

const FullTextGenerationLoader: React.FC<FullTextGenerationLoaderProps> = ({
  tabs,
  activeTab,
  onPrevStep
}) => {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">AI生标</h1>
          
          <ProgressIndicator tabs={tabs} activeTab={activeTab} />

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onPrevStep}>
              上一步
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[600px] flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">正在生成全文</h2>
            <p className="text-gray-600 mb-4">AI正在根据目录结构生成完整的标书内容...</p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              预计需要2-3分钟
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullTextGenerationLoader;