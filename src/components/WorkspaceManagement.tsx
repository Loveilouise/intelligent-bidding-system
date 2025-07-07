import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import MemberManagement from './MemberManagement';
import { useToast } from '@/hooks/use-toast';

const WorkspaceManagement: React.FC = () => {
  const [workspaceInfo, setWorkspaceInfo] = useState({
    name: '智能标书工作空间',
    description: '企业标书智能生成与管理平台，提供全流程标书制作解决方案'
  });
  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false
  });
  const [editValues, setEditValues] = useState(workspaceInfo);
  const { toast } = useToast();

  const handleEdit = (field: 'name' | 'description') => {
    if (isEditing[field]) {
      // 保存
      setWorkspaceInfo({ ...workspaceInfo, [field]: editValues[field] });
      setIsEditing({ ...isEditing, [field]: false });
      toast({
        title: `${field === 'name' ? '工作空间名称' : '工作空间简介'}更新成功`,
      });
    } else {
      // 开始编辑
      setIsEditing({ ...isEditing, [field]: true });
    }
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
            <div className="space-y-2">
              <Label>工作空间名称</Label>
              <div className="flex space-x-2">
                <Input
                  value={isEditing.name ? editValues.name : workspaceInfo.name}
                  onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                  disabled={!isEditing.name}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit('name')}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>工作空间简介</Label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Textarea
                    value={isEditing.description ? editValues.description : workspaceInfo.description}
                    onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                    disabled={!isEditing.description}
                    rows={3}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit('description')}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <MemberManagement />
      </div>
    </div>
  );
};

export default WorkspaceManagement;