import React, { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import CatalogItem from './CatalogItem';
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
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleToggleExpand = () => {
    setCatalogExpanded(!catalogExpanded);
  };

  const handleBatchMode = () => {
    setBatchMode(true);
    setSelectedItems(new Set());
    setSelectAll(false);
  };

  const handleCancelBatch = () => {
    setBatchMode(false);
    setSelectedItems(new Set());
    setSelectAll(false);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allIds = new Set<string>();
      const collectIds = (items: CatalogItemType[]) => {
        items.forEach(item => {
          allIds.add(item.id);
          if (item.children) {
            collectIds(item.children);
          }
        });
      };
      collectIds(catalogItems);
      setSelectedItems(allIds);
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleItemSelect = (itemId: string, checked: boolean) => {
    const newSelectedItems = new Set(selectedItems);
    if (checked) {
      newSelectedItems.add(itemId);
    } else {
      newSelectedItems.delete(itemId);
    }
    setSelectedItems(newSelectedItems);
    
    // 更新全选状态
    const allIds = new Set<string>();
    const collectIds = (items: CatalogItemType[]) => {
      items.forEach(item => {
        allIds.add(item.id);
        if (item.children) {
          collectIds(item.children);
        }
      });
    };
    collectIds(catalogItems);
    setSelectAll(newSelectedItems.size === allIds.size && allIds.size > 0);
  };

  const handleBatchDelete = () => {
    const filterItems = (items: CatalogItemType[]): CatalogItemType[] => {
      return items.filter(item => {
        if (selectedItems.has(item.id)) {
          return false;
        }
        if (item.children) {
          item.children = filterItems(item.children);
        }
        return true;
      });
    };
    
    setCatalogItems(filterItems(catalogItems));
    handleCancelBatch();
  };

  const toggleItemExpansion = (itemId: string) => {
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

  const addSameLevelItem = (parentId: string | null, afterId: string) => {
    const newId = Date.now().toString();
    const newItem: CatalogItemType = {
      id: newId,
      title: '新建章节',
      level: catalogItems.find(item => item.id === afterId)?.level || 1
    };
    
    const updateItems = (items: CatalogItemType[]): CatalogItemType[] => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === afterId) {
          items.splice(i + 1, 0, newItem);
          return items;
        }
        if (items[i].children) {
          items[i].children = updateItems(items[i].children);
        }
      }
      return items;
    };
    
    setCatalogItems([...updateItems(catalogItems)]);
  };

  const addSubLevelItem = (parentId: string) => {
    const newId = Date.now().toString();
    const parent = catalogItems.find(item => item.id === parentId);
    const newItem: CatalogItemType = {
      id: newId,
      title: '新建子章节',
      level: (parent?.level || 1) + 1
    };
    
    const updateItems = (items: CatalogItemType[]): CatalogItemType[] => {
      return items.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            expanded: true,
            children: [...(item.children || []), newItem]
          };
        }
        if (item.children) {
          return { ...item, children: updateItems(item.children) };
        }
        return item;
      });
    };
    
    setCatalogItems(updateItems(catalogItems));
  };

  const deleteItem = (itemId: string) => {
    const updateItems = (items: CatalogItemType[]): CatalogItemType[] => {
      return items.filter(item => {
        if (item.id === itemId) {
          return false;
        }
        if (item.children) {
          item.children = updateItems(item.children);
        }
        return true;
      });
    };
    setCatalogItems(updateItems(catalogItems));
  };

  if (generationStatus === 'generating') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <RefreshCw className="w-8 h-8 text-sky-600 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">正在生成标书目录...</h3>
        <p className="text-gray-600">AI正在分析您的需求和上传的文件，请稍候</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[600px]">
      {/* 左侧目录 */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
          {/* 目录标题和切换 */}
          <div className="border-b border-gray-200 p-4">
            <Tabs value={catalogType} onValueChange={(value) => setCatalogType(value as 'business' | 'technical')}>
              <TabsList className="grid w-fit grid-cols-2">
                <TabsTrigger value="business">商务标</TabsTrigger>
                <TabsTrigger value="technical">技术标</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* 操作按钮栏 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleToggleExpand}>
                {catalogExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
            
            {!batchMode ? (
              <div className="flex items-center space-x-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-sky-600 text-sky-600 hover:bg-sky-50">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      重新生成
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认重新生成</AlertDialogTitle>
                      <AlertDialogDescription>
                        重新生成将覆盖当前目录，确定要继续吗？
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={onRegenerateCatalog} className="bg-sky-600 hover:bg-sky-700">确认</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button variant="outline" size="sm" onClick={handleBatchMode}>
                  批量操作
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all" className="text-sm">全选</label>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      disabled={selectedItems.size === 0}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      批量删除
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认批量删除</AlertDialogTitle>
                      <AlertDialogDescription>
                        确定要删除选中的 {selectedItems.size} 个项目吗？此操作不可撤销。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBatchDelete} className="bg-red-600 hover:bg-red-700">
                        删除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button variant="outline" size="sm" onClick={handleCancelBatch}>
                  取消
                </Button>
              </div>
            )}
          </div>

          {/* 目录内容 */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {catalogItems.map(item => (
                <CatalogItem
                  key={item.id}
                  item={item}
                  batchMode={batchMode}
                  isSelected={selectedItems.has(item.id)}
                  onToggleSelect={handleItemSelect}
                  onToggleExpansion={toggleItemExpansion}
                  onAddSameLevel={addSameLevelItem}
                  onAddSubLevel={addSubLevelItem}
                  onDelete={deleteItem}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 右侧信息面板 */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
          <Tabs value={rightPanelTab} onValueChange={(value) => setRightPanelTab(value as 'requirements' | 'information')}>
            <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
              <TabsTrigger value="requirements">招标要求</TabsTrigger>
              <TabsTrigger value="information">招标信息</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requirements" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">技术要求</h4>
                  <p className="text-sm text-gray-600">
                    项目需要满足国家相关技术标准，具备完整的技术方案和实施计划...
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">资质要求</h4>
                  <p className="text-sm text-gray-600">
                    投标人应具备相应的资质证书，有类似项目经验...
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">商务要求</h4>
                  <p className="text-sm text-gray-600">
                    投标保证金、履约保证金等商务要求...
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="information" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">项目概况</h4>
                  <p className="text-sm text-gray-600">
                    项目名称、建设地点、建设规模等基本信息...
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">投标须知</h4>
                  <p className="text-sm text-gray-600">
                    投标文件编制要求、提交方式、开标时间等...
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">评标办法</h4>
                  <p className="text-sm text-gray-600">
                    评标标准、评分细则、中标条件等...
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BidGeneration;
