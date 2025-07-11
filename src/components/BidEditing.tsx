
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, Image, BarChart3, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, Type, Search, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import CatalogItem from '@/components/CatalogItem';
import { CatalogItem as CatalogItemType } from '@/types/bid';

interface BidEditingProps {
  editingTab: 'cover' | 'business' | 'technical';
  setEditingTab: (tab: 'cover' | 'business' | 'technical') => void;
  editingContent: string;
  setEditingContent: (content: string) => void;
  catalogItems: CatalogItemType[];
  setCatalogItems: (items: CatalogItemType[]) => void;
}

interface MaterialItem {
  id: string;
  name: string;
  type: 'document' | 'image' | 'table';
  folder: string;
  content?: string;
}

const BidEditing: React.FC<BidEditingProps> = ({
  editingTab,
  setEditingTab,
  editingContent,
  setEditingContent,
  catalogItems,
  setCatalogItems
}) => {
  const [selectedOutlineItem, setSelectedOutlineItem] = useState<string>('');
  const [knowledgeTab, setKnowledgeTab] = useState<'materials' | 'charts' | 'templates'>('materials');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [materialFilter, setMaterialFilter] = useState<'all' | 'document' | 'image' | 'table'>('all');
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // 独立的商务标和技术标目录
  const [businessCatalogItems] = useState<CatalogItemType[]>([
    { 
      id: '1', 
      title: '商务标书', 
      level: 1,
      expanded: true,
      children: [
        { id: '1-1', title: '投标函', level: 2 },
        { id: '1-2', title: '法定代表人身份证明', level: 2 },
        { id: '1-3', title: '授权委托书', level: 2 }
      ]
    },
    { id: '2', title: '资质证明文件', level: 1, expanded: true },
    { id: '3', title: '财务状况报告', level: 1, expanded: true }
  ]);

  const [technicalCatalogItems, setTechnicalCatalogItems] = useState<CatalogItemType[]>([
    { 
      id: 't1', 
      title: '技术方案', 
      level: 1,
      expanded: true,
      children: [
        { id: 't1-1', title: '系统架构设计', level: 2 },
        { id: 't1-2', title: '技术实现方案', level: 2 },
        { id: 't1-3', title: '性能优化方案', level: 2 }
      ]
    },
    { id: 't2', title: '项目实施方案', level: 1, expanded: true },
    { id: 't3', title: '质量保证体系', level: 1, expanded: true }
  ]);

  // Mock 素材库数据
  const [materialFolders] = useState([
    { id: 'company', name: '公司介绍', count: 15 },
    { id: 'technical', name: '技术方案', count: 23 },
    { id: 'cases', name: '项目案例', count: 18 },
    { id: 'certificates', name: '资质证书', count: 12 }
  ]);

  const [materials] = useState<MaterialItem[]>([
    { id: '1', name: '公司简介模板', type: 'document', folder: 'company', content: '这是公司简介的详细内容...' },
    { id: '2', name: '组织架构图', type: 'image', folder: 'company' },
    { id: '3', name: '技术架构图', type: 'image', folder: 'technical' },
    { id: '4', name: '项目经验表', type: 'table', folder: 'cases' },
    { id: '5', name: '资质证书扫描件', type: 'image', folder: 'certificates' },
    { id: '6', name: '类似项目案例', type: 'document', folder: 'cases', content: '项目案例详细描述...' }
  ]);

  const handleToggleExpansion = (itemId: string) => {
    const updateItems = (items: CatalogItemType[]): CatalogItemType[] => {
      return items.map(item => {
        if (item.id === itemId) {
          return { ...item, expanded: !item.expanded };
        }
        if (item.children) {
          return { ...item, children: updateItems(item.children) };
        }
        return item;
      });
    };
    
    if (editingTab === 'technical') {
      setTechnicalCatalogItems(updateItems(technicalCatalogItems));
    }
  };

  const handleAddSameLevel = (parentId: string | null, afterId: string) => {
    const newId = Date.now().toString();
    const newItem: CatalogItemType = {
      id: newId,
      title: '新章节',
      level: getItemLevel(afterId) || 1
    };

    const addItem = (items: CatalogItemType[]): CatalogItemType[] => {
      if (!parentId) {
        const index = items.findIndex(item => item.id === afterId);
        return [...items.slice(0, index + 1), newItem, ...items.slice(index + 1)];
      }
      
      return items.map(item => {
        if (item.id === parentId && item.children) {
          const index = item.children.findIndex(child => child.id === afterId);
          const newChildren = [...item.children.slice(0, index + 1), newItem, ...item.children.slice(index + 1)];
          return { ...item, children: newChildren };
        }
        if (item.children) {
          return { ...item, children: addItem(item.children) };
        }
        return item;
      });
    };

    if (editingTab === 'technical') {
      setTechnicalCatalogItems(addItem(technicalCatalogItems));
    }
  };

  const handleAddSubLevel = (parentId: string) => {
    const newId = Date.now().toString();
    const parentLevel = getItemLevel(parentId) || 1;
    const newItem: CatalogItemType = {
      id: newId,
      title: '新子章节',
      level: parentLevel + 1
    };

    const addSubItem = (items: CatalogItemType[]): CatalogItemType[] => {
      return items.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            expanded: true,
            children: [...(item.children || []), newItem]
          };
        }
        if (item.children) {
          return { ...item, children: addSubItem(item.children) };
        }
        return item;
      });
    };

    if (editingTab === 'technical') {
      setTechnicalCatalogItems(addSubItem(technicalCatalogItems));
    }
  };

  const handleDelete = (itemId: string) => {
    const removeItem = (items: CatalogItemType[]): CatalogItemType[] => {
      return items.filter(item => {
        if (item.id === itemId) return false;
        if (item.children) {
          item.children = removeItem(item.children);
        }
        return true;
      });
    };
    
    if (editingTab === 'technical') {
      setTechnicalCatalogItems(removeItem(technicalCatalogItems));
    }
  };

  const handleDoubleClick = (itemId: string, title: string) => {
    setEditingItem(itemId);
    setEditingText(title);
  };

  const handleSaveEdit = () => {
    if (!editingItem || !editingText.trim()) return;
    
    const updateItem = (items: CatalogItemType[]): CatalogItemType[] => {
      return items.map(item => {
        if (item.id === editingItem) {
          return { ...item, title: editingText.trim() };
        }
        if (item.children) {
          return { ...item, children: updateItem(item.children) };
        }
        return item;
      });
    };
    
    if (editingTab === 'technical') {
      setTechnicalCatalogItems(updateItem(technicalCatalogItems));
    }
    setEditingItem(null);
    setEditingText('');
  };

  const handleGenerate = (itemId: string, title: string) => {
    console.log('生成章节:', itemId, title);
    // 这里可以添加生成逻辑
  };

  const getItemLevel = (itemId: string): number | null => {
    const findItem = (items: CatalogItemType[]): CatalogItemType | null => {
      for (const item of items) {
        if (item.id === itemId) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const currentItems = editingTab === 'technical' ? technicalCatalogItems : businessCatalogItems;
    const item = findItem(currentItems);
    return item?.level || null;
  };

  const getFilteredMaterials = () => {
    let filtered = materials.filter(material => material.folder === currentFolder);
    
    if (materialFilter !== 'all') {
      filtered = filtered.filter(material => material.type === materialFilter);
    }
    
    if (searchKeyword) {
      filtered = filtered.filter(material => 
        material.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleInsertMaterial = (material: MaterialItem) => {
    if (material.content) {
      setEditingContent(editingContent + '\n\n' + material.content);
    }
  };

  const renderMaterialIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'table':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCurrentOutline = () => {
    return editingTab === 'business' ? businessCatalogItems : technicalCatalogItems;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex">
      {/* 左侧大纲目录 - 固定宽度 */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">目录</h4>
          <Tabs value={editingTab} onValueChange={(value) => setEditingTab(value as 'cover' | 'business' | 'technical')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="business" className="text-xs">商务标</TabsTrigger>
              <TabsTrigger value="technical" className="text-xs">技术标</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {getCurrentOutline().map(item => (
              <CatalogItem
                key={item.id}
                item={item}
                parentId={null}
                onToggleExpansion={handleToggleExpansion}
                onAddSameLevel={handleAddSameLevel}
                onAddSubLevel={handleAddSubLevel}
                onDelete={handleDelete}
                onDoubleClick={handleDoubleClick}
                onGenerate={editingTab === 'technical' ? handleGenerate : undefined}
                editingItem={editingItem}
                editingText={editingText}
                setEditingText={setEditingText}
                onSaveEdit={handleSaveEdit}
                showGenerateButton={editingTab === 'technical'}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 中间可编辑区域 - 占据剩余空间 */}
      <div className="flex-1 flex flex-col">
        {/* Word样式工具栏 */}
        <div className="flex items-center p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-1">
            {/* 文本格式工具 */}
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
            
            {/* 对齐工具 */}
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
            
            {/* 列表工具 */}
            <button className="p-1 hover:bg-gray-200 rounded">
              <List className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <ListOrdered className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            {/* 其他工具 */}
            <button className="p-1 hover:bg-gray-200 rounded">
              <Link className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <Type className="w-4 h-4" />
            </button>
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

      {/* 右侧素材库 - 固定宽度 */}
      <div className="w-80 border-l border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            素材库
          </h4>
          
          {currentFolder === 'root' ? (
            // 显示文件夹列表
            <div className="space-y-2">
              {materialFolders.map(folder => (
                <div
                  key={folder.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setCurrentFolder(folder.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{folder.name}</span>
                    <span className="text-xs text-gray-500">{folder.count}个</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // 显示文件夹内容
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentFolder('root')}
                  className="text-xs"
                >
                  返回
                </Button>
                <span className="text-sm text-gray-600">
                  {materialFolders.find(f => f.id === currentFolder)?.name}
                </span>
              </div>
              
              {/* 搜索和筛选 */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索素材..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                
                <Select value={materialFilter} onValueChange={(value) => setMaterialFilter(value as any)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="筛选类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="document">文档</SelectItem>
                    <SelectItem value="image">图片</SelectItem>
                    <SelectItem value="table">表格</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* 素材列表 */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {getFilteredMaterials().map(material => (
                  <div
                    key={material.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleInsertMaterial(material)}
                  >
                    <div className="flex items-center">
                      {renderMaterialIcon(material.type)}
                      <span className="text-sm ml-2">{material.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {material.type === 'document' ? '文档' : 
                       material.type === 'image' ? '图片' : '表格'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidEditing;
