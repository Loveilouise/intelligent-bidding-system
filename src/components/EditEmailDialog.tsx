import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface EditEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentValue: string;
  onSave: (newValue: string) => void;
}

const EditEmailDialog: React.FC<EditEmailDialogProps> = ({ 
  open, 
  onOpenChange, 
  currentValue, 
  onSave 
}) => {
  const [value, setValue] = useState(currentValue);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      toast({
        title: "邮箱不能为空",
        variant: "destructive",
      });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      toast({
        title: "请输入有效的邮箱地址",
        variant: "destructive",
      });
      return;
    }
    
    onSave(value);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>编辑邮箱</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="请输入邮箱地址"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">
              保存
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmailDialog;