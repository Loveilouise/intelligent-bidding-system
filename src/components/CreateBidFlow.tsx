
import React from 'react';
import AIBidGeneration from '../pages/AIBidGeneration';

interface CreateBidFlowProps {
  onBack: () => void;
}

const CreateBidFlow: React.FC<CreateBidFlowProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AIBidGeneration showHeaderControls={true} onBack={onBack} />
    </div>
  );
};

export default CreateBidFlow;
