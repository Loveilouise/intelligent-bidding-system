import React, { useState } from 'react';
import { ChevronRight, Plus, Building2 } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import CreateWorkspaceDialog from './CreateWorkspaceDialog';

interface WorkspaceSelectorProps {
  onWorkspaceClick?: () => void;
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({ onWorkspaceClick }) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentWorkspace] = useState({
    name: '智能标书工作空间',
    description: '企业标书智能生成与管理'
  });

  return (
    <>
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-center justify-between w-full cursor-pointer hover:bg-accent hover:text-accent-foreground px-2 py-1.5 text-sm">
            <span>切换工作空间</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </HoverCardTrigger>
        <HoverCardContent side="right" className="w-80 p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">当前工作空间</h4>
              <div 
                className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                onClick={onWorkspaceClick}
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-medium text-sm">{currentWorkspace.name}</div>
                    <div className="text-xs text-muted-foreground">{currentWorkspace.description}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                创建工作空间
              </Button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <CreateWorkspaceDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
};

export default WorkspaceSelector;