import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import MemberManagement from './MemberManagement';
import { useToast } from '@/hooks/use-toast';
import EditWorkspaceDialog from './EditWorkspaceDialog';

const WorkspaceManagement: React.FC = () => {
  const [workspaceInfo, setWorkspaceInfo] = useState({
    name: '智能标书工作空间',
    description: '企业标书智能生成与管理平台，提供全流程标书制作解决方案'
  });
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingField, setEditingField] = useState<'name' | 'description'>('name');
  const { toast } = useToast();

  const handleEdit = (field: 'name' | 'description') => {
    setEditingField(field);
    setShowEditDialog(true);
  };

  const handleSave = (newValue: string) => {
    setWorkspaceInfo({ ...workspaceInfo, [editingField]: newValue });
    toast({
      title: `${editingField === 'name' ? '工作空间名称' : '工作空间简介'}更新成功`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">工作空间管理</h1>
        <p className="text-muted-foreground">管理您的工作空间信息和成员</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>工作空间信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label>工作空间名称</Label>
                <div className="mt-1 text-sm">{workspaceInfo.name}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit('name')}
              >
                <Edit2 className="w-4 h-4 mr-1" />
                编辑
              </Button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label>工作空间简介</Label>
                <div className="mt-1 text-sm">{workspaceInfo.description}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit('description')}
              >
                <Edit2 className="w-4 h-4 mr-1" />
                编辑
              </Button>
            </div>
          </CardContent>
        </Card>

        <MemberManagement />
      </div>

      <EditWorkspaceDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        field={editingField}
        currentValue={workspaceInfo[editingField]}
        onSave={handleSave}
      />
    </div>
  );
};

export default WorkspaceManagement;