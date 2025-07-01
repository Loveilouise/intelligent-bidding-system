
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

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
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">生成全文</h3>
      
      <Tabs value={editingTab} onValueChange={(value) => setEditingTab(value as 'cover' | 'business' | 'technical')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cover">封面</TabsTrigger>
          <TabsTrigger value="business">商务标</TabsTrigger>
          <TabsTrigger value="technical">技术标</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cover" className="mt-4">
          <div className="space-y-4">
            <Textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              placeholder="输入封面内容..."
              className="min-h-[400px]"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="business" className="mt-4">
          <div className="space-y-4">
            <Textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              placeholder="输入商务标内容..."
              className="min-h-[400px]"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="mt-4">
          <div className="space-y-4">
            <Textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              placeholder="输入技术标内容..."
              className="min-h-[400px]"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BidEditing;
