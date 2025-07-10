
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
    <div className="bg-white rounded-lg border border-gray-200 min-h-[600px] flex flex-col">
      <Tabs value={editingTab} onValueChange={(value) => setEditingTab(value as 'cover' | 'business' | 'technical')} className="h-full">
        <div className="border-b border-gray-200 p-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cover">封面页</TabsTrigger>
            <TabsTrigger value="business">商务标</TabsTrigger>
            <TabsTrigger value="technical">技术标</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 p-4">
          <TabsContent value="cover" className="h-full">
            <div className="space-y-4 h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">封面页内容</h3>
              </div>
              <Textarea
                placeholder="请输入封面页内容..."
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="flex-1 min-h-[400px] resize-none"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="business" className="h-full">
            <div className="space-y-4 h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">商务标内容</h3>
              </div>
              <Textarea
                placeholder="请输入商务标内容..."
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="flex-1 min-h-[400px] resize-none"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="technical" className="h-full">
            <div className="space-y-4 h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">技术标内容</h3>
              </div>
              <Textarea
                placeholder="请输入技术标内容..."
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="flex-1 min-h-[400px] resize-none"
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default BidEditing;
