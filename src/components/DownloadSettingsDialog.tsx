
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [fileFormat, setFileFormat] = useState('docx');
  const [includeImages, setIncludeImages] = useState(true);
  const [includeToc, setIncludeToc] = useState(true);
  const [pageLayout, setPageLayout] = useState('a4');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>下载设置</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">文件格式</Label>
            <RadioGroup value={fileFormat} onValueChange={setFileFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="docx" id="docx" className="border-primary text-primary" />
                <Label htmlFor="docx">Word 文档 (.docx)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" className="border-primary text-primary" />
                <Label htmlFor="pdf">PDF 文档 (.pdf)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">页面设置</Label>
            <div className="space-y-2">
              <Label htmlFor="page-layout" className="text-sm">页面大小</Label>
              <Select value={pageLayout} onValueChange={setPageLayout}>
                <SelectTrigger id="page-layout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="a3">A3</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">内容选项</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-images"
                  checked={includeImages}
                  onCheckedChange={(checked) => setIncludeImages(checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="include-images">包含图片</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-toc"
                  checked={includeToc}
                  onCheckedChange={(checked) => setIncludeToc(checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="include-toc">包含目录</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={onDownload} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            下载
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadSettingsDialog;
