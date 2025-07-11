
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { AlignLeft, AlignCenter, AlignRight, Bold } from 'lucide-react';

interface DownloadSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
}

const DownloadSettingsDialog: React.FC<DownloadSettingsDialogProps> = ({
  open,
  onOpenChange,
  onDownload
}) => {
  const [numberingStyle, setNumberingStyle] = useState('1');
  const [titleSettings, setTitleSettings] = useState({
    level1: { font: '黑体', size: '二号', indent: '0', spacing: '1.5', align: 'center', bold: true },
    level2: { font: '黑体', size: '小二', indent: '0', spacing: '1.5', align: 'center', bold: true },
    level3: { font: '宋体', size: '三号', indent: '2', spacing: '1.5', align: 'left', bold: true },
    body: { font: '宋体', size: '三号', indent: '2', spacing: '1.5', align: 'left', bold: false }
  });
  const [contentSettings, setContentSettings] = useState({
    numbering: { level1: '一、', level2: '(一)', level3: '1.', level4: '(1)' },
    table: { font: '宋体', size: '10', spacing: '1.0' }
  });
  const [pageSettings, setPageSettings] = useState({
    topMargin: '2.5',
    bottomMargin: '2.5',
    leftMargin: '2.5',
    rightMargin: '2.5'
  });

  const numberingTemplates = [
    { id: '1', name: '模板一', preview: '第一章 1.1 (1)' },
    { id: '2', name: '模板二', preview: '一、 1、 (1)' },
    { id: '3', name: '模板三', preview: '1. 1.1 1.1.1' },
    { id: '4', name: '模板四', preview: 'I. A. 1.' },
    { id: '5', name: '模板五', preview: '壹、 一、 1、' }
  ];

  const fontOptions = ['宋体', '仿宋' ,'黑体', '楷体', '微软雅黑'];
  const sizeOptions = ['初号', '小初', '一号', '小一', '二号', '小二', '三号', '小三', '四号', '小四', '五号', '小五'];
  const spacingOptions = ['1.0', '1.15', '1.5', '2.0', '2.5', '3.0'];

  const renderTitleFormatSection = (
    title: string,
    key: keyof typeof titleSettings,
    settings: typeof titleSettings.level1
  ) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-gray-900">{title}</h4>
      <div className="grid grid-cols-6 gap-3">
        <div>
          <Label className="text-xs text-gray-600">字体</Label>
          <Select 
            value={settings.font} 
            onValueChange={(value) => setTitleSettings(prev => ({
              ...prev, 
              [key]: { ...prev[key], font: value }
            }))}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map(font => (
                <SelectItem key={font} value={font}>{font}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">字号</Label>
          <Select 
            value={settings.size} 
            onValueChange={(value) => setTitleSettings(prev => ({
              ...prev, 
              [key]: { ...prev[key], size: value }
            }))}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map(size => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">首行缩进</Label>
          <Input 
            value={settings.indent} 
            onChange={(e) => setTitleSettings(prev => ({
              ...prev, 
              [key]: { ...prev[key], indent: e.target.value }
            }))}
            className="h-8" 
            placeholder="字符"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">行间距</Label>
          <Select 
            value={settings.spacing} 
            onValueChange={(value) => setTitleSettings(prev => ({
              ...prev, 
              [key]: { ...prev[key], spacing: value }
            }))}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {spacingOptions.map(spacing => (
                <SelectItem key={spacing} value={spacing}>{spacing}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">对齐</Label>
          <div className="flex">
            <Toggle 
              pressed={settings.align === 'left'} 
              onPressedChange={() => setTitleSettings(prev => ({
                ...prev, 
                [key]: { ...prev[key], align: 'left' }
              }))}
              size="sm"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <AlignLeft className="w-3 h-3" />
            </Toggle>
            <Toggle 
              pressed={settings.align === 'center'} 
              onPressedChange={() => setTitleSettings(prev => ({
                ...prev, 
                [key]: { ...prev[key], align: 'center' }
              }))}
              size="sm"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <AlignCenter className="w-3 h-3" />
            </Toggle>
            <Toggle 
              pressed={settings.align === 'right'} 
              onPressedChange={() => setTitleSettings(prev => ({
                ...prev, 
                [key]: { ...prev[key], align: 'right' }
              }))}
              size="sm"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <AlignRight className="w-3 h-3" />
            </Toggle>
          </div>
        </div>
        <div>
          <Label className="text-xs text-gray-600">加粗</Label>
          <div>
            <Toggle 
              pressed={settings.bold} 
              onPressedChange={() => setTitleSettings(prev => ({
                ...prev, 
                [key]: { ...prev[key], bold: !prev[key].bold }
              }))}
              size="sm"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Bold className="w-3 h-3" />
            </Toggle>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>下载设置</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 标题设置 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">标题设置</h3>
            
            {/* 编号样式 */}
            <div className="mb-6">
              <h4 className="font-medium text-sm text-gray-900 mb-3">编号样式</h4>
              <div className="grid grid-cols-5 gap-3">
                {numberingTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      numberingStyle === template.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setNumberingStyle(template.id)}
                  >
                    <div className="text-sm font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{template.preview}</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* 标题格式设置 */}
            <div className="space-y-4">
              {renderTitleFormatSection('一级标题格式（第XX章）', 'level1', titleSettings.level1)}
              {renderTitleFormatSection('二级标题格式（第XX节）', 'level2', titleSettings.level2)}
              {renderTitleFormatSection('三级标题格式（一、二）', 'level3', titleSettings.level3)}
              {renderTitleFormatSection('正文格式', 'body', titleSettings.body)}
            </div>
          </div>

          <Separator />

          {/* 内容设置 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">内容设置</h3>
            
            {/* 正文序号列表 */}
            <div className="mb-6">
              <h4 className="font-medium text-sm text-gray-900 mb-3">正文序号列表</h4>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">第一级序号</Label>
                  <Input 
                    value={contentSettings.numbering.level1}
                    onChange={(e) => setContentSettings(prev => ({
                      ...prev,
                      numbering: { ...prev.numbering, level1: e.target.value }
                    }))} 
                    className="h-8" 
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">第二级序号</Label>
                  <Input 
                    value={contentSettings.numbering.level2}
                    onChange={(e) => setContentSettings(prev => ({
                      ...prev,
                      numbering: { ...prev.numbering, level2: e.target.value }
                    }))} 
                    className="h-8" 
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">第三级序号</Label>
                  <Input 
                    value={contentSettings.numbering.level3}
                    onChange={(e) => setContentSettings(prev => ({
                      ...prev,
                      numbering: { ...prev.numbering, level3: e.target.value }
                    }))} 
                    className="h-8" 
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">第四级序号</Label>
                  <Input 
                    value={contentSettings.numbering.level4}
                    onChange={(e) => setContentSettings(prev => ({
                      ...prev,
                      numbering: { ...prev.numbering, level4: e.target.value }
                    }))} 
                    className="h-8" 
                  />
                </div>
              </div>
            </div>

            {/* 表格设置 */}
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-3">表格</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">字体</Label>
                  <Select 
                    value={contentSettings.table.font} 
                    onValueChange={(value) => setContentSettings(prev => ({
                      ...prev,
                      table: { ...prev.table, font: value }
                    }))}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map(font => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">字号</Label>
                  <Select 
                    value={contentSettings.table.size} 
                    onValueChange={(value) => setContentSettings(prev => ({
                      ...prev,
                      table: { ...prev.table, size: value }
                    }))}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sizeOptions.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">行间距</Label>
                  <Select 
                    value={contentSettings.table.spacing} 
                    onValueChange={(value) => setContentSettings(prev => ({
                      ...prev,
                      table: { ...prev.table, spacing: value }
                    }))}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {spacingOptions.map(spacing => (
                        <SelectItem key={spacing} value={spacing}>{spacing}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 全局设置 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">全局设置</h3>
            
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-3">页面格式</h4>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">上边距 (cm)</Label>
                  <Input 
                    value={pageSettings.topMargin}
                    onChange={(e) => setPageSettings(prev => ({
                      ...prev,
                      topMargin: e.target.value
                    }))} 
                    className="h-8" 
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">下边距 (cm)</Label>
                  <Input 
                    value={pageSettings.bottomMargin}
                    onChange={(e) => setPageSettings(prev => ({
                      ...prev,
                      bottomMargin: e.target.value
                    }))} 
                    className="h-8" 
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">左边距 (cm)</Label>
                  <Input 
                    value={pageSettings.leftMargin}
                    onChange={(e) => setPageSettings(prev => ({
                      ...prev,
                      leftMargin: e.target.value
                    }))} 
                    className="h-8" 
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">右边距 (cm)</Label>
                  <Input 
                    value={pageSettings.rightMargin}
                    onChange={(e) => setPageSettings(prev => ({
                      ...prev,
                      rightMargin: e.target.value
                    }))} 
                    className="h-8" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={onDownload}>
            下载
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadSettingsDialog;
