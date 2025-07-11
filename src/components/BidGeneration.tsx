import React, { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, CheckCircle2, Clock, FileText, List, BarChart3, Zap, Settings2, Users, CheckSquare, Square, Trash2, Plus, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import CatalogItem from '@/components/CatalogItem';
import { CatalogItem as CatalogItemType } from '@/types/bid';

interface BidGenerationProps {
  generationStatus: 'idle' | 'generating' | 'completed';
  catalogType: 'business' | 'technical';
  setCatalogType: (type: 'business' | 'technical') => void;
  catalogExpanded: boolean;
  setCatalogExpanded: (expanded: boolean) => void;
  rightPanelTab: 'requirements' | 'information';
  setRightPanelTab: (tab: 'requirements' | 'information') => void;
  catalogItems: CatalogItemType[];
  setCatalogItems: (items: CatalogItemType[]) => void;
  onRegenerateCatalog: () => void;
}

const BidGeneration: React.FC<BidGenerationProps> = ({
  generationStatus,
  catalogType,
  setCatalogType,
  catalogExpanded,
  setCatalogExpanded,
  rightPanelTab,
  setRightPanelTab,
  catalogItems,
  setCatalogItems,
  onRegenerateCatalog
}) => {
  const [batchMode, setBatchMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

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

  const handleToggleSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
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

  const handleBatchDelete = () => {
    const removeItems = (items: CatalogItemType[]): CatalogItemType[] => {
      return items.filter(item => {
        if (selectedItems.includes(item.id)) return false;
        if (item.children) {
          item.children = removeItems(item.children);
        }
        return true;
      });
    };
    setCatalogItems(removeItems(catalogItems));
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    const getAllItemIds = (items: CatalogItemType[]): string[] => {
      const ids: string[] = [];
      items.forEach(item => {
        ids.push(item.id);
        if (item.children) {
          ids.push(...getAllItemIds(item.children));
        }
      });
      return ids;
    };
    
    const allIds = getAllItemIds(catalogItems);
    setSelectedItems(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  if (generationStatus === 'generating') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[600px] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">正在生成目录</h2>
          <p className="text-gray-600 mb-4">AI正在根据您的需求分析并生成标书目录...</p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            预计需要30-60秒
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex">
      {/* 左侧目录区域 */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">生成的目录</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBatchMode(!batchMode)}
                className={batchMode ? 'bg-sky-50 border-sky-200 text-sky-700' : ''}
              >
                {batchMode ? '退出批量' : '批量操作'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerateCatalog}
                className="flex items-center space-x-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>重新生成</span>
              </Button>
            </div>
          </div>
          
          <Tabs value={catalogType} onValueChange={(value) => setCatalogType(value as 'business' | 'technical')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="business">商务标</TabsTrigger>
              <TabsTrigger value="technical">技术标</TabsTrigger>
            </TabsList>
            
            <TabsContent value="business" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-green-100 text-green-700 border-green-200"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    已生成
                  </Badge>
                  <span className="text-sm text-gray-600">共{catalogItems.length}个章节</span>
                </div>
                
                {batchMode && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="text-xs"
                    >
                      全选
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                      className="text-xs"
                    >
                      取消全选
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBatchDelete}
                      disabled={selectedItems.length === 0}
                      className="text-xs"
                    >
                      删除选中
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-green-100 text-green-700 border-green-200"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    已生成
                  </Badge>
                  <span className="text-sm text-gray-600">共{catalogItems.length}个章节</span>
                </div>
                
                {batchMode && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="text-xs"
                    >
                      全选
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                      className="text-xs"
                    >
                      取消全选
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBatchDelete}
                      disabled={selectedItems.length === 0}
                      className="text-xs"
                    >
                      删除选中
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-1">
            {catalogItems.map(item => (
              <CatalogItem
                key={item.id}
                item={item}
                parentId={null}
                batchMode={batchMode}
                isSelected={selectedItems.includes(item.id)}
                onToggleSelect={handleToggleSelect}
                onToggleExpansion={handleToggleExpansion}
                onAddSameLevel={handleAddSameLevel}
                onAddSubLevel={handleAddSubLevel}
                onDelete={handleDelete}
                onDoubleClick={handleDoubleClick}
                editingItem={editingItem}
                editingText={editingText}
                setEditingText={setEditingText}
                onSaveEdit={handleSaveEdit}
                showWordCount={false}
                showGenerateButton={false}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 右侧信息区域 */}
      <div className="w-1/2 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Tabs value={rightPanelTab} onValueChange={(value) => setRightPanelTab(value as 'requirements' | 'information')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="requirements">需求信息</TabsTrigger>
              <TabsTrigger value="information">资料信息</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex-1 p-4">
          <Tabs value={rightPanelTab}>
            <TabsContent value="requirements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">项目需求</CardTitle>
                  <CardDescription>
                    根据招标文件解析的关键需求信息
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">功能需求</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">用户管理系统</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">权限控制模块</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">数据统计分析</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">技术要求</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">支持高并发访问</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">数据安全保护</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">移动端适配</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="information" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">上传的资料</CardTitle>
                  <CardDescription>
                    已上传的招标文件和相关资料
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">招标文件.pdf</div>
                        <div className="text-xs text-gray-500">2.5MB • 已解析</div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        已解析
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">技术规格书.docx</div>
                        <div className="text-xs text-gray-500">1.8MB • 已解析</div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        已解析
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BidGeneration;
