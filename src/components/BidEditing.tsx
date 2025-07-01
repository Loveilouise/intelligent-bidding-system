
import React from 'react';
import { Save, Download, Sparkles, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface BidEditingProps {
  editingTab: 'cover' | 'business' | 'technical';
  setEditingTab: (tab: 'cover' | 'business' | 'technical') => void;
  editingContent: string;
  setEditingContent: (content: string) => void;
}

const BidEditing: React.FC<BidEditingProps> = ({
  editingTab,
  setEditingTab,
  editingContent,
  setEditingContent
}) => {
  const handleSave = () => {
    toast({
      title: "保存成功",
      description: "标书内容已保存",
    });
  };

  const handleDownload = () => {
    // 下载标书逻辑
    console.log('下载标书');
  };

  const handleAIPolish = () => {
    // AI润色逻辑
    console.log('AI润色');
  };

  const handleAIBeautify = () => {
    // AI美化逻辑
    console.log('AI美化');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">生成全文</h3>
        
        <div className="flex items-center space-x-2">
          <Button onClick={handleSave} variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
          <Button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700" size="sm">
            <Download className="w-4 h-4 mr-2" />
            下载标书
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1 gap-6">
        {/* 左侧导航 */}
        <div className="w-48 flex-shrink-0">
          <Tabs 
            value={editingTab} 
            onValueChange={(value) => setEditingTab(value as 'cover' | 'business' | 'technical')}
            orientation="vertical"
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-1 h-auto">
              <TabsTrigger value="cover" className="justify-start">封面</TabsTrigger>
              <TabsTrigger value="business" className="justify-start">商务标</TabsTrigger>
              <TabsTrigger value="technical" className="justify-start">技术标</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 右侧内容区域 */}
        <div className="flex-1 flex flex-col">
          {/* 右侧功能按钮 */}
          <div className="flex items-center justify-end space-x-2 mb-4">
            <Button onClick={handleAIPolish} variant="outline" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI润色
            </Button>
            <Button onClick={handleAIBeautify} variant="outline" size="sm">
              <Palette className="w-4 h-4 mr-2" />
              AI美化
            </Button>
          </div>

          {/* 可编辑内容区域 */}
          <div className="flex-1 border border-gray-200 rounded-lg bg-white">
            <Tabs value={editingTab}>
              <TabsContent value="cover" className="h-full m-0">
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  placeholder="输入封面内容..."
                  className="h-full min-h-[500px] border-0 rounded-lg resize-none focus-visible:ring-0"
                />
              </TabsContent>
              
              <TabsContent value="business" className="h-full m-0">
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  placeholder="输入商务标内容..."
                  className="h-full min-h-[500px] border-0 rounded-lg resize-none focus-visible:ring-0"
                />
              </TabsContent>
              
              <TabsContent value="technical" className="h-full m-0">
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  placeholder="输入技术标内容..."
                  className="h-full min-h-[500px] border-0 rounded-lg resize-none focus-visible:ring-0"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidEditing;
