
import React, { useState } from 'react';
import { Save, Download, Sparkles, Palette, ChevronRight, ChevronDown, FileText, Image, BarChart3, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, Type } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface BidEditingProps {
  editingTab: 'cover' | 'business' | 'technical';
  setEditingTab: (tab: 'cover' | 'business' | 'technical') => void;
  editingContent: string;
  setEditingContent: (content: string) => void;
}

interface OutlineItem {
  id: string;
  title: string;
  level: number;
  expanded?: boolean;
  children?: OutlineItem[];
}

const BidEditing: React.FC<BidEditingProps> = ({
  editingTab,
  setEditingTab,
  editingContent,
  setEditingContent
}) => {
  const [selectedOutlineItem, setSelectedOutlineItem] = useState<string>('');
  const [knowledgeTab, setKnowledgeTab] = useState<'materials' | 'charts' | 'templates'>('materials');

  // Mock outline data
  const [businessOutline] = useState<OutlineItem[]>([
    {
      id: '1',
      title: '投标函',
      level: 1,
      expanded: true,
      children: [
        { id: '1-1', title: '投标承诺', level: 2 },
        { id: '1-2', title: '投标报价', level: 2 }
      ]
    },
    {
      id: '2',
      title: '法定代表人身份证明',
      level: 1
    },
    {
      id: '3',
      title: '授权委托书',
      level: 1
    },
    {
      id: '4',
      title: '企业资质证明',
      level: 1,
      expanded: true,
      children: [
        { id: '4-1', title: '营业执照', level: 2 },
        { id: '4-2', title: '资质证书', level: 2 }
      ]
    }
  ]);

  const [technicalOutline] = useState<OutlineItem[]>([
    {
      id: 't1',
      title: '技术方案概述',
      level: 1,
      expanded: true,
      children: [
        { id: 't1-1', title: '项目理解', level: 2 },
        { id: 't1-2', title: '技术路线', level: 2 }
      ]
    },
    {
      id: 't2',
      title: '系统架构设计',
      level: 1
    },
    {
      id: 't3',
      title: '实施方案',
      level: 1,
      expanded: true,
      children: [
        { id: 't3-1', title: '实施计划', level: 2 },
        { id: 't3-2', title: '风险控制', level: 2 }
      ]
    }
  ]);

  const handleSave = () => {
    toast({
      title: "保存成功",
      description: "标书内容已保存",
    });
  };

  const handleDownload = () => {
    console.log('下载标书');
  };

  const handleAIPolish = () => {
    console.log('AI润色');
  };

  const handleAIBeautify = () => {
    console.log('AI美化');
  };

  const renderOutlineItem = (item: OutlineItem, outline: OutlineItem[], setOutline: (outline: OutlineItem[]) => void) => {
    const toggleExpand = () => {
      const updateItem = (items: OutlineItem[]): OutlineItem[] => {
        return items.map(i => {
          if (i.id === item.id) {
            return { ...i, expanded: !i.expanded };
          }
          if (i.children) {
            return { ...i, children: updateItem(i.children) };
          }
          return i;
        });
      };
      setOutline(updateItem(outline));
    };

    return (
      <div key={item.id}>
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 rounded text-sm ${
            selectedOutlineItem === item.id ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${item.level * 12 + 8}px` }}
          onClick={() => setSelectedOutlineItem(item.id)}
        >
          {item.children && item.children.length > 0 && (
            <button onClick={(e) => { e.stopPropagation(); toggleExpand(); }} className="mr-1">
              {item.expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          <span className="flex-1">{item.title}</span>
        </div>
        {item.expanded && item.children && (
          <div>
            {item.children.map(child => renderOutlineItem(child, outline, setOutline))}
          </div>
        )}
      </div>
    );
  };

  const getCurrentOutline = () => {
    return editingTab === 'business' ? businessOutline : technicalOutline;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
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

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧大纲目录 */}
        <div className="w-64 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <Tabs value={editingTab} onValueChange={(value) => setEditingTab(value as 'cover' | 'business' | 'technical')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="business" className="text-xs">商务标</TabsTrigger>
                <TabsTrigger value="technical" className="text-xs">技术标</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
              {getCurrentOutline().map(item => renderOutlineItem(item, getCurrentOutline(), () => {}))}
            </div>
          </ScrollArea>
        </div>

        {/* 中间可编辑区域 */}
        <div className="flex-1 flex flex-col">
          {/* Word样式工具栏 */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-1">
              {/* 文本格式工具 */}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bold className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Italic className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Underline className="w-4 h-4" />
              </Button>
              
              <Separator orientation="vertical" className="h-6 mx-2" />
              
              {/* 对齐工具 */}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignRight className="w-4 h-4" />
              </Button>
              
              <Separator orientation="vertical" className="h-6 mx-2" />
              
              {/* 列表工具 */}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <List className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ListOrdered className="w-4 h-4" />
              </Button>
              
              <Separator orientation="vertical" className="h-6 mx-2" />
              
              {/* 其他工具 */}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Link className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Type className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={handleAIPolish} variant="outline" size="sm">
                <Sparkles className="w-4 h-4 mr-1" />
                AI润色
              </Button>
              <Button onClick={handleAIBeautify} variant="outline" size="sm">
                <Palette className="w-4 h-4 mr-1" />
                AI美化
              </Button>
            </div>
          </div>

          {/* 文档编辑区域 */}
          <div className="flex-1 p-6 bg-white" style={{ backgroundColor: '#fafafa' }}>
            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg min-h-full p-8">
              <Textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                placeholder="在此输入或编辑标书内容..."
                className="min-h-[600px] border-0 resize-none focus-visible:ring-0 text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 右侧知识库 */}
        <div className="w-80 border-l border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              投标文库
            </h4>
            <Tabs value={knowledgeTab} onValueChange={(value) => setKnowledgeTab(value as 'materials' | 'charts' | 'templates')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="materials" className="text-xs">素材</TabsTrigger>
                <TabsTrigger value="charts" className="text-xs">图表</TabsTrigger>
                <TabsTrigger value="templates" className="text-xs">模板</TabsTrigger>
              </TabsList>
              
              <TabsContent value="materials" className="p-3 m-0">
                <div className="space-y-2">
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">公司简介模板</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">标准公司介绍文本</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm">项目经验说明</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">类似项目经验描述</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="text-sm">技术方案框架</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">通用技术实施方案</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="charts" className="p-3 m-0">
                <div className="space-y-2">
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">项目进度图</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">甘特图模板</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center">
                      <Image className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm">系统架构图</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">技术架构示意图</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-orange-500" />
                      <span className="text-sm">成本分析表</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">预算分析图表</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="templates" className="p-3 m-0">
                <div className="space-y-2">
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-sm">投标函模板</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">标准投标函格式</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">技术方案模板</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">技术实施方案框架</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="text-sm">商务方案模板</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">商务条款标准格式</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidEditing;
