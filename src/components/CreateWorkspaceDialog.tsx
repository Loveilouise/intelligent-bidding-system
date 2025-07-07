import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateWorkspaceDialog: React.FC<CreateWorkspaceDialogProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultPermission: 'admin'
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "请填写工作空间名称",
        variant: "destructive",
      });
      return;
    }
    if (formData.description.length > 100) {
      toast({
        title: "简介不能超过100字",
        variant: "destructive",
      });
      return;
    }
    
    // 模拟创建工作空间
    toast({
      title: "工作空间创建成功",
      description: `${formData.name} 已创建完成`,
    });
    
    setFormData({ name: '', description: '', defaultPermission: 'admin' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>创建工作空间</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">工作空间名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入工作空间名称"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              简介
              <span className="text-xs text-muted-foreground ml-1">
                ({formData.description.length}/100)
              </span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="请输入工作空间简介"
              maxLength={100}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>成员默认权限</Label>
            <Select
              value={formData.defaultPermission}
              onValueChange={(value) => setFormData({ ...formData, defaultPermission: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">管理员</SelectItem>
                <SelectItem value="member">成员</SelectItem>
                <SelectItem value="viewer">查看者</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">
              创建
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;