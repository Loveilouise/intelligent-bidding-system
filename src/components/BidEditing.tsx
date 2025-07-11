import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronDown, FileText, Image, BarChart3, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, Type, Search, Filter, Check, Eye, Square, CheckSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
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
  description?: string;
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
  const [materialTypeTab, setMaterialTypeTab] = useState<'all' | 'document' | 'image' | 'table'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedGenerateItem, setSelectedGenerateItem] = useState<{ id: string; title: string } | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
  const [previewMaterial, setPreviewMaterial] = useState<MaterialItem | null>(null);
  const [previewSheetOpen, setPreviewSheetOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [materialFolders] = useState([
    { id: 'company', name: '公司介绍', count: 15 },
    { id: 'technical', name: '技术方案', count: 23 },
    { id: 'cases', name: '项目案例', count: 18 },
    { id: 'certificates', name: '资质证书', count: 12 }
  ]);

  const [materials] = useState<MaterialItem[]>([
    { id: '1', name: '公司简介模板', type: 'document', folder: 'company', content: '这是公司简介的详细内容...', description: '公司基本信息介绍文档' },
    { id: '2', name: '组织架构图', type: 'image', folder: 'company', content: '[组织架构图]', description: '公司组织架构示意图' },
    { id: '3', name: '技术架构图', type: 'image', folder: 'technical', content: '[技术架构图]', description: '系统技术架构图' },
    { id: '4', name: '项目经验表', type: 'table', folder: 'cases', content: '| 项目名称 | 完成时间 | 项目规模 |\n|---------|---------|----------|\n| 示例项目1 | 2023年 | 大型 |', description: '历史项目经验统计表格' },
    { id: '5', name: '资质证书扫描件', type: 'image', folder: 'certificates', content: '[资质证书图片]', description: '公司相关资质证书' },
    { id: '6', name: '类似项目案例', type: 'document', folder: 'cases', content: '项目案例详细描述...', description: '相似项目实施案例' },
    { id: '7', name: '软件著作权证书', type: 'image', folder: 'certificates', content: '[软件著作权证书]', description: '软件著作权相关证书' },
    { id: '8', name: '技术方案文档', type: 'document', folder: 'technical', content: '技术实施方案详细说明...', description: '详细技术实施方案' },
    { id: '9', name: '人员配置表', type: 'table', folder: 'company', content: '| 岗位 | 人数 | 经验要求 |\n|-----|-----|----------|\n| 项目经理 | 1 | 5年以上 |', description: '项目人员配置统计' }
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
    setCatalogItems(updateItems(catalogItems));
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

    setCatalogItems(addItem(catalogItems));
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

    setCatalogItems(addSubItem(catalogItems));
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
    setCatalogItems(removeItem(catalogItems));
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
    
    setCatalogItems(updateItem(catalogItems));
    setEditingItem(null);
    setEditingText('');
  };

  const handleGenerate = (itemId: string, title: string) => {
    setSelectedGenerateItem({ id: itemId, title });
    setGenerateDialogOpen(true);
  };

  const handleConfirmGenerate = () => {
    if (selectedGenerateItem) {
      console.log('生成章节:', selectedGenerateItem.title);
      setEditingContent(editingContent + `\n\n## ${selectedGenerateItem.title}\n\n[AI生成的内容将在这里显示...]`);
    }
    setGenerateDialogOpen(false);
    setSelectedGenerateItem(null);
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
    
    const item = findItem(catalogItems);
    return item?.level || null;
  };

  const getFilteredMaterials = () => {
    let filtered = materials.filter(material => material.folder === currentFolder);
    
    if (materialTypeTab !== 'all') {
      filtered = filtered.filter(material => material.type === materialTypeTab);
    }
    
    if (searchKeyword) {
      filtered = filtered.filter(material => 
        material.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleSelectMaterial = (materialId: string) => {
    const newSelectedMaterials = new Set(selectedMaterials);
    if (newSelectedMaterials.has(materialId)) {
      newSelectedMaterials.delete(materialId);
    } else {
      newSelectedMaterials.add(materialId);
    }
    setSelectedMaterials(newSelectedMaterials);
  };

  const handleSelectAllMaterials = () => {
    const filteredMaterials = getFilteredMaterials();
    const allIds = filteredMaterials.map(m => m.id);
    const isAllSelected = allIds.every(id => selectedMaterials.has(id));
    
    if (isAllSelected) {
      // 取消全选
      const newSelectedMaterials = new Set(selectedMaterials);
      allIds.forEach(id => newSelectedMaterials.delete(id));
      setSelectedMaterials(newSelectedMaterials);
    } else {
      // 全选
      const newSelectedMaterials = new Set(selectedMaterials);
      allIds.forEach(id => newSelectedMaterials.add(id));
      setSelectedMaterials(newSelectedMaterials);
    }
  };

  const handlePreviewMaterial = (material: MaterialItem) => {
    setPreviewMaterial(material);
    setPreviewSheetOpen(true);
  };

  const handleInsertMaterials = () => {
    if (selectedMaterials.size === 0 || !textareaRef.current) return;
    
    const selectedMaterialsData = materials.filter(m => selectedMaterials.has(m.id));
    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const textBefore = editingContent.slice(0, cursorPosition);
    const textAfter = editingContent.slice(cursorPosition);
    
    const insertContent = selectedMaterialsData
      .map(material => material.content || '')
      .join('\n\n');
    
    const newContent = textBefore + '\n\n' + insertContent + '\n\n' + textAfter;
    setEditingContent(newContent);
    
    // 重新设置光标位置
    setTimeout(() => {
      const newCursorPosition = cursorPosition + insertContent.length + 4;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
    
    setSelectedMaterials(new Set());
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
    return catalogItems;
  };

  const filteredMaterials = getFilteredMaterials();
  const isAllSelected = filteredMaterials.length > 0 && filteredMaterials.every(m => selectedMaterials.has(m.id));
  const isPartiallySelected = filteredMaterials.some(m => selectedMaterials.has(m.id)) && !isAllSelected;

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
                onGenerate={handleGenerate}
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

        <div className="flex-1 p-6 bg-white" style={{ backgroundColor: '#fafafa' }}>
          <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg min-h-full p-8">
            <Textarea
              ref={textareaRef}
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
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentFolder('root');
                    setSelectedMaterials(new Set());
                  }}
                  className="text-xs"
                >
                  返回
                </Button>
                <span className="text-sm text-gray-600">
                  {materialFolders.find(f => f.id === currentFolder)?.name}
                </span>
              </div>
              
              <div className="border-b border-gray-200">
                <Tabs value={materialTypeTab} onValueChange={(value) => {
                  setMaterialTypeTab(value as any);
                  setSelectedMaterials(new Set());
                }}>
                  <TabsList className="grid w-full grid-cols-4 h-8">
                    <TabsTrigger value="all" className="text-xs px-2">全部</TabsTrigger>
                    <TabsTrigger value="document" className="text-xs px-2">文档</TabsTrigger>
                    <TabsTrigger value="image" className="text-xs px-2">图片</TabsTrigger>
                    <TabsTrigger value="table" className="text-xs px-2">表格</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索素材..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>

              {filteredMaterials.length > 0 && (
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAllMaterials}
                    className="h-4 w-4"
                  />
                  <span className="text-xs text-gray-600">
                    {isAllSelected ? '取消全选' : '全选'}
                    {selectedMaterials.size > 0 && ` (已选 ${selectedMaterials.size})`}
                  </span>
                </div>
              )}
              
              <ScrollArea className="flex-1 max-h-80">
                <div className="space-y-2">
                  {filteredMaterials.map(material => (
                    <div
                      key={material.id}
                      className={`p-3 border rounded-lg transition-colors ${
                        selectedMaterials.has(material.id) 
                          ? 'border-sky-500 bg-sky-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedMaterials.has(material.id)}
                            onCheckedChange={() => handleSelectMaterial(material.id)}
                            className="h-4 w-4"
                          />
                          <div className="flex items-center">
                            {renderMaterialIcon(material.type)}
                            <span className="text-sm ml-2">{material.name}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreviewMaterial(material)}
                          className="h-6 w-6 p-0"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        {material.description}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Button
                  onClick={handleInsertMaterials}
                  disabled={selectedMaterials.size === 0}
                  className="w-full text-xs"
                  size="sm"
                >
                  插入选中素材 ({selectedMaterials.size})
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Sheet open={previewSheetOpen} onOpenChange={setPreviewSheetOpen}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              {previewMaterial && renderMaterialIcon(previewMaterial.type)}
              <span>{previewMaterial?.name}</span>
            </SheetTitle>
            <SheetDescription>
              {previewMaterial?.description}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h5 className="text-sm font-medium mb-2">内容预览</h5>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {previewMaterial?.content || '暂无内容'}
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <Button
                onClick={() => {
                  if (previewMaterial) {
                    handleSelectMaterial(previewMaterial.id);
                  }
                }}
                variant={previewMaterial && selectedMaterials.has(previewMaterial.id) ? "secondary" : "default"}
                size="sm"
                className="flex-1"
              >
                {previewMaterial && selectedMaterials.has(previewMaterial.id) ? '已选中' : '选择'}
              </Button>
              <Button
                onClick={() => setPreviewSheetOpen(false)}
                variant="outline"
                size="sm"
              >
                关闭
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认生成</AlertDialogTitle>
            <AlertDialogDescription>
              整章生成会替换已经生成的内容，确定生成吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmGenerate}>
              立即生成
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BidEditing;
