
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIBidGeneration from '../pages/AIBidGeneration';

interface CreateBidFlowProps {
  onBack: () => void;
}

const CreateBidFlow: React.FC<CreateBidFlowProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 - 包含所有控制组件 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">创建标书</h1>
          </div>
          
          {/* 将AIBidGeneration的控制组件移到这里 */}
          <div id="bid-controls-container" className="flex items-center">
            {/* 控制组件将通过AIBidGeneration组件渲染到这里 */}
          </div>
        </div>
      </div>
      
      {/* AI生标内容 */}
      <AIBidGeneration showHeaderControls={false} />
    </div>
  );
};

export default CreateBidFlow;
