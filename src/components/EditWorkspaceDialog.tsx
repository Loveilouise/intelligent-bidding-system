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
import { useToast } from '@/hooks/use-toast';

interface EditWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: 'name' | 'description';
  currentValue: string;
  onSave: (newValue: string) => void;
}

const EditWorkspaceDialog: React.FC<EditWorkspaceDialogProps> = ({ 
  open, 
  onOpenChange, 
  field,
  currentValue, 
  onSave 
}) => {
  const [value, setValue] = useState(currentValue);
  const { toast } = useToast();

  const isDescription = field === 'description';
  const title = isDescription ? '编辑工作空间简介' : '编辑工作空间名称';
  const label = isDescription ? '工作空间简介' : '工作空间名称';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDescription && !value.trim()) {
      toast({
        title: "工作空间名称不能为空",
        variant: "destructive",
      });
      return;
    }
    
    if (isDescription && value.length > 100) {
      toast({
        title: "简介不能超过100字",
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
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={field}>
              {label}
              {isDescription && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({value.length}/100)
                </span>
              )}
            </Label>
            {isDescription ? (
              <Textarea
                id={field}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`请输入${label}`}
                maxLength={100}
                rows={3}
              />
            ) : (
              <Input
                id={field}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`请输入${label}`}
                required
              />
            )}
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

export default EditWorkspaceDialog;