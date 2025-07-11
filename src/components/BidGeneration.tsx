import React from 'react';
import { Clock, RefreshCw, CheckCircle, Plus, Trash2, Settings2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  const [batchMode, setBatchMode] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [editingItem, setEditingItem] = React.useState<string | null>(null);
  const [editingText, setEditingText] = React.useState('');

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

  const handleToggleSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
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
    setBatchMode(false);
  };

  if (generationStatus === 'generating') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[600px] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">正在生成目录</h2>
          <p className="text-gray-600 mb-4">AI正在分析招标文件并生成标书目录...</p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            预计需要1-2分钟
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex">
      {/* 左侧目录结构 - 占据更多空间 */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">生成的目录结构</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={onRegenerateCatalog}>
                <RefreshCw className="w-4 h-4 mr-2" />
                重新生成
              </Button>
              <Button
                variant={batchMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setBatchMode(!batchMode);
                  setSelectedItems([]);
                }}
              >
                批量操作
              </Button>
              {batchMode && selectedItems.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      删除选中 ({selectedItems.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认批量删除</AlertDialogTitle>
                      <AlertDialogDescription>
                        确定要删除选中的 {selectedItems.length} 个章节吗？此操作不可撤销。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBatchDelete}>确认删除</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
          
          <Tabs value={catalogType} onValueChange={(value) => setCatalogType(value as 'business' | 'technical')}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="business">商务标</TabsTrigger>
              <TabsTrigger value="technical">技术标</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex-1 p-4">
          <ScrollArea className="h-full">
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
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* 右侧信息面板 */}
      <div className="w-80 border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Tabs value={rightPanelTab} onValueChange={(value) => setRightPanelTab(value as 'requirements' | 'information')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="requirements" className="text-xs">招标要求</TabsTrigger>
              <TabsTrigger value="information" className="text-xs">提取信息</TabsTrigger>
            </TabsList>
            <TabsContent value="requirements" className="mt-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 text-sm mb-2">关键要求</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• 技术方案详细说明</li>
                    <li>• 项目实施计划</li>
                    <li>• 质量保证措施</li>
                    <li>• 售后服务承诺</li>
                  </ul>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 text-sm mb-2">资质要求</h4>
                  <ul className="space-y-1 text-sm text-green-800">
                    <li>• 企业营业执照</li>
                    <li>• 相关行业资质</li>
                    <li>• 项目经验证明</li>
                    <li>• 财务状况证明</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="information" className="mt-4">
              <div className="space-y-3">
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm">项目信息</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">项目名称：</span>
                        <span className="text-gray-600">信息系统建设项目</span>
                      </div>
                      <div>
                        <span className="font-medium">预算范围：</span>
                        <span className="text-gray-600">500-800万元</span>
                      </div>
                      <div>
                        <span className="font-medium">实施周期：</span>
                        <span className="text-gray-600">12个月</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm">技术要求</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>• 支持云原生架构</div>
                      <div>• 微服务设计模式</div>
                      <div>• 高可用性保证</div>
                      <div>• 数据安全合规</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BidGeneration;
