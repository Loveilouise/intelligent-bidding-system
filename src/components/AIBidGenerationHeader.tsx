import React from 'react';
import { Button } from '@/components/ui/button';
import ProgressIndicator from './ProgressIndicator';

interface Tab {
  id: string;
  title: string;
}

interface AIBidGenerationHeaderProps {
  tabs: Tab[];
  activeTab: string;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSave: () => void;
  onDownload: () => void;
}

const AIBidGenerationHeader: React.FC<AIBidGenerationHeaderProps> = ({
  tabs,
  activeTab,
  onPrevStep,
  onNextStep,
  onSave,
  onDownload
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-semibold text-gray-900">AI生标</h1>
      
      <ProgressIndicator tabs={tabs} activeTab={activeTab} />

      <div className="flex items-center space-x-2">
        {activeTab !== 'setup' && (
          <Button variant="outline" onClick={onPrevStep}>
            上一步
          </Button>
        )}
        {activeTab === 'editing' && (
          <>
            <Button variant="outline" onClick={onSave}>
              保存
            </Button>
            <Button onClick={onDownload} className="bg-purple-600 hover:bg-purple-700">
              下载标书
            </Button>
          </>
        )}
        {(activeTab === 'setup' || activeTab === 'generation') && (
          <Button onClick={onNextStep} className="bg-purple-600 hover:bg-purple-700">
            下一步
          </Button>
        )}
      </div>
    </div>
  );
};

export default AIBidGenerationHeader;