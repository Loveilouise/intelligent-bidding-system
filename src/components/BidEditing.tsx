
import React, { useState } from 'react';
import { ArrowLeft, Save, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import OutlineEditor from './OutlineEditor';
import MaterialLibrary from './MaterialLibrary';

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
  const [selectedOutlineItem, setSelectedOutlineItem] = useState<string>('');
  const [wordCount, setWordCount] = useState(2580);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "保存成功",
      description: "文档保存成功",
    });
  };

  const handleInsertMaterial = (content: string) => {
    setEditingContent(editingContent + '\n\n' + content);
    setWordCount(prev => prev + content.length);
  };

  const handleContentChange = (value: string) => {
    setEditingContent(value);
    setWordCount(value.replace(/\s/g, '').length);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">当前字数</span>
              <span className="font-medium text-sky-600">{wordCount}</span>
            </div>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              上一步
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-medium">创建标书</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>已自动保存</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-6 w-6 p-0"
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button>下载标书</Button>
      </div>

      {/* 主要内容区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧目录 */}
        <div className="w-80 border-r border-gray-200 bg-white">
          <OutlineEditor
            selectedOutlineItem={selectedOutlineItem}
            setSelectedOutlineItem={setSelectedOutlineItem}
          />
        </div>

        {/* 中间可编辑区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 编辑工具栏 */}
          <div className="flex items-center p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-1">
              <button className="p-1 hover:bg-gray-200 rounded">
                <Bold className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <Italic className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <Underline className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 mx-2" />
              
              <button className="p-1 hover:bg-gray-200 rounded">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <AlignCenter className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <AlignRight className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 mx-2" />
              
              <button className="p-1 hover:bg-gray-200 rounded">
                <List className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <ListOrdered className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 mx-2" />
              
              <button className="p-1 hover:bg-gray-200 rounded">
                <Link className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <Type className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 文档编辑区域 */}
          <div className="flex-1 p-6 bg-gray-50 overflow-auto">
            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg min-h-full p-8">
              <Textarea
                value={editingContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="在此输入或编辑标书内容..."
                className="min-h-[600px] border-0 resize-none focus-visible:ring-0 text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 右侧素材库 */}
        <div className="w-80 border-l border-gray-200 bg-white">
          <MaterialLibrary onInsertMaterial={handleInsertMaterial} />
        </div>
      </div>
    </div>
  );
};

export default BidEditing;
